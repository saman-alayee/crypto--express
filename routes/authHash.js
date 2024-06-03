const express = require("express");
const router = express.Router();
const md5 = require("blueimp-md5");
const { AuthHash, validate } = require("../models/authHash");
const { UserHash } = require("../models/userHash");

router.post("/", async (req, res) => {
  const { email, password, challenge, name } = req.body;

  // Validate the input data
  const { error } = validate({ email, password, challenge, name });
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // Retrieve the user from the database using the email
    const userHash = await UserHash.findOne({ email });

    if (!userHash) {
      // If user does not exist, send an error response with the hashed password from the request
      const hashedPassword = md5(password + challenge);
      return res.status(400).send({ hashed: hashedPassword, message: "Invalid email or password" });
    }

    // Combine the user's password with the challenge and hash it using md5
    const serverHashedPassword = md5(userHash.password + challenge);

    // Compare the hashed value with the client's hashed password
    if (serverHashedPassword === password) {
      // If they match, send a success response
      return res.send({ message: "Login successful" });
    } else {
      // If they don't match, send an error response with the server hashed password
      return res.status(400).send({ hashed: serverHashedPassword, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).send({
      message: "An error occurred during login",
      error: error.message,
    });
  }
});

module.exports = router;
