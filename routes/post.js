const express = require("express");
const { protect } = require("../middlewares/auth");
const {
  getPost,
  getPosts,
  getUserPost,
  updatePost,
  deletePost,
  createPost
} = require("../controllers/post");

const router = express.Router();

router
  .route("/")
  .get(getPosts)
  .post(protect, createPost);

router
  .route("/:id")
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.route("/user/:userId").get(getUserPost);

module.exports = router;
