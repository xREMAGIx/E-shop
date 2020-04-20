const mongoose = require("mongoose");
const fs = require("fs");

const Image = require("./Image");
const ProductSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    productName: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    size: [
      {
        type: String,
      },
    ],
    description: String,
    createAt: {
      type: Date,
      default: Date.now,
    },
    sold: {
      type: Number,
      default: 0,
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

ProductSchema.virtual("images", {
  ref: "Image",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

ProductSchema.pre("remove", async () => {
  const images = await Image.find({ product: this._id });
  // Remove Image
  images.forEach((image) => {
    fs.unlink(`${process.env.FILE_UPLOAD_PATH}/${image._id}`, function (err) {
      console.log(err);
    });
  });

  // Delete Image in database
  await Image.deleteMany({ product: this._id });
});

module.exports = mongoose.model("Product", ProductSchema);
