const Orders = require("../models/Orders");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const Promotion = require("../models/Promotions");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

const moment = require("moment");

module.exports.getOders = (req, res) => {
  try {
    Orders.find({}, (err, orders) => {
      if (orders) {
        return res.json({
          message: "success",
          data: orders,
        });
      } else {
        return res.json({
          message: "orders is empty",
          data: [],
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
          data: order,
        });
      } else {
        return res.json({
          message: " Oder not found",
        });
      }
    });
  } catch (error) {
    return new ErrorResponse("", 404);
  }
};

module.exports.Create0der = async (req, res) => {
  try {
    let users = [];
    let cart = await Cart.findOne({ user: req.user._id });

    console.log(cart);
    let x = cart.products;

    if (cart.products.length == 0) {
      console.log("fhijfhfifh");
      return res.status(403).json({
        success: false,
        message: "cart is empty, can't create order",
      });
    } else {
      let productIds = [];
      let amount = {};
      cart.products.map((product) => {
        productIds.push(product.product);
        amount[product.product] = product.amount;
      });
      const products = await Product.find({ _id: { $in: productIds } });
      let total = 0;
      products.map((product) => {
        total +=
          amount[product._id] *
          (product.price - (product.discount / 100) * product.price);
      });

      //console.log("1 ", total)
      if (req.body.giftCode) {
        const promotion = await Promotion.findOne({
          giftCode: req.body.giftCode,
        });
        if (promotion) {
          users = promotion.users;
          let y = promotion.users.find((x) => (x._id = req.user._id));

          if (y) {
            return res.status(403).json({
              success: false,
              message: "gift code is used",
            });
          } else {
            if (moment(promotion.expirationDate).diff(moment(), "s") <= 0) {
              return res.status(403).json({
                success: false,
                message: "gift code out of date",
              });
            } else {
              if (promotion.conditionsOfParticipation < total) {
                if (promotion.skind == "discount") {
                  if (total * (promotion.value / 100) >= promotion.maximum) {
                    total -= promotion.maximum;
                  } else {
                    total -= total * (promotion.value / 100);
                  }
                  users.push(req.user._id);
                }
              } else {
                total -= promotion.value;
                users.push(req.user._id);
              }
            }
          }
          console.log("3 ", total);
        } else {
          return res.status(403).json({
            success: false,
            message: "gift code is not exist",
          });
        }
        await Promotion.findOneAndUpdate(
          { giftCode: req.body.giftCode },
          { users: users }
        );
      }
      console.log(1, req.user._id);
      console.log(2, cart.products);
      console.log(3, total);
      console.log(4, req.body);
      await User.findByIdAndUpdate(
        req.user.id,
        { phone: req.body.phone, address: req.body.address },
        {
          new: true,
          // runValidators: true,
        }
      );
      await Orders.create({
        user: req.user._id,
        products: cart.products,
        totalPrice: total,
        payment: req.body.payment,

        dateOrder: Date.now(),
      });
      await Cart.findOneAndUpdate({ user: req.user.id }, { products: [] });
      return res.status(200).json({ success: true, data: cart, total });
    }
  } catch (error) {
    res.json({ error: error });
  }
};

// @des Update category
// @route PUT /api/categories/:id
// @access  Admin
exports.updateOrder = asyncHandler(async (req, res, next) => {
  let order = await Orders.findById(req.params.id);
  console.log(req.body);
  if (!order) return next(new ErrorResponse("Order not found", 404));

  console.log(req.body);

  order = await Orders.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  });

  return res.status(200).json({ success: true, data: order });
});

// @des Delete Order
// @route Delete /api/order/:id
// @access  Private
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Orders.findById(req.params.id);

  if (order.user != req.user.id && req.user.role != "admin") {
    return new ErrorResponse(`You can not access this route`, 403);
  }
  console.log("con cac");

  await Orders.findByIdAndRemove(req.params.id);

  return res.status(200).json({ success: true, data: [] });
});

module.exports.confirmOder = () => {};
