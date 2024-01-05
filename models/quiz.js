const Joi = require("joi");
const mongoose = require("mongoose");

const Blog = mongoose.model(
  "Blog",
  new mongoose.Schema({
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
  },{timestamps:true},
  )
);

function validateBlog(blog) {
  const schema = Joi.object({
    title: Joi.string().max(100).required(),
    image: Joi.string().max(255).required(),
    author: Joi.string().max(20).required(),
    description: Joi.string().max(850).required(),
    type:Joi.string().max(20).required()
  });
  const result = schema.validate(blog);
  return result;
}

exports.Blog = Blog;
exports.validate = validateBlog;
