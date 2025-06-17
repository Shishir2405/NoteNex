import React, { useState, useEffect } from "react";
import {
  Bookmark,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Download,
  Heart,
  MessageCircle,
  Calendar,
  Tag,
  User,
  Star,
  FileText,
  Image as ImageIcon,
  File,
  Trash2,
  ExternalLink,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  Loader2,
  SortAsc,
  SortDesc,
  BookmarkX,
} from "lucide-react";

const BookmarksPage = () => {
  // State management
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookmarks, setTotalBookmarks] = useState(0);

  // Filter options
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [colleges, setColleges] = useState([]);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  // Load bookmarked notes
  useEffect(() => {
    loadBookmarks();
  }, [currentPage, searchQuery, filterSubject, sortBy]);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        ...(searchQuery && { search: searchQuery }),
        ...(filterSubject !== "all" && { subject: filterSubject }),
        ...(sortBy && { sortBy }),
      });

      const response = await fetch(
        `${API_BASE}/notes/bookmarks?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setBookmarks(data.data.notes || []);
        setTotalPages(data.data.pagination?.totalPages || 1);
        setTotalBookmarks(data.data.pagination?.totalNotes || 0);
      }
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load filter options
  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const response = await fetch(`${API_BASE}/search/filters`);
      const data = await response.json();
      if (data.status === "success") {
        setSubjects(data.data.subjects || []);
        setCourses(data.data.courses || []);
        setColleges(data.data.colleges || []);
      }
    } catch (error) {
      console.error("Failed to load filter options:", error);
    }
  };

  // Remove bookmark
  const handleRemoveBookmark = async (noteId) => {
    if (!confirm("Remove this note from your bookmarks?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/notes/${noteId}/bookmark`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setBookmarks((prev) => prev.filter((note) => note._id !== noteId));
        setTotalBookmarks((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
    }
  };

  // Get file type icon
  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return <File className="h-5 w-5 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <ImageIcon className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
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

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Render note card
  const renderNoteCard = (note) => (
    <div
      key={note._id}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-purple-300 ${
        viewMode === "list" ? "flex items-center p-4" : "p-6"
      }`}
    >
      {viewMode === "grid" ? (
        <>
          {/* Note Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getFileIcon(note.fileType)}
                {note.isVerified && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 cursor-pointer">
                {note.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {note.description}
              </p>
            </div>
            <button
              onClick={() => handleRemoveBookmark(note._id)}
              className="text-purple-600 hover:text-red-600 transition-colors p-1"
              title="Remove bookmark"
            >
              <BookmarkX className="h-5 w-5" />
            </button>
          </div>

          {/* Note Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Tag className="h-4 w-4 mr-2" />
              <span>{note.subject}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span>
                {note.uploadedBy?.fullName || note.uploadedBy?.username}
              </span>
              <span className="ml-2">
                {getTrustBadge(note.uploadedBy?.trustRanking)}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {note.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {note.tags.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  +{note.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>{note.views || 0}</span>
              </div>
              <div className="flex items-center">
                <Download className="h-4 w-4 mr-1" />
                <span>{note.downloads || 0}</span>
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                <span>{note.likeCount || note.likes?.length || 0}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>{note.commentCount || note.comments?.length || 0}</span>
              </div>
            </div>
            <span className="text-xs">{formatFileSize(note.fileSize)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => window.open(`/notes/${note._id}`, "_blank")}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View
              </button>
              <button
                onClick={() => {
                  /* Download functionality */
                }}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
            </div>

            <div className="text-xs text-gray-500">
              {note.course} • {note.semester}
            </div>
          </div>
        </>
      ) : (
        // List View
        <>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                {getFileIcon(note.fileType)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 cursor-pointer">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {note.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveBookmark(note._id)}
                className="text-purple-600 hover:text-red-600 transition-colors p-1"
                title="Remove bookmark"
              >
                <BookmarkX className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>{note.subject}</span>
              <span>
                {note.uploadedBy?.fullName || note.uploadedBy?.username}
              </span>
              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              <div className="flex items-center space-x-3">
                <span>{note.downloads || 0} downloads</span>
                <span>{note.likeCount || note.likes?.length || 0} likes</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 ml-4">
            <button
              onClick={() => window.open(`/notes/${note._id}`, "_blank")}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              View
            </button>
            <button
              onClick={() => {
                /* Download functionality */
              }}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Download
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
          </div>
          <p className="text-gray-600">
            Your saved notes collection • {totalBookmarks} bookmarked notes
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search your bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filters and Controls */}
            <div className="flex items-center space-x-4">
              {/* Subject Filter */}
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 min-w-[140px]"
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 min-w-[120px]"
              >
                <option value="recent">Recently Added</option>
                <option value="title">Title A-Z</option>
                <option value="popular">Most Popular</option>
                <option value="downloads">Most Downloaded</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title="Grid view"
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title="List view"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600">
              Loading your bookmarks...
            </span>
          </div>
        ) : (
          <>
            {/* Results Count */}
            {bookmarks.length > 0 && (
              <div className="mb-6">
                <p className="text-gray-600">
                  Showing {bookmarks.length} of {totalBookmarks} bookmarked
                  notes
                </p>
              </div>
            )}

            {/* Bookmarks Grid/List */}
            {bookmarks.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {bookmarks.map(renderNoteCard)}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No bookmarks yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start bookmarking notes you find useful for quick access
                  later.
                </p>
                <button
                  onClick={() => (window.location.href = "/notes")}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Browse Notes
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>

                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const page =
                    Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                    index;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-purple-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
