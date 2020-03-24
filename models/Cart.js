const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
      },
      price: {
        type: Number,
        required: true
      },
      discount: {
        type: Number,
        required: true
      },
      amount: Number
    }
  ],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 1296000 // 15days
  }
});

module.exports = mongoose.model("Cart", CartSchema);
