const mongoose = require("mongoose");
const Orders_schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  payment: {
    type: String,
    required: true,
  },
  dateOrder: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "shipping", "completed", "cancelled"],
    default: "pending",
  },
});
module.exports = mongoose.model("orders", Orders_schema);
