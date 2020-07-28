const advancedResults = (model, populate) => async (req, res, next) => {
  console.log(1);
  let query;

  // Create remove field
  let removeFields = [
    "select",
    "sort",
    "limit",
    "page",
    "checkInDate",
    "checkOutDate",
    "category",
    "search",
  ];

  // Copy req.query
  const reqQuery = { ...req.query };

  // Delete removeField from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Stringify req.query
  queryStr = JSON.stringify(reqQuery);

  // Change lte, gte, ... to $lte, $gte, ...
  queryStr = queryStr.replace(
    /\b(lt|lte|gt|gte|in)\b/g,
    (match) => `$${match}`
  );

  // Query
  console.log(2);
  query = model.find(JSON.parse(queryStr));

  // Select field
  if (req.query.select) {
    const field = req.query.select.split(",").join(" ");
    query = query.select(field);
  }
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  let checkForValidMongoDbID = new RegExp("^[0-9a-fA-F]{24}$");

  //Filter
  if (req.query.category && checkForValidMongoDbID.test(req.query.category)) {
    query = query.find({ category: req.query.category });
  } else if (
    req.query.category &&
    !checkForValidMongoDbID.test(req.query.category)
  ) {
    query = query.find({ sku: "This is none query" });
  }

  //Search
  if (req.query.search) {
    //query = query.find({ $text: { $search: "s" } });
    query = query.find({
      productName: { $regex: req.query.search, $options: "i" },
    });
  }

  console.log(3);

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 9;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments(query);

  query = query.skip(startIndex).limit(limit);

  let results = await query;

  console.log(results);

  console.log(4);

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  pagination.page = page;
  pagination.pageCount = Math.ceil(total / limit);

  let finalResult = results;
  res.advancedResults = {
    success: true,
    count: finalResult.length,
    pagination,
    data: finalResult,
  };

  next();
};

module.exports = advancedResults;
