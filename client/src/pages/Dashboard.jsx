import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  Upload,
  Users,
  Star,
  Download,
  Settings,
  LogOut,
  Search,
  Bell,
  User,
  Menu,
  X,
  Heart,
  TrendingUp,
  FileText,
  Award,
  MessageCircle,
  Plus,
  Eye,
  Filter,
  Calendar,
  Building,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Clock,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";

// API Base URL
const API_BASE = `${import.meta.env.VITE_API_URL}`;

// API Helper Functions
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: { ...defaultOptions.headers, ...options.headers },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState({ name: "Loading...", course: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Data states for different sections
  const [dashboardData, setDashboardData] = useState({});
  const [notesData, setNotesData] = useState([]);
  const [uploadsData, setUploadsData] = useState([]);
  const [bookmarksData, setBookmarksData] = useState([]);
  const [downloadsData, setDownloadsData] = useState([]);
  const [studyGroupsData, setStudyGroupsData] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "browse", label: "Browse Notes", icon: BookOpen },
    { id: "my-uploads", label: "My Uploads", icon: Upload },
    { id: "bookmarks", label: "Bookmarks", icon: Heart },
    { id: "downloads", label: "Downloads", icon: Download },
    { id: "study-groups", label: "Study Groups", icon: Users },
    { id: "leaderboard", label: "Leaderboard", icon: Award },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Load user data and dashboard info on mount
  useEffect(() => {
    loadUserData();
    loadDashboardData();
  }, []);

  // Load data when tab changes
  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  const loadUserData = async () => {
    try {
      const userData = await apiCall("/auth/me");
      if (userData.status === "success") {
        setUser(userData.data);
        localStorage.setItem("user", JSON.stringify(userData.data));
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // You can create a dashboard stats endpoint or combine multiple calls
      const [uploadsRes, bookmarksRes, downloadsRes] = await Promise.all([
        apiCall("/notes/my-uploads?limit=3"),
        apiCall("/notes/bookmarks?limit=3"),
        apiCall("/users/download-history?limit=3"),
      ]);

      setDashboardData({
        recentUploads: uploadsRes.data?.items || [],
        recentBookmarks: bookmarksRes.data?.items || [],
        recentDownloads: downloadsRes.data?.items || [],
        stats: {
          uploads: uploadsRes.data?.pagination?.totalItems || 0,
          bookmarks: bookmarksRes.data?.pagination?.totalItems || 0,
          downloads: downloadsRes.data?.pagination?.totalItems || 0,
        },
      });
    } catch (error) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const loadTabData = async (tab) => {
    setLoading(true);
    setError("");

    try {
      switch (tab) {
        case "browse":
          const notesRes = await apiCall(
            "/notes?page=1&limit=12&sortBy=recent"
          );
          setNotesData(notesRes.data?.items || []);
          break;

        case "my-uploads":
          const uploadsRes = await apiCall("/notes/my-uploads?page=1&limit=10");
          setUploadsData(uploadsRes.data?.items || []);
          break;

        case "bookmarks":
          const bookmarksRes = await apiCall(
            "/notes/bookmarks?page=1&limit=10"
          );
          setBookmarksData(bookmarksRes.data?.items || []);
          break;

        case "downloads":
          const downloadsRes = await apiCall(
            "/users/download-history?page=1&limit=10"
          );
          setDownloadsData(downloadsRes.data?.items || []);
          break;

        case "study-groups":
          const groupsRes = await apiCall("/community/groups?page=1&limit=10");
          setStudyGroupsData(groupsRes.data?.items || []);
          break;

        case "leaderboard":
          const leaderRes = await apiCall(
            "/users/leaderboard?type=contributor&limit=20"
          );
          setLeaderboardData(leaderRes.data || []);
          break;
      }
    } catch (error) {
      setError(`Failed to load ${tab} data`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiCall("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const handleNoteAction = async (noteId, action) => {
    try {
      await apiCall(`/notes/${noteId}/${action}`, { method: "POST" });
      // Reload current tab data
      loadTabData(activeTab);
      if (activeTab !== "dashboard") loadDashboardData();
    } catch (error) {
      setError(`Failed to ${action} note`);
    }
  };

  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2">Loading...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {user.fullName || user.name}!
              </h2>
              <p className="opacity-90">
                Ready to share knowledge and help your peers succeed?
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Notes Uploaded</p>
                    <p className="text-2xl font-bold mt-1">
                      {dashboardData.stats?.uploads || 0}
                    </p>
                  </div>
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Downloads</p>
                    <p className="text-2xl font-bold mt-1">
                      {dashboardData.stats?.downloads || 0}
                    </p>
                  </div>
                  <div className="bg-green-500 p-3 rounded-lg">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Bookmarks</p>
                    <p className="text-2xl font-bold mt-1">
                      {dashboardData.stats?.bookmarks || 0}
                    </p>
                  </div>
                  <div className="bg-red-500 p-3 rounded-lg">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Study Groups</p>
                    <p className="text-2xl font-bold mt-1">5</p>
                  </div>
                  <div className="bg-purple-500 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Recent Uploads
                  </h3>
                  <button
                    onClick={() => setActiveTab("my-uploads")}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {dashboardData.recentUploads?.slice(0, 3).map((note) => (
                    <div
                      key={note._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{note.title}</p>
                        <p className="text-gray-600 text-xs">{note.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {note.downloads || 0} downloads
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!dashboardData.recentUploads ||
                    dashboardData.recentUploads.length === 0) && (
                    <p className="text-gray-500 text-center py-4">
                      No uploads yet
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab("my-uploads")}
                    className="w-full flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <Upload className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="font-medium">Upload New Note</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("browse")}
                    className="w-full flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Search className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium">Browse Notes</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("study-groups")}
                    className="w-full flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Users className="h-5 w-5 text-green-600 mr-3" />
                    <span className="font-medium">Join Study Group</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "browse":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Browse Notes</h2>
              <div className="flex space-x-3">
                <button className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
                <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notesData.map((note) => (
                <div
                  key={note._id}
                  className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{note.title}</h3>
                    <button
                      onClick={() => handleNoteAction(note._id, "bookmark")}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {note.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{note.subject}</span>
                    <span>{note.semester}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span className="text-sm">{note.downloads || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm">{note.rating || 0}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "my-uploads":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Uploads</h2>
              <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Upload Note
              </button>
            </div>

            <div className="space-y-4">
              {uploadsData.map((note) => (
                <div
                  key={note._id}
                  className="bg-white p-6 rounded-xl shadow-sm border"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {note.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{note.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {note.subject}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {note.semester}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {note.downloads || 0} downloads
                        </span>
                        <span className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {note.likes || 0} likes
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-500 hover:text-purple-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-600">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {uploadsData.length === 0 && (
                <div className="text-center py-12">
                  <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No uploads yet. Share your first note!
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case "bookmarks":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Bookmarked Notes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarksData.map((note) => (
                <div
                  key={note._id}
                  className="bg-white p-6 rounded-xl shadow-sm border"
                >
                  <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {note.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{note.subject}</span>
                    <span>{note.semester}</span>
                  </div>
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
                    Download
                  </button>
                </div>
              ))}
              {bookmarksData.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No bookmarks yet. Start bookmarking notes you like!
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case "downloads":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Download History</h2>
            <div className="space-y-4">
              {downloadsData.map((download, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">
                        {download.noteTitle || "Note Title"}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {download.subject} • Downloaded on{" "}
                        {new Date(download.downloadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="text-purple-600 hover:text-purple-700">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
              {downloadsData.length === 0 && (
                <div className="text-center py-12">
                  <Download className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No downloads yet. Start downloading notes!
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case "study-groups":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Study Groups</h2>
              <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studyGroupsData.map((group) => (
                <div
                  key={group._id}
                  className="bg-white p-6 rounded-xl shadow-sm border"
                >
                  <h3 className="font-semibold text-lg mb-2">{group.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {group.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{group.subject}</span>
                    <span>{group.members?.length || 0} members</span>
                  </div>
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                    Join Group
                  </button>
                </div>
              ))}
              {studyGroupsData.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No study groups yet. Create or join your first group!
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case "leaderboard":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Leaderboard</h2>
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6">
                <h3 className="font-semibold mb-4">Top Contributors</h3>
                <div className="space-y-3">
                  {leaderboardData.map((user, index) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                              ? "bg-gray-400"
                              : index === 2
                              ? "bg-orange-500"
                              : "bg-purple-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-gray-600 text-sm">
                            {user.college}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {user.uploads || 0} uploads
                        </p>
                        <p className="text-gray-600 text-sm">
                          {user.downloads || 0} downloads
                        </p>
                      </div>
                    </div>
                  ))}
                  {leaderboardData.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No leaderboard data available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="font-semibold mb-4">Profile Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.fullName || ""}
                    className="w-full p-3 border rounded-lg"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email || ""}
                    className="w-full p-3 border rounded-lg"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    College
                  </label>
                  <input
                    type="text"
                    value={user.college || ""}
                    className="w-full p-3 border rounded-lg"
                    readOnly
                  />
                </div>
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
            <h2 className="text-2xl font-bold mb-4 capitalize">
              {activeTab.replace("-", " ")}
            </h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center">
            <div className="bg-purple-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold">StudyShare</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center px-3 py-3 mb-1 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-3 right-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-4"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold capitalize">
              {activeTab.replace("-", " ")}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search notes..."
                className="bg-transparent outline-none text-sm w-64"
              />
            </div>

            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-2">
              <div className="bg-purple-600 p-2 rounded-full">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user.fullName}</p>
                <p className="text-xs text-gray-600">{user.course}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderDashboardContent()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;
