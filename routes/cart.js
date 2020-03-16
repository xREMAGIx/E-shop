const express = require("express");
const {
  viewCart,
  addToCart,
  decreaseCart,
  deleteCart,
  DeleteItemFromCart,
  checkOutCart
} = require("../controllers/cart");

const { protect, roleProtect } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(protect, viewCart)
  .delete(protect, deleteCart)
  .put(protect, checkOutCart);
router
  .route("/:productId")
  .put(protect, addToCart)
  .patch(protect, decreaseCart)
  .delete(protect, DeleteItemFromCart);

module.exports = router;
