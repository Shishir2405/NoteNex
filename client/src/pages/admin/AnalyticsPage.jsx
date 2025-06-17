import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Download,
  Eye,
  Calendar,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity,
  Globe,
  School,
  BookOpen,
} from "lucide-react";

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({
    period: 30,
    trends: {
      users: [],
      uploads: [],
      downloads: [],
    },
    collegeStats: [],
    subjectPopularity: [],
    fileTypeStats: [],
    topPerformers: {
      uploaders: [],
      downloaders: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [selectedMetric, setSelectedMetric] = useState("users");

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

  const periods = [
    { value: 7, label: "Last 7 days" },
    { value: 30, label: "Last 30 days" },
    { value: 90, label: "Last 3 months" },
    { value: 365, label: "Last year" },
  ];

  const metrics = [
    { value: "users", label: "User Registrations", icon: Users, color: "blue" },
    { value: "uploads", label: "Note Uploads", icon: FileText, color: "green" },
    { value: "downloads", label: "Downloads", icon: Download, color: "purple" },
  ];

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/admin/analytics?period=${selectedPeriod}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowth = (data) => {
    if (data.length < 2) return 0;
    const current = data[data.length - 1]?.count || 0;
    const previous = data[data.length - 2]?.count || 0;
    if (previous === 0) return current > 0 ? 100 : 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const getTotalCount = (data) => {
    return data.reduce((sum, item) => sum + (item.count || 0), 0);
  };

  const MetricCard = ({ title, value, growth, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {growth !== undefined && (
            <div className="flex items-center mt-2">
              {growth >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  growth >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {Math.abs(growth)}% vs previous period
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-600`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const SimpleChart = ({ data, title, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-2">
        {data.slice(0, 6).map((item, index) => {
          const maxValue = Math.max(
            ...data.map((d) => d.count || d.noteCount || d.userCount || 0)
          );
          const percentage =
            maxValue > 0
              ? ((item.count || item.noteCount || item.userCount || 0) /
                  maxValue) *
                100
              : 0;

          return (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 w-1/3 truncate">
                {item._id || item.date}
              </span>
              <div className="flex-1 mx-3">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${color}-600 h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                {(
                  item.count ||
                  item.noteCount ||
                  item.userCount ||
                  0
                ).toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Platform insights and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          <button
            onClick={loadAnalytics}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="User Registrations"
          value={getTotalCount(analytics.trends.users)}
          growth={calculateGrowth(analytics.trends.users)}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Note Uploads"
          value={getTotalCount(analytics.trends.uploads)}
          growth={calculateGrowth(analytics.trends.uploads)}
          icon={FileText}
          color="green"
        />
        <MetricCard
          title="Total Downloads"
          value={getTotalCount(analytics.trends.downloads)}
          growth={calculateGrowth(analytics.trends.downloads)}
          icon={Download}
          color="purple"
        />
      </div>

      {/* Trend Chart Simulation */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Activity Trends
          </h2>
          <div className="flex space-x-2">
            {metrics.map((metric) => (
              <button
                key={metric.value}
                onClick={() => setSelectedMetric(metric.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedMetric === metric.value
                    ? `bg-${metric.color}-100 text-${metric.color}-700`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        {/* Simple trend visualization */}
        <div className="space-y-3">
          {analytics.trends[selectedMetric]?.slice(-7).map((item, index) => {
            const maxValue = Math.max(
              ...analytics.trends[selectedMetric].map((d) => d.count)
            );
            const percentage = maxValue > 0 ? (item.count / maxValue) * 100 : 0;

            return (
              <div key={index} className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-600 w-20">
                  {item._id ? `${item._id.month}/${item._id.year}` : "N/A"}
                </span>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div
                      className={`bg-${
                        metrics.find((m) => m.value === selectedMetric)?.color
                      }-600 h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                  {item.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* College Performance */}
        <SimpleChart
          data={analytics.collegeStats}
          title="Top Colleges by Activity"
          color="blue"
        />

        {/* Subject Popularity */}
        <SimpleChart
          data={analytics.subjectPopularity}
          title="Most Popular Subjects"
          color="green"
        />
      </div>

      {/* File Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            File Type Distribution
          </h3>
          <div className="space-y-3">
            {analytics.fileTypeStats.map((fileType, index) => {
              const maxCount = Math.max(
                ...analytics.fileTypeStats.map((f) => f.count)
              );
              const percentage =
                maxCount > 0 ? (fileType.count / maxCount) * 100 : 0;

              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 uppercase">
                    {fileType._id}
                  </span>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {fileType.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Contributors
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">
                Top Uploaders
              </h4>
              <div className="space-y-2">
                {analytics.topPerformers.uploaders
                  .slice(0, 5)
                  .map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {user.fullName?.charAt(0) || "U"}
                        </div>
                        <span className="text-sm text-gray-900">
                          {user.fullName || user.username}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {user.totalUploads} uploads
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-3">
                Most Active Users
              </h4>
              <div className="space-y-2">
                {analytics.topPerformers.downloaders
                  .slice(0, 5)
                  .map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {user.fullName?.charAt(0) || "U"}
                        </div>
                        <span className="text-sm text-gray-900">
                          {user.fullName || user.username}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {user.totalDownloads} downloads
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {analytics.collegeStats.length}
          </p>
          <p className="text-sm text-gray-600">Active Colleges</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {analytics.subjectPopularity.length}
          </p>
          <p className="text-sm text-gray-600">Subjects</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {analytics.fileTypeStats.reduce(
              (sum, type) => sum + type.totalSize,
              0
            ) /
              (1024 * 1024 * 1024) >
            1
              ? `${(
                  analytics.fileTypeStats.reduce(
                    (sum, type) => sum + type.totalSize,
                    0
                  ) /
                  (1024 * 1024 * 1024)
                ).toFixed(1)}GB`
              : `${(
                  analytics.fileTypeStats.reduce(
                    (sum, type) => sum + type.totalSize,
                    0
                  ) /
                  (1024 * 1024)
                ).toFixed(0)}MB`}
          </p>
          <p className="text-sm text-gray-600">Total Storage</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <TrendingUp className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {calculateGrowth(analytics.trends.users) >= 0 ? "+" : ""}
            {calculateGrowth(analytics.trends.users)}%
          </p>
          <p className="text-sm text-gray-600">Growth Rate</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
