// Application constants

// Common subjects across engineering/science courses
const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Science",
  "Data Structures",
  "Algorithms",
  "Database Management",
  "Software Engineering",
  "Machine Learning",
  "Artificial Intelligence",
  "Web Development",
  "Mobile Development",
  "Operating Systems",
  "Computer Networks",
  "Digital Electronics",
  "Microprocessors",
  "Engineering Mechanics",
  "Thermodynamics",
  "Fluid Mechanics",
  "Materials Science",
  "Electrical Circuits",
  "Control Systems",
  "Signal Processing",
  "Communication Systems",
  "Power Systems",
  "Mechanical Design",
  "Manufacturing",
  "Civil Engineering",
  "Structural Analysis",
  "Environmental Engineering",
  "Economics",
  "Management",
  "Business Studies",
  "Statistics",
  "Linear Algebra",
  "Calculus",
  "Discrete Mathematics",
  "Biology",
  "Biotechnology",
  "Electronics",
  "Instrumentation",
];

// Common semesters
const SEMESTERS = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
  "Final Year",
  "Post Graduate",
];

// Common courses
const COURSES = [
  "B.Tech Computer Science",
  "B.Tech Information Technology",
  "B.Tech Electronics",
  "B.Tech Electrical",
  "B.Tech Mechanical",
  "B.Tech Civil",
  "B.Tech Chemical",
  "B.E Computer Science",
  "B.E Electronics",
  "B.E Electrical",
  "B.E Mechanical",
  "B.E Civil",
  "BCA",
  "MCA",
  "M.Tech",
  "M.E",
  "BSc Computer Science",
  "BSc Mathematics",
  "BSc Physics",
  "BSc Chemistry",
  "MSc Computer Science",
  "MSc Mathematics",
  "MSc Physics",
  "MSc Chemistry",
  "BBA",
  "MBA",
  "B.Com",
  "M.Com",
  "BA",
  "MA",
];

// File type restrictions
const ALLOWED_FILE_TYPES = {
  DOCUMENTS: ["pdf", "doc", "docx", "txt"],
  IMAGES: ["jpg", "jpeg", "png", "gif"],
  ALL: ["pdf", "doc", "docx", "txt", "jpg", "jpeg", "png", "gif"],
};

// File size limits (in bytes)
const FILE_SIZE_LIMITS = {
  NOTES: 10 * 1024 * 1024, // 10MB
  AVATAR: 2 * 1024 * 1024, // 2MB
  ATTACHMENTS: 5 * 1024 * 1024, // 5MB
};

// Quality levels
const QUALITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  PREMIUM: "premium",
};

// Trust rankings
const TRUST_RANKINGS = {
  BRONZE: "Bronze",
  SILVER: "Silver",
  GOLD: "Gold",
  PLATINUM: "Platinum",
};

// Score thresholds for trust rankings
const TRUST_SCORE_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 50,
  GOLD: 200,
  PLATINUM: 500,
};

// Points system
const POINTS = {
  UPLOAD_NOTE: 10,
  NOTE_DOWNLOADED: 2,
  NOTE_LIKED: 1,
  COMMENT_RECEIVED: 1,
  VERIFIED_NOTE: 25,
};

// Report reasons
const REPORT_REASONS = [
  "spam",
  "inappropriate",
  "copyright",
  "wrong-subject",
  "low-quality",
  "other",
];

// User roles
const USER_ROLES = {
  STUDENT: "student",
  ADMIN: "admin",
};

// Group roles
const GROUP_ROLES = {
  MEMBER: "member",
  MODERATOR: "moderator",
  ADMIN: "admin",
};

// Common Indian colleges/universities
const POPULAR_COLLEGES = [
  "IIT Delhi",
  "IIT Bombay",
  "IIT Madras",
  "IIT Kanpur",
  "IIT Kharagpur",
  "IIT Roorkee",
  "IIT Guwahati",
  "IIT Hyderabad",
  "NIT Trichy",
  "NIT Warangal",
  "NIT Surathkal",
  "NIT Calicut",
  "BITS Pilani",
  "IIIT Hyderabad",
  "IIIT Delhi",
  "Delhi University",
  "Mumbai University",
  "Pune University",
  "Anna University",
  "VTU Belgaum",
  "JNTU Hyderabad",
  "AKTU Lucknow",
  "RGPV Bhopal",
  "PTU Jalandhar",
  "BPUT Bhubaneswar",
  "WBUT Kolkata",
  "MAKAUT West Bengal",
  "Manipal University",
  "SRM University",
  "VIT Vellore",
  "Amity University",
  "LPU Punjab",
  "Chandigarh University",
  "Lovely Professional University",
];

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};

// API Rate limits
const RATE_LIMITS = {
  UPLOAD: 5, // 5 uploads per hour
  DOWNLOAD: 50, // 50 downloads per hour
  SEARCH: 100, // 100 searches per hour
  COMMENT: 20, // 20 comments per hour
  LIKE: 100, // 100 likes per hour
};

module.exports = {
  SUBJECTS,
  SEMESTERS,
  COURSES,
  ALLOWED_FILE_TYPES,
  FILE_SIZE_LIMITS,
  QUALITY_LEVELS,
  TRUST_RANKINGS,
  TRUST_SCORE_THRESHOLDS,
  POINTS,
  REPORT_REASONS,
  USER_ROLES,
  GROUP_ROLES,
  POPULAR_COLLEGES,
  PAGINATION,
  RATE_LIMITS,
};
