const path = require("path");
const Product = require("../models/Product");
const Image = require("../models/Image");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const Filter = require("../utils/productsFilter");
const fs = require("fs");

// @des Get all products
// @route GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const perPage = 10;
  const page = parseInt(req.query.pages, 10) || 1;
  const products = await Product.find().populate("images", "path");

  let maxPage =
    products.length % perPage == 0
      ? Math.ceil(products.length / perPage)
      : Math.floor(products.length / perPage) + 1;

  let newProducts = products.slice((page - 1) * 10, page * perPage - 1);
  res.status(200).json({
    success: true,
    data: newProducts,
    page: page,
    maxPage: maxPage,
  });
});

// @des Get product
// @route GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "images",
    "path"
  );

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

  console.log("COn cac");
  const product = await Product.create(req.body);

  res.status(200).json({ success: true, data: product });
});

// @des Update Product
// @route PUT /api/product/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
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

  images.forEach((image) => {
    console.log("image " + image);
    fs.unlink(`${process.env.FILE_UPLOAD_PATH}/${image.path}`, function (err) {
      console.log(err);
    });
  });

  // Delete Image in database
  await Image.deleteMany({ product: product._id });

  res.status(200).json({ success: true, data: product });
});

// @des Delete many Image in product
// @route DELETE /api/products/:id/image
// @access admin
exports.deleteProductImages = asyncHandler(async (req, res, next) => {
  const images = await Image.deleteMany({
    product: req.params.id,
    _id: { $in: req.body.ids },
  });

  if (!images)
    return next(new ErrorResponse("Image or Product not found", 404));

  // Remove Image

  images.forEach((image) => {
    console.log("image " + image);
    fs.unlink(`${process.env.FILE_UPLOAD_PATH}/${image.path}`, function (err) {
      console.log(err);
    });
  });

  const product = await Product.find(req.params.id);

  return res.status(200).json({ success: true, data: product });
});

// @des Delete one Image in product
// @route DELETE /api/products/:id/images/imageId
// @access admin
exports.deleteProductImage = asyncHandler(async (req, res, next) => {
  const image = await Image.deleteMany({
    product: req.params.id,
    _id: req.params.imageId,
  });

  if (!image) return next(new ErrorResponse("Image or Product not found", 404));

  // Remove Image

  fs.unlink(`${process.env.FILE_UPLOAD_PATH}/${image.path}`, function (err) {
    console.log(err);
  });

  const product = await Product.find(req.params.id).populate("images", "path");

  return res.status(200).json({ success: true, data: product });
});

// @des Upload photo for Product
// @route PUT /api/products/:id/image
// @access  Private
exports.productImageUpload = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Error`, 404));
  }

  console.log(req.files);
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  let files = [];

  Array.isArray(req.files.image) === false
    ? files.push(req.files.image)
    : (files = [...req.files.image]);

  for (let i = 0; i < files.length; i++) {
    // Make sure the image is a photo
    if (!files[i].mimetype.startsWith("image")) {
      console.log("MineType " + !files[i].mimetype);
      return next(new ErrorResponse(`Please upload a image file`, 400));
    }

    // Check filesize
    if (files[i].size > process.env.MAX_FILE_UPLOAD)
      return next(
        new ErrorResponse(
          `Please upload a image file less than ${process.env.MAX_FILE_UPLOAD}`,
          404
        )
      );
    console.log(3);
    // Create custom filename
    const image = await Image.create({
      //    user: req.user.id,
      product: req.params.id,
    });

    files[i].name = `photo_${image._id}${path.parse(files[i].name).ext}`;
    image.path = files[i].name;
    await image.save();

    files[i].mv(
      `${process.env.FILE_UPLOAD_PATH}/${files[i].name}`,
      async (err) => {
        if (err) {
          console.error(err);
          // Delete Image
          image.remove();
          return next(new ErrorResponse(`Problem with file upload`, 404));
        }
      }
    );
  }
  const updatedProduct = await Product.findById(req.params.id).populate(
    "images"
  );

  return res.status(200).json({ success: true, data: updatedProduct });
});

//  ----------------------------------------products  filter----------------------------------------------------------//

exports.productsFilter = asyncHandler((req, res) => {
  const {
    cate,
    sold,
    priceFrom,
    priceTo,
    createAt,
    greatDiscounts,
  } = req.query;

  if (cate) {
    Filter.filterProductsByCategogy(cate).then((list) => {
      res.json({
        success: true,
        data: list,
      });
    });
  } else if (priceFrom && priceTo) {
    const from = parseFloat(priceFrom, 10);
    const to = parseFloat(priceTo, 10);
    Filter.filterProductsByPrice(from, to).then((list) => {
      res.json({
        success: true,
        data: list,
      });
    });
  } else if (createAt) {
    Filter.filterProductsByNewest().then((list) => {
      res.json({
        success: true,
        data: list,
      });
    });
  } else if (sold) {
    Filter.filterProductsByBestSold().then((list) => {
      res.json({
        success: true,
        data: list,
      });
    });
  } else if (greatDiscounts) {
    Filter.filterProductsByGreatDiscounts().then((list) => {
      res.json({
        success: true,
        data: list,
      });
    });
  } else {
    res.json({
      success: false,
      data: [],
    });
  }
});
