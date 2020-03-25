const Orders = require("../models/Orders");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");
module.exports.getOders = (req, res) => {
  try {
    Orders.find({}, (err, orders) => {
      if (orders) {
        return res.json({
          message: "success",
          data: orders
        });
      } else {
        return res.json({
          message: "orders is empty",
          data: []
        });
      }
    });
  } catch (error) {
    res.sendStatus(404);
  }
};
module.exports.getOder = (req, res) => {
  try {
    Orders.findById(req.params.id, (err, order) => {
      if (order) {
        return res.json({
          message: "success",
          order: order
        });
      } else {
        return res.json({
          message: " product  not found"
        });
      }
    });
  } catch (error) {
    return new ErrorResponse("", 404)
  }
};

module.exports.Create0der = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    cart = JSON.parse(JSON.stringify(cart));
    let productIds = [];
    let amount = {};
    cart.products.map(product => {
      productIds.push(product.product);
      amount[product.product] = product.amount;
    });
    const products = await Product.find({ _id: { $in: productIds } });
    let total = 0;
    products.map(product => {
      console.log(total);
      total += amount[product._id] * (product.price - product.discount / 100 * product.price);
    });
    cart.products = [];
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { products: cart.products }
    );
    return res.status(200).json({ success: true, data: cart, total });
  } catch (error) {
    res.sendStatus(404);
  }
};
module.exports.confirmOder = () => { };
