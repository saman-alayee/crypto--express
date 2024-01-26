const Joi = require("joi");
const mongoose = require("mongoose");

const Cart = mongoose.model(
  "Cart",
  new mongoose.Schema({
    userId: {
      type: String,
      required: true,
      maxlength: 100,
    },
    productId: {
      type: String,
      required: true,
      maxlength: 100,
    },
    quantity: {
        type: Number, // Change the type to Number for an integer
        required: true,
        max: 255, // Update max to 255 if you have a specific limit
      },
    
  },{timestamps:true},
  )
);

function validateCart(cart) {
  const schema = Joi.object({
    productId: Joi.string().max(100).required(),
    quantity: Joi.number().required(), // Change to number type in Joi
    
  });
  const result = schema.validate(cart);
  return result;
}

exports.Cart = Cart;
exports.validate = validateCart;
