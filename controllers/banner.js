const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const Banner = require("../models/Banner");
const BannerImage = require("../models/BannerImage");
const path = require("path");

const fs = require("fs");

// @des Get current banner
// @route Get /api/banner/current
// @access All
exports.getCurrentBanner = asyncHandler(async (req, res, next) => {
  console.log(1);
  let banner = await Banner.findOne();

  console.log(2);
  if (!banner) {
    banner = await Banner.create({});
  }

  console.log(3);
  return res.status(200).json({ success: true, data: banner });
});

// @des Update Banner
// @route Put /api/banner
// @access  Admin
exports.UploadBanner = asyncHandler(async (req, res, next) => {
  let banner = await Banner.findOne();

  if (!banner) {
    banner = await Banner.create({});
  }

  // Check single file
  const image = Array.isArray(req.files.image)
    ? req.files.image[0]
    : req.files.image;

  let bannerImage = new BannerImage();
  // Check Image file
  if (!image.mimetype.startsWith("image")) {
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

  bannerImage.path = `banner_${bannerImage._id}.jpg`;
  image.mv(
    `${process.env.FILE_UPLOAD_PATH}/${bannerImage.path}`,
    async (err) => {
      if (err) {
        console.error(err);
        // Delete Image
        return next(new ErrorResponse(`Problem with file upload`, 404));
      }
    }
  );

  await bannerImage.save();

  let updatedBanner = await Banner.findOne();

  updatedBanner.path = bannerImage.path;

  await updatedBanner.save();

  return res.status(200).json({ success: true, data: updatedBanner });
});

// @des Get Banner
// @route get /api/banner
// @access
exports.getAllBanners = asyncHandler(async (req, res, next) => {
  const banners = await BannerImage.find();

  return res.status(200).json({ success: true, data: banners });
});

// @des Delete Banner
// @route delete /api/banner/:id
// @access
exports.deleteBanner = asyncHandler(async (req, res, next) => {
  const banner = await BannerImage.findByIdAndDelete(req.params.id);

  if (!banner) return next(new ErrorResponse("Banner not found", 404));

  return res.status(200).json({
    success: true,
    data: banner,
  });
});

// @des Update Banner
// @route put /api/banner/:id
// @access

exports.updateBanner = asyncHandler(async (req, res, next) => {
  const bannerImage = await BannerImage.findById(req.params.id);

  if (!bannerImage) return next(new ErrorResponse("Banner not found", 404));

  let banner = await Banner.findOne();

  banner.path = bannerImage.path;

  await banner.save();

  return res.status(200).json({
    success: true,
    data: banner,
  });
});

// @des Get Banner by id
// @route get /api/banner/:id
// @access Admin

exports.getBannerById = asyncHandler(async (req, res, next) => {
  console.log(1);
  const banner = await BannerImage.findById(req.params.id);

  if (!banner) return next(new ErrorResponse("Banner not found", 404));

  return res.status(200).json({
    success: true,
    data: banner,
  });
});
