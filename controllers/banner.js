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

  console.log("1" + banner);
  if (!banner) {
    banner = await Banner.create({});
  }

  console.log("2 " + banner);

  console.log(1);
  // Check single file
  const image = Array.isArray(req.files.image)
    ? req.files.image[0]
    : req.files.image;

  console.log(2);
  // Check Image file
  if (!image.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload a image file`, 400));
  }
  console.log(3);

  // Check filesize
  if (image.size > process.env.MAX_FILE_UPLOAD)
    return next(
      new ErrorResponse(
        `Please upload a image file less than ${process.env.MAX_FILE_UPLOAD}`,
        404
      )
    );

  console.log(4);
  image.mv(`${process.env.FILE_UPLOAD_PATH}/${banner.path}`, async (err) => {
    if (err) {
      console.error(err);
      // Delete Image
      return next(new ErrorResponse(`Problem with file upload`, 404));
    }
  });
  console.log(5);

  return res.status(200).json({ success: true, data: banner });
});

// @des Get Banner
// @route get /api/banner
// @access
exports.getBanner = asyncHandler(async (req, res, next) => {
  const banner = Banner.findOne();

  return res.status(200).json({ success: true, data: banner });
});
