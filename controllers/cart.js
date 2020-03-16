const crypto = require("crypto");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const Product = require("../models/Product");

// @des View Cart
// @route GET /api/cart/
// @access  Private
exports.viewCart = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const cart = user.cart;

  return res.status(200).json({ success: true, data: cart });
});

// @des Add to Cart
// @route PUT /api/cart/:productId
// @access  Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  let cart = user.cart;

  const productId = req.params.productId;
  let exits = false;

  cart.products.map(product => {
    if (product.productId.equals(productId)) {
      product.amount++;
      exits = true;
      return;
    }
  });

  if (exits == false) {
    const product = await Product.findById(productId);

    if (!product) return next(new ErrorResponse("Product not found", 404));

    const { sku, productName, category, price, discount, image } = product;
    cart.products.push({
      productId,
      amount: 1,
      sku,
      productName,
      category,
      price,
      discount,
      image
    });
  }

  user.cart = cart;

  await user.save();

  return res.status(200).json({ success: true, data: cart });
});

// @des Decresing from Cart
// @route Patch /api/cart/:productId
// @access  Private
exports.decreaseCart = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  let cart = user.cart;

  const productId = req.params.productId;

  cart.products.map(product => {
    if (product.productId.equals(productId)) {
      product.amount--;
      return;
    }
  });
  cart = cart.products.filter(product => product.amount > 0);
  user.cart = cart;

  await user.save();

  return res.status(200).json({ success: true, data: cart });
});

// @des Delete from Cart
// @route Delete /api/cart/:productId
// @access  Private
exports.DeleteItemFromCart = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  let cart = user.cart;

  cart = cart.products.filter(
    product => product.productId != req.params.productId
  );

  user.cart = cart;

  await user.save();

  return res.status(200).json({ success: true, data: cart });
});

// @des Delete Cart
// @route Delete /api/cart/
// @access  Private
exports.deleteCart = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  user.cart = [];

  await user.save();

  return res.status(200).json({ success: true, data: user.cart });
});

// @des Check out Cart
// @route Put /api/cart/
// @access  Private
exports.deleteCart = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  cart = user.cart = [];

  await user.save();

  return res.status(200).json({ success: true, data: user.cart });
});

// @des Check out Cart
// @route Put /api/cart/
// @access  Private
exports.checkOutCart = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  let total = 0;

  user.cart.products.map(product => {
    total +=
      product.amount * (product.price - product.price * product.discount);
  });

  user.cart = [];

  await user.save();

  return res.status(200).json({ success: true, data: user.cart, total });
});
