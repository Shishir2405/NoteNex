import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  User,
  Calendar,
  FileText,
  Tag,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const PendingNotesPage = () => {
  const [pendingNotes, setPendingNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedNote, setSelectedNote] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [subjects, setSubjects] = useState([]);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    loadPendingNotes();
    loadSubjects();
  }, [currentPage, searchQuery, filterSubject]);

  const loadPendingNotes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchQuery && { search: searchQuery }),
        ...(filterSubject !== 'all' && { subject: filterSubject })
      });

      const response = await fetch(`${API_BASE}/admin/pending-notes?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.status === 'success') {
        setPendingNotes(data.data.notes || []);
        setTotalPages(data.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to load pending notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      const response = await fetch(`${API_BASE}/search/filters`);
      const data = await response.json();
      if (data.status === 'success') {
        setSubjects(data.data.subjects || []);
      }
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  };

  const handleApprove = async (noteId) => {
    setActionLoading(noteId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/notes/${noteId}/approve`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setPendingNotes(prev => prev.filter(note => note._id !== noteId));
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Failed to approve note:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (noteId, reason) => {
    setActionLoading(noteId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/notes/${noteId}/reject`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        setPendingNotes(prev => prev.filter(note => note._id !== noteId));
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Failed to reject note:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTrustBadge = (ranking) => {
    const config = {
      Bronze: { bg: 'bg-orange-100', text: 'text-orange-800', icon: '🥉' },
      Silver: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '🥈' },
      Gold: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '🥇' },
      Platinum: { bg: 'bg-purple-100', text: 'text-purple-800', icon: '💎' }
    };

    const badgeConfig = config[ranking] || config.Bronze;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeConfig.bg} ${badgeConfig.text}`}>
        <span className="mr-1">{badgeConfig.icon}</span>
        {ranking}
      </span>
    );
  };

  const NoteDetailsModal = ({ note, onClose }) => {
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(false);

    if (!note) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Review Note</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Note Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{note.title}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Subject:</span>
                  <span className="ml-2">{note.subject}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Course:</span>
                  <span className="ml-2">{note.course}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Semester:</span>
                  <span className="ml-2">{note.semester}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">File Size:</span>
                  <span className="ml-2">{formatFileSize(note.fileSize)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {note.description && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{note.description}</p>
              </div>
            )}

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Author Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {note.uploadedBy?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {note.uploadedBy?.fullName || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600">
                      @{note.uploadedBy?.username} • {note.uploadedBy?.college}
                    </p>
                    <div className="mt-1">
                      {getTrustBadge(note.uploadedBy?.trustRanking)}
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Total Uploads:</span>
                    <span className="ml-1">{note.uploadedBy?.totalUploads || 0}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Downloads:</span>
                    <span className="ml-1">{note.uploadedBy?.totalDownloads || 0}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Score:</span>
                    <span className="ml-1">{note.uploadedBy?.contributorScore || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* File Preview */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">File Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{note.fileName}</p>
                    <p className="text-sm text-gray-600">
                      {note.fileType?.toUpperCase()} • {formatFileSize(note.fileSize)}
                    </p>
                  </div>
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </a>
                </div>
              </div>
            </div>

            {/* Reject Form */}
            {showRejectForm && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Rejection Reason</h4>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            {showRejectForm ? (
              <>
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(note._id, rejectReason)}
                  disabled={!rejectReason.trim() || actionLoading === note._id}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === note._id ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Confirm Rejection
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(note._id)}
                  disabled={actionLoading === note._id}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === note._id ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Approve
                </button>
              </>
            )}
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
          <h1 className="text-2xl font-bold text-gray-900">Pending Notes</h1>
          <p className="text-gray-600">Review and moderate uploaded content</p>
        </div>
        <button
          onClick={loadPendingNotes}
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
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 min-w-[150px]"
            >
              <option value="all">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
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
            <p className="text-gray-600 mt-4">Loading pending notes...</p>
          </div>
        </div>
      ) : pendingNotes.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Note
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingNotes.map((note) => (
                    <tr key={note._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FileText className="h-8 w-8 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {note.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {note.fileType?.toUpperCase()} • {formatFileSize(note.fileSize)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                            {note.uploadedBy?.fullName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {note.uploadedBy?.fullName || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{note.uploadedBy?.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {note.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedNote(note)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleApprove(note._id)}
                            disabled={actionLoading === note._id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedNote(note);
                              // Could trigger reject form directly
                            }}
                            disabled={actionLoading === note._id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            <XCircle className="h-4 w-4" />
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
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-red-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
          <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No pending notes
          </h3>
          <p className="text-gray-600">
            All notes have been reviewed. Great job!
          </p>
        </div>
      )}

      {/* Note Details Modal */}
      <NoteDetailsModal 
        note={selectedNote} 
        onClose={() => setSelectedNote(null)} 
      />
    </div>
  );
};

export default PendingNotesPage;