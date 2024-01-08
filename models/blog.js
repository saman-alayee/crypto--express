const Joi = require("joi");
const mongoose = require("mongoose");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename for each uploaded file
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB file size limit, adjust as needed
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed."));
    }
  },
});

const Blog = mongoose.model(
  "Blog",
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        maxlength: 100,
      },
      image: {
        type: String,
        required: true,
        maxlength: 255,
      },
      author: {
        type: String,
        required: true,
        maxlength: 20,
      },
      type: {
        type: String,
        required: true,
        maxlength: 20,
      },
      description: {
        type: String,
        required: true,
        maxlength: 850,
      },
    },
    { timestamps: true }
  )
);

function validateBlog(blog) {
  const schema = Joi.object({
    title: Joi.string().max(100).required(),
    image: Joi.string().uri().required(),
    author: Joi.string().max(20).required(),
    description: Joi.string().max(850).required(),
    type: Joi.string().max(20).required(),
  });
  const result = schema.validate(blog);
  return result;
}

exports.Blog = Blog;
exports.validate = validateBlog;
exports.upload = upload; // Export the Multer uploazd middleware
