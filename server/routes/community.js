const express = require("express");
const router = express.Router();
const {
  getStudyGroups,
  getStudyGroup,
  createStudyGroup,
  joinStudyGroup,
  leaveStudyGroup,
  addPost,
  getMyGroups,
} = require("../controllers/communityController");
const { protect, optionalAuth } = require("../middleware/auth");

// @route   GET /api/community/groups
// @desc    Get all study groups
// @access  Public
router.get("/groups", optionalAuth, getStudyGroups);

// @route   GET /api/community/my-groups
// @desc    Get user's study groups
// @access  Private
router.get("/my-groups", protect, getMyGroups);

// @route   POST /api/community/groups
// @desc    Create new study group
// @access  Private
router.post("/groups", protect, createStudyGroup);

// @route   GET /api/community/groups/:id
// @desc    Get single study group
// @access  Public
router.get("/groups/:id", optionalAuth, getStudyGroup);

// @route   POST /api/community/groups/:id/join
// @desc    Join study group
// @access  Private
router.post("/groups/:id/join", protect, joinStudyGroup);

// @route   POST /api/community/groups/:id/leave
// @desc    Leave study group
// @access  Private
router.post("/groups/:id/leave", protect, leaveStudyGroup);

// @route   POST /api/community/groups/:id/posts
// @desc    Add post to study group
// @access  Private
router.post("/groups/:id/posts", protect, addPost);

module.exports = router;
