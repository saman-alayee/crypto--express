const Joi = require("joi");
const mongoose = require("mongoose");
const multer = require("multer"); // Add Multer

// Define storage for image uploads using Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/Shelters"); // Specify the directory where uploaded files will be stored
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
  

const Shelter = mongoose.model(
  "Shelter",
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        maxlength: 250,
      },
      address: {
        type: String,
        required: true,
        maxlength: 500,
      },
      phone: {
        type: String,
        required: true,
        maxlength: 255,
      },
      doctorName: {
        type: String,
        required: true,
        maxlength: 255,
      },
      shortDescription: {
        type: String,
        required: false,
        maxlength: 1024,
      },
      doctorDescription: {
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

function validateShelter(shelter) {
  const schema = Joi.object({
    name: Joi.string().max(250).required(),
    address: Joi.string().max(500).required(),
    phone: Joi.string().max(255).required(),
    shortDescription: Joi.string().max(1024).required(),
    doctorName: Joi.string().max(255).required(),
    doctorDescription: Joi.string().max(255).required(),
    attachmentFile: Joi.string().uri().required(),
    // Add validation for the image file
  });
  const result = schema.validate(shelter);
  return result;
}

exports.Shelter = Shelter;
exports.validate = validateShelter;
exports.upload = upload; // Export the Multer uploazd middleware
