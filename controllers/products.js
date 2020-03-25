const path = require("path");
const Product = require("../models/Product");
const Image = require("../models/Image");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const fs = require("fs");

// @des Get all products
// @route GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const perPage = 10;
  const page = parseInt(req.query.pages, 10);
  const products = await Product.find().populate("images", "path");
  let maxPage = (products.length % perPage == 0) ? products.length / perPage : products.length % perPage + 1;
  let newProducts = products.slice((page - 1) * 10, page * perPage - 1)
  res.status(200).json({
    success: true,
    data: newProducts,
    page: parseInt(req.query.pages, 10),
    maxPage: maxPage
  });
});

// @des Get product
// @route GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("images", "path");

  if (!product) {
    return next(new ErrorResponse(`Error`, 404));
  }
  res.status(200).json({ success: true, data: product });
});

// @des Create new product
// @route POST /api/products
// @access  Private
exports.createProduct = asyncHandler(async (req, res, next) => {
  console.log(req.body);

  const product = await Product.create(req.body);

  res.status(200).json({ success: true, data: product });
});

// @des Update Product
// @route PUT /api/product/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) {
    return next(new ErrorResponse(`Error`, 404));
  }

  res.status(200).json({ success: true, data: product });
});

// @des Delete product
// @route DELETE /api/products/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Error`, 500));
  }

  // Delete all Image
  const images = await Image.find({ product: product._id });
  // Remove Image
  console.log(images);
  images.forEach(image => {
    console.log("image " + image);
    fs.unlink(`${process.env.FILE_UPLOAD_PATH}/${image.path}`, function (err) {
      console.log(err);
    });
  });

  // Delete Image in database
  await Image.deleteMany({ product: product._id });

  res.status(200).json({ success: true, data: product });
});

// @des Upload photo for Product
// @route PUT /api/products/:id/image
// @access  Private
exports.productImageUpload = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Error`, 404));
  }

  const file = req.files.image
  // Create custom filename
  const image = await Image.create({
    user: req.user.id,
    product: req.params.id
  });

  file.name = `photo_${image._id}${path.parse(file.name).ext}`;
  image.path = file.name;
  await image.save();
  console.log(file.name);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      // Delete Image
      image.remove();
      return next(new ErrorResponse(`Problem with file upload`, 404));
    }

    const updatedProduct = await Product.findById(req.params.id).populate(
      "images"
    );

    res.status(200).json({ success: true, data: updatedProduct });
  });
});
