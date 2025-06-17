import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
  CheckCircle,
  BookOpen,
  Settings,
  Home,
  Sparkles,
} from "lucide-react";

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:5001/api";

  // Gentle entrance animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Check if already logged in as admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        const userData = JSON.parse(user);
        if (userData.role === "admin") {
          window.location.href = "/admin";
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.username || !formData.password) {
      setError("Please enter both username and password");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/admin-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setSuccess("Welcome back, Admin! Redirecting...");
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        setTimeout(() => {
          window.location.href = "/admin";
        }, 1500);
      } else {
        setError(data.message || "Invalid admin credentials");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  // Floating background elements
  const FloatingElement = ({ children, delay = 0, duration = 8 }) => (
    <motion.div
      animate={{
        y: [0, -20, 0],
        x: [0, 10, 0],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white/30" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 hidden lg:block">
        <FloatingElement delay={0}>
          <div className="w-16 h-16 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm border border-white/50">
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </FloatingElement>
      </div>

      <div className="absolute top-32 right-24 hidden lg:block">
        <FloatingElement delay={2}>
          <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm border border-white/50">
            <Settings className="w-6 h-6 text-purple-500" />
          </div>
        </FloatingElement>
      </div>

      <div className="absolute bottom-24 left-32 hidden lg:block">
        <FloatingElement delay={4}>
          <div className="w-14 h-14 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm border border-white/50">
            <Sparkles className="w-7 h-7 text-pink-500" />
          </div>
        </FloatingElement>
      </div>

      <div className="absolute bottom-32 right-20 hidden lg:block">
        <FloatingElement delay={1}>
          <div className="w-10 h-10 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm border border-white/50">
            <Shield className="w-5 h-5 text-green-500" />
          </div>
        </FloatingElement>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : 20,
          scale: isVisible ? 1 : 0.95,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Main Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-3xl" />

          <div className="relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-8"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="mx-auto w-18 h-18 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
              >
                <Shield className="h-10 w-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                Admin Portal
              </h1>
              <p className="text-gray-600 font-medium">
                StudyShare Administration
              </p>
            </motion.div>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 p-4 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-2xl flex items-center"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-green-700 text-sm font-medium">
                    {success}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl flex items-center"
                >
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                  <span className="text-red-700 text-sm font-medium">
                    {error}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Username Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="block w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 placeholder-gray-400 transition-all duration-200 text-gray-800 font-medium backdrop-blur-sm"
                    placeholder="Enter admin username"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="block w-full pl-12 pr-14 py-4 bg-white/50 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 placeholder-gray-400 transition-all duration-200 text-gray-800 font-medium backdrop-blur-sm"
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading || !formData.username || !formData.password}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Access Dashboard
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Demo Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 p-4 bg-blue-50/60 backdrop-blur-sm rounded-2xl border border-blue-200/30"
            >
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">
                    Demo Access
                  </h3>
                  <p className="text-xs text-blue-700 mb-3">
                    Use the demo credentials for testing:
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setFormData({
                        username: "admin",
                        password: "admin123",
                      });
                    }}
                    className="text-xs bg-blue-100/80 hover:bg-blue-200/80 text-blue-800 px-3 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Fill Demo Credentials
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-4 p-4 bg-gray-50/60 backdrop-blur-sm rounded-2xl border border-gray-200/30"
            >
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">
                    Secure Access
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    All admin activities are monitored and logged for security
                    purposes.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Back to Main Site */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-6 text-center"
            >
              <motion.button
                whileHover={{ scale: 1.02, x: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => (window.location.href = "/")}
                className="text-sm text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to StudyShare
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-600 text-sm font-medium">
            Need assistance? Contact system administrator
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
