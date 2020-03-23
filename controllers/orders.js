const Orders = require("../models/Orders");
const Carts = require("../models/Cart");
const Products = require("../models/Product");

module.exports.getOders = (req, res) => {
    try {
        Orders.find({}, (err, orders) => {
            if (sorder) {
                return res.json({
                    message: "success",
                    order: orders
                });
            } else {
                return res.json({
                    message: "orders is empty"
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
        res.sendStatus(404);
    }
};
module.exports.Create0der = (req, res) => {
    Carts.findOne({ user: req.user._id }, (err, cart) => {
        if (err) {
            return res.json({
                message: " cart  not found"
            });
        } else {
            let totalprice = totalprice || 0;
            cart.products.forEach(x => {
                Products.findOne({ _id: x.product }, (err, product) => {
                    if (err) {
                        throw err;
                    } else {
                        totalprice += x.amount * product.price;
                    }
                });
            });
            const today = new Date();
            Orders.create({
                user: req.user._id,
                products: cart.products,
                totalprice: totalprice,
                payMent: req.query.payment,
                dateOrder: Date.parse(
                    today.getFullYear() +
                    "-" +
                    (today.getMonth() + 1) +
                    "-" +
                    today.getDate() +
                    "  " +
                    today.getHours() +
                    ":" +
                    today.getMinutes() +
                    ":" +
                    today.getSeconds()
                )
            }).then(order => {
                if (order) {
                    return res.json({
                        message: "sucess",
                        order: order
                    })
                }
            })
        }
    });
};
module.exports.confirmOder = () => { };
