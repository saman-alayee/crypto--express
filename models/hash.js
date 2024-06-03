const Joi = require("joi");
const mongoose = require("mongoose");

const hashSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: false,
  },
  challenge: {
    type: String,
    required: true,
  },
});

const Hash = mongoose.model("Hash", hashSchema);

function validateEmail(req) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate(req);
}

function generateSalt(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let salt = '';
  for (let i = 0; i < length; i++) {
    salt += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return salt;
}

function generateChallenge(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let challenge = '';
  for (let i = 0; i < length; i++) {
    challenge += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return challenge;
}

function generateSaltAndChallenge() {
  const salt = generateSalt();
  const challenge = generateChallenge();
  return { salt, challenge };
}

module.exports = {
  Hash,
  validateEmail,
  generateSaltAndChallenge,
};
