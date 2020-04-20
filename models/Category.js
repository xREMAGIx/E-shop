const mongoose = require("mongoose");
const Product = require("./Product");

const CategorySchema = new mongoose.Schema(
  {
    name: String,
    createdAt: {
      type: Date,
      default: Date.now(),
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

CategorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
  justOne: false,
});

CategorySchema.pre("remove", async () => {
  // Delete Product in database
  await Product.deleteMany({ category: this._id });
});

module.exports = mongoose.model("Category", CategorySchema);
