const Joi = require("joi");
const mongoose = require("mongoose");
const multer = require("multer"); // Add Multer

// Define storage for image uploads using Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products"); // Specify the directory where uploaded files will be stored
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

const Product = mongoose.model(
  "Product",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        maxlength: 100,
      },
      category: {
        type: String,
        required: true,
        maxlength: 50,
      },
      price: {
        type: String,
        required: true,
        maxlength: 255,
      },
      shortDescription: {
        type: String,
        required: false,
        maxlength: 1024,
      },

      description: {
        type: String,
        required: true,
        maxlength: 255,
      },
      // Add a field to store the image file path
      attachmentFile: {
        type: String,
        required: true,
        maxlength: 255,
      },
    },
    { timestamps: true }
  )
);

function validateProduct(product) {
  const schema = Joi.object({
    name: Joi.string().max(100).required(),
    category: Joi.string().max(50).required(),
    price: Joi.string().max(255).required(),
    shortDescription: Joi.string().max(1024).required(),
    description: Joi.string().max(255).required(),
    attachmentFile: Joi.string().uri().required(),
    // Add validation for the image file
  });
  const result = schema.validate(product);
  return result;
}

exports.Product = Product;
exports.validate = validateProduct;
exports.upload = upload; // Export the Multer uploazd middleware
