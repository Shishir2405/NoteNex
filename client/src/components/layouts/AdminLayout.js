import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  BarChart3,
  FileText,
  Users,
  Flag,
  Settings,
  AlertTriangle,
  TrendingUp,
  Database,
  UserCheck,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Crown,
  Activity,
  FileCheck,
  UserX,
  MessageSquare,
} from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState({ name: "Loading...", email: "" });
  const [notifications] = useState(5);
  const [stats, setStats] = useState({
    pendingNotes: 0,
    reportedNotes: 0,
    totalUsers: 0,
    newUsers: 0,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      path: "/admin",
      badge: null,
    },
    {
      id: "pending-notes",
      label: "Pending Notes",
      icon: FileCheck,
      path: "/admin/pending-notes",
      badge: stats.pendingNotes,
    },
    {
      id: "reported-content",
      label: "Reported Content",
      icon: Flag,
      path: "/admin/reported-content",
      badge: stats.reportedNotes,
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      path: "/admin/users",
      badge: null,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: TrendingUp,
      path: "/admin/analytics",
      badge: null,
    },
    {
      id: "content",
      label: "Content Manager",
      icon: FileText,
      path: "/admin/content",
      badge: null,
    },
    {
      id: "moderation",
      label: "Moderation Tools",
      icon: UserCheck,
      path: "/admin/moderation",
      badge: null,
    },
    {
      id: "settings",
      label: "Admin Settings",
      icon: Settings,
      path: "/admin/settings",
      badge: null,
    },
  ];

  useEffect(() => {
    loadAdminData();
    loadDashboardStats();
  }, []);

  const loadAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to admin login");
        navigate("/admin-login");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success" && data.data.user.role === "admin") {
          setAdmin(data.data.user);
        } else {
          console.log("User is not admin, redirecting to dashboard");
          navigate("/dashboard");
        }
      } else {
        localStorage.removeItem("token");
        console.log("Invalid token, redirecting to admin login");
        navigate("/admin-login");
      }
    } catch (error) {
      console.error("Failed to load admin data:", error);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setStats({
            pendingNotes: data.data.overview.pendingNotes || 0,
            reportedNotes: data.data.overview.reportedNotes || 0,
            totalUsers: data.data.overview.totalUsers || 0,
            newUsers: data.data.overview.recentUsers || 0,
          });
        }
      }
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/admin-login");
    }
  };

  const isActiveLink = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin") return "Admin Dashboard";

    const segments = path.split("/");
    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Light Mode */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Logo/Brand */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-red-600 p-2 rounded-lg shadow-sm">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold text-gray-900">NoteNex</span>
              <span className="block text-xs text-red-600 font-medium">
                Admin Panel
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Admin Status Indicator */}
        <div className="px-6 py-4 bg-red-50 border-b border-red-100">
          <div className="flex items-center">
            <Crown className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-sm font-medium text-red-700">
              Administrator Access
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 px-3 flex-1">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActiveLink(item.path);
            const hasBadge = item.badge && item.badge > 0;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-3 py-3 mb-1 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-red-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <IconComponent
                  className={`h-5 w-5 mr-3 ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}
                />
                <span className="font-medium flex-1 text-left">
                  {item.label}
                </span>

                {/* Badge for notifications */}
                {hasBadge && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center shadow-sm">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}

                {isActive && (
                  <ChevronRight className="h-4 w-4 ml-2 text-white" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-3 right-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-red-200"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-4 p-2 rounded-md hover:bg-gray-100 text-gray-600"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Page Title */}
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
              <span className="ml-3 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full border border-red-200">
                Admin Mode
              </span>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-red-500">
              <Search className="h-4 w-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search users, notes..."
                className="bg-transparent outline-none text-sm w-64 placeholder-gray-500"
              />
            </div>

            {/* Emergency Alert Button */}
            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 border border-red-200">
              <AlertTriangle className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
              <Bell className="h-5 w-5 text-gray-600" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm">
                  {notifications > 9 ? "9+" : notifications}
                </span>
              )}
            </button>

            {/* Quick Actions Dropdown */}
            <div className="hidden md:flex items-center space-x-2">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm">
                Emergency Stop
              </button>
            </div>

            {/* Admin Avatar */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="bg-red-600 p-2 rounded-full shadow-sm">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {admin.fullName?.split(" ")[0] || admin.username || "Admin"}
                </p>
                <p className="text-xs text-red-600 font-medium">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Notice Bar */}
        <div className="bg-red-50 border-l-4 border-red-400 border-b border-red-100 p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">
              <span className="font-medium">Administrator Mode:</span> You have
              full system access. All actions are logged and monitored.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* React Router Outlet for nested routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
