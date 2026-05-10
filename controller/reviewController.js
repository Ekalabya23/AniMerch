const Review = require("../model/reviewModel");
// const catchAsync = require("../utils/catchAsync");
// const AppError = require("../utils/appError");
const factoryHandelr = require("./factoryHandelr");

exports.getAllReview = factoryHandelr.getAll(Review);

// exports.getAllReview = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.productId) filter = { product: req.params.productId };
//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     stauts: "Success",
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

exports.getAReview = factoryHandelr.getOne(Review);

exports.setProductIdAndUserId = async (req, res, next) => {
  try {
    if (!req.body.user && req.user) {
      req.body.user = req.user.id;
    }
    console.log(req.body.user, req.body.product);
    next();
  } catch (err) {
    next(err);
  }
};

exports.postReview = factoryHandelr.createOne(Review);

// exports.postReview = catchAsync(async (req, res, next) => {
//   if (!req.body.user) req.body.user = req.user.id;
//   if (!req.body.product) req.body.product = req.params.productId;

//   const review = await Review.create(req.body);

//   res.status(201).json({
//     status: "Success",
//     data: review,
//   });
// });

exports.deleteReview = factoryHandelr.deleteOne(Review);

exports.updateReview = factoryHandelr.updateOne(Review);
