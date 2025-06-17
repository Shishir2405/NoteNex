import React, { useState, useEffect } from "react";
import {
  Flag,
  Eye,
  Check,
  X,
  AlertTriangle,
  User,
  Calendar,
  FileText,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Shield,
  Ban,
  CheckCircle,
} from "lucide-react";

const ReportedContentPage = () => {
  const [reportedNotes, setReportedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterReason, setFilterReason] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedNote, setSelectedNote] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  const reportReasons = [
    { value: "all", label: "All Reports" },
    { value: "spam", label: "Spam" },
    { value: "inappropriate", label: "Inappropriate Content" },
    { value: "copyright", label: "Copyright Violation" },
    { value: "wrong-subject", label: "Wrong Subject" },
    { value: "low-quality", label: "Low Quality" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    loadReportedNotes();
  }, [currentPage, searchQuery, filterReason]);

  const loadReportedNotes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchQuery && { search: searchQuery }),
        ...(filterReason !== "all" && { reason: filterReason }),
      });

      const response = await fetch(
        `${API_BASE}/admin/reported-notes?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setReportedNotes(data.data.notes || []);
        setTotalPages(data.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to load reported notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (noteId) => {
    setActionLoading(noteId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/admin/notes/${noteId}/resolve-report`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setReportedNotes((prev) => prev.filter((note) => note._id !== noteId));
        setSelectedNote(null);
      }
    } catch (error) {
      console.error("Failed to resolve report:", error);
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
        setReportedNotes((prev) => prev.filter((note) => note._id !== noteId));
        setSelectedNote(null);
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getReasonBadge = (reason) => {
    const config = {
      spam: { bg: "bg-red-100", text: "text-red-800" },
      inappropriate: { bg: "bg-orange-100", text: "text-orange-800" },
      copyright: { bg: "bg-purple-100", text: "text-purple-800" },
      "wrong-subject": { bg: "bg-blue-100", text: "text-blue-800" },
      "low-quality": { bg: "bg-yellow-100", text: "text-yellow-800" },
      other: { bg: "bg-gray-100", text: "text-gray-800" },
    };

    const badgeConfig = config[reason] || config.other;
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeConfig.bg} ${badgeConfig.text}`}
      >
        {reason.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </span>
    );
  };

  const ReportDetailsModal = ({ note, onClose }) => {
    if (!note) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Reported Content Details
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
            {/* Note Info */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <span className="font-medium text-red-900">
                  Reported Content
                </span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {note.title}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Subject:</span>
                  <span className="ml-2">{note.subject}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Reports:</span>
                  <span className="ml-2 font-bold text-red-600">
                    {note.reports?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Reports List */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">
                Reports ({note.reports?.length || 0})
              </h4>
              <div className="space-y-3">
                {note.reports?.map((report, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {report.reportedBy?.fullName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {report.reportedBy?.fullName || "Anonymous"}
                          </p>
                          <p className="text-sm text-gray-600">
                            @{report.reportedBy?.username}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getReasonBadge(report.reason)}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(report.reportedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {report.description && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          {report.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Note Content Preview */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Content Details
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                {note.description && (
                  <div className="mb-3">
                    <span className="font-medium text-gray-600">
                      Description:
                    </span>
                    <p className="text-gray-700 mt-1">{note.description}</p>
                  </div>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Course: {note.course}</span>
                  <span>Semester: {note.semester}</span>
                  <span>File: {note.fileName}</span>
                </div>
              </div>
            </div>

            {/* Author Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Author Information
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {note.uploadedBy?.fullName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {note.uploadedBy?.fullName || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600">
                      @{note.uploadedBy?.username} • {note.uploadedBy?.college}
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">
                      Total Uploads:
                    </span>
                    <span className="ml-1">
                      {note.uploadedBy?.totalUploads || 0}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Warnings:</span>
                    <span className="ml-1 text-red-600">
                      {note.uploadedBy?.warnings?.length || 0}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Trust Rank:
                    </span>
                    <span className="ml-1">
                      {note.uploadedBy?.trustRanking || "Bronze"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={() => window.open(note.fileUrl, "_blank")}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              View File
            </button>
            <button
              onClick={() => handleResolveReport(note._id)}
              disabled={actionLoading === note._id}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {actionLoading === note._id ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Resolve Reports
            </button>
            <button
              onClick={() => handleDeleteNote(note._id)}
              disabled={actionLoading === note._id}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {actionLoading === note._id ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Ban className="h-4 w-4 mr-2" />
              )}
              Delete Content
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
          <h1 className="text-2xl font-bold text-gray-900">Reported Content</h1>
          <p className="text-gray-600">Review and moderate reported notes</p>
        </div>
        <button
          onClick={loadReportedNotes}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search reported content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 min-w-[180px]"
            >
              {reportReasons.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading reported content...</p>
          </div>
        </div>
      ) : reportedNotes.length > 0 ? (
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
                      Reports
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Report
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportedNotes.map((note) => (
                    <tr key={note._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FileText className="h-8 w-8 text-red-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {note.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {note.subject}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Flag className="h-4 w-4 text-red-500 mr-2" />
                          <span className="text-sm font-medium text-red-600">
                            {note.reports?.length || 0} reports
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {note.reports?.slice(0, 2).map((report, index) => (
                            <span key={index}>
                              {getReasonBadge(report.reason)}
                            </span>
                          ))}
                          {note.reports?.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{note.reports.length - 2} more
                            </span>
                          )}
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
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {note.reports?.length > 0 &&
                          new Date(
                            note.reports[note.reports.length - 1].reportedAt
                          ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedNote(note)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleResolveReport(note._id)}
                            disabled={actionLoading === note._id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Resolve Reports"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note._id)}
                            disabled={actionLoading === note._id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Delete Content"
                          >
                            <Ban className="h-4 w-4" />
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
          <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reported content
          </h3>
          <p className="text-gray-600">
            {searchQuery || filterReason !== "all"
              ? "No reports match your current filters."
              : "All content is clean. No reports to review!"}
          </p>
        </div>
      )}

      {/* Report Details Modal */}
      <ReportDetailsModal
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
      />
    </div>
  );
};

export default ReportedContentPage;
