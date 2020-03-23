const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const mongoose = require("mongoose");
const Post = require("../models/Post");

// @des View all Post
// @route GET /api/posts/
// @access  Private
exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = Post.find().populate("Image");

  return res.status(200).json({ success: true, data: posts });
});

// @des Get one Post
// @route POST /api/posts/:id
// @access  Private
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = Post.findById(req.params.id).populate("Image");

  if (!post) return next(new ErrorResponse("Resource not found", 404));

  return res.status(200).json({ success: true, data: post });
});

// @des Get user's post
// @route GET /api/posts/:userId
// @access  Private
exports.getUserPost = asyncHandler(async (req, res, next) => {
  const posts = Post.find({ user: req.params.userId }).populate("Image");

  return res.status(200).json({ success: true, data: posts });
});

// @des Create post
// @route POST /api/posts/
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
  const { title, content } = req.body;
  const post = Post.create({ user: req.user.id, title, content });

  return res.status(200).json({ success: true, data: post });
});

// @des Update Post
// @route PUT /api/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  const post = Post.findById(req.params.id);

  if (post.user != req.user.id && req.user.role != "admin") {
    return new ErrorResponse(`You can not access this route`, 403);
  }

  await Post.findOneAndUpdate({ _id: req.params.id }, req.body);

  return res.status(200).json({ success: true, data: post });
});

// @des Delete Post
// @route Delete /api/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = Post.findById(req.params.id);

  if (post.user != req.user.id && req.user.role != "admin") {
    return new ErrorResponse(`You can not access this route`, 403);
  }

  await post.remove();

  return res.status(200).json({ success: true, data: [] });
});
