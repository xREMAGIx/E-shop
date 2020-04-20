const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const Category = require("../models/Category");

// @des View all Categories
// @route GET /api/categories/
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();

  return res.status(200).json({ success: true, data: categories });
});

// @des Get one Category
// @route POST /api/categories/:id
// @access  Private
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate(
    "products",
    "productName"
  );

  if (!category) return next(new ErrorResponse("Resource not found", 404));

  return res.status(200).json({ success: true, data: category });
});

// @des Create category
// @route POST /api/categories/
// @access  Admin
exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);

  return res.status(200).json({ success: true, data: category });
});

// @des Update category
// @route PUT /api/categories/:id
// @access  Admin
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) return next(new ErrorResponse("Category not found", 404));

  category = await Category.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  });

  return res.status(200).json({ success: true, data: category });
});

// @des Delete Category
// @route Delete /api/categories/:id
// @access  Admin
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndRemove(req.params.id);

  return res.status(200).json({ success: true, data: [] });
});
