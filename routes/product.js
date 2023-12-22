const express = require("express");
const router = express.Router();
const { Product, validate, upload } = require("../models/product");
const auth = require("../middleware/auth");
const path = require("path");
const ExcelJS = require("exceljs");
const fs = require("fs");

router.post("/", upload.single("attachmentFile"), async (req, res) => {
  try {
    const uploadedFile = req.file;

    if (!uploadedFile) {
      return res.status(400).send("Please upload an image using 'attachmentFile' field.");
    }

    const attachmentFileUrl = `${req.protocol}://${req.get("host")}/uploads/${uploadedFile.filename}`;

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

router.delete("/:id", auth, async (req, res) => {
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
