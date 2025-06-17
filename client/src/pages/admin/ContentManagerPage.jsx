import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Star,
  Download,
  Heart,
  MessageSquare,
  Calendar,
  User,
  Tag,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Archive,
  Copy,
  ExternalLink,
} from "lucide-react";

const ContentManagerPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterQuality, setFilterQuality] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [subjects, setSubjects] = useState([]);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
  ];

  const qualityOptions = [
    { value: "all", label: "All Quality" },
    { value: "low", label: "Low Quality" },
    { value: "medium", label: "Medium Quality" },
    { value: "high", label: "High Quality" },
    { value: "premium", label: "Premium Quality" },
  ];

  const sortOptions = [
    { value: "recent", label: "Recently Added" },
    { value: "popular", label: "Most Popular" },
    { value: "downloads", label: "Most Downloaded" },
    { value: "title", label: "Title A-Z" },
  ];

  useEffect(() => {
    loadNotes();
    loadSubjects();
  }, [
    currentPage,
    searchQuery,
    filterSubject,
    filterStatus,
    filterQuality,
    sortBy,
  ]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "15",
        ...(searchQuery && { search: searchQuery }),
        ...(filterSubject !== "all" && { subject: filterSubject }),
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(filterQuality !== "all" && { quality: filterQuality }),
        ...(sortBy && { sortBy }),
      });

      // For demo purposes, we'll use the general notes endpoint
      // In a real app, you'd have a specific admin endpoint for all notes
      const response = await fetch(`${API_BASE}/notes?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.status === "success") {
        setNotes(data.data.notes || []);
        setTotalPages(data.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      const response = await fetch(`${API_BASE}/search/filters`);
      const data = await response.json();
      if (data.status === "success") {
        setSubjects(data.data.subjects || []);
      }
    } catch (error) {
      console.error("Failed to load subjects:", error);
    }
  };

  const handleUpdateQuality = async () => {
    if (!selectedNote) return;

    setActionLoading(selectedNote._id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/admin/notes/${selectedNote._id}/quality`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quality: selectedQuality,
            isVerified: isVerified,
          }),
        }
      );

      if (response.ok) {
        setNotes((prev) =>
          prev.map((note) =>
            note._id === selectedNote._id
              ? { ...note, quality: selectedQuality, isVerified: isVerified }
              : note
          )
        );
        setShowQualityModal(false);
        setSelectedNote(null);
        setSelectedQuality("");
        setIsVerified(false);
      }
    } catch (error) {
      console.error("Failed to update note quality:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm("Are you sure you want to permanently delete this note?"))
      return;

    setActionLoading(noteId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotes((prev) => prev.filter((note) => note._id !== noteId));
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status, isApproved) => {
    if (isApproved) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Pending
        </span>
      );
    }
  };

  const getQualityBadge = (quality) => {
    const config = {
      low: { bg: "bg-red-100", text: "text-red-800" },
      medium: { bg: "bg-yellow-100", text: "text-yellow-800" },
      high: { bg: "bg-blue-100", text: "text-blue-800" },
      premium: { bg: "bg-purple-100", text: "text-purple-800" },
    };

    const badgeConfig = config[quality] || config.medium;
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeConfig.bg} ${badgeConfig.text}`}
      >
        {quality?.charAt(0).toUpperCase() + quality?.slice(1) || "Medium"}
      </span>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Manager</h1>
          <p className="text-gray-600">
            Manage and moderate all platform content
          </p>
        </div>
        <button
          onClick={loadNotes}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filterQuality}
            onChange={(e) => setFilterQuality(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
          >
            {qualityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading content...</p>
          </div>
        </div>
      ) : notes.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quality
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notes.map((note) => (
                    <tr key={note._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FileText className="h-8 w-8 text-gray-400 mr-3" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {note.title}
                              {note.isVerified && (
                                <Star className="h-4 w-4 text-yellow-500 inline ml-2" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {note.subject} • {formatFileSize(note.fileSize)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                            {note.uploadedBy?.fullName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {note.uploadedBy?.fullName || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{note.uploadedBy?.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(note.status, note.isApproved)}
                      </td>
                      <td className="px-6 py-4">
                        {getQualityBadge(note.quality)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {note.views || 0}
                          </div>
                          <div className="flex items-center">
                            <Download className="h-3 w-3 mr-1" />
                            {note.downloads || 0}
                          </div>
                          <div className="flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {note.likeCount || note.likes?.length || 0}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => window.open(note.fileUrl, "_blank")}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Content"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedNote(note);
                              setSelectedQuality(note.quality || "medium");
                              setIsVerified(note.isVerified || false);
                              setShowQualityModal(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Edit Quality"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note._id)}
                            disabled={actionLoading === note._id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Delete Content"
                          >
                            <Trash2 className="h-4 w-4" />
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
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? "bg-red-600 text-white"
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
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No content found
          </h3>
          <p className="text-gray-600">
            {searchQuery ||
            filterSubject !== "all" ||
            filterStatus !== "all" ||
            filterQuality !== "all"
              ? "No content matches your current filters."
              : "No content available."}
          </p>
        </div>
      )}

      {/* Quality Update Modal */}
      {showQualityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Update Content Quality
              </h2>
              <button
                onClick={() => {
                  setShowQualityModal(false);
                  setSelectedNote(null);
                  setSelectedQuality("");
                  setIsVerified(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Updating quality for:{" "}
                  <span className="font-medium">{selectedNote?.title}</span>
                </p>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality Level
                </label>
                <select
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                >
                  <option value="low">Low Quality</option>
                  <option value="medium">Medium Quality</option>
                  <option value="high">High Quality</option>
                  <option value="premium">Premium Quality</option>
                </select>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="verified"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Mark as verified content
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Verified content gets a star badge and higher visibility
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowQualityModal(false);
                    setSelectedNote(null);
                    setSelectedQuality("");
                    setIsVerified(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateQuality}
                  disabled={actionLoading}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Update Quality
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagerPage;
