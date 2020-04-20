const express = require("express");
const { protect, roleProtect } = require("../middlewares/auth");
const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brands");

const router = express.Router();

router.route("/").get(getBrands).post(protect, createBrand);

router
  .route("/:id")
  .get(getBrand)
  .put(protect, roleProtect("admin"), updateBrand)
  .delete(protect, roleProtect("admin"), deleteBrand);

module.exports = router;
