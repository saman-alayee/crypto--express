const express = require("express");
const router = express.Router();
const { UserHash } = require("../models/userHash");

router.post("/", async (req, res) => {
  const { name, email, password, salt } = req.body;

  try {
    // Check if the userHash already exists by email
    const existingUserHash = await UserHash.findOne({ email });

    if (existingUserHash) {
      // If the userHash already exists, return an error message
      return res.status(400).send({ message: "UserHash already exists!" });
    }

    // Create a new userHash with name, email, password, and salt
    const newUserHash = new UserHash({
      name,
      email,
      password,
      salt,
    });

    // Save the userHash to the database
    await newUserHash.save();
    res.send({
        message: "UserHash created successfully!",
        userHash: {
          name: newUserHash.name,
          email: newUserHash.email,
          password: newUserHash.password,
          salt: newUserHash.salt
        }
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.get("/", async (req, res) => {
    const userHash = await UserHash.find().sort("name");
    res.send(userHash);
  });
  
module.exports = router;
