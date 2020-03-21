const crypto = require("crypto");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// @des View Cart
// @route GET /api/cart/
// @access  Private

const createCart = async user => {
  let cart = await Cart.findOne({ user: user });
  if (!cart) cart = Cart.create({ user: user });
  return cart;
};
exports.viewCart = asyncHandler(async (req, res, next) => {
  console.log("userID: ", req.user.id);
  let cart = req.session.cart;

  if (!cart) cart = await createCart(req.user);

  await Cart.findOneAndUpdate(
    { user: req.user.id },
    { products: cart.products }
  );

  return res.status(200).json({ success: true, data: cart });
});

// @des Add to Cart
// @route PUT /api/cart/:productId
// @access  Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  console.log("User' cart: ", req.session.cart);
  let cart = req.session.cart;

  if (!cart) cart = await createCart(req.user);

  console.log(cart);

  const productId = req.params.productId;
  let exits = false;

  cart.products.map(product => {
    console.log(product._id);
    if (product.product === productId) {
      product.amount++;
      exits = true;
      return;
    }
  });

  if (exits === false) {
    const product = await Product.findById(productId);

    console.log("Add to cart");
    console.log(cart.products);

    if (!product) return next(new ErrorResponse("Product not found", 404));

    req.session.cart = cart;

    req.session.cart.products.push({
      product: productId,
      amount: 1
    });

    console.log(cart.products);
    console.log("ahihi");
  }

  cart.createdAt = Date.now();

  req.session.cart = cart;

  return res.status(200).json({ success: true, data: cart });
});

// @des Decresing from Cart
// @route Patch /api/cart/:productId
// @access  Private
exports.decreaseCart = asyncHandler(async (req, res, next) => {
  let cart = req.session.cart;

  if (!cart) cart = await createCart(req.user);

  cart = JSON.parse(JSON.stringify(cart));

  const productId = req.params.productId;

  cart.products.map(product => {
    if (product.product === productId && product.amount >= 1) {
      product.amount--;
      return;
    }
  });

  let products = cart.products;

  products = products.filter(a => a.amount > 0);

  cart.products = cart.products.filter(product => {
    console.log(product.amount > 0);
    product.amount > 0;
  });

  cart.products = products;
  cart.createdAt = Date.now();

  req.session.cart = cart;

  return res.status(200).json({ success: true, data: cart });
});

// @des Delete from Cart
// @route Delete /api/cart/:productId
// @access  Private
exports.DeleteItemFromCart = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) cart = await Cart.create({ user: req.user.id });

  cart = JSON.parse(JSON.stringify(cart));

  products = cart.products;

  console.log(products);

  products = products.filter(
    product => product.product != req.params.productId
  );

  cart.createdAt = Date.now();

  await Cart.findOneAndUpdate(
    { user: req.user.id },
    { products: products, createdAt: Date.now() }
  );

  cart.products = products;

  req.session.cart = cart;

  return res.status(200).json({ success: true, data: req.session.cart });
});

// @des Delete Cart
// @route Delete /api/cart/
// @access  Private
exports.deleteCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) cart = await Cart.create({ user: req.user.id });

  cart.products = [];
  await cart.save();

  return res.status(200).json({ success: true, data: cart });
});

// @des Check out Cart
// @route Put /api/cart/
// @access  Private
exports.checkOutCart = asyncHandler(async (req, res, next) => {
  let cart = req.session.cart;

  let productIds = [];
  let amount = {};
  cart.products.map(product => {
    productIds.push(product.productId);
    amount[product.productId] = product.amount;
  });

  const products = await Product.find({ _id: { $in: productIds } });

  // Create hash amount
  let total = 0;

  products.map(product => (total += amount[product._id] * product.price));
  cart.products = [];

  await Cart.findOneAndUpdate(
    { user: req.user.id },
    { products: cart.products }
  );

  return res.status(200).json({ success: true, data: cart, total });
});

// @des Save out Cart
// @route Post /api/cart/
// @access  Private
exports.saveCart = asyncHandler(async (req, res, next) => {
  let cart = req.session.cart;

  if (!cart) {
    return res.status(200).json({ success: true, data: cart });
  }

  await Cart.findOneAndUpdate(
    { user: req.user.id },
    { products: cart.products }
  );

  return res.status(200).json({ success: true, data: cart });
});
