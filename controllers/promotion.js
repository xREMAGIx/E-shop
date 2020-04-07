const Promotion = require('../models/Promotions');
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");


module.exports.createPromotion = asyncHandler(async (req, res) => {
    const { giftCode, name, skind, value, maximum, conditionsOfParticipation, expirationDate } = req.body;
    const promotion = await Promotion.findOne({ giftCode: giftCode });
    if (promotion) {
        return res.status(403).json({
            success: false,
            message: "discount code is existed"
        })
    } else {
        if (skind == "discount") {
            if (!maximum) {
                return res.status(403).json({
                    success: false,
                    message: "Maximum is required"
                })
            }
            if (value) {
                if (value <= 0 || value >= 100) {
                    return res.status(403).json({
                        success: false,
                        message: "value not suitable - truthy=>  0  <  value  <  100"
                    })
                }
            }
        }
        if (skind == "cash") {
            if (value) {
                if (maximum !== value) {
                    return res.status(403).json({
                        status: "warning",
                        message: "maxium must equal  " + value
                    })
                }
            }
        }
        Promotion.create(req.body).then(data => {
            res.status(200).json({
                success: true
            })
        }).catch(reason => res.send(reason))
    }
})

module.exports.getPromotions = asyncHandler(async (req, res) => {
    const promotions = await Promotion.find({});
    if (promotions) {
        res.status(200).json({
            success: true,
            data: promotions
        })
    } else {
        res.status(200).json({
            success: true,
            message: "nothing yet"
        })
    }
})

module.exports.updatePromotion = asyncHandler(async (req, res) => {
    const updated = await Promotion.findOneAndUpdate({ giftCode: req.params.giftCode }, req.body);
    if (updated) {
        res.status(200).json({
            success: true
        })
    }
})

module.exports.getPromotion = asyncHandler(async (req, res) => {
    const promotion = await Promotion.findOne({ giftCode: req.params.giftCode });
    if (promotion) {
        res.status(200).json({
            success: true,
            data: promotion
        })
    }
})

module.exports.deletePromotion = asyncHandler(async (req, res) => {
    const deleted = await Promotion.findOneAndDelete({ giftCode: req.params.giftCode })
    if (deleted) {
        res.status(200).json({
            success: true
        })
    }
})

