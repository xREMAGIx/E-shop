const express = require("express");
const { protect, roleProtect } = require("../middlewares/auth");
const { UploadBanner } = require("../controllers/banner");
const { imageUpload } = require("../middlewares/file");
const router = express.Router();

router.route("/").put(protect, roleProtect("admin"), imageUpload, UploadBanner);

module.exports = router;
