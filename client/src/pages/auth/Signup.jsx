import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  GraduationCap,
  Building,
  Calendar,
  UserPlus,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    college: "",
    course: "",
    semester: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const semesters = [
    "1st Semester",
    "2nd Semester",
    "3rd Semester",
    "4th Semester",
    "5th Semester",
    "6th Semester",
    "7th Semester",
    "8th Semester",
  ];

  const courses = [
    "B.Tech Computer Science",
    "B.Tech Mechanical",
    "B.Tech Electrical",
    "BCA",
    "MCA",
    "B.Sc Computer Science",
    "M.Tech",
    "MBA",
    "Other",
  ];

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // Check for empty required fields
    const requiredFields = [
      "username",
      "email",
      "password",
      "fullName",
      "college",
      "course",
      "semester",
    ];
    const emptyFields = requiredFields.filter(
      (field) => !formData[field].trim()
    );

    if (emptyFields.length > 0) {
      setError(`Please fill in all required fields: ${emptyFields.join(", ")}`);
      setLoading(false);
      return;
    }

    // Prepare request payload (exactly as per API docs)
    const requestPayload = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      fullName: formData.fullName.trim(),
      college: formData.college.trim(),
      course: formData.course,
      semester: formData.semester,
    };

    // Debug logging
    console.log("📤 Sending registration request:", {
      url: "http://localhost:5001/api/auth/register",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      payload: requestPayload,
    });

    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      console.log("📥 Response status:", response.status);
      console.log(
        "📥 Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      // Get response text first to handle both JSON and non-JSON responses
      const responseText = await response.text();
      console.log("📥 Raw response body:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ Failed to parse response as JSON:", parseError);
        setError(`Server returned invalid response: ${responseText}`);
        setLoading(false);
        return;
      }

      if (response.ok) {
        console.log("✅ Registration successful:", data);
        navigate("/login", {
          state: { message: "Account created successfully! Please sign in." },
        });
      } else {
        console.error("❌ Registration failed:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });

        // Handle different error response formats
        const errorMessage =
          data.message ||
          data.error ||
          (data.errors && data.errors[0]?.message) ||
          `Registration failed with status ${response.status}`;

        setError(errorMessage);
      }
    } catch (err) {
      console.error("❌ Network/request error:", err);
      setError(
        `Network error: ${err.message}. Please check if the server is running on port 5001.`
      );
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gradient-to-br from-purple-600 to-blue-700">
        <div className="max-w-md text-center text-white px-8">
          <h3 className="text-3xl font-bold mb-8">Join StudyShare</h3>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold">Access Premium Notes</h4>
                <p className="text-purple-100 text-sm">
                  Download high-quality study materials
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold">Connect with Peers</h4>
                <p className="text-purple-100 text-sm">
                  Network with students from your college
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold">Earn Recognition</h4>
                <p className="text-purple-100 text-sm">
                  Build your academic reputation
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white bg-opacity-10 rounded-xl">
            <p className="text-lg font-medium mb-2">Start your journey today</p>
            <p className="text-purple-100">
              Create your account and join the academic community!
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-600 p-3 rounded-full">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Join StudyShare and start your academic journey
            </p>
          </div>

          {/* Debug Info */}
          <div className="bg-gray-50 p-3 rounded-lg text-xs">
            <p>
              <strong>Debug Info:</strong> Check browser console for detailed
              logs
            </p>
            <p>Server: http://localhost:5001/api/auth/register</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm">{error}</div>
              </div>
            </div>
          )}

          {/* Signup Form */}
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* College */}
            <div>
              <label
                htmlFor="college"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                College/University <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="college"
                  name="college"
                  type="text"
                  required
                  value={formData.college}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your college name"
                />
              </div>
            </div>

            {/* Course and Semester Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Course */}
              <div>
                <label
                  htmlFor="course"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="course"
                    name="course"
                    required
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 appearance-none bg-white"
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Semester */}
              <div>
                <label
                  htmlFor="semester"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Semester <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="semester"
                    name="semester"
                    required
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 appearance-none bg-white"
                  >
                    <option value="">Select Semester</option>
                    {semesters.map((semester) => (
                      <option key={semester} value={semester}>
                        {semester}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Password Strength</span>
                    <span
                      className={`font-medium ${
                        passwordStrength <= 2
                          ? "text-red-600"
                          : passwordStrength <= 3
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-1">
                  {formData.password === formData.confirmPassword ? (
                    <div className="flex items-center text-green-600 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Passwords match
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600 text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Passwords don't match
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 mt-6"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create Account
                </>
              )}
            </button>

            {/* Sign In Link */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-purple-600 hover:text-purple-500 transition duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
