const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productImageUpload
} = require("../controllers/products");

const { protect, roleProtect } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(protect, roleProtect("admin"), createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(protect, roleProtect("admin"), updateProduct)
  .delete(protect, roleProtect("admin"), deleteProduct);

router
  .route("/:id/image")
  .put(protect, roleProtect("admin"), productImageUpload)
  .post(protect, roleProtect("admin"), productImageUpload);

module.exports = router;
