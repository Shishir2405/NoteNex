import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Home,
  BookOpen,
  Upload,
  Heart,
  Download,
  Users,
  Award,
  Settings,
  Search,
  Bell,
  User,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({ name: "Loading...", email: "" });
  const [notifications] = useState(3);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    {
      id: "browse",
      label: "Browse Notes",
      icon: BookOpen,
      path: "/dashboard/browse",
    },
    {
      id: "my-uploads",
      label: "My Uploads",
      icon: Upload,
      path: "/dashboard/my-uploads",
    },
    {
      id: "bookmarks",
      label: "Bookmarks",
      icon: Heart,
      path: "/dashboard/bookmarks",
    },
    {
      id: "downloads",
      label: "Downloads",
      icon: Download,
      path: "/dashboard/downloads",
    },
    {
      id: "study-groups",
      label: "Study Groups",
      icon: Users,
      path: "/dashboard/study-groups",
    },
    {
      id: "leaderboard",
      label: "Leaderboard",
      icon: Award,
      path: "/dashboard/leaderboard",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/dashboard/settings",
    },
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
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
        if (data.status === "success") {
          setUser(data.data);
        }
      } else {
        // Token might be invalid
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
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
      navigate("/login");
    }
  };

  const isActiveLink = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false); // Close mobile sidebar
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

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Logo/Brand */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">
              NoteNex
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 px-3">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActiveLink(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-3 py-3 mb-1 rounded-lg transition-colors duration-200 group ${
                  isActive
                    ? "bg-purple-100 text-purple-700 border-r-2 border-purple-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <IconComponent
                  className={`h-5 w-5 mr-3 ${
                    isActive
                      ? "text-purple-600"
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <ChevronRight className="h-4 w-4 ml-auto text-purple-600" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-16 left-0 right-0 px-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-purple-600 p-2 rounded-full">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.fullName || user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-3 right-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
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
              className="lg:hidden mr-4 p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-gray-500" />
            </button>

            {/* Page Title */}
            <h1 className="text-xl font-semibold text-gray-900 capitalize">
              {location.pathname === "/dashboard"
                ? "Dashboard"
                : location.pathname.split("/").pop()?.replace("-", " ")}
            </h1>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search className="h-4 w-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search notes..."
                className="bg-transparent outline-none text-sm w-64 placeholder-gray-500"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* User Avatar */}
            <div className="flex items-center space-x-2">
              <div className="bg-purple-600 p-2 rounded-full">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user.fullName?.split(" ")[0] || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user.course || "Student"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
