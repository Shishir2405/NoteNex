const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

// Apply admin protection to all routes
router.use(protect, adminOnly);

// Dashboard and Analytics
// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard stats
// @access  Private/Admin
router.get("/dashboard", getDashboardStats);

// @route   GET /api/admin/analytics
// @desc    Get platform analytics
// @access  Private/Admin
router.get("/analytics", getAnalytics);

// Note Management
// @route   GET /api/admin/pending-notes
// @desc    Get pending notes for approval
// @access  Private/Admin
router.get("/pending-notes", getPendingNotes);

// @route   GET /api/admin/reported-notes
// @desc    Get reported notes
// @access  Private/Admin
router.get("/reported-notes", getReportedNotes);

// @route   PUT /api/admin/notes/:id/approve
// @desc    Approve note
// @access  Private/Admin
router.put("/notes/:id/approve", approveNote);

// @route   PUT /api/admin/notes/:id/reject
// @desc    Reject note
// @access  Private/Admin
router.put("/notes/:id/reject", rejectNote);

// @route   DELETE /api/admin/notes/:id
// @desc    Delete note permanently
// @access  Private/Admin
router.delete("/notes/:id", deleteNote);

// @route   PUT /api/admin/notes/:id/resolve-report
// @desc    Resolve report (mark as resolved)
// @access  Private/Admin
router.put("/notes/:id/resolve-report", resolveReport);

// @route   PUT /api/admin/notes/:id/quality
// @desc    Update note quality/verification status
// @access  Private/Admin
router.put("/notes/:id/quality", updateNoteQuality);

// User Management
// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get("/users", getUsers);

// @route   GET /api/admin/users/:id
// @desc    Get user details with full history
// @access  Private/Admin
router.get("/users/:id", getUserDetails);

// @route   PUT /api/admin/users/:id/ban
// @desc    Ban/Unban user
// @access  Private/Admin
router.put("/users/:id/ban", toggleUserBan);

// @route   POST /api/admin/users/:id/warn
// @desc    Warn user
// @access  Private/Admin
router.post("/users/:id/warn", warnUser);

module.exports = router;
