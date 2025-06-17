import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Lock,
  Camera,
  Save,
  Edit3,
  Shield,
  Bell,
  Globe,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle,
  School,
  BookOpen,
  Calendar,
  Info,
  Settings,
  UserCircle,
  Key,
  HelpCircle,
} from "lucide-react";

const SettingsPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // User data
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    fullName: "",
    bio: "",
    college: "",
    course: "",
    semester: "",
    avatar: "",
    role: "student",
  });

  // Form states
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    bio: "",
    college: "",
    course: "",
    semester: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    newFollower: true,
    noteApproved: true,
    noteDownloaded: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showCollege: true,
    allowMessages: true,
  });

  const fileInputRef = useRef(null);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  // Tab configuration
  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: UserCircle,
      description: "Manage your personal information",
    },
    {
      id: "account",
      label: "Account",
      icon: Key,
      description: "Security and login settings",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Manage your notification preferences",
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: Shield,
      description: "Control your privacy settings",
    },

    {
      id: "privacy",
      label: "Privacy",
      icon: Info,
      description: "Control your privacy settings",
    },
  ];

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.status === "success") {
        const userData = data.data.user;
        setUser(userData);
        setProfileForm({
          fullName: userData.fullName || "",
          bio: userData.bio || "",
          college: userData.college || "",
          course: userData.course || "",
          semester: userData.semester || "",
        });
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      showMessage("error", "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  // Show message helper
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 2 * 1024 * 1024) {
      showMessage("error", "Image must be less than 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      showMessage("error", "Please select an image file");
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`${API_BASE}/upload/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.status === "success") {
        setUser((prev) => ({ ...prev, avatar: data.data.avatarUrl }));
        showMessage("success", "Avatar updated successfully");
      } else {
        showMessage("error", data.message || "Failed to upload avatar");
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
      showMessage("error", "Failed to upload avatar");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();
      if (data.status === "success") {
        setUser((prev) => ({ ...prev, ...profileForm }));
        showMessage("success", "Profile updated successfully");
      } else {
        showMessage("error", data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      showMessage("error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage("error", "New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage("error", "Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        showMessage("success", "Password changed successfully");
      } else {
        showMessage("error", data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Password change failed:", error);
      showMessage("error", "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Render profile tab
  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Profile Picture
        </h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-24 h-24 object-cover"
                />
              ) : (
                user.fullName?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Camera className="h-4 w-4 mr-2" />
              Change Avatar
            </label>
            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG or GIF. Max size 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Personal Information
        </h3>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileForm.fullName}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={user.username}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={profileForm.bio}
              onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, bio: e.target.value }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Tell others about yourself..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College
              </label>
              <input
                type="text"
                value={profileForm.college}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    college: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course
              </label>
              <input
                type="text"
                value={profileForm.course}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    course: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={profileForm.semester}
                onChange={(e) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    semester: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Semester</option>
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="3rd Semester">3rd Semester</option>
                <option value="4th Semester">4th Semester</option>
                <option value="5th Semester">5th Semester</option>
                <option value="6th Semester">6th Semester</option>
                <option value="7th Semester">7th Semester</option>
                <option value="8th Semester">8th Semester</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Render account tab
  const renderAccountTab = () => (
    <div className="space-y-6">
      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Account Information
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900">{user.email}</p>
                <p className="text-sm text-gray-500">Your email address</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Change Password
        </h3>
        <div onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handlePasswordChange}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Changing...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render notifications tab
  const renderNotificationsTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Notification Preferences
      </h3>
      <div className="space-y-4">
        {Object.entries(notifications).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div>
              <p className="font-medium text-gray-900">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </p>
              <p className="text-sm text-gray-500">
                {key === "emailNotifications" &&
                  "Receive notifications via email"}
                {key === "pushNotifications" &&
                  "Receive push notifications in browser"}
                {key === "weeklyDigest" && "Get weekly summary of activities"}
                {key === "newFollower" && "When someone follows you"}
                {key === "noteApproved" && "When your note gets approved"}
                {key === "noteDownloaded" && "When someone downloads your note"}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  setNotifications((prev) => ({
                    ...prev,
                    [key]: e.target.checked,
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  // Render privacy tab
  const renderPrivacyTab = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Privacy Settings
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Visibility
          </label>
          <select
            value={privacy.profileVisibility}
            onChange={(e) =>
              setPrivacy((prev) => ({
                ...prev,
                profileVisibility: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="public">
              Public - Anyone can view your profile
            </option>
            <option value="members">
              Members Only - Only registered users can view
            </option>
            <option value="private">Private - Only you can view</option>
          </select>
        </div>

        {Object.entries(privacy)
          .filter(([key]) => key !== "profileVisibility")
          .map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </p>
                <p className="text-sm text-gray-500">
                  {key === "showEmail" && "Display your email on your profile"}
                  {key === "showCollege" && "Display your college information"}
                  {key === "allowMessages" &&
                    "Allow other users to message you"}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setPrivacy((prev) => ({ ...prev, [key]: e.target.checked }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 mr-3" />
                        <div>
                          <div className="font-medium">{tab.label}</div>
                          <div className="text-xs opacity-75">
                            {tab.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "account" && renderAccountTab()}
            {activeTab === "notifications" && renderNotificationsTab()}
            {activeTab === "privacy" && renderPrivacyTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
