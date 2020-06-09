const express = require("express");
const {
  viewCart,
  addToCart,
  decreaseCart,
  deleteCart,
  DeleteItemFromCart,
  checkOutCart,
  saveCart,
} = require("../controllers/cart");

const { protect } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(protect, viewCart)
  .delete(protect, deleteCart)
  .put(protect, checkOutCart)
  .post(protect, saveCart);

router
  .route("/:productId")
  .put(protect, addToCart)
  .patch(protect, decreaseCart)
  .delete(protect, DeleteItemFromCart);

module.exports = router;
