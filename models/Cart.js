const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
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
