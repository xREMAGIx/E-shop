const Orders = require("../models/Orders");
const Carts = require("../models/cart");
const Products = require("../models/products");

module.exports.getOders = (req, res) => {
    try {
        Orders.find({}, (err, orders) => {
            if (orders) {
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
    try {
        Carts.findOne({ user: req.user._id }, (err, cart) => {
            if (err) {
                return res.json({
                    message: " cart  not found"
                });
            }
            if (cart) {
                let totalprice = 0;
                cart.products.forEach(async x => {
                    totalprice += x.quantity * (x.price - x.discount / 100 * x.price);
                })
                console.log(cart.products)
                const today = new Date();
                Orders.create({
                    user: req.user._id,
                    products: cart.products,
                    totalPrice: totalprice,
                    payMent: req.query.payment,
                    dateOrder: Date.parse(today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "  " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds())
                }).then(order => {
                    if (order) {
                        cart.remove();
                        return res.json({
                            message: "sucess",
                            order: order
                        })
                    }
                })
            } else {
                return res.json({
                    message: "cart  is empty , you can't create your orders"

                })
            }

        })
    } catch (error) {
        res.sendStatus(404);
    }

};
module.exports.confirmOder = () => { };
