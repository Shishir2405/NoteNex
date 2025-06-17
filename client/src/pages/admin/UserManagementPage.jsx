import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Shield,
  AlertTriangle,
  Eye,
  Ban,
  Mail,
  Calendar,
  Award,
  Upload,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  MessageSquare,
} from "lucide-react";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCollege, setFilterCollege] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showWarnModal, setShowWarnModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [warnReason, setWarnReason] = useState("");
  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState("");
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Mock API base - replace with your actual API
  const API_BASE = "http://localhost:5001/api";

  // Mock data for demonstration
  useEffect(() => {
    // Initialize with mock data
    const mockUsers = [
      {
        _id: "1",
        fullName: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        college: "MIT",
        course: "Computer Science",
        semester: "6th",
        trustRanking: "Gold",
        isBanned: false,
        warnings: [],
        totalUploads: 15,
        totalDownloads: 45,
        contributorScore: 250,
        bookmarkedNotes: ["note1", "note2"],
        bio: "Software engineering student passionate about AI and machine learning.",
        createdAt: "2024-01-15T10:30:00Z",
        avatar: null,
      },
      {
        _id: "2",
        fullName: "Jane Smith",
        username: "janesmith",
        email: "jane@example.com",
        college: "Harvard",
        course: "Data Science",
        semester: "4th",
        trustRanking: "Silver",
        isBanned: true,
        banReason: "Violation of community guidelines",
        warnings: [
          { reason: "Inappropriate content", issuedAt: "2024-02-10T14:20:00Z" },
        ],
        totalUploads: 8,
        totalDownloads: 22,
        contributorScore: 120,
        bookmarkedNotes: ["note3"],
        bio: "Data science enthusiast with focus on analytics.",
        createdAt: "2024-02-01T09:15:00Z",
        avatar: null,
      },
      {
        _id: "3",
        fullName: "Mike Johnson",
        username: "mikej",
        email: "mike@example.com",
        college: "Stanford",
        course: "Physics",
        semester: "8th",
        trustRanking: "Platinum",
        isBanned: false,
        warnings: [],
        totalUploads: 32,
        totalDownloads: 78,
        contributorScore: 450,
        bookmarkedNotes: ["note4", "note5", "note6"],
        bio: "Physics major with interests in quantum computing.",
        createdAt: "2023-12-10T16:45:00Z",
        avatar: null,
      },
    ];

    const mockColleges = ["MIT", "Harvard", "Stanford", "Berkeley", "Caltech"];
    const mockCourses = [
      "Computer Science",
      "Data Science",
      "Physics",
      "Mathematics",
      "Engineering",
    ];

    setUsers(mockUsers);
    setColleges(mockColleges);
    setCourses(mockCourses);
    setTotalPages(1);
    setLoading(false);
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      console.log("Loading users with filters:", {
        page: currentPage,
        search: searchQuery,
        college: filterCollege,
        course: filterCourse,
        status: filterStatus,
      });

      // Simulate API delay
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Failed to load users:", error);
      setLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      // Mock API call - replace with actual implementation
      console.log("Loading filter options");
    } catch (error) {
      console.error("Failed to load filter options:", error);
    }
  };

  const handleBanUser = async () => {
    if (!selectedUser?.isBanned && !banReason.trim()) return;

    setActionLoading(selectedUser._id);
    try {
      // Mock API call - replace with actual implementation
      console.log("Ban/Unban user:", selectedUser._id, {
        reason: banReason,
        duration: banDuration ? parseInt(banDuration) : null,
      });

      // Update user state
      setUsers((prev) =>
        prev.map((user) =>
          user._id === selectedUser._id
            ? {
                ...user,
                isBanned: !user.isBanned,
                banReason: user.isBanned ? null : banReason,
              }
            : user
        )
      );

      setShowBanModal(false);
      setBanReason("");
      setBanDuration("");
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to ban/unban user:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleWarnUser = async () => {
    if (!warnReason.trim()) return;

    setActionLoading(selectedUser._id);
    try {
      // Mock API call - replace with actual implementation
      console.log("Warn user:", selectedUser._id, { reason: warnReason });

      const newWarning = {
        reason: warnReason,
        issuedAt: new Date().toISOString(),
      };

      setUsers((prev) =>
        prev.map((user) =>
          user._id === selectedUser._id
            ? { ...user, warnings: [...(user.warnings || []), newWarning] }
            : user
        )
      );

      setShowWarnModal(false);
      setWarnReason("");
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to warn user:", error);
    } finally {
      setActionLoading(null);
    }
  };

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

  const UserDetailsModal = ({ user, isOpen, onClose }) => {
    if (!isOpen || !user) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-screen overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              User Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  user.fullName?.charAt(0) || "U"
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.fullName}
                </h3>
                <p className="text-gray-600">@{user.username}</p>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-1">{getTrustBadge(user.trustRanking)}</div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-3 rounded-lg ${
                  user.isBanned
                    ? "bg-red-50 border border-red-200"
                    : "bg-green-50 border border-green-200"
                }`}
              >
                <div className="flex items-center">
                  {user.isBanned ? (
                    <Ban className="h-5 w-5 text-red-600 mr-2" />
                  ) : (
                    <UserCheck className="h-5 w-5 text-green-600 mr-2" />
                  )}
                  <span
                    className={`font-medium ${
                      user.isBanned ? "text-red-900" : "text-green-900"
                    }`}
                  >
                    {user.isBanned ? "Banned" : "Active"}
                  </span>
                </div>
                {user.isBanned && user.banReason && (
                  <p className="text-sm text-red-700 mt-1">
                    Reason: {user.banReason}
                  </p>
                )}
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="font-medium text-gray-900">
                    {user.warnings?.length || 0} Warnings
                  </span>
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Academic Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">College:</span>
                  <p className="text-gray-900">{user.college}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Course:</span>
                  <p className="text-gray-900">{user.course}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Semester:</span>
                  <p className="text-gray-900">{user.semester}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Joined:</span>
                  <p className="text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Activity Statistics
              </h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {user.totalUploads || 0}
                  </div>
                  <div className="text-xs text-blue-600">Uploads</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {user.totalDownloads || 0}
                  </div>
                  <div className="text-xs text-green-600">Downloads</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {user.contributorScore || 0}
                  </div>
                  <div className="text-xs text-purple-600">Score</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {user.bookmarkedNotes?.length || 0}
                  </div>
                  <div className="text-xs text-yellow-600">Bookmarks</div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Warnings History */}
            {user.warnings && user.warnings.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Warning History
                </h4>
                <div className="space-y-2">
                  {user.warnings.map((warning, index) => (
                    <div
                      key={index}
                      className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <p className="text-sm text-yellow-800">
                        {warning.reason}
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">
                        {new Date(warning.issuedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={() => {
                setSelectedUser(user);
                setShowWarnModal(true);
                onClose();
              }}
              className="flex items-center px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Warn User
            </button>
            <button
              onClick={() => {
                setSelectedUser(user);
                setShowBanModal(true);
                onClose();
              }}
              className={`flex items-center px-4 py-2 rounded-lg ${
                user.isBanned
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {user.isBanned ? (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Unban User
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4 mr-2" />
                  Ban User
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={loadUsers}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={filterCollege}
              onChange={(e) => setFilterCollege(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 min-w-[150px]"
            >
              <option value="all">All Colleges</option>
              {colleges.map((college) => (
                <option key={college} value={college}>
                  {college}
                </option>
              ))}
            </select>

            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 min-w-[130px]"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 min-w-[120px]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              <option value="warned">Warned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading users...</p>
          </div>
        </div>
      ) : users.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      College
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.fullName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              user.fullName?.charAt(0) || "U"
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username}
                            </div>
                            <div className="mt-1">
                              {getTrustBadge(user.trustRanking)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {user.college}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.course}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex space-x-4">
                          <span>{user.totalUploads || 0} uploads</span>
                          <span>{user.totalDownloads || 0} downloads</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Score: {user.contributorScore || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-1">
                          {user.isBanned ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Banned
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          )}
                          {user.warnings && user.warnings.length > 0 && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {user.warnings.length} warnings
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowWarnModal(true);
                            }}
                            className="text-yellow-600 hover:text-yellow-900 flex items-center"
                          >
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Warn
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowBanModal(true);
                            }}
                            className={`flex items-center ${
                              user.isBanned
                                ? "text-green-600 hover:text-green-900"
                                : "text-red-600 hover:text-red-900"
                            }`}
                          >
                            {user.isBanned ? (
                              <>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Unban
                              </>
                            ) : (
                              <>
                                <Ban className="h-4 w-4 mr-1" />
                                Ban
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-white px-6 py-3 rounded-lg shadow-sm">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No users found
          </h3>
          <p className="text-gray-600">
            {searchQuery ||
            filterCollege !== "all" ||
            filterCourse !== "all" ||
            filterStatus !== "all"
              ? "No users match your current filters."
              : "No users to display."}
          </p>
        </div>
      )}

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={showUserDetails}
        onClose={() => {
          setShowUserDetails(false);
          setSelectedUser(null);
        }}
      />

      {/* Warn User Modal */}
      {showWarnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Warn User</h2>
              <button
                onClick={() => {
                  setShowWarnModal(false);
                  setWarnReason("");
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Warning user:{" "}
                  <span className="font-medium">{selectedUser?.fullName}</span>
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warning Reason
                </label>
                <textarea
                  value={warnReason}
                  onChange={(e) => setWarnReason(e.target.value)}
                  placeholder="Enter reason for warning..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowWarnModal(false);
                    setWarnReason("");
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWarnUser}
                  disabled={!warnReason.trim() || actionLoading}
                  className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-2" />
                  )}
                  Issue Warning
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ban/Unban User Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedUser?.isBanned ? "Unban User" : "Ban User"}
              </h2>
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setBanReason("");
                  setBanDuration("");
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  {selectedUser?.isBanned ? "Unbanning" : "Banning"} user:{" "}
                  <span className="font-medium">{selectedUser?.fullName}</span>
                </p>

                {!selectedUser?.isBanned && (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ban Reason *
                    </label>
                    <textarea
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      placeholder="Enter reason for ban..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                      rows={3}
                    />

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ban Duration (days)
                    </label>
                    <input
                      type="number"
                      value={banDuration}
                      onChange={(e) => setBanDuration(e.target.value)}
                      placeholder="Leave empty for permanent ban"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      min="1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for a permanent ban
                    </p>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowBanModal(false);
                    setBanReason("");
                    setBanDuration("");
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBanUser}
                  disabled={
                    (!selectedUser?.isBanned && !banReason.trim()) ||
                    actionLoading
                  }
                  className={`flex items-center px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedUser?.isBanned
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {actionLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : selectedUser?.isBanned ? (
                    <UserCheck className="h-4 w-4 mr-2" />
                  ) : (
                    <Ban className="h-4 w-4 mr-2" />
                  )}
                  {selectedUser?.isBanned ? "Unban User" : "Ban User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
