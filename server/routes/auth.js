const express = require("express");
const router = express.Router();
const {
  register,
  login,
  adminLogin,
  getMe,
  updateProfile,
  changePassword,
  logout,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", login);

// @route   POST /api/auth/admin-login
// @desc    Admin login with hardcoded credentials
// @access  Public
router.post("/admin-login", adminLogin);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", protect, getMe);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, updateProfile);

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put("/change-password", protect, changePassword);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post("/logout", protect, logout);

module.exports = router;
