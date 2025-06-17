const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const Note = require("../models/Note");

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -warnings -downloadHistory")
      .populate(
        "uploadedNotes",
        "title subject downloads views createdAt isApproved"
      )
      .populate("bookmarkedNotes", "title subject downloads views createdAt");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Get public stats
    const stats = user.getStats();

    res.json({
      status: "success",
      data: {
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          college: user.college,
          course: user.course,
          semester: user.semester,
          bio: user.bio,
          avatar: user.avatar,
          trustRanking: user.trustRanking,
          contributorScore: user.contributorScore,
          joinDate: user.createdAt,
          stats,
        },
        uploadedNotes: user.uploadedNotes.filter((note) => note.isApproved), // Only show approved notes
        bookmarkedNotes: user.bookmarkedNotes,
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching user profile",
    });
  }
};

// @desc    Get user's download history
// @route   GET /api/users/download-history
// @access  Private
const getDownloadHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const user = await User.findById(req.user.id).populate({
      path: "downloadHistory.noteId",
      populate: {
        path: "uploadedBy",
        select: "username fullName avatar",
      },
      select: "title subject fileType downloads views createdAt",
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Sort by download date and paginate
    const sortedHistory = user.downloadHistory
      .sort((a, b) => new Date(b.downloadedAt) - new Date(a.downloadedAt))
      .slice(skip, skip + parseInt(limit));

    const totalDownloads = user.downloadHistory.length;
    const totalPages = Math.ceil(totalDownloads / parseInt(limit));

    res.json({
      status: "success",
      data: {
        downloads: sortedHistory,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalDownloads,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get download history error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching download history",
    });
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const { type = "contributor", limit = 20 } = req.query;

    let sortField = {};
    let title = "";

    switch (type) {
      case "contributor":
        sortField = { contributorScore: -1 };
        title = "Top Contributors";
        break;
      case "uploader":
        sortField = { totalUploads: -1 };
        title = "Top Uploaders";
        break;
      case "downloader":
        sortField = { totalDownloads: -1 };
        title = "Most Active Users";
        break;
      default:
        sortField = { contributorScore: -1 };
        title = "Top Contributors";
    }

    const users = await User.find({ role: "student" })
      .sort(sortField)
      .limit(parseInt(limit))
      .select(
        "username fullName college avatar trustRanking contributorScore totalUploads totalDownloads createdAt"
      );

    // Add rank to each user
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      college: user.college,
      avatar: user.avatar,
      trustRanking: user.trustRanking,
      contributorScore: user.contributorScore,
      totalUploads: user.totalUploads,
      totalDownloads: user.totalDownloads,
      joinDate: user.createdAt,
    }));

    res.json({
      status: "success",
      data: {
        title,
        type,
        leaderboard,
      },
    });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching leaderboard",
    });
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
const searchUsers = async (req, res) => {
  try {
    const { q: query, page = 1, limit = 12, college, course } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        status: "error",
        message: "Search query must be at least 2 characters long",
      });
    }

    // Build search filter
    const filter = {
      role: "student",
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } },
      ],
    };

    if (college && college !== "all") filter.college = college;
    if (course && course !== "all") filter.course = course;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .sort({ contributorScore: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select(
        "username fullName college course avatar trustRanking contributorScore totalUploads"
      );

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / parseInt(limit));

    res.json({
      status: "success",
      data: {
        users,
        searchQuery: query,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while searching users",
    });
  }
};

// @desc    Get users by college
// @route   GET /api/users/college/:collegeName
// @access  Public
const getUsersByCollege = async (req, res) => {
  try {
    const { collegeName } = req.params;
    const { page = 1, limit = 12, course } = req.query;

    const filter = {
      role: "student",
      college: { $regex: collegeName, $options: "i" },
    };

    if (course && course !== "all") filter.course = course;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .sort({ contributorScore: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select(
        "username fullName college course semester avatar trustRanking contributorScore totalUploads"
      );

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / parseInt(limit));

    // Get college stats
    const collegeStats = await User.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalUploads: { $sum: "$totalUploads" },
          totalDownloads: { $sum: "$totalDownloads" },
          avgContributorScore: { $avg: "$contributorScore" },
        },
      },
    ]);

    res.json({
      status: "success",
      data: {
        college: collegeName,
        users,
        stats: collegeStats[0] || {
          totalUsers: 0,
          totalUploads: 0,
          totalDownloads: 0,
          avgContributorScore: 0,
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get users by college error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching users by college",
    });
  }
};

// Routes
router.get("/leaderboard", getLeaderboard);
router.get("/search", searchUsers);
router.get("/download-history", protect, getDownloadHistory);
router.get("/college/:collegeName", getUsersByCollege);
router.get("/:id", getUserProfile);

module.exports = router;
