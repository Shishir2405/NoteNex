import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Auth Pages
import Landing from "./pages/home/landing";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Signup";
import AdminLoginPage from "./pages/auth/AdminLogin";

// Dashboard Pages - StudyShare
// import DashboardHomePage from "./pages/dashboard/DashboardHomePage";
import BrowseNotesPage from "./pages/dashboard/BrowseNotesPage";
import MyUploadsPage from "./pages/dashboard/MyUploadsPage";
import BookmarksPage from "./pages/dashboard/BookmarksPage";
import DownloadsPage from "./pages/dashboard/DownloadsPage";
import StudyGroupsPage from "./pages/dashboard/StudyGroupsPage";
import LeaderboardPage from "./pages/dashboard/LeaderboardPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

// Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import PendingNotesPage from "./pages/admin/PendingNotesPage";
import ReportedContentPage from "./pages/admin/ReportedContentPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import ContentManagerPage from "./pages/admin/ContentManagerPage";
import ModerationToolsPage from "./pages/admin/ModerationToolsPage";
// import SystemHealthPage from "./pages/admin/SystemHealthPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

// Layout Components
import DashboardLayout from "./components/layouts/DashboardLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import LandingLayout from "./components/layouts/MainLayout"; // New landing layout

// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<RegisterPage />} />
        <Route path="admin-login" element={<AdminLoginPage />} />

        {/* Dashboard Routes - With StudyShare Sidebar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Home */}
          {/* <Route index element={<DashboardHomePage />} /> */}

          {/* StudyShare Core Features */}
          <Route path="browse" element={<BrowseNotesPage />} />
          <Route path="my-uploads" element={<MyUploadsPage />} />
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="downloads" element={<DownloadsPage />} />
          <Route path="study-groups" element={<StudyGroupsPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Admin Routes - With Admin Sidebar */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Admin Dashboard */}
          <Route index element={<AdminDashboardPage />} />

          {/* Content Management */}
          <Route path="pending-notes" element={<PendingNotesPage />} />
          <Route path="reported-content" element={<ReportedContentPage />} />
          <Route path="content" element={<ContentManagerPage />} />

          {/* User Management */}
          <Route path="users" element={<UserManagementPage />} />
          <Route path="moderation" element={<ModerationToolsPage />} />

          {/* Analytics & System */}
          <Route path="analytics" element={<AnalyticsPage />} />
          {/* <Route path="system" element={<SystemHealthPage />} /> */}

          {/* Admin Settings */}
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Home Route with Landing Layout */}
        <Route
          index
          element={
            <LandingLayout>
              <Landing />
            </LandingLayout>
          }
        />

        {/* Legacy routes - Redirect to new structure */}
        <Route path="/login" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<Navigate to="/signup" replace />} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
