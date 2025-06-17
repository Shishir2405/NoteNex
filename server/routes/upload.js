const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { uploadAvatar } = require("../config/cloudinary");
const User = require("../models/User");

// @desc    Upload user avatar
// @route   POST /api/upload/avatar
// @access  Private
const uploadUserAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Please upload an image file",
      });
    }

    // Update user's avatar URL
    const user = await User.findById(req.user.id);
    user.avatar = req.file.path;
    await user.save();

    res.json({
      status: "success",
      message: "Avatar uploaded successfully",
      data: {
        avatarUrl: req.file.path,
      },
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while uploading avatar",
    });
  }
};

// @route   POST /api/upload/avatar
// @desc    Upload user avatar
// @access  Private
router.post(
  "/avatar",
  protect,
  uploadAvatar.single("avatar"),
  uploadUserAvatar
);

module.exports = router;
