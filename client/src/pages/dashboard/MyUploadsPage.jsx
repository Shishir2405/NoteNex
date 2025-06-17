import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  FileText,
  Edit3,
  Trash2,
  Eye,
  Download,
  Heart,
  MessageCircle,
  Calendar,
  Tag,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Plus,
  X,
  Filter,
  Search,
  Grid,
  List,
  Loader2,
  Image as ImageIcon,
  File,
  Save,
} from "lucide-react";

const MyUploadsPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState("manage"); // 'upload' or 'manage'
  const [myNotes, setMyNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingNote, setEditingNote] = useState(null);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    file: null,
    title: "",
    description: "",
    subject: "",
    semester: "",
    course: "",
    college: "",
    tags: [],
    topics: [],
    isPremium: false,
    price: 0,
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    subject: "",
    semester: "",
    course: "",
    college: "",
    tags: [],
    topics: [],
    isPremium: false,
    price: 0,
  });

  const [tagInput, setTagInput] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [editTagInput, setEditTagInput] = useState("");
  const [editTopicInput, setEditTopicInput] = useState("");
  const fileInputRef = useRef(null);

  // Filter options
  const [filterOptions, setFilterOptions] = useState({
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
    courses: [
      "B.Tech Computer Science",
      "B.Tech Information Technology",
      "B.Tech Electronics",
      "B.Tech Electrical",
      "B.Tech Mechanical",
      "B.Tech Civil",
      "BCA",
      "MCA",
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
  });

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  // Load user's uploaded notes
  useEffect(() => {
    loadMyNotes();
  }, [currentPage, searchQuery, filterStatus]);

  const loadMyNotes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
      });

      const response = await fetch(
        `${API_BASE}/notes/my-uploads?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        // Handle the response structure from your backend
        let notes = data.data.notes || data.data || [];

        // Apply client-side filtering if needed
        if (searchQuery) {
          notes = notes.filter(
            (note) =>
              note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              note.description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              note.subject.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (filterStatus !== "all") {
          notes = notes.filter((note) => {
            if (filterStatus === "approved") return note.isApproved === true;
            if (filterStatus === "pending")
              return note.isApproved === false && !note.rejectionReason;
            if (filterStatus === "rejected") return note.rejectionReason;
            return true;
          });
        }

        setMyNotes(notes);
        setTotalPages(data.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
      alert("Failed to load your notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      setUploadForm((prev) => ({ ...prev, file }));
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setUploadForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle edit form input changes
  const handleEditInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !uploadForm.tags.includes(tagInput.trim())) {
      setUploadForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setUploadForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Add edit tag
  const addEditTag = () => {
    if (editTagInput.trim() && !editForm.tags.includes(editTagInput.trim())) {
      setEditForm((prev) => ({
        ...prev,
        tags: [...prev.tags, editTagInput.trim()],
      }));
      setEditTagInput("");
    }
  };

  // Remove edit tag
  const removeEditTag = (tagToRemove) => {
    setEditForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Add topic
  const addTopic = () => {
    if (topicInput.trim() && !uploadForm.topics.includes(topicInput.trim())) {
      setUploadForm((prev) => ({
        ...prev,
        topics: [...prev.topics, topicInput.trim()],
      }));
      setTopicInput("");
    }
  };

  // Remove topic
  const removeTopic = (topicToRemove) => {
    setUploadForm((prev) => ({
      ...prev,
      topics: prev.topics.filter((topic) => topic !== topicToRemove),
    }));
  };

  // Add edit topic
  const addEditTopic = () => {
    if (
      editTopicInput.trim() &&
      !editForm.topics.includes(editTopicInput.trim())
    ) {
      setEditForm((prev) => ({
        ...prev,
        topics: [...prev.topics, editTopicInput.trim()],
      }));
      setEditTopicInput("");
    }
  };

  // Remove edit topic
  const removeEditTopic = (topicToRemove) => {
    setEditForm((prev) => ({
      ...prev,
      topics: prev.topics.filter((topic) => topic !== topicToRemove),
    }));
  };

  // Start editing a note
  const startEditing = (note) => {
    setEditForm({
      title: note.title,
      description: note.description || "",
      subject: note.subject,
      semester: note.semester || "",
      course: note.course || "",
      college: note.college || "",
      tags: note.tags || [],
      topics: note.topics || [],
      isPremium: note.isPremium || false,
      price: note.price || 0,
    });
    setEditingNote(note._id);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingNote(null);
    setEditForm({
      title: "",
      description: "",
      subject: "",
      semester: "",
      course: "",
      college: "",
      tags: [],
      topics: [],
      isPremium: false,
      price: 0,
    });
  };

  // Save edited note
  const saveEditedNote = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/notes/${editingNote}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editForm,
          tags: editForm.tags.join(","),
          topics: editForm.topics.join(","),
        }),
      });

      if (response.ok) {
        alert("Note updated successfully!");
        setEditingNote(null);
        loadMyNotes(); // Reload notes
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update note");
      }
    } catch (error) {
      console.error("Failed to update note:", error);
      alert("Failed to update note. Please try again.");
    }
  };

  // Handle upload submission
  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!uploadForm.file || !uploadForm.title || !uploadForm.subject) {
      alert("Please fill in all required fields and select a file");
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Append all form data
      formData.append("file", uploadForm.file);
      formData.append("title", uploadForm.title);
      formData.append("description", uploadForm.description);
      formData.append("subject", uploadForm.subject);
      formData.append("semester", uploadForm.semester);
      formData.append("course", uploadForm.course);
      formData.append("college", uploadForm.college);
      formData.append("tags", uploadForm.tags.join(","));
      formData.append("topics", uploadForm.topics.join(","));
      formData.append("isPremium", uploadForm.isPremium);
      formData.append("price", uploadForm.price);

      const response = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.status === "success") {
        alert(
          "Note uploaded successfully! It will be reviewed before being published."
        );
        // Reset form
        setUploadForm({
          file: null,
          title: "",
          description: "",
          subject: "",
          semester: "",
          course: "",
          college: "",
          tags: [],
          topics: [],
          isPremium: false,
          price: 0,
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Switch to manage tab and reload notes
        setActiveTab("manage");
        loadMyNotes();
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Delete note
  const handleDeleteNote = async (noteId) => {
    if (
      !confirm(
        "Are you sure you want to delete this note? This action cannot be undone."
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMyNotes((prev) => prev.filter((note) => note._id !== noteId));
        alert("Note deleted successfully");
      } else {
        alert("Failed to delete note. You can only delete your own notes.");
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Failed to delete note");
    }
  };

  // Get status badge
  const getStatusBadge = (note) => {
    let status, config;

    if (note.rejectionReason) {
      status = "rejected";
      config = { bg: "bg-red-100", text: "text-red-800", icon: XCircle };
    } else if (note.isApproved) {
      status = "approved";
      config = {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: CheckCircle,
      };
    } else {
      status = "pending";
      config = { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock };
    }

    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
        {note.rejectionReason && (
          <span className="ml-1" title={note.rejectionReason}>
            <AlertCircle className="h-3 w-3" />
          </span>
        )}
      </span>
    );
  };

  // Render upload form
  const renderUploadForm = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload New Note</h2>

      <form onSubmit={handleUploadSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select File *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                {uploadForm.file ? (
                  <>
                    <File className="h-12 w-12 text-green-500 mb-2" />
                    <p className="text-sm font-medium text-gray-900">
                      {uploadForm.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-900">
                      Click to upload file
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, TXT, JPG, PNG (max 10MB)
                    </p>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={uploadForm.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter note title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <select
              value={uploadForm.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select Subject</option>
              {filterOptions.subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={uploadForm.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Describe your notes..."
          />
        </div>

        {/* Academic Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester
            </label>
            <select
              value={uploadForm.semester}
              onChange={(e) => handleInputChange("semester", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select Semester</option>
              {filterOptions.semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course
            </label>
            <select
              value={uploadForm.course}
              onChange={(e) => handleInputChange("course", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select Course</option>
              {filterOptions.courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              College
            </label>
            <select
              value={uploadForm.college}
              onChange={(e) => handleInputChange("college", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select College</option>
              {filterOptions.colleges.map((college) => (
                <option key={college} value={college}>
                  {college}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {uploadForm.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Add tags..."
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Topics */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topics Covered
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {uploadForm.topics.map((topic, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {topic}
                <button
                  type="button"
                  onClick={() => removeTopic(topic)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTopic())
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Add topics..."
            />
            <button
              type="button"
              onClick={addTopic}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Premium Options */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isPremium"
              checked={uploadForm.isPremium}
              onChange={(e) => handleInputChange("isPremium", e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isPremium"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Make this a premium note
            </label>
          </div>

          {uploadForm.isPremium && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                min="1"
                value={uploadForm.price}
                onChange={(e) =>
                  handleInputChange("price", parseInt(e.target.value) || 0)
                }
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={uploading}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Upload Note
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  // Render edit form
  const renderEditForm = (note) => (
    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
      <h4 className="font-medium text-gray-900">Edit Note</h4>

      {/* Title and Subject */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => handleEditInputChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Title"
          />
        </div>
        <div>
          <select
            value={editForm.subject}
            onChange={(e) => handleEditInputChange("subject", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Subject</option>
            {filterOptions.subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <textarea
        value={editForm.description}
        onChange={(e) => handleEditInputChange("description", e.target.value)}
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        placeholder="Description"
      />

      {/* Tags */}
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          {editForm.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeEditTag(tag)}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={editTagInput}
            onChange={(e) => setEditTagInput(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addEditTag())
            }
            className="flex-1 px-3 py-1 border border-gray-300 rounded-l-lg text-sm"
            placeholder="Add tags..."
          />
          <button
            type="button"
            onClick={addEditTag}
            className="px-3 py-1 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 text-sm"
          >
            Add
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={cancelEditing}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center text-sm"
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </button>
        <button
          onClick={saveEditedNote}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-sm"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </button>
      </div>
    </div>
  );

  // Render note card
  const renderNoteCard = (note) => (
    <div
      key={note._id}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
        viewMode === "list" ? "flex items-center p-4" : "p-6"
      }`}
    >
      {editingNote === note._id ? (
        renderEditForm(note)
      ) : viewMode === "grid" ? (
        <>
          {/* Note Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {note.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {note.description || "No description provided"}
              </p>
            </div>
            {getStatusBadge(note)}
          </div>

          {/* Note Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Tag className="h-4 w-4 mr-2" />
              <span>{note.subject}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
            {note.isPremium && (
              <div className="flex items-center text-sm text-green-600">
                <DollarSign className="h-4 w-4 mr-2" />
                <span>₹{note.price}</span>
              </div>
            )}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {note.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
                {note.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{note.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

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
          </div>

          {/* Rejection Reason */}
          {note.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Rejection Reason:
                  </p>
                  <p className="text-sm text-red-700">{note.rejectionReason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => startEditing(note)}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </button>
              {note.isApproved && (
                <button
                  onClick={() => window.open(`/notes/${note._id}`, "_blank")}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
              )}
            </div>

            <button
              onClick={() => handleDeleteNote(note._id)}
              className="flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </>
      ) : (
        // List View
        <>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {note.title}
              </h3>
              {getStatusBadge(note)}
            </div>

            <p className="text-sm text-gray-600 mb-2">
              {note.description || "No description provided"}
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{note.subject}</span>
              <span>•</span>
              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{note.downloads || 0} downloads</span>
              <span>•</span>
              <span>{note.views || 0} views</span>
            </div>

            {note.rejectionReason && (
              <div className="mt-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                Rejected: {note.rejectionReason}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 ml-4">
            <button
              onClick={() => startEditing(note)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Edit
            </button>
            {note.isApproved && (
              <button
                onClick={() => window.open(`/notes/${note._id}`, "_blank")}
                className="text-gray-600 hover:text-gray-700 font-medium"
              >
                View
              </button>
            )}
            <button
              onClick={() => handleDeleteNote(note._id)}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );

  // Render notes management
  const renderNotesManagement = () => (
    <div>
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search your notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filters and View Controls */}
          <div className="flex items-center space-x-4">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading your notes...</span>
        </div>
      ) : (
        <>
          {/* Results Count and Status Summary */}
          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              Showing {myNotes.length} of your uploaded notes
            </p>
            {myNotes.length > 0 && (
              <div className="flex space-x-4 text-sm">
                <span className="text-green-600">
                  {myNotes.filter((note) => note.isApproved).length} Approved
                </span>
                <span className="text-yellow-600">
                  {
                    myNotes.filter(
                      (note) => !note.isApproved && !note.rejectionReason
                    ).length
                  }{" "}
                  Pending
                </span>
                <span className="text-red-600">
                  {myNotes.filter((note) => note.rejectionReason).length}{" "}
                  Rejected
                </span>
              </div>
            )}
          </div>

          {/* Notes Grid/List */}
          {myNotes.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {myNotes.map(renderNoteCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || filterStatus !== "all"
                  ? "No notes found"
                  : "No notes uploaded yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filters."
                  : "Start sharing your knowledge by uploading your first note."}
              </p>
              {!searchQuery && filterStatus === "all" && (
                <button
                  onClick={() => setActiveTab("upload")}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Upload Your First Note
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
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Uploads</h1>
          <p className="text-gray-600 mt-2">
            Upload new notes or manage your existing uploads
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("upload")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "upload"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Upload className="h-5 w-5 inline mr-2" />
                Upload New Note
              </button>
              <button
                onClick={() => setActiveTab("manage")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "manage"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FileText className="h-5 w-5 inline mr-2" />
                Manage Notes ({myNotes.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "upload" ? renderUploadForm() : renderNotesManagement()}
      </div>
    </div>
  );
};

export default MyUploadsPage;
