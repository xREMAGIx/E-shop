const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const Post = require("../models/Post");
const Image = require("../models/Image");
const path = require("path");

// @des View all Post
// @route GET /api/posts/
// @access  Private
exports.getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().populate("images");

  return res.status(200).json({ success: true, data: posts });
});

// @des Get one Post
// @route POST /api/posts/:id
// @access  Private
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate("Image");

  if (!post) return next(new ErrorResponse("Resource not found", 404));

  return res.status(200).json({ success: true, data: post });
});

// @des Get user's post
// @route GET /api/posts/:userId
// @access  Private
exports.getUserPost = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({ user: req.params.userId }).populate("Image");

  return res.status(200).json({ success: true, data: posts });
});

// @des Create post
// @route POST /api/posts/
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
  const { title, content } = req.body;
  const post = await Post.create({ user: req.user.id, title, content });

  return res.status(200).json({ success: true, data: post });
});

// @des Update Post
// @route PUT /api/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

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
  const post = await Post.findById(req.params.id);

  if (post.user != req.user.id && req.user.role != "admin") {
    return new ErrorResponse(`You can not access this route`, 403);
  }
  console.log("con cac");

  await Post.findByIdAndRemove(req.params.id);

  return res.status(200).json({ success: true, data: [] });
});

// @des Upload photo for Post
// @route PUT /api/products/:id/image
// @access  Private
exports.postImageUpload = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  console.log(4);
  if (!post) {
    return next(new ErrorResponse(`Error`, 404));
  }

  // Create custom filename
  const image = await Image.create({
    user: req.user.id,
    post: req.params.id,
  });

  const file = req.files.file;

  file.name = `photo_${image._id}${path.parse(file.name).ext}`;
  image.path = file.name;
  await image.save();
  console.log(file.name);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      // Delete Image
      image.remove();
      return next(new ErrorResponse(`Problem with file upload`, 404));
    }

    const updatedPost = await Post.findById(req.params.id).populate("images");

    res.status(200).json({ success: true, data: updatedPost });
  });
});
