const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ApiFetures = require("../utils/apiFetures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("doc Id not found", 404));
    }

    res.status(200).json({
      status: "Sucess",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    console.log(doc);

    if (!doc) {
      return next(new AppError("doc Id not found", 404));
    }

    res.status(200).json({
      status: "Sucess",
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({ status: "Sucess", product: doc });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError("Doc Id not found", 404));
    }

    res.status(200).json({
      status: "Sucess",
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.productId) filter = { product: req.params.productId };
    const features = new ApiFetures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitingFeilds()
      .paginations();
    const doc = await features.query;

    res.status(200).json({
      status: "Sucess",
      results: doc.length,
      products: {
        doc,
      },
    });
  });
