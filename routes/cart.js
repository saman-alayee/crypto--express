const { Cart, validate } = require("../models/cart");
const { Product } = require("../models/product"); // Import the Product model
const { User } = require("../models/user");

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API endpoints for managing the shopping cart
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         productId:
 *           type: string
 *         quantity:
 *           type: integer
 *       required:
 *         - productId
 *         - quantity
 *     CartItemResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         productId:
 *           type: string
 *         quantity:
 *           type: integer
 *       required:
 *         - _id
 *         - productId
 *         - quantity
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get all items in the cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       200:
 *         description: Item added to the cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItemResponse'
 *       400:
 *         description: Bad request or invalid product ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Delete an item from the cart by ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart item to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItemResponse'
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cart/{id}:
 *   get:
 *     summary: Get details of a specific item in the cart by ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart item to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItemResponse'
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Delete all items from the cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       404:
 *         description: No cart items found to delete
 *       500:
 *         description: Internal server error
 */

// Get all items in the cart
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const cartItems = await Cart.find({ userId }).sort("name");
    res.send(cartItems);
  } catch (error) {
    console.error("Error during fetching cart items:", error);
    res.status(500).send("An error occurred while fetching cart items.");
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { productId, quantity } = req.body;

    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).send("Product with the given ID was not found.");
    }

    const existingCartItem = await Cart.findOne({ productId });
    const existingUser = await User.findById(userId);
    const totalPrice = quantity * existingProduct.price;



    if (existingUser.wallet < totalPrice) {
      return res.status(400).send("Insufficient funds in the wallet.");
    }

    // Deduct the amount from the wallet
    existingUser.wallet -= totalPrice;
    await existingUser.save();

    const cartItem = new Cart({
      userId,
      productId,
      quantity,
      totalPrice,
    });

    const savedCartItem = await cartItem.save();

    res.send(savedCartItem);
  } 
  catch (error) {
    console.error("Error during cart item creation:", error);
    res.status(500).send("An error occurred while creating the cart item.");
  }
});


// Delete an item from the cart
router.delete("/:id", auth, async (req, res) => {
  try {
    const cartItem = await Cart.findByIdAndRemove(req.params.id);

    if (!cartItem) {
      return res.status(404).send("Cart item with the given ID was not found.");
    }

    res.send(cartItem);
  } catch (error) {
    return res
      .status(500)
      .send("An error occurred while deleting the cart item.");
  }
});

// Get details of a specific item in the cart



module.exports = router;
