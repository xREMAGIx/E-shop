const express = require("express");
const { protect, roleProtect } = require("../middlewares/auth");
const {
  UploadBanner,
  getAllBanners,
  deleteBanner,
  updateBanner,
  getCurrentBanner,
  getBannerById,
} = require("../controllers/banner");
const { imageUpload } = require("../middlewares/file");
const router = express.Router();

router
  .route("/")
  .post(protect, roleProtect("admin"), UploadBanner)
  .get(getAllBanners);

router
  .route("/:id")
  .delete(protect, roleProtect("admin"), deleteBanner)
  .put(protect, roleProtect("admin"), updateBanner)
  .get(protect, roleProtect("admin"), getBannerById);

router.route("/current/banner").get(getCurrentBanner);

module.exports = router;
