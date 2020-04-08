const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const Banner = require("../models/Banner");
const path = require("path");

const fs = require("fs");
// @des Update Banner
// @route Put /api/banner
// @access  Admin
exports.UploadBanner = asyncHandler(async (req, res, next) => {
  let banner = await Banner.findOne();

  if (!banner) {
    banner = await Banner.create();
  }

  // Check single file
  const image = Array.isArray(req.files.image)
    ? req.files.image[0]
    : req.files.image;

  // Check Image file
  if (!image.startsWith("image")) {
    return next(new ErrorResponse(`Please upload a image file`, 400));
  }

  // Check filesize
  if (image.size > process.env.MAX_FILE_UPLOAD)
    return next(
      new ErrorResponse(
        `Please upload a image file less than ${process.env.MAX_FILE_UPLOAD}`,
        404
      )
    );

  image.mv(`${process.env.FILE_UPLOAD_PATH}/${banner.path}`, async (err) => {
    if (err) {
      console.error(err);
      // Delete Image
      return next(new ErrorResponse(`Problem with file upload`, 404));
    }
  });

  return res.status(200).json({ success: true, data: banner });
});
