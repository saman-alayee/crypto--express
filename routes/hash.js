const express = require("express");
const router = express.Router();
const { UserHash } = require("../models/userHash");
const { generateSaltAndChallenge } = require("../models/hash");

router.post("/", async (req, res) => {
  const { email } = req.body;

  // Check if email exists in UserHash table
  const userHash = await UserHash.findOne({ email });

  if (userHash) {
    // If email exists in UserHash table, generate a random salt and challenge
    const { salt, challenge } = generateSaltAndChallenge(8);
    return res.send({ exist: true, salt: userHash.salt, challenge });
  } else {
    // If email doesn't exist in UserHash table, generate a new salt and return an empty challenge
    const { salt } = generateSaltAndChallenge();
    return res.send({ exist: false, salt, challenge: "" });
  }
});

module.exports = router;
