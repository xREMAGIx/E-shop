const express = require("express");

const {
  userImageUpload,
  userAvatarUpload,
  changeAvatar
} = require("../controllers/user");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/image").post(protect, userImageUpload);
router.route("/avatar").post(protect, userAvatarUpload);
router.route("/avatar/:id").put(protect, changeAvatar);
module.exports = router;
