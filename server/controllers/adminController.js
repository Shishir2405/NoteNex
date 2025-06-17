const Note = require("../models/Note");
const User = require("../models/User");
const { deleteFromCloudinary } = require("../config/cloudinary");

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Get basic counts
    const totalUsers = await User.countDocuments({ role: "student" });
    const totalNotes = await Note.countDocuments();
    const approvedNotes = await Note.countDocuments({ isApproved: true });
    const pendingNotes = await Note.countDocuments({ isApproved: false });
    const reportedNotes = await Note.countDocuments({ isReported: true });

    const totalDownloads = await Note.aggregate([
      { $group: { _id: null, total: { $sum: "$downloads" } } },
    ]);

    const totalViews = await Note.aggregate([
      { $group: { _id: null, total: { $sum: "$views" } } },
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
      role: "student",
    });
    const recentNotes = await Note.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get top contributors
    const topContributors = await User.find({ role: "student" })
      .sort({ contributorScore: -1 })
      .limit(5)
      .select("username fullName contributorScore totalUploads totalDownloads");

    // Get most popular notes
    const popularNotes = await Note.find({ isApproved: true })
      .sort({ downloads: -1 })
      .limit(5)
      .populate("uploadedBy", "username fullName")
      .select("title subject downloads views createdAt");

    // Get subject distribution
    const subjectStats = await Note.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: "$subject", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get monthly upload trends (last 6 months)
    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
    const monthlyTrends = await Note.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      status: "success",
      data: {
        overview: {
          totalUsers,
          totalNotes,
          approvedNotes,
          pendingNotes,
          reportedNotes,
          totalDownloads: totalDownloads[0]?.total || 0,
          totalViews: totalViews[0]?.total || 0,
          recentUsers,
          recentNotes,
        },
        topContributors,
        popularNotes,
        subjectStats,
        monthlyTrends,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching dashboard stats",
    });
  }
};

// @desc    Get pending notes for approval
// @route   GET /api/admin/pending-notes
// @access  Private/Admin
const getPendingNotes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notes = await Note.find({ isApproved: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate(
        "uploadedBy",
        "username fullName email college course trustRanking"
      );

    const totalNotes = await Note.countDocuments({ isApproved: false });
    const totalPages = Math.ceil(totalNotes / parseInt(limit));

    res.json({
      status: "success",
      data: {
        notes,
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
    console.error("Get pending notes error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching pending notes",
    });
  }
};

// @desc    Approve note
// @route   PUT /api/admin/notes/:id/approve
// @access  Private/Admin
const approveNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        status: "error",
        message: "Note not found",
      });
    }

    await note.approveNote(req.user.id);

    res.json({
      status: "success",
      message: "Note approved successfully",
    });
  } catch (error) {
    console.error("Approve note error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while approving note",
    });
  }
};

// @desc    Reject note
// @route   PUT /api/admin/notes/:id/reject
// @access  Private/Admin
const rejectNote = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        status: "error",
        message: "Rejection reason is required",
      });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        status: "error",
        message: "Note not found",
      });
    }

    await note.rejectNote(reason);

    res.json({
      status: "success",
      message: "Note rejected successfully",
    });
  } catch (error) {
    console.error("Reject note error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while rejecting note",
    });
  }
};

// @desc    Delete note permanently
// @route   DELETE /api/admin/notes/:id
// @access  Private/Admin
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        status: "error",
        message: "Note not found",
      });
    }

    // Delete file from Cloudinary
    try {
      await deleteFromCloudinary(note.cloudinaryId);
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError);
    }

    // Remove note from user's uploaded notes
    await User.findByIdAndUpdate(note.uploadedBy, {
      $pull: { uploadedNotes: note._id },
      $inc: { totalUploads: -1 },
    });

    // Remove from all users' bookmarks
    await User.updateMany(
      { bookmarkedNotes: note._id },
      { $pull: { bookmarkedNotes: note._id } }
    );

    // Delete the note
    await Note.findByIdAndDelete(req.params.id);

    res.json({
      status: "success",
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while deleting note",
    });
  }
};

// @desc    Get reported notes
// @route   GET /api/admin/reported-notes
// @access  Private/Admin
const getReportedNotes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notes = await Note.find({ isReported: true })
      .sort({ "reports.0.reportedAt": -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("uploadedBy", "username fullName email")
      .populate("reports.reportedBy", "username fullName");

    const totalNotes = await Note.countDocuments({ isReported: true });
    const totalPages = Math.ceil(totalNotes / parseInt(limit));

    res.json({
      status: "success",
      data: {
        notes,
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
    console.error("Get reported notes error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching reported notes",
    });
  }
};

// @desc    Resolve report (mark as resolved)
// @route   PUT /api/admin/notes/:id/resolve-report
// @access  Private/Admin
const resolveReport = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        status: "error",
        message: "Note not found",
      });
    }

    note.isReported = false;
    note.reports = []; // Clear all reports
    await note.save();

    res.json({
      status: "success",
      message: "Report resolved successfully",
    });
  } catch (error) {
    console.error("Resolve report error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while resolving report",
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, college, course } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = { role: "student" };
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (college) filter.college = college;
    if (course) filter.course = course;

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-password");

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / parseInt(limit));

    res.json({
      status: "success",
      data: {
        users,
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
    console.error("Get users error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching users",
    });
  }
};

// @desc    Ban/Unban user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
const toggleUserBan = async (req, res) => {
  try {
    const { reason, duration } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        status: "error",
        message: "Cannot ban admin users",
      });
    }

    if (user.isBanned) {
      // Unban user
      user.isBanned = false;
      user.banReason = undefined;
      user.bannedUntil = undefined;
      await user.save();

      res.json({
        status: "success",
        message: "User unbanned successfully",
      });
    } else {
      // Ban user
      user.isBanned = true;
      user.banReason = reason || "Violation of terms of service";
      if (duration) {
        user.bannedUntil = new Date(
          Date.now() + duration * 24 * 60 * 60 * 1000
        );
      }
      await user.save();

      res.json({
        status: "success",
        message: "User banned successfully",
      });
    }
  } catch (error) {
    console.error("Toggle user ban error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while updating user ban status",
    });
  }
};

// @desc    Warn user
// @route   POST /api/admin/users/:id/warn
// @access  Private/Admin
const warnUser = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        status: "error",
        message: "Warning reason is required",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        status: "error",
        message: "Cannot warn admin users",
      });
    }

    user.warnings.push({
      reason: reason,
      issuedBy: req.user.id,
    });

    await user.save();

    res.json({
      status: "success",
      message: "Warning issued successfully",
      data: {
        totalWarnings: user.warnings.length,
      },
    });
  } catch (error) {
    console.error("Warn user error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while warning user",
    });
  }
};

// @desc    Get user details with full history
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate(
        "uploadedNotes",
        "title subject isApproved downloads views createdAt"
      )
      .populate("bookmarkedNotes", "title subject")
      .populate("warnings.issuedBy", "username fullName");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Get user's recent download history
    const recentDownloads = await Note.find({
      "downloadHistory.user": user._id,
    })
      .populate("downloadHistory.user", "username")
      .select("title subject downloadHistory")
      .sort({ "downloadHistory.downloadedAt": -1 })
      .limit(10);

    // Get notes reported by this user
    const reportedNotes = await Note.find({
      "reports.reportedBy": user._id,
    })
      .select("title subject reports")
      .populate("uploadedBy", "username fullName");

    res.json({
      status: "success",
      data: {
        user: {
          ...user.toObject(),
          stats: user.getStats(),
        },
        recentDownloads,
        reportedNotes,
      },
    });
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching user details",
    });
  }
};

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const { period = "30" } = req.query; // days
    const periodDays = parseInt(period);
    const startDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

    // User registration trends
    const userTrends = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          role: "student",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Note upload trends
    const uploadTrends = await Note.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Download trends
    const downloadTrends = await Note.aggregate([
      {
        $match: {
          "downloadHistory.downloadedAt": { $gte: startDate },
        },
      },
      { $unwind: "$downloadHistory" },
      {
        $match: {
          "downloadHistory.downloadedAt": { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$downloadHistory.downloadedAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Most active colleges
    const collegeStats = await User.aggregate([
      {
        $match: { role: "student" },
      },
      {
        $group: {
          _id: "$college",
          userCount: { $sum: 1 },
          totalUploads: { $sum: "$totalUploads" },
          totalDownloads: { $sum: "$totalDownloads" },
        },
      },
      { $sort: { userCount: -1 } },
      { $limit: 10 },
    ]);

    // Subject popularity
    const subjectPopularity = await Note.aggregate([
      {
        $match: { isApproved: true },
      },
      {
        $group: {
          _id: "$subject",
          noteCount: { $sum: 1 },
          totalDownloads: { $sum: "$downloads" },
          avgRating: { $avg: { $size: "$likes" } },
        },
      },
      { $sort: { totalDownloads: -1 } },
      { $limit: 15 },
    ]);

    // File type distribution
    const fileTypeStats = await Note.aggregate([
      {
        $match: { isApproved: true },
      },
      {
        $group: {
          _id: "$fileType",
          count: { $sum: 1 },
          totalSize: { $sum: "$fileSize" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Top performers
    const topUploaders = await User.find({ role: "student" })
      .sort({ totalUploads: -1 })
      .limit(10)
      .select("username fullName college totalUploads contributorScore");

    const topDownloaders = await User.find({ role: "student" })
      .sort({ totalDownloads: -1 })
      .limit(10)
      .select("username fullName college totalDownloads");

    res.json({
      status: "success",
      data: {
        period: periodDays,
        trends: {
          users: userTrends,
          uploads: uploadTrends,
          downloads: downloadTrends,
        },
        collegeStats,
        subjectPopularity,
        fileTypeStats,
        topPerformers: {
          uploaders: topUploaders,
          downloaders: topDownloaders,
        },
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching analytics",
    });
  }
};

// @desc    Update note quality/verification status
// @route   PUT /api/admin/notes/:id/quality
// @access  Private/Admin
const updateNoteQuality = async (req, res) => {
  try {
    const { quality, isVerified } = req.body;

    const validQualities = ["low", "medium", "high", "premium"];
    if (quality && !validQualities.includes(quality)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid quality value",
      });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        status: "error",
        message: "Note not found",
      });
    }

    if (quality) note.quality = quality;
    if (typeof isVerified === "boolean") note.isVerified = isVerified;

    await note.save();

    res.json({
      status: "success",
      message: "Note quality updated successfully",
      data: {
        quality: note.quality,
        isVerified: note.isVerified,
      },
    });
  } catch (error) {
    console.error("Update note quality error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while updating note quality",
    });
  }
};

module.exports = {
  getDashboardStats,
  getPendingNotes,
  approveNote,
  rejectNote,
  deleteNote,
  getReportedNotes,
  resolveReport,
  getUsers,
  toggleUserBan,
  warnUser,
  getUserDetails,
  getAnalytics,
  updateNoteQuality,
};
