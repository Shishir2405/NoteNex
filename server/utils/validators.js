const Joi = require("joi");

// User registration validation
const validateRegister = (data) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
      "string.alphanum": "Username must contain only letters and numbers",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username cannot exceed 30 characters",
      "any.required": "Username is required",
    }),

    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),

    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),

    fullName: Joi.string().min(2).max(50).required().messages({
      "string.min": "Full name must be at least 2 characters long",
      "string.max": "Full name cannot exceed 50 characters",
      "any.required": "Full name is required",
    }),

    college: Joi.string().min(2).max(100).required().messages({
      "string.min": "College name must be at least 2 characters long",
      "string.max": "College name cannot exceed 100 characters",
      "any.required": "College is required",
    }),

    course: Joi.string().min(2).max(50).required().messages({
      "string.min": "Course must be at least 2 characters long",
      "string.max": "Course cannot exceed 50 characters",
      "any.required": "Course is required",
    }),

    semester: Joi.string().required().messages({
      "any.required": "Semester is required",
    }),
  });

  return schema.validate(data);
};

// User login validation
const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),

    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  });

  return schema.validate(data);
};

// Note upload validation
const validateNoteUpload = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
      "string.min": "Title must be at least 3 characters long",
      "string.max": "Title cannot exceed 100 characters",
      "any.required": "Title is required",
    }),

    description: Joi.string().max(500).allow("").messages({
      "string.max": "Description cannot exceed 500 characters",
    }),

    subject: Joi.string().required().messages({
      "any.required": "Subject is required",
    }),

    semester: Joi.string().required().messages({
      "any.required": "Semester is required",
    }),

    course: Joi.string().required().messages({
      "any.required": "Course is required",
    }),

    college: Joi.string().required().messages({
      "any.required": "College is required",
    }),

    tags: Joi.array().items(Joi.string().max(30)).max(10).messages({
      "array.max": "Maximum 10 tags allowed",
      "string.max": "Each tag cannot exceed 30 characters",
    }),

    topics: Joi.array().items(Joi.string().max(50)).max(10).messages({
      "array.max": "Maximum 10 topics allowed",
      "string.max": "Each topic cannot exceed 50 characters",
    }),

    isPremium: Joi.boolean().default(false),

    price: Joi.number()
      .min(0)
      .max(500)
      .when("isPremium", {
        is: true,
        then: Joi.required(),
        otherwise: Joi.default(0),
      })
      .messages({
        "number.min": "Price cannot be negative",
        "number.max": "Price cannot exceed ₹500",
        "any.required": "Price is required for premium notes",
      }),
  });

  return schema.validate(data);
};

// Comment validation
const validateComment = (data) => {
  const schema = Joi.object({
    comment: Joi.string().min(1).max(300).required().messages({
      "string.min": "Comment cannot be empty",
      "string.max": "Comment cannot exceed 300 characters",
      "any.required": "Comment is required",
    }),
  });

  return schema.validate(data);
};

// Report validation
const validateReport = (data) => {
  const schema = Joi.object({
    reason: Joi.string()
      .valid(
        "spam",
        "inappropriate",
        "copyright",
        "wrong-subject",
        "low-quality",
        "other"
      )
      .required()
      .messages({
        "any.only": "Invalid report reason",
        "any.required": "Report reason is required",
      }),

    description: Joi.string()
      .max(200)
      .when("reason", {
        is: "other",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .messages({
        "string.max": "Description cannot exceed 200 characters",
        "any.required": 'Description is required when reason is "other"',
      }),
  });

  return schema.validate(data);
};

// Study group validation
const validateStudyGroup = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
      "string.min": "Group name must be at least 3 characters long",
      "string.max": "Group name cannot exceed 50 characters",
      "any.required": "Group name is required",
    }),

    description: Joi.string().max(200).allow("").messages({
      "string.max": "Description cannot exceed 200 characters",
    }),

    subject: Joi.string().required().messages({
      "any.required": "Subject is required",
    }),

    college: Joi.string().required().messages({
      "any.required": "College is required",
    }),

    isPrivate: Joi.boolean().default(false),

    maxMembers: Joi.number().min(2).max(100).default(50).messages({
      "number.min": "Group must allow at least 2 members",
      "number.max": "Group cannot exceed 100 members",
    }),
  });

  return schema.validate(data);
};

module.exports = {
  validateRegister,
  validateLogin,
  validateNoteUpload,
  validateComment,
  validateReport,
  validateStudyGroup,
};
