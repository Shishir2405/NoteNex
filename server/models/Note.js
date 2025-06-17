const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Note title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    semester: {
      type: String,
      required: [true, "Semester is required"],
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
    },
    college: {
      type: String,
      required: [true, "College is required"],
      trim: true,
    },

    // File information
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
    },
    fileType: {
      type: String,
      required: [true, "File type is required"],
      enum: ["pdf", "doc", "docx", "txt", "jpg", "jpeg", "png"],
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
    },
    cloudinaryId: {
      type: String,
      required: [true, "Cloudinary ID is required"],
    },

    // Author information
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },

    // Tags and categories
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    topics: [
      {
        type: String,
        trim: true,
      },
    ],

    // Engagement metrics
    views: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        likedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Comments
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        username: String,
        comment: {
          type: String,
          required: true,
          maxlength: [300, "Comment cannot exceed 300 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Moderation
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: Date,
    rejectionReason: String,

    // Flags and reports
    isReported: {
      type: Boolean,
      default: false,
    },
    reports: [
      {
        reportedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reason: {
          type: String,
          required: true,
          enum: [
            "spam",
            "inappropriate",
            "copyright",
            "wrong-subject",
            "low-quality",
            "other",
          ],
        },
        description: String,
        reportedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Quality indicators
    quality: {
      type: String,
      enum: ["low", "medium", "high", "premium"],
      default: "medium",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Premium features
    isPremium: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Activity tracking
    lastDownloaded: Date,
    downloadHistory: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        downloadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Search optimization
    searchKeywords: [
      {
        type: String,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better search performance
noteSchema.index({ subject: 1, semester: 1, course: 1 });
noteSchema.index({ college: 1 });
noteSchema.index({ uploadedBy: 1 });
noteSchema.index({ tags: 1 });
noteSchema.index({ createdAt: -1 });
noteSchema.index({ downloads: -1 });
noteSchema.index({ "likes.user": 1 });
noteSchema.index({ isApproved: 1, isReported: 1 });

// Text search index
noteSchema.index({
  title: "text",
  description: "text",
  subject: "text",
  tags: "text",
  searchKeywords: "text",
});

// Virtual for like count
noteSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// Virtual for comment count
noteSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// Pre-save middleware to generate search keywords
noteSchema.pre("save", function (next) {
  if (
    this.isModified("title") ||
    this.isModified("description") ||
    this.isModified("subject")
  ) {
    const keywords = [];

    // Add title words
    if (this.title) {
      keywords.push(...this.title.toLowerCase().split(" "));
    }

    // Add description words
    if (this.description) {
      keywords.push(...this.description.toLowerCase().split(" "));
    }

    // Add subject
    if (this.subject) {
      keywords.push(this.subject.toLowerCase());
    }

    // Remove duplicates and empty strings
    this.searchKeywords = [
      ...new Set(keywords.filter((keyword) => keyword.length > 2)),
    ];
  }
  next();
});

// Method to increment view count
noteSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Method to increment download count
noteSchema.methods.incrementDownloads = function (userId) {
  this.downloads += 1;
  this.lastDownloaded = new Date();

  if (userId) {
    this.downloadHistory.push({ user: userId });
  }

  return this.save();
};

// Method to add like
noteSchema.methods.addLike = function (userId) {
  const existingLike = this.likes.find(
    (like) => like.user.toString() === userId.toString()
  );

  if (!existingLike) {
    this.likes.push({ user: userId });
    return this.save();
  }

  return Promise.resolve(this);
};

// Method to remove like
noteSchema.methods.removeLike = function (userId) {
  this.likes = this.likes.filter(
    (like) => like.user.toString() !== userId.toString()
  );
  return this.save();
};

// Method to add comment
noteSchema.methods.addComment = function (userId, username, comment) {
  this.comments.push({
    user: userId,
    username: username,
    comment: comment,
  });
  return this.save();
};

// Method to report note
noteSchema.methods.reportNote = function (userId, reason, description) {
  this.isReported = true;
  this.reports.push({
    reportedBy: userId,
    reason: reason,
    description: description,
  });
  return this.save();
};

// Method to approve note
noteSchema.methods.approveNote = function (adminId) {
  this.isApproved = true;
  this.approvedBy = adminId;
  this.approvedAt = new Date();
  this.rejectionReason = undefined;
  return this.save();
};

// Method to reject note
noteSchema.methods.rejectNote = function (reason) {
  this.isApproved = false;
  this.rejectionReason = reason;
  return this.save();
};

// Static method to get popular notes
noteSchema.statics.getPopularNotes = function (limit = 10) {
  return this.find({ isApproved: true })
    .sort({ downloads: -1, views: -1 })
    .limit(limit)
    .populate("uploadedBy", "username fullName avatar");
};

// Static method to get recent notes
noteSchema.statics.getRecentNotes = function (limit = 10) {
  return this.find({ isApproved: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("uploadedBy", "username fullName avatar");
};

module.exports = mongoose.model("Note", noteSchema);
