// Image upload

exports.imageUpload = async (req, res, next) => {
  try {
    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.image;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`Please upload a image file`, 400));
    }
    console.log(2);
    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD)
      return next(
        new ErrorResponse(
          `Please upload a image file less than ${process.env.MAX_FILE_UPLOAD}`,
          404
        )
      );

    next();
  } catch (error) {
    return res.status(400).json({ success: false });
  }
};
