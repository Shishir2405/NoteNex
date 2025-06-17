const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/notesController");
const { protect, optionalAuth } = require("../middleware/auth");
const { uploadNotes } = require("../config/cloudinary");

// @route   GET /api/notes
// @desc    Get all approved notes with filters
// @access  Public
router.get("/", optionalAuth, getNotes);

// @route   GET /api/notes/my-uploads
// @desc    Get user's uploaded notes
// @access  Private
router.get("/my-uploads", protect, getMyUploads);

// @route   GET /api/notes/bookmarks
// @desc    Get user's bookmarked notes
// @access  Private
router.get("/bookmarks", protect, getBookmarks);

// @route   POST /api/notes
// @desc    Upload new note
// @access  Private
router.post("/", protect, uploadNotes.single("file"), uploadNote);

// @route   GET /api/notes/:id
// @desc    Get single note by ID
// @access  Public
router.get("/:id", optionalAuth, getNoteById);

// @route   GET /api/notes/:id/download
// @desc    Download note
// @access  Private
router.get("/:id/download", protect, downloadNote);

// @route   POST /api/notes/:id/like
// @desc    Like/Unlike note
// @access  Private
router.post("/:id/like", protect, toggleLike);

// @route   POST /api/notes/:id/comment
// @desc    Add comment to note
// @access  Private
router.post("/:id/comment", protect, addComment);

// @route   POST /api/notes/:id/bookmark
// @desc    Bookmark/Unbookmark note
// @access  Private
router.post("/:id/bookmark", protect, toggleBookmark);

// @route   POST /api/notes/:id/report
// @desc    Report note
// @access  Private
router.post("/:id/report", protect, reportNote);

module.exports = router;
