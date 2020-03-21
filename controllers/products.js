const path = require("path");
const Product = require("../models/Product");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @des Get all products
// @route GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  res
    .status(200)
    .json({ success: true, count: products.length, data: products });
});

// @des Get product
// @route GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

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
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Error`, 500));
  }

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

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload a image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD)
    return next(
      new ErrorResponse(
        `Please upload a image file less than ${process.env.MAX_FILE_UPLOAD}`,
        404
      )
    );

  // Create custom filename
  file.name = `photo_${product._id}${path.parse(file.name).ext}`;

  console.log(file.name);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);

      return next(new ErrorResponse(`Problem with file upload`, 404));
    }

    const product = await Product.findByIdAndUpdate(req.params.id, {
      image: file.name
    });

    res.status(200).json({ success: true, data: product });
  });
});
