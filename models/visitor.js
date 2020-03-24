const mongoose = require("mongoose");
const today = new Date();
const Visitor_schema = new mongoose.Schema({
  ip: {
    type: String,
    unique: true,
    required: true
  },
  account: {
    type: String,
    required: true,
    default: "guest"
  },
  visitCount: {
    type: Number,
    required: true,
    default: 0
  },
  lastVisit: {
    type: Number,
    required: true,
    default: Date.parse(
      today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate() +
        "  " +
        today.getHours() +
        ":" +
        today.getMinutes() +
        ":" +
        today.getSeconds()
    )
  },
  online: {
    type: String,
    required: true,
    default: "false"
  }
});
module.exports = mongoose.model("Visitor", Visitor_schema);
