const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// @des Upload image
// @route POST /api/user/image
// @access  Private
exports.userImageUpload = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload a image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD)
    return next(
      new ErrorResponse(
        `Please upload a image file less than ${process.env.MAX_FILE_UPLOAD}`,
        404
      )
    );

  // Create custom filename
  const image = await Image.create({
    user: req.user.id
  });
  file.name = `photo_${image._id}${path.parse(file.name).ext}`;
  image.path = file.name;
  console.log(file.name);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);

      await image.remove();
      return next(new ErrorResponse(`Problem with file upload`, 404));
    }
    await image.save();
    res.status(200).json({ success: true, data: image });
  });
});

// @des Upload Avatar
// @route POST /api/user/avatar
// @access  Private
exports.userAvatarUpload = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload a image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD)
    return next(
      new ErrorResponse(
        `Please upload a image file less than ${process.env.MAX_FILE_UPLOAD}`,
        404
      )
    );

  // Create custom filename
  const image = await Image.create({
    user: req.user.id
  });
  image.path = file.name;
  file.name = `photo_${product._id}${path.parse(file.name).ext}`;
  console.log(file.name);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);

      await image.remove();

      return next(new ErrorResponse(`Problem with file upload`, 404));
    }

    await image.save();

    const user = User.findById(req.user.id);

    user.avatar = file.name;

    await user.save();
    res.status(200).json({ success: true, data: user });
  });
});

// @des Change Avatar
// @route Put /api/user/avatar/:id
// @access  Private
exports.changeAvatar = asyncHandler(async (req, res, next) => {
  const image = Image.find({ user: req.user.id, _id: req.params.id });

  if (!image) return next(new ErrorResponse("Image not found", 404));

  const user = User.findById(req.user.id);

  user.avatar = file.image.path;

  await user.save();
  res.status(200).json({ success: true, data: user });
});
