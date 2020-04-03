const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productImageUpload,
  productsFilter
} = require("../controllers/products");

const { protect, roleProtect } = require("../middlewares/auth");
const checkImage = require('../middlewares/file');

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  // .post(protect, roleProtect("admin"), createProduct);
  .post(createProduct);
router
  .route("/:id?")
  .get(getProduct)
  .put(protect, roleProtect("admin"), updateProduct)
  .delete(protect, roleProtect("admin"), deleteProduct);

router
  .route("/:id/image")
  .put(checkImage.imageUpload, protect, roleProtect("admin"), productImageUpload)
  .post(checkImage.imageUpload, protect, roleProtect("admin"), productImageUpload);


router.get("/filter/by", productsFilter);
module.exports = router;
