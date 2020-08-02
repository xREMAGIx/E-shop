const Product = require("../models/Product");
const Rating = require("../models/Rating");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");

// @des Create new product
// @route POST /api/ratings
// @access  Private
exports.createRating = asyncHandler(async (req, res, next) => {
  // create rating
  let { content, isAnonymous, point, productID } = req.body

  const product = await Product.findById(productID)

  // remove old rating
  await Rating.deleteMany({ product, user: req.user })

  let rating = new Rating(
    {
      user: req.user,
      name: req.user.name,
      email: req.user.email,
      product,
      isAnonymous,
      content,
      point,
    }
  )

  await rating.save()

  // if rating create success, update rating product
  const results = await Rating.aggregate([
    {
      $match: { product: product._id }
    },
    { "$unwind": "$product" },
    {
      "$group": {
        "_id": "$product",
        "ratingAvg": { "$avg": "$point" },
        "ratingCount": { "$sum": 1 }
      }
    }
  ])

  const result = results[0]

  await Product.findOneAndUpdate({ _id: productID }, { ratingAvg: result.ratingAvg, ratingCount: result.ratingCount }, { new: true })

  res.status(200).json({ success: true, data: rating });
});


// @des Create new product
// @route POST /api/ratings/:id/replies
// @access  Private
exports.createReply = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(200).json({ success: true, data: product });
});
