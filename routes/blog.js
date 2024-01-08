const { Blog, validate, upload } = require("../models/blog");
const express = require("express");
const nodemailer = require("nodemailer"); // Don't forget to require nodemailer
const router = express.Router();
const ExcelJS = require("exceljs");
const path = require("path");
const auth = require("../middleware/auth");


/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: API endpoints for managing blogs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         image:
 *           type: string
 *         author:
 *           type: string
 *         type:
 *           type: string
 *         description:
 *           type: string
 *       required:
 *         - title
 *         - image
 *         - author
 *         - type
 *         - description
 */

/**
 * @swagger
 * /blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 */

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               author:
 *                 type: string
 *               type:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete a blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the blog to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get a blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the blog to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /blogs:
 *   delete:
 *     summary: Delete all blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       404:
 *         description: No blogs found to delete
 *       500:
 *         description: Internal server error
 */


router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort("name");
  res.send(blogs);
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const uploadedFile = req.file;

    if (!uploadedFile) {
      return res
        .status(400)
        .send("Please upload an image using 'image' field.");
    }

    const attachmentFileUrl = `${req.protocol}://${req.get("host")}/uploads/${
      uploadedFile.filename
    }`;

    // Extract additional fields from the request body
    const { title, type, author, description } = req.body;

    const blog = new Blog({
      title,
      type,
      author,
      description,
      image: attachmentFileUrl,
    });

    await blog.save();
    res.status(201).send(blog);
  } catch (error) {
    console.error("Error during blog creation:", error);
    res.status(500).send("An error occurred while creating the blog.");
  }
});
router.delete("/:id", async (req, res) => {
  try {
    // Find the blog by ID and delete it
    const blog = await Blog.findByIdAndRemove(req.params.id);

    if (!blog) {
      return res.status(404).send("blog with the given ID was not found.");
    }

    res.send(blog);
  } catch (error) {
    return res.status(500).send("An error occurred while deleting the blog.");
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
router.delete("/", async (req, res) => {
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
