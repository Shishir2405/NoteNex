const StudyGroup = require("../models/StudyGroup");
const User = require("../models/User");
const { validateStudyGroup } = require("../utils/validators");

// @desc    Get all study groups
// @route   GET /api/community/groups
// @access  Public
const getStudyGroups = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      subject,
      college,
      search,
      sortBy = "activity",
    } = req.query;

    // Build filter
    const filter = { isActive: true, isPrivate: false };

    if (subject && subject !== "all") filter.subject = subject;
    if (college && college !== "all") filter.college = college;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    // Sort options
    let sortOption = {};
    switch (sortBy) {
      case "activity":
        sortOption = { lastActivity: -1 };
        break;
      case "members":
        sortOption = { "members.length": -1 };
        break;
      case "recent":
        sortOption = { createdAt: -1 };
        break;
      case "posts":
        sortOption = { totalPosts: -1 };
        break;
      default:
        sortOption = { lastActivity: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const groups = await StudyGroup.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("createdBy", "username fullName avatar")
      .populate("members.user", "username fullName avatar", null, { limit: 5 });

    const totalGroups = await StudyGroup.countDocuments(filter);
    const totalPages = Math.ceil(totalGroups / parseInt(limit));

    // Add member count and user membership status
    const groupsWithStats = groups.map((group) => ({
      ...group.toObject(),
      memberCount: group.members.length,
      isMember: req.user ? group.isMember(req.user.id) : false,
      canModerate: req.user ? group.canModerate(req.user.id) : false,
    }));

    res.json({
      status: "success",
      data: {
        groups: groupsWithStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalGroups,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get study groups error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching study groups",
    });
  }
};

// @desc    Get single study group
// @route   GET /api/community/groups/:id
// @access  Public
const getStudyGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id)
      .populate("createdBy", "username fullName avatar")
      .populate("members.user", "username fullName avatar")
      .populate("posts.author", "username fullName avatar")
      .populate("posts.replies.author", "username fullName avatar");

    if (!group) {
      return res.status(404).json({
        status: "error",
        message: "Study group not found",
      });
    }

    if (group.isPrivate && (!req.user || !group.isMember(req.user.id))) {
      return res.status(403).json({
        status: "error",
        message: "This is a private group",
      });
    }

    // Sort posts by creation date (newest first)
    group.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      status: "success",
      data: {
        group: {
          ...group.toObject(),
          memberCount: group.members.length,
          isMember: req.user ? group.isMember(req.user.id) : false,
          canModerate: req.user ? group.canModerate(req.user.id) : false,
        },
      },
    });
  } catch (error) {
    console.error("Get study group error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching study group",
    });
  }
};

// @desc    Create new study group
// @route   POST /api/community/groups
// @access  Private
const createStudyGroup = async (req, res) => {
  try {
    const { error } = validateStudyGroup(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    const {
      name,
      description,
      subject,
      college,
      semester,
      course,
      isPrivate,
      maxMembers,
      tags,
    } = req.body;

    // Check if user already has a group with the same name
    const existingGroup = await StudyGroup.findOne({
      name: name,
      createdBy: req.user.id,
    });

    if (existingGroup) {
      return res.status(400).json({
        status: "error",
        message: "You already have a group with this name",
      });
    }

    // Create new study group
    const group = new StudyGroup({
      name,
      description,
      subject,
      college,
      semester,
      course,
      isPrivate: isPrivate || false,
      maxMembers: maxMembers || 50,
      createdBy: req.user.id,
      tags: tags
        ? Array.isArray(tags)
          ? tags
          : tags.split(",").map((tag) => tag.trim())
        : [],
    });

    // Add creator as admin member
    group.members.push({
      user: req.user.id,
      role: "admin",
    });

    await group.save();

    // Populate for response
    await group.populate("createdBy", "username fullName avatar");

    res.status(201).json({
      status: "success",
      message: "Study group created successfully",
      data: {
        group: {
          ...group.toObject(),
          memberCount: 1,
          isMember: true,
          canModerate: true,
        },
      },
    });
  } catch (error) {
    console.error("Create study group error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while creating study group",
    });
  }
};

// @desc    Join study group
// @route   POST /api/community/groups/:id/join
// @access  Private
const joinStudyGroup = async (req, res) => {
  try {
    const { joinCode } = req.body;
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        status: "error",
        message: "Study group not found",
      });
    }

    if (group.isMember(req.user.id)) {
      return res.status(400).json({
        status: "error",
        message: "You are already a member of this group",
      });
    }

    if (group.isPrivate && (!joinCode || joinCode !== group.joinCode)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid join code for private group",
      });
    }

    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({
        status: "error",
        message: "Group is full",
      });
    }

    await group.addMember(req.user.id);

    res.json({
      status: "success",
      message: "Successfully joined the study group",
      data: {
        memberCount: group.members.length,
      },
    });
  } catch (error) {
    console.error("Join study group error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Server error while joining study group",
    });
  }
};

// @desc    Leave study group
// @route   POST /api/community/groups/:id/leave
// @access  Private
const leaveStudyGroup = async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        status: "error",
        message: "Study group not found",
      });
    }

    if (!group.isMember(req.user.id)) {
      return res.status(400).json({
        status: "error",
        message: "You are not a member of this group",
      });
    }

    if (group.createdBy.toString() === req.user.id) {
      return res.status(400).json({
        status: "error",
        message:
          "Group creator cannot leave. Transfer ownership or delete the group.",
      });
    }

    await group.removeMember(req.user.id);

    res.json({
      status: "success",
      message: "Successfully left the study group",
      data: {
        memberCount: group.members.length,
      },
    });
  } catch (error) {
    console.error("Leave study group error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while leaving study group",
    });
  }
};

// @desc    Add post to study group
// @route   POST /api/community/groups/:id/posts
// @access  Private
const addPost = async (req, res) => {
  try {
    const { content, attachments } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Post content is required",
      });
    }

    if (content.length > 500) {
      return res.status(400).json({
        status: "error",
        message: "Post content cannot exceed 500 characters",
      });
    }

    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        status: "error",
        message: "Study group not found",
      });
    }

    if (!group.isMember(req.user.id)) {
      return res.status(403).json({
        status: "error",
        message: "You must be a member to post in this group",
      });
    }

    await group.addPost(
      req.user.id,
      req.user.fullName,
      content,
      attachments || []
    );

    // Get the newly added post
    const newPost = group.posts[group.posts.length - 1];

    res.status(201).json({
      status: "success",
      message: "Post added successfully",
      data: {
        post: {
          ...newPost.toObject(),
          author: {
            _id: req.user.id,
            username: req.user.username,
            fullName: req.user.fullName,
            avatar: req.user.avatar,
          },
        },
      },
    });
  } catch (error) {
    console.error("Add post error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while adding post",
    });
  }
};

// @desc    Get user's study groups
// @route   GET /api/community/my-groups
// @access  Private
const getMyGroups = async (req, res) => {
  try {
    const groups = await StudyGroup.find({
      "members.user": req.user.id,
      isActive: true,
    })
      .sort({ lastActivity: -1 })
      .populate("createdBy", "username fullName avatar")
      .populate("members.user", "username fullName avatar", null, { limit: 3 });

    const groupsWithStats = groups.map((group) => ({
      ...group.toObject(),
      memberCount: group.members.length,
      isMember: true,
      canModerate: group.canModerate(req.user.id),
      myRole:
        group.members.find((m) => m.user._id.toString() === req.user.id)
          ?.role || "member",
    }));

    res.json({
      status: "success",
      data: {
        groups: groupsWithStats,
        totalGroups: groups.length,
      },
    });
  } catch (error) {
    console.error("Get my groups error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error while fetching your groups",
    });
  }
};

module.exports = {
  getStudyGroups,
  getStudyGroup,
  createStudyGroup,
  joinStudyGroup,
  leaveStudyGroup,
  addPost,
  getMyGroups,
};
