const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  confirmEmail
} = require("../controllers/auth");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.get("/confirm-email/:confirmToken", confirmEmail);

module.exports = router;
