const mongoose = require("mongoose");
const Joi = require("joi");


const userHashSchema = new mongoose.Schema(
  {
    name:{
      type:String,  
      required: true,

    },
    email: {
      type: String,
      required: true,
        },

    password: {
      type: String,
      required: true,

    },
    salt: {
        type: String,
        required: true,
      },
  },
);

const UserHash = mongoose.model("UserHash", userHashSchema);

function validateUserHash(userHash) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    salt: Joi.string().required(),

  });
  const result = schema.validate(userHash);
  console.log(result);
  return result;
}

exports.UserHash = UserHash;
exports.validate = validateUserHash;
