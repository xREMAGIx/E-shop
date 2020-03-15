const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true
  },
  productName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: "no-image.jpg"
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Product", ProductSchema);
