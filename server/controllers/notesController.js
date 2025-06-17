const Note = require("../models/Note");
const User = require("../models/User");
const {
  validateNoteUpload,
  validateComment,
  validateReport,
} = require("../utils/validators");
const { deleteFromCloudinary } = require("../config/cloudinary");

// @desc    Get all approved notes with filters
// @route   GET /api/notes
// @access  Public
const getNotes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      subject,
      semester,
      college,
      course,
      search,
      sortBy = "recent",
      quality,
      isPremium,
    } = req.query;

    // Build filter object
    const filter = { isApproved: true };

    if (subject && subject !== "all") filter.subject = subject;
    if (semester && semester !== "all") filter.semester = semester;
    if (college && college !== "all") filter.college = college;
    if (course && course !== "all") filter.course = course;
    if (quality) filter.quality = quality;
    if (isPremium !== undefined) filter.isPremium = isPremium === "true";

    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
        { topics: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Sort options
    let sortOption = {};
    switch (sortBy) {
      case "popular":
        sortOption = { downloads: -1, views: -1 };
        break;
      case "recent":
        sortOption = { createdAt: -1 };
        break;
      case "likes":
        sortOption = { "likes.length": -1 };
        break;
      case "views":
        sortOption = { views: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const notes = await Note.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("uploadedBy", "username fullName avatar trustRanking")
      .select("-reports -downloadHistory");

    // Get total count for pagination
    const totalNotes = await Note.countDocuments(filter);
    const totalPages = Math.ceil(totalNotes / parseInt(limit));

    // Add virtual fields
    const notesWithStats = notes.map((note) => ({
      ...note.toObject(),
      likeCount: note.likes.length,
      commentCount: note.comments.length,
    }));

    res.json({
      status: "success",
      data: {
        notes: notesWithStats,
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
    console.error("Get notes error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching notes",
    });
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Public
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate("uploadedBy", "username fullName avatar trustRanking")
      .populate("comments.user", "username fullName avatar");

    if (!note) {
      return res.status(404).json({
        status: "error",
        message: "Note not found",
      });
    }

    if (!note.isApproved && (!req.user || req.user.role !== "admin")) {
      return res.status(403).json({
        status: "error",
        message: "Note is not approved yet",
      });
    }

    // Increment view count
    await note.incrementViews();

    res.json({
      status: "success",
      data: {
        note: {
          ...note.toObject(),
          likeCount: note.likes.length,
          commentCount: note.comments.length,
          isLikedByUser: req.user
            ? note.likes.some((like) => like.user.toString() === req.user.id)
            : false,
          isBookmarkedByUser: req.user
            ? req.user.bookmarkedNotes.includes(note._id)
            : false,
        },
      },
    });
  } catch (error) {
    console.error("Get note by ID error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching note",
    });
  }
};

// @desc    Upload new note
// @route   POST /api/notes
// @access  Private
const uploadNote = async (req, res) => {
  try {
    // Validate input
    const { error } = validateNoteUpload(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Please upload a file",
      });
    }

    const {
      title,
      description,
      subject,
      semester,
      course,
      college,
      tags,
      topics,
      isPremium = false,
      price = 0,
    } = req.body;

    // Create new note
    const note = new Note({
      title,
      description,
      subject,
      semester,
      course,
      college,
      fileUrl: req.file.path,
      fileName: req.file.originalname,
      fileType: req.file.mimetype.split("/")[1],
      fileSize: req.file.size,
      cloudinaryId: req.file.filename,
      uploadedBy: req.user.id,
      authorName: req.user.fullName,
      tags: tags
        ? Array.isArray(tags)
          ? tags
          : tags.split(",").map((tag) => tag.trim())
        : [],
      topics: topics
        ? Array.isArray(topics)
          ? topics
          : topics.split(",").map((topic) => topic.trim())
        : [],
      isPremium: isPremium === "true" || isPremium === true,
      price: isPremium ? parseFloat(price) || 0 : 0,
    });

    await note.save();

    // Update user's uploaded notes and stats
    const user = await User.findById(req.user.id);
    user.uploadedNotes.push(note._id);
    user.totalUploads += 1;
    user.updateContributorScore();
    await user.save();

    // Populate the note for response
    await note.populate("uploadedBy", "username fullName avatar trustRanking");

    res.status(201).json({
      status: "success",
      message: "Note uploaded successfully and pending approval",
      data: {
        note: {
          ...note.toObject(),
          likeCount: 0,
          commentCount: 0,
        },
      },
    });
  } catch (error) {
    console.error("Upload note error:", error);

    // Delete uploaded file if note creation failed
    if (req.file && req.file.filename) {
      try {
        await deleteFromCloudinary(req.file.filename);
      } catch (deleteError) {
        console.error("Error deleting file after failed upload:", deleteError);
      }
    }

    res.status(500).json({
      status: "error",
      message: "Server error while uploading note",
    });
  }
};

// @desc    Download note
// @route   GET /api/notes/:id/download
// @access  Private
const downloadNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        status: "error",
        message: "Note not found",
      });
    }

    if (!note.isApproved) {
      return res.status(403).json({
        status: "error",
        message: "Note is not approved for download",
      });
    }

    // Check if premium note and user has access
    if (note.isPremium) {
      // For now, allow all authenticated users to download premium notes
      // In a real app, you'd check payment status here
    }

    // Increment download count
    await note.incrementDownloads(req.user.id);

    // Add to user's download history
    const user = await User.findById(req.user.id);
    const existingDownload = user.downloadHistory.find(
      (download) => download.noteId.toString() === note._id.toString()
    );

    if (!existingDownload) {
      user.downloadHistory.push({ noteId: note._id });
      user.totalDownloads += 1;
      await user.save();
    }

    // Update note author's stats
    const author = await User.findById(note.uploadedBy);
    if (author) {
      author.updateContributorScore();
      await author.save();
    }

    res.json({
      status: "success",
      message: "Download recorded successfully",
      data: {
        downloadUrl: note.fileUrl,
        fileName: note.fileName,
      },
    });
  } catch (error) {
    console.error("Download note error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while downloading note",
    });
  }
};

// @desc    Like/Unlike note
// @route   POST /api/notes/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        status: "error",
        message: "Note not found",
      });
    }

    const existingLike = note.likes.find(
      (like) => like.user.toString() === req.user.id
    );

    if (existingLike) {
      // Unlike
      await note.removeLike(req.user.id);
      res.json({
        status: "success",
        message: "Note unliked",
        data: {
          isLiked: false,
          likeCount: note.likes.length,
        },
      });
    } else {
      // Like
      await note.addLike(req.user.id);
      res.json({
        status: "success",
        message: "Note liked",
        data: {
          isLiked: true,
          likeCount: note.likes.length,
        },
      });
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while toggling like",
    });
  }
};

// @desc    Add comment to note
// @route   POST /api/notes/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const { error } = validateComment(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        status: "error",
        message: "Note not found",
      });
    }

    await note.addComment(req.user.id, req.user.username, req.body.comment);

    // Populate the updated note with comment user details
    await note.populate("comments.user", "username fullName avatar");

    const newComment = note.comments[note.comments.length - 1];

    res.status(201).json({
      status: "success",
      message: "Comment added successfully",
      data: {
        comment: newComment,
        commentCount: note.comments.length,
      },
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while adding comment",
    });
  }
};

// @desc    Bookmark/Unbookmark note
// @route   POST /api/notes/:id/bookmark
// @access  Private
const toggleBookmark = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        status: "error",
        message: "Note not found",
      });
    }

    const user = await User.findById(req.user.id);
    const isBookmarked = user.bookmarkedNotes.includes(note._id);

    if (isBookmarked) {
      // Remove bookmark
      user.bookmarkedNotes = user.bookmarkedNotes.filter(
        (noteId) => noteId.toString() !== note._id.toString()
      );
      await user.save();

      res.json({
        status: "success",
        message: "Bookmark removed",
        data: {
          isBookmarked: false,
        },
      });
    } else {
      // Add bookmark
      user.bookmarkedNotes.push(note._id);
      await user.save();

      res.json({
        status: "success",
        message: "Note bookmarked",
        data: {
          isBookmarked: true,
        },
      });
    }
  } catch (error) {
    console.error("Toggle bookmark error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while toggling bookmark",
    });
  }
};

// @desc    Report note
// @route   POST /api/notes/:id/report
// @access  Private
const reportNote = async (req, res) => {
  try {
    const { error } = validateReport(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        status: "error",
        message: "Note not found",
      });
    }

    // Check if user already reported this note
    const existingReport = note.reports.find(
      (report) => report.reportedBy.toString() === req.user.id
    );

    if (existingReport) {
      return res.status(400).json({
        status: "error",
        message: "You have already reported this note",
      });
    }

    await note.reportNote(req.user.id, req.body.reason, req.body.description);

    res.json({
      status: "success",
      message: "Note reported successfully. Admin will review it.",
    });
  } catch (error) {
    console.error("Report note error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while reporting note",
    });
  }
};

// @desc    Get user's uploaded notes
// @route   GET /api/notes/my-uploads
// @access  Private
const getMyUploads = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notes = await Note.find({ uploadedBy: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-reports -downloadHistory");

    const totalNotes = await Note.countDocuments({ uploadedBy: req.user.id });
    const totalPages = Math.ceil(totalNotes / parseInt(limit));

    const notesWithStats = notes.map((note) => ({
      ...note.toObject(),
      likeCount: note.likes.length,
      commentCount: note.comments.length,
    }));

    res.json({
      status: "success",
      data: {
        notes: notesWithStats,
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
    console.error("Get my uploads error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching your uploads",
    });
  }
};

// @desc    Get user's bookmarked notes
// @route   GET /api/notes/bookmarks
// @access  Private
const getBookmarks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const user = await User.findById(req.user.id).populate({
      path: "bookmarkedNotes",
      populate: {
        path: "uploadedBy",
        select: "username fullName avatar trustRanking",
      },
      options: {
        sort: { createdAt: -1 },
        skip: skip,
        limit: parseInt(limit),
      },
    });

    const totalBookmarks = user.bookmarkedNotes.length;
    const totalPages = Math.ceil(totalBookmarks / parseInt(limit));

    const bookmarksWithStats = user.bookmarkedNotes.map((note) => ({
      ...note.toObject(),
      likeCount: note.likes.length,
      commentCount: note.comments.length,
      isBookmarked: true,
    }));

    res.json({
      status: "success",
      data: {
        notes: bookmarksWithStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalNotes: totalBookmarks,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get bookmarks error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching bookmarks",
    });
  }
};

module.exports = {
  getNotes,
  getNoteById,
  uploadNote,
  downloadNote,
  toggleLike,
  addComment,
  toggleBookmark,
  reportNote,
  getMyUploads,
  getBookmarks,
};
