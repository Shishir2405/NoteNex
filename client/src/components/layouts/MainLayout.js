import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Menu,
  X,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart,
  Star,
  Users,
  Shield,
  Award,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";

const LandingLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monthly color palette - matching the landing page
  const monthlyColors = [
    "from-blue-400 to-blue-500", // January
    "from-purple-400 to-purple-500", // February
    "from-green-400 to-green-500", // March
    "from-pink-400 to-pink-500", // April
    "from-indigo-400 to-indigo-500", // May
    "from-teal-400 to-teal-500", // June
    "from-orange-400 to-orange-500", // July
    "from-cyan-400 to-cyan-500", // August
    "from-violet-400 to-violet-500", // September
    "from-emerald-400 to-emerald-500", // October
    "from-rose-400 to-rose-500", // November
    "from-amber-400 to-amber-500", // December
  ];

  const currentMonth = new Date().getMonth();
  const primaryGradient = monthlyColors[currentMonth];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Community", href: "#community" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  const handleNavClick = (href) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  const handleAuthClick = (type) => {
    if (type === "login") {
      navigate("/login");
    } else if (type === "signup") {
      navigate("/signup");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-3 group"
            >
              <div
                className={`w-10 h-10 bg-gradient-to-r ${primaryGradient} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm`}
              >
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span
                className={`text-2xl font-bold bg-gradient-to-r ${primaryGradient} bg-clip-text text-transparent`}
              >
                NoteNex
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-300 relative group"
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r ${primaryGradient} transition-all duration-300 group-hover:w-full`}
                  ></span>
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login">
                {" "}
                <button className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-300">
                  Sign In
                </button>
              </Link>
              <button
                onClick={() => handleAuthClick("signup")}
                className={`px-6 py-2 bg-gradient-to-r ${primaryGradient} text-white rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-sm hover:shadow-md`}
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50 rounded-b-2xl shadow-lg mt-2">
              <div className="px-6 py-4 space-y-4">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.href)}
                    className="block w-full text-left text-gray-700 hover:text-gray-900 font-medium py-2 transition-colors duration-300"
                  >
                    {link.name}
                  </button>
                ))}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleAuthClick("login");
                      setIsMenuOpen(false);
                    }}
                    className="block text-gray-700 hover:text-gray-900 font-medium py-2 transition-colors duration-300"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      handleAuthClick("signup");
                      setIsMenuOpen(false);
                    }}
                    className={`block mt-2 w-full px-6 py-3 bg-gradient-to-r ${primaryGradient} text-white rounded-full font-semibold text-center hover:scale-105 transition-transform duration-300 shadow-sm`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${primaryGradient} rounded-xl flex items-center justify-center shadow-sm`}
                >
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <span
                  className={`text-3xl font-bold bg-gradient-to-r ${primaryGradient} bg-clip-text text-transparent`}
                >
                  NoteNex
                </span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                Empowering students worldwide through collaborative learning and
                knowledge sharing. Join our community and transform your
                academic journey.
              </p>
              <div className="flex items-center space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-300"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  "Features",
                  "How It Works",
                  "Community",
                  "Pricing",
                  "About Us",
                  "Contact",
                ].map((link) => (
                  <li key={link}>
                    <button
                      className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                      onClick={() =>
                        handleNavClick(
                          `#${link.toLowerCase().replace(" ", "-")}`
                        )
                      }
                    >
                      <ChevronRight className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-6">Get In Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <a
                    href="mailto:hello@NoteNex.com"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    hello@NoteNex.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <a
                    href="tel:+919876543210"
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    +91 98765 43210
                  </a>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-300">Mumbai, India</span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  />
                  <button
                    className={`px-6 py-2 bg-gradient-to-r ${primaryGradient} rounded-r-lg hover:scale-105 transition-transform duration-300 font-semibold`}
                    onClick={() =>
                      alert("Newsletter subscription feature coming soon!")
                    }
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center text-gray-400 mb-4 md:mb-0">
                <span>Made with </span>
                <Heart className="w-4 h-4 text-red-500 mx-1" />
                <span> for students worldwide</span>
              </div>

              <div className="flex items-center space-x-6 text-gray-400 text-sm">
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Cookie Policy
                </a>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between mt-6 pt-6 border-t border-gray-800">
              <p className="text-gray-400 text-sm">
                © 2024 NoteNex. All rights reserved.
              </p>

              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <div className="flex items-center text-gray-400 text-sm">
                  <Shield className="w-4 h-4 mr-1 text-green-500" />
                  <span>Secure Platform</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Award className="w-4 h-4 mr-1 text-yellow-500" />
                  <span>Quality Assured</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Globe className="w-4 h-4 mr-1 text-blue-500" />
                  <span>Global Community</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;
