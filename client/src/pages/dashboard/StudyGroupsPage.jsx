import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  MessageCircle,
  Calendar,
  Lock,
  Globe,
  UserPlus,
  UserMinus,
  Send,
  X,
  Eye,
  Star,
  Clock,
  BookOpen,
  Building,
  GraduationCap,
  Hash,
  Loader2,
  Settings,
  MoreVertical,
  Edit3,
  Trash2,
  Copy,
} from "lucide-react";

const StudyGroupsPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState("browse"); // 'browse', 'myGroups', 'create'
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [filters, setFilters] = useState({
    subject: "all",
    college: "all",
    sortBy: "activity",
  });

  // Create group form
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    subject: "",
    college: "",
    semester: "",
    course: "",
    isPrivate: false,
    maxMembers: 50,
    tags: [],
  });

  // Post form
  const [postForm, setPostForm] = useState({
    content: "",
  });

  // UI states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [tagInput, setTagInput] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  // Filter options
  const filterOptions = {
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
    colleges: [
      "IIT Delhi",
      "IIT Bombay",
      "IIT Madras",
      "NIT Trichy",
      "BITS Pilani",
      "Delhi University",
      "Mumbai University",
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
      "BCA",
      "MCA",
      "B.Sc Computer Science",
    ],
  };

  // Load study groups
  useEffect(() => {
    if (activeTab === "browse") {
      loadGroups();
    } else if (activeTab === "myGroups") {
      loadMyGroups();
    }
  }, [activeTab, currentPage, searchQuery, filters]);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        ...(searchQuery && { search: searchQuery }),
        ...(filters.subject !== "all" && { subject: filters.subject }),
        ...(filters.college !== "all" && { college: filters.college }),
        sortBy: filters.sortBy,
      });

      const response = await fetch(
        `${API_BASE}/community/groups?${queryParams}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setGroups(data.data.groups || []);
        setTotalPages(data.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to load groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyGroups = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/community/my-groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.status === "success") {
        setMyGroups(data.data.groups || []);
      }
    } catch (error) {
      console.error("Failed to load my groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadGroupDetails = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/community/groups/${groupId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await response.json();
      if (data.status === "success") {
        setSelectedGroup(data.data.group);
        setShowGroupModal(true);
      }
    } catch (error) {
      console.error("Failed to load group details:", error);
    }
  };

  // Create new group
  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!createForm.name || !createForm.subject || !createForm.college) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/community/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...createForm,
          tags: createForm.tags.join(","),
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        alert("Study group created successfully!");
        setShowCreateModal(false);
        setCreateForm({
          name: "",
          description: "",
          subject: "",
          college: "",
          semester: "",
          course: "",
          isPrivate: false,
          maxMembers: 50,
          tags: [],
        });
        setActiveTab("myGroups");
        loadMyGroups();
      } else {
        alert(data.message || "Failed to create group");
      }
    } catch (error) {
      console.error("Failed to create group:", error);
      alert("Failed to create group");
    }
  };

  // Join group
  const handleJoinGroup = async (groupId, isPrivate = false) => {
    try {
      const token = localStorage.getItem("token");
      const body = isPrivate ? { joinCode } : {};

      const response = await fetch(
        `${API_BASE}/community/groups/${groupId}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        alert("Successfully joined the group!");
        setJoinCode("");
        loadGroups();
        loadMyGroups();
      } else {
        alert(data.message || "Failed to join group");
      }
    } catch (error) {
      console.error("Failed to join group:", error);
      alert("Failed to join group");
    }
  };

  // Leave group
  const handleLeaveGroup = async (groupId) => {
    if (!confirm("Are you sure you want to leave this group?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/community/groups/${groupId}/leave`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        alert("Successfully left the group");
        loadGroups();
        loadMyGroups();
        setShowGroupModal(false);
      } else {
        alert(data.message || "Failed to leave group");
      }
    } catch (error) {
      console.error("Failed to leave group:", error);
      alert("Failed to leave group");
    }
  };

  // Add post to group
  const handleAddPost = async (groupId) => {
    if (!postForm.content.trim()) {
      alert("Please enter some content");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/community/groups/${groupId}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: postForm.content,
          }),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setPostForm({ content: "" });
        setShowPostModal(false);
        // Reload group details
        loadGroupDetails(groupId);
      } else {
        alert(data.message || "Failed to add post");
      }
    } catch (error) {
      console.error("Failed to add post:", error);
      alert("Failed to add post");
    }
  };

  // Handle form changes
  const handleCreateFormChange = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !createForm.tags.includes(tagInput.trim())) {
      setCreateForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setCreateForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Render group card
  const renderGroupCard = (group) => (
    <div
      key={group._id}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
        viewMode === "list" ? "flex items-center p-4" : "p-6"
      }`}
      onClick={() => loadGroupDetails(group._id)}
    >
      {viewMode === "grid" ? (
        <>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900 mr-2">
                  {group.name}
                </h3>
                {group.isPrivate ? (
                  <Lock className="h-4 w-4 text-gray-500" />
                ) : (
                  <Globe className="h-4 w-4 text-green-500" />
                )}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {group.description || "No description provided"}
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>{group.subject}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Building className="h-4 w-4 mr-2" />
              <span>{group.college}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span>
                {group.memberCount || group.members?.length || 0} members
                {group.maxMembers && ` / ${group.maxMembers}`}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{new Date(group.lastActivity).toLocaleDateString()}</span>
            </div>
          </div>

          {group.tags && group.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {group.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {group.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{group.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{group.totalPosts || 0} posts</span>
            </div>
            <div className="flex items-center space-x-2">
              {group.isMember ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                  Member
                </span>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (group.isPrivate) {
                      const code = prompt("Enter join code:");
                      if (code) {
                        setJoinCode(code);
                        handleJoinGroup(group._id, true);
                      }
                    } else {
                      handleJoinGroup(group._id);
                    }
                  }}
                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full hover:bg-purple-700"
                >
                  Join
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        // List view
        <>
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900 mr-2">
                {group.name}
              </h3>
              {group.isPrivate ? (
                <Lock className="h-4 w-4 text-gray-500" />
              ) : (
                <Globe className="h-4 w-4 text-green-500" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{group.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{group.subject}</span>
              <span>•</span>
              <span>{group.college}</span>
              <span>•</span>
              <span>{group.memberCount || 0} members</span>
            </div>
          </div>
          <div className="ml-4">
            {group.isMember ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                Member
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleJoinGroup(group._id, group.isPrivate);
                }}
                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
              >
                Join
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );

  // Render create group modal
  const renderCreateModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Create Study Group
            </h2>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleCreateGroup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) =>
                    handleCreateFormChange("name", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter group name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  value={createForm.subject}
                  onChange={(e) =>
                    handleCreateFormChange("subject", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={createForm.description}
                onChange={(e) =>
                  handleCreateFormChange("description", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Describe your study group..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College *
                </label>
                <select
                  value={createForm.college}
                  onChange={(e) =>
                    handleCreateFormChange("college", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select College</option>
                  {filterOptions.colleges.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Members
                </label>
                <input
                  type="number"
                  min="2"
                  max="100"
                  value={createForm.maxMembers}
                  onChange={(e) =>
                    handleCreateFormChange(
                      "maxMembers",
                      parseInt(e.target.value) || 50
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester
                </label>
                <select
                  value={createForm.semester}
                  onChange={(e) =>
                    handleCreateFormChange("semester", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                  value={createForm.course}
                  onChange={(e) =>
                    handleCreateFormChange("course", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Course</option>
                  {filterOptions.courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {createForm.tags.map((tag, index) => (
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500"
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

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                checked={createForm.isPrivate}
                onChange={(e) =>
                  handleCreateFormChange("isPrivate", e.target.checked)
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="isPrivate" className="ml-2 text-sm text-gray-700">
                Make this group private (requires join code)
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create Group
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Render group details modal
  const renderGroupModal = () => {
    if (!selectedGroup) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 mr-2">
                      {selectedGroup.name}
                    </h2>
                    {selectedGroup.isPrivate ? (
                      <Lock className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Globe className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">
                    {selectedGroup.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{selectedGroup.subject}</span>
                    <span>•</span>
                    <span>{selectedGroup.college}</span>
                    <span>•</span>
                    <span>{selectedGroup.memberCount || 0} members</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedGroup.isMember && (
                    <button
                      onClick={() => setShowPostModal(true)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Post
                    </button>
                  )}
                  <button
                    onClick={() => setShowGroupModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Group Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Posts
                  </h3>
                  {selectedGroup.posts && selectedGroup.posts.length > 0 ? (
                    <div className="space-y-4">
                      {selectedGroup.posts.slice(0, 5).map((post) => (
                        <div
                          key={post._id}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <span className="font-medium text-gray-900">
                                  {post.authorName}
                                </span>
                                <span className="text-gray-500 text-sm ml-2">
                                  {new Date(
                                    post.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700">{post.content}</p>
                              {post.likes && post.likes.length > 0 && (
                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                  <Star className="h-4 w-4 mr-1" />
                                  <span>{post.likes.length} likes</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        No posts yet. Be the first to start a discussion!
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Members
                  </h3>
                  {selectedGroup.members && selectedGroup.members.length > 0 ? (
                    <div className="space-y-2">
                      {selectedGroup.members.slice(0, 10).map((member) => (
                        <div key={member._id} className="flex items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-purple-600">
                              {member.user?.fullName?.charAt(0) ||
                                member.user?.username?.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {member.user?.fullName || member.user?.username}
                            </p>
                            <p className="text-xs text-gray-500">
                              {member.role}
                            </p>
                          </div>
                        </div>
                      ))}
                      {selectedGroup.members.length > 10 && (
                        <p className="text-sm text-gray-500">
                          +{selectedGroup.members.length - 10} more members
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No members to display</p>
                  )}

                  {!selectedGroup.isMember ? (
                    <button
                      onClick={() => {
                        if (selectedGroup.isPrivate) {
                          const code = prompt("Enter join code:");
                          if (code) {
                            setJoinCode(code);
                            handleJoinGroup(selectedGroup._id, true);
                          }
                        } else {
                          handleJoinGroup(selectedGroup._id);
                        }
                      }}
                      className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Group
                    </button>
                  ) : (
                    <button
                      onClick={() => handleLeaveGroup(selectedGroup._id)}
                      className="w-full mt-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center"
                    >
                      <UserMinus className="h-4 w-4 mr-2" />
                      Leave Group
                    </button>
                  )}

                  {selectedGroup.isPrivate &&
                    selectedGroup.isMember &&
                    selectedGroup.canModerate && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 mb-2">
                          Join Code:
                        </p>
                        <div className="flex items-center">
                          <code className="flex-1 px-3 py-2 bg-white border rounded-lg text-sm font-mono">
                            {selectedGroup.joinCode}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                selectedGroup.joinCode
                              );
                              alert("Join code copied to clipboard!");
                            }}
                            className="ml-2 p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render post modal
  const renderPostModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Add New Post
            </h3>
            <button
              onClick={() => setShowPostModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <textarea
            value={postForm.content}
            onChange={(e) => setPostForm({ content: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="What would you like to share with the group?"
            maxLength={500}
          />

          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">
              {postForm.content.length}/500 characters
            </span>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPostModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddPost(selectedGroup._id)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render browse tab
  const renderBrowseTab = () => (
    <div>
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search study groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={filters.subject}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, subject: e.target.value }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Subjects</option>
              {filterOptions.subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            <select
              value={filters.college}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, college: e.target.value }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Colleges</option>
              {filterOptions.colleges.map((college) => (
                <option key={college} value={college}>
                  {college}
                </option>
              ))}
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
            >
              <option value="activity">Recent Activity</option>
              <option value="members">Most Members</option>
              <option value="recent">Recently Created</option>
              <option value="posts">Most Posts</option>
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
          <span className="ml-2 text-gray-600">Loading study groups...</span>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">Found {groups.length} study groups</p>
          </div>

          {/* Groups Grid/List */}
          {groups.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {groups.map(renderGroupCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No study groups found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filters, or create a new group.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Study Group
              </button>
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

  // Render my groups tab
  const renderMyGroupsTab = () => (
    <div>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading your groups...</span>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-gray-600">
              You are a member of {myGroups.length} study groups
            </p>
          </div>

          {myGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myGroups.map((group) => (
                <div
                  key={group._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 cursor-pointer"
                  onClick={() => loadGroupDetails(group._id)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-2">
                          {group.name}
                        </h3>
                        {group.isPrivate ? (
                          <Lock className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Globe className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {group.description || "No description provided"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        group.myRole === "admin"
                          ? "bg-red-100 text-red-700"
                          : group.myRole === "moderator"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {group.myRole}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>{group.subject}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{group.memberCount} members</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        Active{" "}
                        {new Date(group.lastActivity).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>{group.totalPosts || 0} posts</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        loadGroupDetails(group._id);
                      }}
                      className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                You haven't joined any groups yet
              </h3>
              <p className="text-gray-600 mb-4">
                Browse and join study groups to connect with peers.
              </p>
              <button
                onClick={() => setActiveTab("browse")}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors mr-4"
              >
                Browse Groups
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Create Group
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Study Groups</h1>
              <p className="text-gray-600 mt-2">
                Connect with peers and collaborate on your studies
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Group
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("browse")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "browse"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Globe className="h-5 w-5 inline mr-2" />
                Browse Groups
              </button>
              <button
                onClick={() => setActiveTab("myGroups")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "myGroups"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Users className="h-5 w-5 inline mr-2" />
                My Groups ({myGroups.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "browse" ? renderBrowseTab() : renderMyGroupsTab()}

        {/* Modals */}
        {showCreateModal && renderCreateModal()}
        {showGroupModal && renderGroupModal()}
        {showPostModal && renderPostModal()}
      </div>
    </div>
  );
};

export default StudyGroupsPage;
