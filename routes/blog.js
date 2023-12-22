const { Blog, validate } = require("../models/blog");
const express = require("express");
const nodemailer = require("nodemailer"); // Don't forget to require nodemailer
const router = express.Router();
const ExcelJS = require("exceljs");
const path = require("path");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort("name");
  res.send(blogs);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Create a new Blog instance
  let blog = new Blog({
    // Set properties based on the blog body
    title: req.body.title,
    image: req.body.image,
    author: req.body.author,
    description: req.body.description,
    type: req.body.type,
  });

  // Save the new blog to the database
  blog = await blog.save();

  // Send the newly created blog as the response
  res.send(blog);
});
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find the blog by ID and delete it
    const blog = await Blog.findByIdAndRemove(req.params.id);

    if (!blog) {
      return res.status(404).send("blog with the given ID was not found.");
    }

    res.send(blog);
  } catch (error) {
    return res
      .status(500)
      .send("An error occurred while deleting the blog.");
  }
});

// ... (previous imports and code)

router.get("/:id", async (req, res) => {
  try {
    // Find the blog by ID
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).send("blog with the given ID was not found.");
    }

    res.send(blog);
  } catch (error) {
    return res.status(500).send("An error occurred while fetching the blog.");
  }
});

// Delete all blogs
router.delete("/", auth, async (req, res) => {
  try {
    // Delete all blogs
    const result = await blog.deleteMany();

    if (result.deletedCount === 0) {
      return res.status(404).send("No blogs found to delete.");
    }

    res.send(`Deleted ${result.deletedCount} blogs.`);
  } catch (error) {
    return res.status(500).send("An error occurred while deleting blogs.");
  }
});

module.exports = router;
