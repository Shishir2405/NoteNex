import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Upload,
  Users,
  TrendingUp,
  FileText,
  Award,
  Heart,
  Download,
  Eye,
  Star,
  Calendar,
  Building,
  GraduationCap,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  MessageSquare,
  User,
  Mail,
  Lock,
  Bell,
  Palette,
  Shield,
  Edit,
} from "lucide-react";

const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
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

// Dashboard Home Page
export const DashboardHomePage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUploads: 0,
    totalBookmarks: 0,
    totalDownloads: 0,
  });
  const [recentNotes, setRecentNotes] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [uploadsRes, bookmarksRes, downloadsRes] = await Promise.all([
        apiCall("/notes/my-uploads?limit=5"),
        apiCall("/notes/bookmarks?limit=3"),
        apiCall("/users/download-history?limit=3"),
      ]);

      setStats({
        totalUploads: uploadsRes.data?.pagination?.totalItems || 0,
        totalBookmarks: bookmarksRes.data?.pagination?.totalItems || 0,
        totalDownloads: downloadsRes.data?.pagination?.totalItems || 0,
      });

      setRecentNotes(uploadsRes.data?.items || []);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Welcome to StudyShare! 📚</h1>
        <p className="text-purple-100 text-lg">
          Share knowledge, grow together, succeed as one.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Notes Uploaded</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalUploads}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Bookmarks</p>
              <p className="text-3xl font-bold text-red-600">
                {stats.totalBookmarks}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Downloads</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.totalDownloads}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Download className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link to="/dashboard/browse" className="block">
              <div className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <BookOpen className="h-5 w-5 text-blue-600 mr-3" />
                <span className="font-medium">Browse Notes</span>
              </div>
            </Link>
            <Link to="/dashboard/my-uploads" className="block">
              <div className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <Upload className="h-5 w-5 text-purple-600 mr-3" />
                <span className="font-medium">Upload New Note</span>
              </div>
            </Link>
            <Link to="/dashboard/study-groups" className="block">
              <div className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <Users className="h-5 w-5 text-green-600 mr-3" />
                <span className="font-medium">Join Study Groups</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Notes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Recent Uploads
          </h3>
          <div className="space-y-3">
            {recentNotes.slice(0, 3).map((note) => (
              <div key={note._id} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm">{note.title}</h4>
                <p className="text-xs text-gray-600">
                  {note.subject} • {note.downloads || 0} downloads
                </p>
              </div>
            ))}
            {recentNotes.length === 0 && (
              <p className="text-gray-500 text-center py-4">No uploads yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Browse Notes Page
export const BrowseNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    subject: "",
    semester: "",
    sortBy: "recent",
  });

  useEffect(() => {
    loadNotes();
  }, [filters]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: "1",
        limit: "12",
        sortBy: filters.sortBy,
        ...(filters.subject && { subject: filters.subject }),
        ...(filters.semester && { semester: filters.semester }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await apiCall(`/notes?${queryParams}`);
      setNotes(response.data?.items || []);
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (noteId) => {
    try {
      await apiCall(`/notes/${noteId}/bookmark`, { method: "POST" });
      // Refresh notes to show updated bookmark status
      loadNotes();
    } catch (error) {
      console.error("Failed to bookmark note:", error);
    }
  };

  const handleDownload = async (noteId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/notes/${noteId}/download`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "note.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to download note:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Notes</h1>
          <p className="text-gray-600">Discover and download study materials</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={loadNotes}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border flex flex-wrap gap-4">
        <select
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Subjects</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
        </select>

        <select
          value={filters.semester}
          onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Semesters</option>
          <option value="1st Semester">1st Semester</option>
          <option value="2nd Semester">2nd Semester</option>
          <option value="3rd Semester">3rd Semester</option>
          <option value="4th Semester">4th Semester</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
          <option value="likes">Most Liked</option>
        </select>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {note.title}
                  </h3>
                  <button
                    onClick={() => handleBookmark(note._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {note.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {note.subject}
                  </span>
                  <span>{note.semester}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{note.downloads || 0}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>{note.rating || 0}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(note._id)}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Download Note
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {notes.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            No notes found. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

// My Uploads Page
export const MyUploadsPage = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    loadUploads();
  }, []);

  const loadUploads = async () => {
    try {
      setLoading(true);
      const response = await apiCall("/notes/my-uploads?page=1&limit=20");
      setUploads(response.data?.items || []);
    } catch (error) {
      console.error("Failed to load uploads:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Uploads</h1>
          <p className="text-gray-600">Manage your uploaded study materials</p>
        </div>
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Note
        </button>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Upload New Note</h3>
            {/* Add upload form here */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUploadForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Uploads List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {uploads.map((note) => (
            <div
              key={note._id}
              className="bg-white p-6 rounded-xl shadow-sm border"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
                  <p className="text-gray-600 mb-4">{note.description}</p>
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
                      <Download className="h-4 w-4 mr-1" />
                      {note.downloads || 0} downloads
                    </span>
                    <span className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {note.likes || 0} likes
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-purple-600 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                    <AlertCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploads.length === 0 && !loading && (
        <div className="text-center py-12">
          <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            No uploads yet. Share your first note!
          </p>
          <button
            onClick={() => setShowUploadForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Upload Your First Note
          </button>
        </div>
      )}
    </div>
  );
};

// Bookmarks Page
export const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const response = await apiCall("/notes/bookmarks?page=1&limit=20");
      setBookmarks(response.data?.items || []);
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (noteId) => {
    try {
      await apiCall(`/notes/${noteId}/bookmark`, { method: "POST" });
      setBookmarks(bookmarks.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookmarked Notes</h1>
        <p className="text-gray-600">Your saved study materials</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((note) => (
            <div
              key={note._id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{note.title}</h3>
                  <button
                    onClick={() => removeBookmark(note._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Heart className="h-5 w-5 fill-current" />
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-4">{note.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{note.subject}</span>
                  <span>{note.semester}</span>
                </div>
                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {bookmarks.length === 0 && !loading && (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            No bookmarks yet. Start bookmarking notes you like!
          </p>
        </div>
      )}
    </div>
  );
};

// Downloads Page
export const DownloadsPage = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    try {
      setLoading(true);
      const response = await apiCall("/users/download-history?page=1&limit=20");
      setDownloads(response.data?.items || []);
    } catch (error) {
      console.error("Failed to load downloads:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Download History</h1>
        <p className="text-gray-600">Previously downloaded notes</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {downloads.map((download, index) => (
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
                <button className="text-purple-600 hover:text-purple-700 p-2">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {downloads.length === 0 && !loading && (
        <div className="text-center py-12">
          <Download className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            No downloads yet. Start downloading notes!
          </p>
        </div>
      )}
    </div>
  );
};

// Study Groups Page
export const StudyGroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudyGroups();
  }, []);

  const loadStudyGroups = async () => {
    try {
      setLoading(true);
      const response = await apiCall("/community/groups?page=1&limit=20");
      setGroups(response.data?.items || []);
    } catch (error) {
      console.error("Failed to load study groups:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Groups</h1>
          <p className="text-gray-600">Join or create study groups</p>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group._id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">{group.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {group.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{group.subject}</span>
                  <span>{group.members?.length || 0} members</span>
                </div>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Join Group
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {groups.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            No study groups yet. Create or join your first group!
          </p>
        </div>
      )}
    </div>
  );
};

// Leaderboard Page
export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await apiCall(
        "/users/leaderboard?type=contributor&limit=20"
      );
      setLeaderboard(response.data || []);
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-600">Top contributors in the community</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6">
            <h3 className="font-semibold mb-4">Top Contributors</h3>
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
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
                      <p className="text-gray-600 text-sm">{user.college}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{user.uploads || 0} uploads</p>
                    <p className="text-gray-600 text-sm">
                      {user.downloads || 0} downloads
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {leaderboard.length === 0 && !loading && (
        <div className="text-center py-12">
          <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No leaderboard data available</p>
        </div>
      )}
    </div>
  );
};

// Settings Page
export const SettingsPage = () => {
  const [user, setUser] = useState < any > {};
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      setLoading(true);
      const response = await apiCall("/auth/me");
      if (response.status === "success") {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Failed to load user settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await apiCall("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          fullName: user.fullName,
          bio: user.bio,
          college: user.college,
          course: user.course,
          semester: user.semester,
        }),
      });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Profile Settings
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={user.fullName || ""}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={user.bio || ""}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College
              </label>
              <input
                type="text"
                value={user.college || ""}
                onChange={(e) => setUser({ ...user, college: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>
              <input
                type="text"
                value={user.course || ""}
                onChange={(e) => setUser({ ...user, course: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <input
                type="text"
                value={user.semester || ""}
                onChange={(e) => setUser({ ...user, semester: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded text-purple-600 focus:ring-purple-500"
              defaultChecked
            />
            <span className="ml-3 text-gray-700">
              Email notifications for new comments
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded text-purple-600 focus:ring-purple-500"
              defaultChecked
            />
            <span className="ml-3 text-gray-700">
              Weekly summary of your uploads
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <span className="ml-3 text-gray-700">Marketing emails</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};
