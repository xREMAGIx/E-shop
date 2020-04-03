const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  confirmEmail,
  activeAccount,
  logout
} = require("../controllers/auth");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.get("/confirm-email/:confirmToken", confirmEmail);
router.post("/authentication", activeAccount);

module.exports = router;
