const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Not authorized, no token provided",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Not authorized, user not found",
        });
      }

      // Check if user is banned
      if (user.isBanned) {
        return res.status(403).json({
          status: "error",
          message: "Account is banned",
          banReason: user.banReason,
        });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(403).json({
          status: "error",
          message: "Account is deactivated",
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({
        status: "error",
        message: "Not authorized, invalid token",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error in authentication",
    });
  }
};

// Admin only access
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      status: "error",
      message: "Access denied. Admin privileges required.",
    });
  }
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (user && user.isActive && !user.isBanned) {
          req.user = user;
        }
      } catch (error) {
        // Token invalid, but continue without user
        console.log("Optional auth - invalid token:", error.message);
      }
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  protect,
  adminOnly,
  optionalAuth,
};
