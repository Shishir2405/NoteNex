const User = require('../models/User');
const Note = require('../models/Note');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -warnings -downloadHistory')
      .populate('uploadedNotes', 'title subject downloads views createdAt isApproved')
      .populate('bookmarkedNotes', 'title subject downloads views createdAt');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get public stats
    const stats = user.getStats();

    res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          college: user.college,
          course: user.course,
          semester: user.semester,
          bio: user.bio,
          avatar: user.avatar,
          trustRanking: user.trustRanking,
          contributorScore: user.contributorScore,
          joinDate: user.createdAt,
          stats
        },
        uploadedNotes: user.uploadedNotes.filter(note => note.isApproved), // Only show approved notes
        bookmarkedNotes: user.bookmarkedNotes
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching user profile'
    });
  }
};

// @desc    Get user's download history
// @route   GET /api/users/download-history
// @access  Private
const getDownloadHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const user = await User.findById(req.user.id)
      .populate({
        path: 'downloadHistory.noteId',
        populate: {
          path: 'uploadedBy',
          select: 'username fullName avatar'
        },
        select: 'title subject fileType downloads views createdAt'
      });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Sort by download date and paginate
    const sortedHistory = user.downloadHistory
      .sort((a, b) => new Date(b.downloadedAt) - new Date(a.downloadedAt))
      .slice(skip, skip + parseInt(limit));

    const totalDownloads = user.downloadHistory.length;
    const totalPages = Math.ceil(totalDownloads / parseInt(limit));

    res.json({
      status: 'success',
      data: {
        downloads: sortedHistory,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalDownloads,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get download history error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching download history'
    });
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const { type = 'contributor', limit = 20 } = req.query;

    let sortField = {};
    let title = '';

    switch (type) {
      case 'contributor':
        sortField = { contributorScore: -1 };
        title = 'Top Contributors';
        break;
      case 'uploader':
        sortField = { totalUploads: -1 };
        title = 'Top Uploaders';
        break;
      case 'downloader':
        sortField = { totalDownloads: -1 };
        title = 'Most Active Users';
        break;
      default:
        sortField = { contributorScore: -1 };
        title = 'Top Contributors';
    }

    const users = await User.find({ role: 'student' })
      .sort(sortField)
      .limit(parseInt(limit))
      .select('username fullName college avatar trustRanking contributorScore totalUploads totalDownloads createdAt');

    // Add rank to each user
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      college: user.college,
      avatar: user.avatar,
      trustRanking: user.trustRanking,
      contributorScore: user.contributorScore,
      totalUploads: user.totalUploads,
      totalDownloads: user.totalDownloads,
      joinDate: user.createdAt
    }));

    res.json({
      status: 'success',
      data: {
        title,
        type,
        leaderboard
      }
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching leaderboard'
    });
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
const searchUsers = async (req, res) => {
  try {
    const { q: query, page = 1, limit = 12, college, course } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query must be at least 2 characters long'
      });
    }

    // Build search filter
    const filter = {
      role: 'student',
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { fullName: { $regex: query, $options: 'i' } }
      ]
    };

    if (college && college !== 'all') filter.college = college;
    if (course && course !== 'all') filter.course = course;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .sort({ contributorScore: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('username fullName college course avatar trustRanking contributorScore totalUploads');

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / parseInt(limit));

    res.json({
      status: 'success',
      data: {
        users,
        searchQuery: query,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while searching users'
    });
  }
};

// @desc    Get users by college
// @route   GET /api/users/college/:collegeName
// @access  Public
const getUsersByCollege = async (req, res) => {
  try {
    const { collegeName } = req.params;
    const { page = 1, limit = 12, course } = req.query;

    const filter = { 
      role: 'student',
      college: { $regex: collegeName, $options: 'i' }
    };

    if (course && course !== 'all') filter.course = course;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .sort({ contributorScore: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('username fullName college course semester avatar trustRanking contributorScore totalUploads');

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / parseInt(limit));

    // Get college stats
    const collegeStats = await User.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalUploads: { $sum: '$totalUploads' },
          totalDownloads: { $sum: '$totalDownloads' },
          avgContributorScore: { $avg: '$contributorScore' }
        }
      }
    ]);

    res.json({
      status: 'success',
      data: {
        college: collegeName,
        users,
        stats: collegeStats[0] || {
          totalUsers: 0,
          totalUploads: 0,
          totalDownloads: 0,
          avgContributorScore: 0
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get users by college error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching users by college'
    });
  }
};

// @desc    Follow/Unfollow user
// @route   POST /api/users/:id/follow
// @access  Private
const toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({
        status: 'error',
        message: 'You cannot follow yourself'
      });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check if already following
    const isFollowing = currentUser.following && currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);
      
      await currentUser.save();
      await targetUser.save();

      res.json({
        status: 'success',
        message: 'User unfollowed successfully',
        data: {
          isFollowing: false,
          followersCount: targetUser.followers.length
        }
      });
    } else {
      // Follow
      if (!currentUser.following) currentUser.following = [];
      if (!targetUser.followers) targetUser.followers = [];

      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
      
      await currentUser.save();
      await targetUser.save();

      res.json({
        status: 'success',
        message: 'User followed successfully',
        data: {
          isFollowing: true,
          followersCount: targetUser.followers.length
        }
      });
    }

  } catch (error) {
    console.error('Toggle follow error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating follow status'
    });
  }
};

// @desc    Get user's followers
// @route   GET /api/users/:id/followers
// @access  Public
const getFollowers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const user = await User.findById(req.params.id)
      .populate({
        path: 'followers',
        select: 'username fullName avatar college trustRanking contributorScore',
        options: {
          skip: skip,
          limit: parseInt(limit),
          sort: { contributorScore: -1 }
        }
      });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const totalFollowers = user.followers ? user.followers.length : 0;
    const totalPages = Math.ceil(totalFollowers / parseInt(limit));

    res.json({
      status: 'success',
      data: {
        followers: user.followers || [],
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalFollowers,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching followers'
    });
  }
};

// @desc    Get user's following
// @route   GET /api/users/:id/following
// @access  Public
const getFollowing = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const user = await User.findById(req.params.id)
      .populate({
        path: 'following',
        select: 'username fullName avatar college trustRanking contributorScore',
        options: {
          skip: skip,
          limit: parseInt(limit),
          sort: { contributorScore: -1 }
        }
      });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const totalFollowing = user.following ? user.following.length : 0;
    const totalPages = Math.ceil(totalFollowing / parseInt(limit));

    res.json({
      status: 'success',
      data: {
        following: user.following || [],
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalFollowing,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching following'
    });
  }
};

// @desc    Get user's activity feed
// @route   GET /api/users/activity-feed
// @access  Private
const getActivityFeed = async (req, res) => {
  try {
    const { page = 1, limit = 15 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const user = await User.findById(req.user.id).populate('following');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get activity from followed users
    const followingIds = user.following ? user.following.map(f => f._id) : [];
    followingIds.push(req.user.id); // Include own activity

    // Get recent notes from followed users
    const recentNotes = await Note.find({
      uploadedBy: { $in: followingIds },
      isApproved: true,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('uploadedBy', 'username fullName avatar')
    .select('title subject downloads views likes createdAt');

    const totalActivities = await Note.countDocuments({
      uploadedBy: { $in: followingIds },
      isApproved: true,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const totalPages = Math.ceil(totalActivities / parseInt(limit));

    // Format activities
    const activities = recentNotes.map(note => ({
      type: 'note_upload',
      note: {
        id: note._id,
        title: note.title,
        subject: note.subject,
        downloads: note.downloads,
        views: note.views,
        likes: note.likes.length
      },
      user: note.uploadedBy,
      createdAt: note.createdAt
    }));

    res.json({
      status: 'success',
      data: {
        activities,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalActivities,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get activity feed error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching activity feed'
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Public
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get detailed statistics
    const stats = user.getStats();

    // Get monthly upload trend (last 6 months)
    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
    const monthlyUploads = await Note.aggregate([
      {
        $match: {
          uploadedBy: user._id,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get subject-wise contribution
    const subjectWiseStats = await Note.aggregate([
      {
        $match: {
          uploadedBy: user._id,
          isApproved: true
        }
      },
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 },
          totalDownloads: { $sum: '$downloads' },
          totalViews: { $sum: '$views' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      status: 'success',
      data: {
        basicStats: stats,
        monthlyTrend: monthlyUploads,
        subjectWiseContribution: subjectWiseStats,
        rank: {
          contributor: await User.countDocuments({
            role: 'student',
            contributorScore: { $gt: user.contributorScore }
          }) + 1,
          uploader: await User.countDocuments({
            role: 'student',
            totalUploads: { $gt: user.totalUploads }
          }) + 1
        }
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching user statistics'
    });
  }
};

module.exports = {
  getUserProfile,
  getDownloadHistory,
  getLeaderboard,
  searchUsers,
  getUsersByCollege,
  toggleFollow,
  getFollowers,
  getFollowing,
  getActivityFeed,
  getUserStats
};