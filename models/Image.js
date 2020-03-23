const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  path: {
    type: String,
    default: "no-image.jpg"
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Image", ImageSchema);
