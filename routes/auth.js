const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ status: "error", message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(400)
        .json({ status: "error", message: "Invalid email or password" });

    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatePassword)
      return res
        .status(400)
        .json({ status: "error", message: "Invalid email or password" });

    const accessToken = user.generateAuthToken();
    res.json({
      status: "success",
      token: accessToken,
      username: user.name,
      id: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(req);
}

module.exports = router;
