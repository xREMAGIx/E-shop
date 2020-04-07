const Product = require("../models/Product");
const asyncHandler = require("../middlewares/async");
const moment = require("moment");

module.exports.filterProductsByCategogy = asyncHandler(async cate => {
  const list = await Product.find({ category: cate });
  return list;
});

module.exports.filterProductsByPrice = asyncHandler(async (from, to) => {
  const list = await Product.find({
    price: {
      $gte: from,
      $lte: to
    }
  });
  return list;
});

module.exports.filterProductsByNewest = asyncHandler(async () => {
  const list = await Product.find({
    createAt: { $gte: moment().subtract(10, "day") }
  });
  return list;
});

module.exports.filterProductsByBestSold = asyncHandler(async () => {
  const list = await Product.find({ sold: { $gte: 50 } })
    .sort({ sold: -1 })
    .limit(50);
  return list;
});

module.exports.filterProductsByCategogyAndPrice = asyncHandler(
  async (cate, from, to) => {
    const list = await Product.find({
      category: cate,
      price: {
        $gte: from,
        $lte: to
      }
    });
    return list;
  }
);

module.exports.filterProductsByCategogyAndBestSold = asyncHandler(
  async (cate, from, to) => {
    const list = await Product.find({
      category: cate,
      sold: { $gte: 50 }
    })
      .sort({ sold: -1 })
      .limit(50);
    return list;
  }
);

module.exports.filterProductsByGreatDiscounts = asyncHandler(
  async (cate, from, to) => {
    const list = await Product.find({
      discount: { $gte: 50 }
    });
    return list;
  }
);
