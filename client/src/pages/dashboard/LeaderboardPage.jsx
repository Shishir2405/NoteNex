import React, { useState, useEffect } from "react";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Star,
  TrendingUp,
  Upload,
  Download,
  Users,
  Calendar,
  School,
  User,
  ChevronUp,
  ChevronDown,
  Filter,
  Search,
  Loader2,
  RefreshCw,
  Target,
  Zap,
  BookOpen,
} from "lucide-react";

const LeaderboardPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState("contributor");
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [limit, setLimit] = useState(20);

  // Filter options
  const [colleges, setColleges] = useState([]);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  // Tab configuration
  const tabs = [
    {
      id: "contributor",
      label: "Top Contributors",
      icon: Trophy,
      description: "Users with highest contributor scores",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    {
      id: "uploader",
      label: "Top Uploaders",
      icon: Upload,
      description: "Users who upload most notes",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "downloader",
      label: "Most Active",
      icon: Download,
      description: "Users with most downloads",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
  ];

  // Load leaderboard data
  useEffect(() => {
    loadLeaderboard();
  }, [activeTab, limit, collegeFilter]);

  // Load filter options
  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        type: activeTab,
        limit: limit.toString(),
        ...(collegeFilter !== "all" && { college: collegeFilter }),
      });

      const response = await fetch(
        `${API_BASE}/users/leaderboard?${queryParams}`
      );
      const data = await response.json();

      if (data.status === "success") {
        setLeaderboardData(data.data.leaderboard || []);
      }
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const response = await fetch(`${API_BASE}/search/filters`);
      const data = await response.json();
      if (data.status === "success") {
        setColleges(data.data.colleges || []);
      }
    } catch (error) {
      console.error("Failed to load filter options:", error);
    }
  };

  // Get rank badge/icon
  const getRankBadge = (rank) => {
    if (rank === 1) {
      return <Crown className="h-6 w-6 text-yellow-500" />;
    } else if (rank === 2) {
      return <Medal className="h-6 w-6 text-gray-400" />;
    } else if (rank === 3) {
      return <Award className="h-6 w-6 text-orange-500" />;
    } else if (rank <= 10) {
      return <Star className="h-5 w-5 text-purple-500" />;
    }
    return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
  };

  // Get trust ranking badge
  const getTrustBadge = (ranking) => {
    const config = {
      Bronze: { bg: "bg-orange-100", text: "text-orange-800", icon: "🥉" },
      Silver: { bg: "bg-gray-100", text: "text-gray-800", icon: "🥈" },
      Gold: { bg: "bg-yellow-100", text: "text-yellow-800", icon: "🥇" },
      Platinum: { bg: "bg-purple-100", text: "text-purple-800", icon: "💎" },
    };

    const badgeConfig = config[ranking] || config.Bronze;
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeConfig.bg} ${badgeConfig.text}`}
      >
        <span className="mr-1">{badgeConfig.icon}</span>
        {ranking}
      </span>
    );
  };

  // Get primary stat based on active tab
  const getPrimaryStat = (user) => {
    switch (activeTab) {
      case "contributor":
        return user.contributorScore;
      case "uploader":
        return user.totalUploads;
      case "downloader":
        return user.totalDownloads;
      default:
        return 0;
    }
  };

  // Get stat label
  const getStatLabel = () => {
    switch (activeTab) {
      case "contributor":
        return "Score";
      case "uploader":
        return "Uploads";
      case "downloader":
        return "Downloads";
      default:
        return "Points";
    }
  };

  // Filter users based on search
  const filteredUsers = leaderboardData.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.college.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render user card
  const renderUserCard = (user, index) => {
    const actualRank = user.rank || index + 1;
    const isTopThree = actualRank <= 3;
    const currentTab = tabs.find((tab) => tab.id === activeTab);

    return (
      <div
        key={user.id}
        className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4 ${
          isTopThree ? currentTab.borderColor : "border-gray-200"
        } ${isTopThree ? currentTab.bgColor : ""}`}
      >
        <div className="flex items-center justify-between">
          {/* Rank and User Info */}
          <div className="flex items-center space-x-4">
            {/* Rank Badge */}
            <div className="flex items-center justify-center w-12 h-12">
              {getRankBadge(actualRank)}
            </div>

            {/* User Avatar and Info */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  user.fullName.charAt(0).toUpperCase()
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.fullName}
                </h3>
              </div>
            </div>
          </div>

          {/* Stats and Badge */}
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {getPrimaryStat(user).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mb-2">{getStatLabel()}</div>
            {getTrustBadge(user.trustRanking)}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {user.totalUploads}
              </div>
              <div className="text-xs text-gray-600">Uploads</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {user.totalDownloads}
              </div>
              <div className="text-xs text-gray-600">Downloads</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {user.contributorScore}
              </div>
              <div className="text-xs text-gray-600">Score</div>
            </div>
          </div>
        </div>

        {/* Join Date */}
        <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          Member since {new Date(user.joinDate).toLocaleDateString()}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-10 w-10 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">
            Celebrating our top contributors and most active community members
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Updated Daily</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Real-time Rankings</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 px-6 text-center border-b-2 transition-all duration-200 ${
                      activeTab === tab.id
                        ? `border-current ${tab.color} ${tab.bgColor}`
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    <p className="text-xs mt-1 opacity-75">{tab.description}</p>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              {/* College Filter */}
              <select
                value={collegeFilter}
                onChange={(e) => setCollegeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 min-w-[150px]"
              >
                <option value="all">All Colleges</option>
                {colleges.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>

              {/* Limit */}
              <select
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
              >
                <option value={10}>Top 10</option>
                <option value={20}>Top 20</option>
                <option value={50}>Top 50</option>
                <option value={100}>Top 100</option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={loadLeaderboard}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Leaderboard Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600">Loading leaderboard...</span>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredUsers.length} of {leaderboardData.length} users
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>

            {/* Top 3 Podium (Special Display) */}
            {filteredUsers.length >= 3 && !searchQuery && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                  🏆 Top Performers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {/* 2nd Place */}
                  <div className="md:order-1 md:mt-8">
                    {renderUserCard(filteredUsers[1], 1)}
                  </div>
                  {/* 1st Place - Elevated */}
                  <div className="md:order-2 md:-mt-4 transform md:scale-105">
                    {renderUserCard(filteredUsers[0], 0)}
                  </div>
                  {/* 3rd Place */}
                  <div className="md:order-3 md:mt-8">
                    {renderUserCard(filteredUsers[2], 2)}
                  </div>
                </div>
              </div>
            )}

            {/* Section Divider */}
            {filteredUsers.length > 3 && !searchQuery && (
              <div className="mb-8">
                <div className="flex items-center justify-center">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <div className="px-4 text-sm font-medium text-gray-500 bg-gray-50 rounded-full py-2">
                    Rest of the Rankings
                  </div>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
              </div>
            )}

            {/* Rest of the Leaderboard */}
            {filteredUsers.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(searchQuery ? filteredUsers : filteredUsers.slice(3)).map(
                  (user, index) =>
                    renderUserCard(user, searchQuery ? index : index + 3)
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? `No users match your search "${searchQuery}"`
                    : "No leaderboard data available"}
                </p>
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white">
          <Zap className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Want to climb the ranks?</h2>
          <p className="text-purple-100 mb-4">
            Upload quality notes, help others, and build your reputation in the
            community
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => (window.location.href = "/upload")}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Upload Notes
            </button>
            <button
              onClick={() => (window.location.href = "/notes")}
              className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-purple-600 transition-colors"
            >
              Browse Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
