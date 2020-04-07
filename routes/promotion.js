const express = require("express");
const { protect, roleProtect } = require("../middlewares/auth");
const router = express.Router();
const { createPromotion, getPromotions, getPromotion, updatePromotion, deletePromotion } = require('../controllers/promotion');

router.route('/')
    .get(protect, roleProtect("admin"), getPromotions)
    .post(protect, roleProtect("admin"), createPromotion)

router.route('/:discountCode')
    .get(protect, roleProtect("admin"), getPromotion)
    .put(protect, roleProtect("admin"), updatePromotion)
    .delete(protect, roleProtect("admin"), deletePromotion)
module.exports = router;
