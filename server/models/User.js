const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [50, "Full name cannot exceed 50 characters"],
    },
    college: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
    },
    semester: {
      type: String,
      required: [true, "Semester is required"],
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    bio: {
      type: String,
      maxlength: [200, "Bio cannot exceed 200 characters"],
      default: "",
    },

    // Stats
    totalUploads: {
      type: Number,
      default: 0,
    },
    totalDownloads: {
      type: Number,
      default: 0,
    },
    contributorScore: {
      type: Number,
      default: 0,
    },
    trustRanking: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Platinum"],
      default: "Bronze",
    },

    // Activity tracking
    bookmarkedNotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    uploadedNotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    downloadHistory: [
      {
        noteId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Note",
        },
        downloadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },

    // Warnings and bans
    warnings: [
      {
        reason: String,
        issuedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        issuedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isBanned: {
      type: Boolean,
      default: false,
    },
    banReason: String,
    bannedUntil: Date,
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
userSchema.index({ email: 1, username: 1 });
userSchema.index({ college: 1, course: 1 });
userSchema.index({ contributorScore: -1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update contributor score based on activity
userSchema.methods.updateContributorScore = function () {
  let score = 0;

  // Points for uploads
  score += this.totalUploads * 10;

  // Points for being downloaded (popularity)
  score += this.totalDownloads * 2;

  // Update trust ranking based on score
  if (score >= 500) {
    this.trustRanking = "Platinum";
  } else if (score >= 200) {
    this.trustRanking = "Gold";
  } else if (score >= 50) {
    this.trustRanking = "Silver";
  } else {
    this.trustRanking = "Bronze";
  }

  this.contributorScore = score;
};

// Get user stats
userSchema.methods.getStats = function () {
  return {
    totalUploads: this.totalUploads,
    totalDownloads: this.totalDownloads,
    contributorScore: this.contributorScore,
    trustRanking: this.trustRanking,
    joinDate: this.createdAt,
    totalBookmarks: this.bookmarkedNotes.length,
  };
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.warnings;
  return user;
};

module.exports = mongoose.model("User", userSchema);
