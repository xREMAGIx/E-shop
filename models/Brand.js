const mongoose = require("mongoose");
const Product = require("./Product");

const BrandSchema = new mongoose.Schema(
  {
    name: String,
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: 1296000, // 15days
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

BrandSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "brand",
  justOne: false,
});

BrandSchema.pre("remove", async () => {
  // Delete Product in database
  await Product.deleteMany({ brand: this._id });
});

module.exports = mongoose.model("Brand", BrandSchema);
