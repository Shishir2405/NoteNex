import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Heart,
  BookOpen,
  Star,
  Eye,
  MessageCircle,
  Calendar,
  User,
  Tag,
  FileText,
  ChevronDown,
  X,
  Bookmark,
  Flag,
  ThumbsUp,
  Grid,
  List,
  SortAsc,
  Loader2,
  DollarSign,
  CheckCircle,
} from "lucide-react";

const BrowseNotesPage = () => {
  // State management
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Filter states
  const [filters, setFilters] = useState({
    subject: "",
    semester: "",
    college: "",
    course: "",
    quality: "",
    isPremium: "",
    sortBy: "recent",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    subjects: [],
    semesters: [],
    colleges: [],
    courses: [],
    qualities: ["low", "medium", "high", "premium"],
  });

  // API Base URL
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  // Load initial data
  useEffect(() => {
    loadNotes();
  }, [currentPage, filters, searchQuery]);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        sortBy: filters.sortBy,
      });

      // Add search query if present
      if (searchQuery.trim()) {
        queryParams.append("search", searchQuery.trim());
      }

      // Add filters only if they have values
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "" && key !== "sortBy") {
          queryParams.append(key, value);
        }
      });

      console.log("Fetching notes with params:", queryParams.toString());

      const response = await fetch(`${API_BASE}/notes?${queryParams}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (data.status === "success") {
        // Handle different response structures
        const notesData = data.data.notes || data.data || [];
        const paginationData = data.data.pagination || {};

        setNotes(notesData);
        setTotalPages(
          paginationData.totalPages || Math.ceil(notesData.length / 12)
        );
        setTotalNotes(paginationData.totalNotes || notesData.length);

        console.log("Loaded notes:", notesData.length);
      } else {
        console.error("API Error:", data.message);
        setNotes([]);
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const response = await fetch(`${API_BASE}/search/filters`);
      const data = await response.json();

      if (data.status === "success") {
        setFilterOptions({
          subjects: data.data.subjects || [
            "Computer Science",
            "Mathematics",
            "Physics",
            "Chemistry",
            "Data Structures",
            "Algorithms",
            "Database Management",
            "Software Engineering",
            "Machine Learning",
          ],
          semesters: data.data.semesters || [
            "1st Semester",
            "2nd Semester",
            "3rd Semester",
            "4th Semester",
            "5th Semester",
            "6th Semester",
            "7th Semester",
            "8th Semester",
          ],
          colleges: data.data.colleges || [
            "IIT Delhi",
            "IIT Bombay",
            "IIT Madras",
            "NIT Trichy",
            "BITS Pilani",
            "Delhi University",
            "Mumbai University",
          ],
          courses: data.data.courses || [
            "B.Tech Computer Science",
            "B.Tech Information Technology",
            "B.Tech Electronics",
            "BCA",
            "MCA",
            "B.Sc Computer Science",
          ],
          qualities: ["low", "medium", "high", "premium"],
        });
      }
    } catch (error) {
      console.error("Failed to load filter options:", error);
      // Set default options if API fails
      setFilterOptions({
        subjects: [
          "Computer Science",
          "Mathematics",
          "Physics",
          "Chemistry",
          "Data Structures",
          "Algorithms",
          "Database Management",
          "Software Engineering",
          "Machine Learning",
        ],
        semesters: [
          "1st Semester",
          "2nd Semester",
          "3rd Semester",
          "4th Semester",
          "5th Semester",
          "6th Semester",
          "7th Semester",
          "8th Semester",
        ],
        colleges: [
          "IIT Delhi",
          "IIT Bombay",
          "IIT Madras",
          "NIT Trichy",
          "BITS Pilani",
          "Delhi University",
          "Mumbai University",
        ],
        courses: [
          "B.Tech Computer Science",
          "B.Tech Information Technology",
          "B.Tech Electronics",
          "BCA",
          "MCA",
          "B.Sc Computer Science",
        ],
        qualities: ["low", "medium", "high", "premium"],
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadNotes();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      subject: "",
      semester: "",
      college: "",
      course: "",
      quality: "",
      isPremium: "",
      sortBy: "recent",
    });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleLike = async (noteId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to like notes");
        return;
      }

      const response = await fetch(`${API_BASE}/notes/${noteId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        // Update the note in the list
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === noteId
              ? {
                  ...note,
                  likeCount: data.data.likeCount,
                  isLikedByUser: data.data.isLiked,
                }
              : note
          )
        );
      } else {
        alert(data.message || "Failed to like note");
      }
    } catch (error) {
      console.error("Failed to like note:", error);
      alert("Failed to like note");
    }
  };

  const handleBookmark = async (noteId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to bookmark notes");
        return;
      }

      const response = await fetch(`${API_BASE}/notes/${noteId}/bookmark`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === noteId
              ? { ...note, isBookmarkedByUser: data.data.isBookmarked }
              : note
          )
        );
      } else {
        alert(data.message || "Failed to bookmark note");
      }
    } catch (error) {
      console.error("Failed to bookmark note:", error);
      alert("Failed to bookmark note");
    }
  };

  const handleDownload = async (noteId, title) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to download notes");
        return;
      }

      const response = await fetch(`${API_BASE}/notes/${noteId}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        // Open the download URL in a new tab
        window.open(data.data.downloadUrl, "_blank");

        // Update download count
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === noteId
              ? { ...note, downloads: (note.downloads || 0) + 1 }
              : note
          )
        );
      } else {
        alert(data.message || "Failed to download note");
      }
    } catch (error) {
      console.error("Failed to download note:", error);
      alert("Failed to download note");
    }
  };

  const handleViewNote = (noteId) => {
    // Navigate to note details page
    window.open(`/notes/${noteId}`, "_blank");
  };

  const renderNoteCard = (note) => (
    <div
      key={note._id}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
        viewMode === "list" ? "flex items-center p-4" : "p-6"
      }`}
    >
      {viewMode === "grid" ? (
        <>
          {/* Note Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3
                className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-purple-600"
                onClick={() => handleViewNote(note._id)}
              >
                {note.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {note.description || "No description provided"}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {note.isPremium && (
                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" />₹{note.price || 0}
                </div>
              )}
              {note.isVerified && (
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </div>
              )}
            </div>
          </div>

          {/* Note Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>{note.subject}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span>
                {note.uploadedBy?.fullName || note.authorName || "Anonymous"}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
            {note.college && (
              <div className="flex items-center text-sm text-gray-600">
                <Tag className="h-4 w-4 mr-2" />
                <span>{note.college}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {note.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
              {note.tags.length > 3 && (
                <span className="text-gray-500 text-xs">
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
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span>{note.likeCount || note.likes?.length || 0}</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>{note.commentCount || note.comments?.length || 0}</span>
              </div>
            </div>

            {note.quality && (
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  note.quality === "high" || note.quality === "premium"
                    ? "bg-green-100 text-green-800"
                    : note.quality === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {note.quality} quality
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => handleLike(note._id)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  note.isLikedByUser
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Heart
                  className={`h-4 w-4 mr-1 ${
                    note.isLikedByUser ? "fill-current" : ""
                  }`}
                />
                Like
              </button>

              <button
                onClick={() => handleBookmark(note._id)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  note.isBookmarkedByUser
                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 mr-1 ${
                    note.isBookmarkedByUser ? "fill-current" : ""
                  }`}
                />
                Save
              </button>

              <button
                onClick={() => handleViewNote(note._id)}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </button>
            </div>

            <button
              onClick={() => handleDownload(note._id, note.title)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center text-sm font-medium"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </button>
          </div>
        </>
      ) : (
        // List View
        <>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3
                className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-purple-600"
                onClick={() => handleViewNote(note._id)}
              >
                {note.title}
              </h3>
              <div className="flex items-center space-x-2">
                {note.isPremium && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    ₹{note.price || 0}
                  </span>
                )}
                {note.isVerified && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    Verified
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              {note.description || "No description provided"}
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{note.subject}</span>
              <span>•</span>
              <span>{note.uploadedBy?.fullName || note.authorName}</span>
              <span>•</span>
              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{note.downloads || 0} downloads</span>
              <span>•</span>
              <span>{note.views || 0} views</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 ml-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleLike(note._id)}
                className={`p-2 rounded-lg ${
                  note.isLikedByUser ? "text-red-600" : "text-gray-400"
                } hover:bg-gray-100`}
              >
                <Heart
                  className={`h-4 w-4 ${
                    note.isLikedByUser ? "fill-current" : ""
                  }`}
                />
              </button>
              <button
                onClick={() => handleBookmark(note._id)}
                className={`p-2 rounded-lg ${
                  note.isBookmarkedByUser ? "text-blue-600" : "text-gray-400"
                } hover:bg-gray-100`}
              >
                <Bookmark
                  className={`h-4 w-4 ${
                    note.isBookmarkedByUser ? "fill-current" : ""
                  }`}
                />
              </button>
            </div>
            <button
              onClick={() => handleDownload(note._id, note.title)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Notes
          </h1>
          <p className="text-gray-600">
            Discover and download study materials from your peers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Search Bar */}
          <div className="mb-4">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for notes, topics, or subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              <ChevronDown
                className={`h-4 w-4 ml-1 transform transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
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
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="likes">Most Liked</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <select
                  value={filters.subject}
                  onChange={(e) =>
                    handleFilterChange("subject", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Subjects</option>
                  {filterOptions.subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.semester}
                  onChange={(e) =>
                    handleFilterChange("semester", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Semesters</option>
                  {filterOptions.semesters.map((semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.college}
                  onChange={(e) =>
                    handleFilterChange("college", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Colleges</option>
                  {filterOptions.colleges.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.course}
                  onChange={(e) => handleFilterChange("course", e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Courses</option>
                  {filterOptions.courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.quality}
                  onChange={(e) =>
                    handleFilterChange("quality", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Quality</option>
                  {filterOptions.qualities.map((quality) => (
                    <option key={quality} value={quality}>
                      {quality.charAt(0).toUpperCase() + quality.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.isPremium}
                  onChange={(e) =>
                    handleFilterChange("isPremium", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Notes</option>
                  <option value="false">Free Only</option>
                  <option value="true">Premium Only</option>
                </select>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-gray-600">Loading notes...</span>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {notes.length} of {totalNotes} notes
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            {/* Notes Grid/List */}
            {notes.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {notes.map(renderNoteCard)}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notes found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ||
                  Object.values(filters).some((f) => f && f !== "recent")
                    ? "Try adjusting your search or filter criteria."
                    : "No notes have been uploaded yet. Be the first to share your knowledge!"}
                </p>
                {!searchQuery &&
                  !Object.values(filters).some((f) => f && f !== "recent") && (
                    <button
                      onClick={() => (window.location.href = "/upload")}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Upload First Note
                    </button>
                  )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
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
                      className={`px-4 py-2 rounded-lg ${
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
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseNotesPage;
