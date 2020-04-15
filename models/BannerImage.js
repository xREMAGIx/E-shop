const mongoose = require("mongoose");

const BannerImageSchama = new mongoose.Schema({
  path: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BannerImage", BannerImageSchama);
