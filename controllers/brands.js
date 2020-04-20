const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const Brand = require("../models/Brand");

// @des View all Barnds
// @route GET /api/brands/
// @access  Public
exports.getBrands = asyncHandler(async (req, res, next) => {
  const brands = await Brand.find();

  return res.status(200).json({ success: true, data: brands });
});

// @des Get one Brand
// @route POST /api/brands/:id
// @access  Private
exports.getBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id).populate(
    "products",
    "productName"
  );

  if (!brand) return next(new ErrorResponse("Resource not found", 404));

  return res.status(200).json({ success: true, data: brand });
});

// @des Create brand
// @route POST /api/brands/
// @access  Admin
exports.createBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.create(req.body);

  return res.status(200).json({ success: true, data: brand });
});

// @des Update brand
// @route PUT /api/brands/:id
// @access  Admin
exports.updateBrand = asyncHandler(async (req, res, next) => {
  let brand = await Brand.findById(req.params.id);

  if (!brand) return next(new ErrorResponse("Brand not found", 404));

  brand = await Brand.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  });

  return res.status(200).json({ success: true, data: brand });
});

// @des Delete Brand
// @route Delete /api/brands/:id
// @access  Admin
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  await Brand.findByIdAndRemove(req.params.id);

  return res.status(200).json({ success: true, data: [] });
});
