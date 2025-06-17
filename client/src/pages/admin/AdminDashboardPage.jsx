import React, { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Download,
  Flag,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Calendar,
  BarChart3,
  Activity,
  Shield,
  Zap,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    overview: {
      totalUsers: 0,
      totalNotes: 0,
      approvedNotes: 0,
      pendingNotes: 0,
      reportedNotes: 0,
      totalDownloads: 0,
      totalViews: 0,
      recentUsers: 0,
      recentNotes: 0,
    },
    topContributors: [],
    popularNotes: [],
    subjectStats: [],
    monthlyTrends: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.status === "success") {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardStats();
    setRefreshing(false);
  };

  const StatCard = ({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    color,
    trend,
  }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {changeType === "increase" ? (
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  changeType === "increase" ? "text-green-600" : "text-red-600"
                }`}
              >
                {change}% from last week
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and key metrics</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.overview.totalUsers}
          change={12}
          changeType="increase"
          icon={Users}
          color="bg-blue-600"
        />
        <StatCard
          title="Total Notes"
          value={stats.overview.totalNotes}
          change={8}
          changeType="increase"
          icon={FileText}
          color="bg-green-600"
        />
        <StatCard
          title="Pending Approval"
          value={stats.overview.pendingNotes}
          icon={Clock}
          color="bg-yellow-600"
        />
        <StatCard
          title="Reported Items"
          value={stats.overview.reportedNotes}
          icon={Flag}
          color="bg-red-600"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Downloads"
          value={stats.overview.totalDownloads}
          change={15}
          changeType="increase"
          icon={Download}
          color="bg-purple-600"
        />
        <StatCard
          title="Total Views"
          value={stats.overview.totalViews}
          change={22}
          changeType="increase"
          icon={Eye}
          color="bg-indigo-600"
        />
        <StatCard
          title="New Users (7d)"
          value={stats.overview.recentUsers}
          change={5}
          changeType="increase"
          icon={TrendingUp}
          color="bg-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Note approved: "Data Structures Guide"
                </p>
                <p className="text-xs text-gray-600">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  New note pending approval
                </p>
                <p className="text-xs text-gray-600">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  New user registered: john_doe
                </p>
                <p className="text-xs text-gray-600">10 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <Flag className="h-5 w-5 text-red-600 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Content reported for review
                </p>
                <p className="text-xs text-gray-600">15 minutes ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Contributors
            </h2>
            <Shield className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.topContributors.slice(0, 5).map((user, index) => (
              <div key={user._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                    {user.fullName?.charAt(0) ||
                      user.username?.charAt(0) ||
                      "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.fullName || user.username}
                    </p>
                    <p className="text-xs text-gray-600">
                      {user.totalUploads} uploads
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-purple-600">
                  {user.contributorScore} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Subject Distribution
          </h2>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.subjectStats.slice(0, 10).map((subject, index) => (
            <div
              key={subject._id}
              className="text-center p-4 bg-gray-50 rounded-lg"
            >
              <p className="text-2xl font-bold text-gray-900">
                {subject.count}
              </p>
              <p className="text-sm text-gray-600 mt-1">{subject._id}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Notes */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Most Popular Notes
          </h2>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Downloads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.popularNotes.slice(0, 5).map((note) => (
                <tr key={note._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {note.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {note.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {note.downloads}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {note.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {note.uploadedBy?.fullName || note.uploadedBy?.username}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Status</p>
              <p className="text-lg font-semibold text-green-600 mt-1">
                All Systems Operational
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Server Response
              </p>
              <p className="text-lg font-semibold text-blue-600 mt-1">
                45ms avg
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-lg font-semibold text-purple-600 mt-1">
                2.3GB / 10GB
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
