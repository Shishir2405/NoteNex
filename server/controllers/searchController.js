const Note = require("../models/Note");
const User = require("../models/User");

// @desc    Search notes
// @route   GET /api/search/notes
// @access  Public
const searchNotes = async (req, res) => {
  try {
    const {
      q: query,
      page = 1,
      limit = 12,
      subject,
      semester,
      college,
      course,
      sortBy = "relevance",
      fileType,
      quality,
    } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        status: "error",
        message: "Search query must be at least 2 characters long",
      });
    }

    // Build search filter
    const filter = {
      isApproved: true,
      $text: { $search: query },
    };

    // Add additional filters
    if (subject && subject !== "all") filter.subject = subject;
    if (semester && semester !== "all") filter.semester = semester;
    if (college && college !== "all") filter.college = college;
    if (course && course !== "all") filter.course = course;
    if (fileType && fileType !== "all") filter.fileType = fileType;
    if (quality && quality !== "all") filter.quality = quality;

    // Sort options
    let sortOption = {};
    switch (sortBy) {
      case "relevance":
        sortOption = { score: { $meta: "textScore" } };
        break;
      case "recent":
        sortOption = { createdAt: -1 };
        break;
      case "popular":
        sortOption = { downloads: -1, views: -1 };
        break;
      case "likes":
        sortOption = { "likes.length": -1 };
        break;
      default:
        sortOption = { score: { $meta: "textScore" } };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute search
    const notes = await Note.find(filter, { score: { $meta: "textScore" } })
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("uploadedBy", "username fullName avatar trustRanking")
      .select("-reports -downloadHistory");

    // Get total count
    const totalNotes = await Note.countDocuments(filter);
    const totalPages = Math.ceil(totalNotes / parseInt(limit));

    // Add stats to notes
    const notesWithStats = notes.map((note) => ({
      ...note.toObject(),
      likeCount: note.likes.length,
      commentCount: note.comments.length,
      relevanceScore: note._doc.score,
    }));

    res.json({
      status: "success",
      data: {
        notes: notesWithStats,
        searchQuery: query,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalNotes,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Search notes error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while searching notes",
    });
  }
};

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Public
const getSearchSuggestions = async (req, res) => {
  try {
    const { q: query, limit = 5 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.json({
        status: "success",
        data: { suggestions: [] },
      });
    }

    // Get title suggestions
    const titleSuggestions = await Note.find({
      isApproved: true,
      title: { $regex: query, $options: "i" },
    })
      .select("title")
      .limit(parseInt(limit))
      .sort({ downloads: -1 });

    // Get subject suggestions
    const subjectSuggestions = await Note.distinct("subject", {
      isApproved: true,
      subject: { $regex: query, $options: "i" },
    });

    // Get tag suggestions
    const tagSuggestions = await Note.aggregate([
      { $match: { isApproved: true, tags: { $regex: query, $options: "i" } } },
      { $unwind: "$tags" },
      { $match: { tags: { $regex: query, $options: "i" } } },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: parseInt(limit) },
    ]);

    const suggestions = {
      titles: titleSuggestions.map((note) => note.title),
      subjects: subjectSuggestions.slice(0, parseInt(limit)),
      tags: tagSuggestions.map((tag) => tag._id),
    };

    res.json({
      status: "success",
      data: { suggestions },
    });
  } catch (error) {
    console.error("Get suggestions error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching suggestions",
    });
  }
};

// @desc    Get popular search terms
// @route   GET /api/search/popular
// @access  Public
const getPopularSearches = async (req, res) => {
  try {
    // Get most popular subjects
    const popularSubjects = await Note.aggregate([
      { $match: { isApproved: true } },
      {
        $group: {
          _id: "$subject",
          count: { $sum: 1 },
          downloads: { $sum: "$downloads" },
        },
      },
      { $sort: { downloads: -1 } },
      { $limit: 10 },
    ]);

    // Get most popular tags
    const popularTags = await Note.aggregate([
      { $match: { isApproved: true, tags: { $exists: true, $ne: [] } } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]);

    // Get trending colleges (most active)
    const trendingColleges = await Note.aggregate([
      {
        $match: {
          isApproved: true,
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
        },
      },
      { $group: { _id: "$college", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    res.json({
      status: "success",
      data: {
        popularSubjects: popularSubjects.map((item) => ({
          subject: item._id,
          noteCount: item.count,
          downloads: item.downloads,
        })),
        popularTags: popularTags.map((item) => item._id),
        trendingColleges: trendingColleges.map((item) => item._id),
      },
    });
  } catch (error) {
    console.error("Get popular searches error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching popular searches",
    });
  }
};

// @desc    Advanced search with multiple filters
// @route   POST /api/search/advanced
// @access  Public
const advancedSearch = async (req, res) => {
  try {
    const {
      query,
      subjects = [],
      semesters = [],
      colleges = [],
      courses = [],
      fileTypes = [],
      qualities = [],
      dateRange,
      minDownloads,
      maxFileSize,
      isVerified,
      isPremium,
      page = 1,
      limit = 12,
      sortBy = "relevance",
    } = req.body;

    // Build complex filter
    const filter = { isApproved: true };

    // Text search
    if (query && query.trim().length >= 2) {
      filter.$text = { $search: query };
    }

    // Array filters
    if (subjects.length > 0) filter.subject = { $in: subjects };
    if (semesters.length > 0) filter.semester = { $in: semesters };
    if (colleges.length > 0) filter.college = { $in: colleges };
    if (courses.length > 0) filter.course = { $in: courses };
    if (fileTypes.length > 0) filter.fileType = { $in: fileTypes };
    if (qualities.length > 0) filter.quality = { $in: qualities };

    // Boolean filters
    if (typeof isVerified === "boolean") filter.isVerified = isVerified;
    if (typeof isPremium === "boolean") filter.isPremium = isPremium;

    // Numeric filters
    if (minDownloads) filter.downloads = { $gte: parseInt(minDownloads) };
    if (maxFileSize)
      filter.fileSize = { $lte: parseInt(maxFileSize) * 1024 * 1024 }; // Convert MB to bytes

    // Date range filter
    if (dateRange && dateRange.start && dateRange.end) {
      filter.createdAt = {
        $gte: new Date(dateRange.start),
        $lte: new Date(dateRange.end),
      };
    }

    // Sort options
    let sortOption = {};
    switch (sortBy) {
      case "relevance":
        sortOption = query
          ? { score: { $meta: "textScore" } }
          : { downloads: -1 };
        break;
      case "recent":
        sortOption = { createdAt: -1 };
        break;
      case "popular":
        sortOption = { downloads: -1, views: -1 };
        break;
      case "likes":
        sortOption = { "likes.length": -1 };
        break;
      case "fileSize":
        sortOption = { fileSize: -1 };
        break;
      default:
        sortOption = { downloads: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute search
    const searchQuery = Note.find(filter);

    if (query && query.trim().length >= 2) {
      searchQuery.select({ score: { $meta: "textScore" } });
    }

    const notes = await searchQuery
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("uploadedBy", "username fullName avatar trustRanking")
      .select("-reports -downloadHistory");

    // Get total count
    const totalNotes = await Note.countDocuments(filter);
    const totalPages = Math.ceil(totalNotes / parseInt(limit));

    // Add stats to notes
    const notesWithStats = notes.map((note) => ({
      ...note.toObject(),
      likeCount: note.likes.length,
      commentCount: note.comments.length,
    }));

    res.json({
      status: "success",
      data: {
        notes: notesWithStats,
        filters: {
          query,
          subjects,
          semesters,
          colleges,
          courses,
          fileTypes,
          qualities,
          dateRange,
          minDownloads,
          maxFileSize,
          isVerified,
          isPremium,
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalNotes,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Advanced search error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while performing advanced search",
    });
  }
};

// @desc    Get filter options for search
// @route   GET /api/search/filters
// @access  Public
const getFilterOptions = async (req, res) => {
  try {
    // Get unique values for filters
    const subjects = await Note.distinct("subject", { isApproved: true });
    const semesters = await Note.distinct("semester", { isApproved: true });
    const colleges = await Note.distinct("college", { isApproved: true });
    const courses = await Note.distinct("course", { isApproved: true });
    const fileTypes = await Note.distinct("fileType", { isApproved: true });

    // Sort them alphabetically
    subjects.sort();
    semesters.sort();
    colleges.sort();
    courses.sort();
    fileTypes.sort();

    res.json({
      status: "success",
      data: {
        subjects,
        semesters,
        colleges,
        courses,
        fileTypes,
        qualities: ["low", "medium", "high", "premium"],
      },
    });
  } catch (error) {
    console.error("Get filter options error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching filter options",
    });
  }
};

module.exports = {
  searchNotes,
  getSearchSuggestions,
  getPopularSearches,
  advancedSearch,
  getFilterOptions,
};
