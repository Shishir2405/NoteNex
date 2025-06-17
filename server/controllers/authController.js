const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");
const { validateRegister, validateLogin } = require("../utils/validators");

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { error } = validateRegister(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    const { username, email, password, fullName, college, course, semester } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message:
          existingUser.email === email
            ? "User with this email already exists"
            : "Username is already taken",
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      fullName,
      college,
      course,
      semester,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          college: user.college,
          course: user.course,
          semester: user.semester,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during registration",
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    // Check for user (include password for comparison)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Check if account is banned
    if (user.isBanned) {
      return res.status(403).json({
        status: "error",
        message: "Your account has been banned",
        banReason: user.banReason,
        bannedUntil: user.bannedUntil,
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          college: user.college,
          course: user.course,
          semester: user.semester,
          role: user.role,
          avatar: user.avatar,
          contributorScore: user.contributorScore,
          trustRanking: user.trustRanking,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during login",
    });
  }
};

// @desc    Admin login with hardcoded credentials
// @route   POST /api/auth/admin-login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check hardcoded admin credentials
    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        status: "error",
        message: "Invalid admin credentials",
      });
    }

    // Check if admin user exists in database, if not create one
    let adminUser = await User.findOne({
      role: "admin",
      username: process.env.ADMIN_USERNAME,
    });

    if (!adminUser) {
      adminUser = new User({
        username: process.env.ADMIN_USERNAME,
        email: "admin@studyshare.com",
        password: process.env.ADMIN_PASSWORD,
        fullName: "System Administrator",
        college: "StudyShare Platform",
        course: "Administration",
        semester: "N/A",
        role: "admin",
        isVerified: true,
      });
      await adminUser.save();
    }

    // Generate token
    const token = generateToken(adminUser._id);

    res.json({
      status: "success",
      message: "Admin login successful",
      data: {
        user: {
          id: adminUser._id,
          username: adminUser.username,
          email: adminUser.email,
          fullName: adminUser.fullName,
          role: adminUser.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during admin login",
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("bookmarkedNotes", "title subject")
      .populate("uploadedNotes", "title subject downloads views");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.json({
      status: "success",
      data: {
        user: {
          ...user.toJSON(),
          stats: user.getStats(),
        },
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, college, course, semester } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Update fields if provided
    if (fullName) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;
    if (college) user.college = college;
    if (course) user.course = course;
    if (semester) user.semester = semester;

    await user.save();

    res.json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during profile update",
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error during password change",
    });
  }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    res.json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error during logout",
    });
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  getMe,
  updateProfile,
  changePassword,
  logout,
};
