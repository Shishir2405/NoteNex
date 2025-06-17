const mongoose = require("mongoose");

const studyGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
      maxlength: [50, "Group name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    college: {
      type: String,
      required: [true, "College is required"],
      trim: true,
    },
    semester: {
      type: String,
      trim: true,
    },
    course: {
      type: String,
      trim: true,
    },

    // Group settings
    isPrivate: {
      type: Boolean,
      default: false,
    },
    maxMembers: {
      type: Number,
      default: 50,
      min: 2,
      max: 100,
    },
    joinCode: {
      type: String,
      unique: true,
      sparse: true, // Only for private groups
    },

    // Creator and members
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        role: {
          type: String,
          enum: ["member", "moderator", "admin"],
          default: "member",
        },
      },
    ],

    // Group activity
    posts: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        authorName: String,
        content: {
          type: String,
          required: true,
          maxlength: [500, "Post content cannot exceed 500 characters"],
        },
        attachments: [
          {
            type: String, // URLs to uploaded files
            name: String,
            fileType: String,
          },
        ],
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
        replies: [
          {
            author: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            authorName: String,
            content: {
              type: String,
              required: true,
              maxlength: [300, "Reply cannot exceed 300 characters"],
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Group stats
    totalPosts: {
      type: Number,
      default: 0,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },

    // Group status
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
studyGroupSchema.index({ subject: 1, college: 1 });
studyGroupSchema.index({ createdBy: 1 });
studyGroupSchema.index({ "members.user": 1 });
studyGroupSchema.index({ isPrivate: 1, isActive: 1 });
studyGroupSchema.index({ lastActivity: -1 });

// Virtual for member count
studyGroupSchema.virtual("memberCount").get(function () {
  return this.members.length;
});

// Pre-save middleware to generate join code for private groups
studyGroupSchema.pre("save", function (next) {
  if (this.isPrivate && !this.joinCode) {
    this.joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

// Method to add member
studyGroupSchema.methods.addMember = function (userId, role = "member") {
  const existingMember = this.members.find(
    (member) => member.user.toString() === userId.toString()
  );

  if (existingMember) {
    return Promise.resolve(this);
  }

  if (this.members.length >= this.maxMembers) {
    throw new Error("Group is full");
  }

  this.members.push({ user: userId, role });
  return this.save();
};

// Method to remove member
studyGroupSchema.methods.removeMember = function (userId) {
  this.members = this.members.filter(
    (member) => member.user.toString() !== userId.toString()
  );
  return this.save();
};

// Method to add post
studyGroupSchema.methods.addPost = function (
  authorId,
  authorName,
  content,
  attachments = []
) {
  this.posts.push({
    author: authorId,
    authorName: authorName,
    content: content,
    attachments: attachments,
  });
  this.totalPosts += 1;
  this.lastActivity = new Date();
  return this.save();
};

// Method to check if user is member
studyGroupSchema.methods.isMember = function (userId) {
  return this.members.some(
    (member) => member.user.toString() === userId.toString()
  );
};

// Method to check if user is moderator or admin
studyGroupSchema.methods.canModerate = function (userId) {
  const member = this.members.find(
    (member) => member.user.toString() === userId.toString()
  );
  return (
    (member && (member.role === "moderator" || member.role === "admin")) ||
    this.createdBy.toString() === userId.toString()
  );
};

// Static method to find groups by subject
studyGroupSchema.statics.findBySubject = function (subject, limit = 10) {
  return this.find({ subject: subject, isActive: true, isPrivate: false })
    .sort({ memberCount: -1, lastActivity: -1 })
    .limit(limit)
    .populate("createdBy", "username fullName avatar")
    .populate("members.user", "username fullName avatar");
};

// Static method to get active groups
studyGroupSchema.statics.getActiveGroups = function (limit = 20) {
  return this.find({ isActive: true, isPrivate: false })
    .sort({ lastActivity: -1 })
    .limit(limit)
    .populate("createdBy", "username fullName avatar");
};

module.exports = mongoose.model("StudyGroup", studyGroupSchema);
