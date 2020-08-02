const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  isAnonymous: { type: Boolean, default: false },
  name: { type: String },
  email: { type: String },
  content: { type: String },
  point: { type: Number, default: 5 },
  createdAt: { type: Date, require: true, default: Date.now },
});

module.exports = mongoose.model("Rating", RatingSchema);
