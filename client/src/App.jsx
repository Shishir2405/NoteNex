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

// Dashboard Pages - StudyShare
// import DashboardHomePage from "./pages/dashboard/DashboardHomePage";
import BrowseNotesPage from "./pages/dashboard/BrowseNotesPage";
import MyUploadsPage from "./pages/dashboard/MyUploadsPage";
import BookmarksPage from "./pages/dashboard/BookmarksPage";
import DownloadsPage from "./pages/dashboard/DownloadsPage";
import StudyGroupsPage from "./pages/dashboard/StudyGroupsPage";
import LeaderboardPage from "./pages/dashboard/LeaderboardPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

// Layout Components
import DashboardLayout from "./components/layouts/DashboardLayout";

// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<RegisterPage />} />

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

       

          <Route index element={<Landing />} />
   

        {/* Legacy routes - Redirect to new structure */}
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route
          path="/signup"
          element={<Navigate to="/auth/signup" replace />}
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
