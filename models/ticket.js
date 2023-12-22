const Joi = require("joi");
const mongoose = require("mongoose");
const multer = require("multer"); // Add Multer

// Define storage for image uploads using Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename for each uploaded file
  },
});
function generateTicketNumber() {
  // const prefix = "TICKET"; // You can change this prefix as needed
  const randomNumber = Math.floor(Math.random() * 10000000); // Generate a random number
  const ticketNumber = `${randomNumber}`; // Combine the prefix and random number
  return ticketNumber;
}
const upload = multer({ storage: storage });

const Ticket = mongoose.model(
  "Ticket",
  new mongoose.Schema(
    {
      fullName: {
        type: String,
        required: true,
        maxlength: 20,
      },
      email: {
        type: String,
        required: true,
        maxlength: 100,
      },
      company: {
        type: String,
        required: true,
        maxlength: 50,
      },
      licenseCode: {
        type: String,
        required: true,
        maxlength: 255,
      },
      problemType: {
        type: String,
        required: true,
        maxlength: 30,
      },
      errorTime: {
        type: String,
        required: true,
        maxlength: 255,
      },
      ticketNumber: {
        type: String,
        default: generateTicketNumber, // Generate a ticket number when creating a new ticket
        unique: true, // Ensure uniqueness of ticket numbers
      },
      request: {
        type: String,
        required: true,
        maxlength: 255,
      },
      requestTitle: {
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

function validateTicket(ticket) {
  const schema = Joi.object({
    fullName: Joi.string().max(20).required(),
    email: Joi.string().email().max(100).required(),
    company: Joi.string().max(50).required(),
    licenseCode: Joi.string().max(255).required(),
    problemType: Joi.string().max(30).required(),
    errorTime: Joi.string().max(255).required(),
    request: Joi.string().max(255).required(),
    requestTitle: Joi.string().max(255).required(),
    attachmentFile: Joi.string().max(500).required(),
    // Add validation for the image file
  });
  const result = schema.validate(ticket);
  return result;
}


exports.Ticket = Ticket;
exports.validate = validateTicket;
exports.upload = upload; // Export the Multer uploazd middleware
