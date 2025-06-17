import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = () => {
    try {
      const token = localStorage.getItem("token");
      // You can add more validation here like token expiry check
      return token !== null && token !== undefined;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  };

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return React.createElement(Navigate, { to: "/login", replace: true });
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
