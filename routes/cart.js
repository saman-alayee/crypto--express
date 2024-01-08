const { Cart, validate } = require("../models/cart");
const { Product } = require("../models/product"); // Import the Product model
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Get all items in the cart
router.get("/", async (req, res) => {
  const cartItems = await Cart.find().sort("name");
  res.send(cartItems);
});

// Add an item to the cart
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { productId, quantity } = req.body;

    // Check if the product exists in the Product database
    const existingProduct = await Product.findById(productId);
    
    if (!existingProduct) {
      return res.status(404).send("Product with the given ID was not found.");
    }

    // Check if the product is already in the cart
    const existingCartItem = await Cart.findOne({ productId });

    if (existingCartItem) {
      // If the product already exists in the cart, update the quantity
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      res.send(existingCartItem);
    } else {
      // If the product doesn't exist in the cart, create a new cart item
      const cartItem = new Cart({
        productId,
        quantity,
      });

      // Save the new cart item to the database
      const savedCartItem = await cartItem.save();

      // Send the newly created cart item as the response
      res.send(savedCartItem);
    }
  } catch (error) {
    console.error("Error during cart item creation:", error);
    res.status(500).send("An error occurred while creating the cart item.");
  }
});

// Delete an item from the cart
router.delete("/:id", auth, async (req, res) => {
  try {
    // Find the cart item by ID and delete it
    const cartItem = await Cart.findByIdAndRemove(req.params.id);

    if (!cartItem) {
      return res.status(404).send("Cart item with the given ID was not found.");
    }

    res.send(cartItem);
  } catch (error) {
    return res.status(500).send("An error occurred while deleting the cart item.");
  }
});

// Get details of a specific item in the cart
router.get("/:id", async (req, res) => {
  try {
    // Find the cart item by ID
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).send("Cart item with the given ID was not found.");
    }

    res.send(cartItem);
  } catch (error) {
    return res.status(500).send("An error occurred while fetching the cart item.");
  }
});

// Delete all items from the cart
router.delete("/", auth, async (req, res) => {
  try {
    // Delete all cart items
    const result = await Cart.deleteMany();

    if (result.deletedCount === 0) {
      return res.status(404).send("No cart items found to delete.");
    }

    res.send(`Deleted ${result.deletedCount} cart items.`);
  } catch (error) {
    return res.status(500).send("An error occurred while deleting cart items.");
  }
});

module.exports = router;
