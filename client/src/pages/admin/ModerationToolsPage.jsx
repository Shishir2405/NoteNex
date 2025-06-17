import React, { useState, useEffect } from "react";
import {
  Shield,
  Flag,
  Ban,
  AlertTriangle,
  Eye,
  MessageSquare,
  UserX,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Activity,
  TrendingUp,
  Mail,
  Zap,
  Lock,
  Unlock,
} from "lucide-react";

const ModerationToolsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [moderationStats, setModerationStats] = useState({
    pendingReports: 0,
    activeFlags: 0,
    bannedUsers: 0,
    resolvedToday: 0,
    totalWarnings: 0,
    autoModActions: 0,
  });
  const [recentActions, setRecentActions] = useState([]);
  const [autoModSettings, setAutoModSettings] = useState({
    spamDetection: true,
    profanityFilter: true,
    duplicateContent: true,
    bulkActions: false,
    autoApprove: false,
    minTrustLevel: "Bronze",
  });
  const [bulkActions, setBulkActions] = useState({
    selectedItems: [],
    action: "",
    reason: "",
  });
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "reports", label: "Active Reports", icon: Flag },
    { id: "auto-mod", label: "Auto Moderation", icon: Zap },
    { id: "bulk-actions", label: "Bulk Actions", icon: Settings },
    { id: "history", label: "Action History", icon: Clock },
  ];

  useEffect(() => {
    loadModerationData();
  }, []);

  const loadModerationData = async () => {
    setLoading(true);
    try {
      // Load moderation statistics
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.status === "success") {
        setModerationStats({
          pendingReports: data.data.overview.reportedNotes || 0,
          activeFlags: data.data.overview.pendingNotes || 0,
          bannedUsers: 0, // This would come from user stats
          resolvedToday: Math.floor(Math.random() * 15) + 5,
          totalWarnings: Math.floor(Math.random() * 50) + 20,
          autoModActions: Math.floor(Math.random() * 100) + 50,
        });
      }

      // Mock recent actions
      setRecentActions([
        {
          id: 1,
          type: "ban",
          user: "john_doe",
          reason: "Spam posting",
          time: "2 minutes ago",
          status: "completed",
        },
        {
          id: 2,
          type: "approve",
          content: "Data Structures Guide",
          time: "5 minutes ago",
          status: "completed",
        },
        {
          id: 3,
          type: "warning",
          user: "jane_smith",
          reason: "Inappropriate content",
          time: "10 minutes ago",
          status: "completed",
        },
        {
          id: 4,
          type: "delete",
          content: "Low quality notes",
          time: "15 minutes ago",
          status: "completed",
        },
        {
          id: 5,
          type: "resolve",
          report: "Copyright violation claim",
          time: "20 minutes ago",
          status: "completed",
        },
      ]);
    } catch (error) {
      console.error("Failed to load moderation data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoModToggle = (setting) => {
    setAutoModSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-green-600">
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Pending Reports"
          value={moderationStats.pendingReports}
          icon={Flag}
          color="bg-red-600"
          trend="-12% from yesterday"
        />
        <StatCard
          title="Active Flags"
          value={moderationStats.activeFlags}
          icon={AlertTriangle}
          color="bg-yellow-600"
          trend="+5% from yesterday"
        />
        <StatCard
          title="Banned Users"
          value={moderationStats.bannedUsers}
          icon={Ban}
          color="bg-gray-600"
        />
        <StatCard
          title="Resolved Today"
          value={moderationStats.resolvedToday}
          icon={CheckCircle}
          color="bg-green-600"
          trend="+8% from yesterday"
        />
        <StatCard
          title="Total Warnings"
          value={moderationStats.totalWarnings}
          icon={MessageSquare}
          color="bg-orange-600"
        />
        <StatCard
          title="Auto-Mod Actions"
          value={moderationStats.autoModActions}
          icon={Zap}
          color="bg-purple-600"
          trend="+15% from yesterday"
        />
      </div>

      {/* Recent Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Moderation Actions
          </h2>
          <button
            onClick={loadModerationData}
            className="text-red-600 hover:text-red-700"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3">
          {recentActions.map((action) => (
            <div
              key={action.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    action.type === "ban"
                      ? "bg-red-100"
                      : action.type === "approve"
                      ? "bg-green-100"
                      : action.type === "warning"
                      ? "bg-yellow-100"
                      : action.type === "delete"
                      ? "bg-red-100"
                      : "bg-blue-100"
                  }`}
                >
                  {action.type === "ban" && (
                    <Ban className="h-4 w-4 text-red-600" />
                  )}
                  {action.type === "approve" && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {action.type === "warning" && (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  )}
                  {action.type === "delete" && (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  {action.type === "resolve" && (
                    <Flag className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {action.type.charAt(0).toUpperCase() + action.type.slice(1)}{" "}
                    {action.user ? `user: ${action.user}` : ""}
                    {action.content ? `content: ${action.content}` : ""}
                    {action.report ? `report: ${action.report}` : ""}
                  </p>
                  <p className="text-xs text-gray-600">{action.reason}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{action.time}</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {action.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAutoModeration = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Auto-Moderation Settings
        </h2>

        <div className="space-y-6">
          {/* Detection Settings */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Content Detection
            </h3>
            <div className="space-y-4">
              {Object.entries({
                spamDetection: "Spam Detection",
                profanityFilter: "Profanity Filter",
                duplicateContent: "Duplicate Content Detection",
              }).map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-sm text-gray-600">
                      {key === "spamDetection" &&
                        "Automatically detect and flag potential spam content"}
                      {key === "profanityFilter" &&
                        "Filter out inappropriate language and content"}
                      {key === "duplicateContent" &&
                        "Detect and prevent duplicate note uploads"}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoModSettings[key]}
                      onChange={() => handleAutoModToggle(key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Settings */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Automated Actions
            </h3>
            <div className="space-y-4">
              {Object.entries({
                bulkActions: "Enable Bulk Actions",
                autoApprove: "Auto-approve trusted users",
              }).map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{label}</p>
                    <p className="text-sm text-gray-600">
                      {key === "bulkActions" &&
                        "Allow bulk moderation actions on multiple items"}
                      {key === "autoApprove" &&
                        "Automatically approve content from trusted contributors"}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoModSettings[key]}
                      onChange={() => handleAutoModToggle(key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Level Settings */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">
              Trust Level Settings
            </h3>
            <div className="p-4 border border-gray-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Trust Level for Auto-Approval
              </label>
              <select
                value={autoModSettings.minTrustLevel}
                onChange={(e) =>
                  setAutoModSettings((prev) => ({
                    ...prev,
                    minTrustLevel: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
              <p className="text-sm text-gray-600 mt-2">
                Content from users with this trust level or higher will be
                auto-approved
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderBulkActions = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Bulk Moderation Actions
        </h2>

        {!autoModSettings.bulkActions ? (
          <div className="text-center py-12">
            <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Bulk Actions Disabled
            </h3>
            <p className="text-gray-600 mb-4">
              Enable bulk actions in auto-moderation settings to use this
              feature.
            </p>
            <button
              onClick={() => setActiveTab("auto-mod")}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Go to Settings
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Action Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bulk Action
                </label>
                <select
                  value={bulkActions.action}
                  onChange={(e) =>
                    setBulkActions((prev) => ({
                      ...prev,
                      action: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select Action</option>
                  <option value="approve">Approve Content</option>
                  <option value="reject">Reject Content</option>
                  <option value="delete">Delete Content</option>
                  <option value="ban-users">Ban Users</option>
                  <option value="warn-users">Warn Users</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">Select Target</option>
                  <option value="pending-notes">Pending Notes</option>
                  <option value="reported-content">Reported Content</option>
                  <option value="flagged-users">Flagged Users</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter By
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">No Filter</option>
                  <option value="subject">Subject</option>
                  <option value="date">Date Range</option>
                  <option value="user">User</option>
                  <option value="reports">Report Count</option>
                </select>
              </div>
            </div>

            {/* Reason Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason/Message
              </label>
              <textarea
                value={bulkActions.reason}
                onChange={(e) =>
                  setBulkActions((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                placeholder="Enter reason for this bulk action..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Preview and Execute */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="font-medium text-yellow-800">
                  Preview Bulk Action
                </span>
              </div>
              <p className="text-sm text-yellow-700">
                This action will affect approximately <strong>0 items</strong>{" "}
                based on your current filters. Please review carefully before
                executing.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Preview Changes
              </button>
              <button
                disabled={!bulkActions.action || !bulkActions.reason}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Execute Bulk Action
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderActionHistory = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Moderation Action History
          </h2>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
            />
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500">
              <option value="all">All Actions</option>
              <option value="ban">Bans</option>
              <option value="warning">Warnings</option>
              <option value="approval">Approvals</option>
              <option value="deletion">Deletions</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Moderator
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActions.map((action) => (
                <tr key={action.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          action.type === "ban"
                            ? "bg-red-100"
                            : action.type === "approve"
                            ? "bg-green-100"
                            : action.type === "warning"
                            ? "bg-yellow-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {action.type === "ban" && (
                          <Ban className="h-4 w-4 text-red-600" />
                        )}
                        {action.type === "approve" && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {action.type === "warning" && (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        )}
                        {action.type === "delete" && (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        {action.type === "resolve" && (
                          <Flag className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {action.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {action.user && `User: ${action.user}`}
                    {action.content && `Content: ${action.content}`}
                    {action.report && `Report: ${action.report}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {action.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Admin
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {action.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading moderation tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Moderation Tools</h1>
          <p className="text-gray-600">
            Advanced moderation and automation controls
          </p>
        </div>
        <button
          onClick={loadModerationData}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && renderOverview()}
        {activeTab === "reports" && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Active Reports Management
            </h2>
            <p className="text-gray-600 mb-4">
              Manage active reports and flags. This integrates with the Reported
              Content page.
            </p>
            <button
              onClick={() => (window.location.href = "/admin/reported-content")}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Go to Reported Content
            </button>
          </div>
        )}
        {activeTab === "auto-mod" && renderAutoModeration()}
        {activeTab === "bulk-actions" && renderBulkActions()}
        {activeTab === "history" && renderActionHistory()}
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-medium text-gray-900">Quick Actions</h3>
          <div className="flex space-x-3">
            <button className="flex items-center px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm">
              <Flag className="h-4 w-4 mr-2" />
              Review Reports
            </button>
            <button className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Pending
            </button>
            <button className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
              <Ban className="h-4 w-4 mr-2" />
              Emergency Ban
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModerationToolsPage;
