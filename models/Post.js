const mongoose = require("mongoose");
const Image = require("../models/Image");

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    content: {
      type: String,
      minlength: [5, "Contain must have at least 5 charaters"],
    },
    title: {
      type: String,
      minlength: [5, "Title must have at least 5 charaters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

PostSchema.virtual("images", {
  ref: "Image",
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

PostSchema.pre("save", () => {
  this.updatedAt = Date.now;
});

PostSchema.pre("remove", async () => {
  await Image.findByIdAndDelete({ post: this._id });
});
module.exports = mongoose.model("Post", PostSchema);
