const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
  path: {
    type: String,
    default: "banner.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Banner", BannerSchema);
