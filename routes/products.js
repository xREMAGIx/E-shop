const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productImageUpload,
  productsFilter,
  deleteProductImages,
  deleteProductImage,
  getRatings
} = require("../controllers/products");

const { protect, roleProtect } = require("../middlewares/auth");
const checkImage = require("../middlewares/file");
const advancedResults = require("../middlewares/advancedResults");

const Product = require("../models/Product");

const router = express.Router();

router
  .route("/")
  .get(advancedResults(Product, ""), getProducts)
  .post(protect, roleProtect("admin"), createProduct);

router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);
router.route("/:id/ratings").get(getRatings);
router
  .route("/:id/image")
  .post(
    checkImage.imageUpload,
    protect,
    roleProtect("admin"),
    productImageUpload
  )
  .put(productImageUpload)
  .delete(deleteProductImages);

router.route("/:id/image/:imageId").delete(deleteProductImage);

router.get("/filter/by", productsFilter);
module.exports = router;
