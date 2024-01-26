const express = require("express");
const router = express.Router();
const { Product, validate, upload } = require("../models/product");
const auth = require("../middleware/auth");
const path = require("path");
const ExcelJS = require("exceljs");
const fs = require("fs");

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: API endpoints for managing products
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         price:
 *           type: string
 *         shortDescription:
 *           type: string
 *         description:
 *           type: string
 *         attachmentFile:
 *           type: string
 *       required:
 *         - name
 *         - category
 *         - price
 *         - shortDescription
 *         - description
 *         - attachmentFile
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               description:
 *                 type: string
 *               attachmentFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request or missing image file
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get details of a specific product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */


router.post("/", upload.single("attachmentFile"), async (req, res) => {
  try {
    const uploadedFile = req.file;

    if (!uploadedFile) {
      return res.status(400).send("Please upload an image using 'attachmentFile' field.");
    }

    const attachmentFileUrl = `${req.protocol}://${req.get("host")}/uploads/products/${uploadedFile.filename}`;

    // Extract additional fields from the request body
    const { name, category, price, shortDescription, description } = req.body;

    const product = new Product({
      name,
      category,
      price,
      shortDescription,
      description,
      attachmentFile: attachmentFileUrl,
    });

    await product.save();
    res.status(201).send(product);
  } catch (error) {
    console.error("Error during product creation:", error);
    res.status(500).send("An error occurred while creating the product.");
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("An error occurred while fetching products.");
  }
});

router.delete("/:id",  async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).send("Product with the given ID was not found.");
    }

    if (product.attachmentFile) {
      const filePath = path.join(__dirname, "../uploads", path.basename(product.attachmentFile));
      fs.unlinkSync(filePath);
    }

    await Product.findByIdAndRemove(req.params.id);

    res.send(product);
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("An error occurred while deleting the product.");
  }
});
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send("Product with the given ID was not found.");
    }

    res.status(200).send(product);
  } catch (error) {
    console.error("Error fetching the product:", error);
    res.status(500).send("An error occurred while fetching the product.");
  }
});

module.exports = router;
