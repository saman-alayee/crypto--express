const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const _ = require("lodash");
const auth = require("../middleware/auth");


// ... (your existing imports and code)

/**
 * @swagger
 * /charge:
 *   post:
 *     summary: Charge user's wallet
 *     tags: [Wallet]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 required: true
 *     responses:
 *       200:
 *         description: Wallet charged successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 newBalance:
 *                   type: number
 *       400:
 *         description: Bad request or invalid amount
 *       500:
 *         description: Internal server error
 */

// Charge user's wallet
// ...

// Charge user's wallet
router.post("/", auth, async (req, res) => {
    try {
      const userId = req.userId;
      const { amount } = req.body;
  
      // Validate the amount
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).send("Invalid amount. Please provide a positive number.");
      }
  
      // Find the user
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send("User not found.");
      }
  
      // Update user's wallet balance
      user.wallet += amount;  // Updated the property name here
      const newBalance = user.wallet;
  
      // Save the updated user
      await user.save();
  
      res.json({ userId, newBalance });
    } catch (error) {
      console.error("Error during wallet charging:", error);
      res.status(500).send("An error occurred while charging the wallet.");
    }
  });
  
  // ...
  
  
  // ... (your existing routes)
  
  module.exports = router;