const Orders = require("../models/Orders");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Promotion = require("../models/Promotions");
const ErrorResponse = require("../utils/errorResponse");
const moment = require('moment');
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
					order: order,
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
		cart = JSON.parse(JSON.stringify(cart));
		let productIds = [];
		let amount = {};
		cart.products.map((product) => {
			productIds.push(product.product);
			amount[product.product] = product.amount;
		});
		const products = await Product.find({ _id: { $in: productIds } });
		let total = 0;
		products.map((product) => {
			total += amount[product._id] * (product.price - (product.discount / 100) * product.price);
		});

		//console.log("1 ", total)
		const promotion = await Promotion.findOne({ giftCode: req.body.giftCode });
		if (promotion) {
			//console.log("2 ", promotion)
			if (promotion.users.find(x => x == req.user._id)) {
				//	console.log("6 ", total)
				return res.status(403).json({
					success: false,
					message: "gift code is used"
				});
			} else {
				if (moment(promotion.expirationDate).diff(moment(), "s") <= 0) {
					return res.status(403).json({
						success: false,
						message: "gift code out of date"
					});
				} else {
					if (promotion.conditionsOfParticipation < total) {
						if (promotion.skind == "discount") {
							if (total * (promotion.value / 100) >= promotion.maximum) {
								total -= promotion.maximum
							} else {
								total -= total * (promotion.value / 100);
							}
							users.push(req.user._id)
						}
					} else {
						total -= promotion.value;
						users.push(req.user._id)
					}
				}
			}
			console.log("3 ", total)
		} else {
			return res.status(403).json({
				success: false,
				message: "gift code is not exist"
			});
		}
		await Orders.create({
			user: req.user._id,
			products: cart.products,
			totalPrice: total,
			payment: req.body.payment,
			dateOrder: Date.now()
		})
		await Cart.findOneAndUpdate(
			{ user: req.user.id },
			{ products: [] }
		);

		await Promotion.findOneAndUpdate(
			{ giftCode: req.body.giftCode },
			{ users: users }
		);
		return res.status(200).json({ success: true, data: cart, total });
	} catch (error) {

		res.json({ abc: error });
	}
};
module.exports.confirmOder = () => { };
