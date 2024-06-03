const mongoose = require("mongoose");
const Joi = require("joi");

const authHashSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  challenge: {
    type: String,
    required: true,
  },
});

const AuthHash = mongoose.model("AuthHash", authHashSchema);

function validateAuthHash(authHash) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    challenge: Joi.string().required(),
  });
  return schema.validate(authHash);
}

module.exports = {
  AuthHash,
  validate: validateAuthHash,
};
