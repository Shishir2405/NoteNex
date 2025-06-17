const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration for notes (PDFs, documents)
const notesStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "studyshare/notes",
    allowed_formats: ["pdf", "doc", "docx", "txt", "jpg", "jpeg", "png"],
    resource_type: "auto",
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.split(".")[0];
      return `${originalName}_${timestamp}`;
    },
  },
});

// Storage configuration for user avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "studyshare/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [
      { width: 200, height: 200, crop: "fill", gravity: "face" },
    ],
    public_id: (req, file) => {
      return `avatar_${req.user.id}_${Date.now()}`;
    },
  },
});

// Multer upload configurations
const uploadNotes = multer({
  storage: notesStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, DOC, DOCX, TXT, and image files are allowed."
        ),
        false
      );
    }
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for avatars
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPG, JPEG, PNG, and GIF files are allowed for avatars."
        ),
        false
      );
    }
  },
});

// Helper function to delete files from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadNotes,
  uploadAvatar,
  deleteFromCloudinary,
};
