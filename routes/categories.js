const express = require("express");
const { protect, roleProtect } = require("../middlewares/auth");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");

const router = express.Router();

router.route("/").get(getCategories).post(protect, createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(protect, roleProtect("admin"), updateCategory)
  .delete(protect, roleProtect("admin"), deleteCategory);

module.exports = router;
