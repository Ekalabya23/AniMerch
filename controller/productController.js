const Product = require("../model/productModel");
// const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factoryHandler = require("./factoryHandelr");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");
const multer = require("multer");

exports.aliasTopProduct = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-avgRating,price";
  req.query.fields = "name,price,avgRating,coverImage";
  next();
};

exports.getAllProduct = factoryHandler.getAll(Product);

// exports.getAllProduct = catchAsync(async (req, res, next) => {
//   const features = new ApiFetures(Product.find(), req.query)
//     .filter()
//     .sort()
//     .limitingFeilds()
//     .paginations();
//   const products = await features.query;

//   res.status(200).json({
//     status: "Sucess",
//     results: products.length,
//     products: products,
//   });
// });

exports.getAProduct = factoryHandler.getOne(Product, { path: "reviews" });

// exports.getAProduct = catchAsync(async (req, res, next) => {
//   const product = await Product.findById(req.params.id).populate("reviews");

//   if (!product) {
//     return next(new AppError("Product Id not found", 404));
//   }

//   res.status(200).json({
//     status: "Sucess",
//     data: {
//       product,
//     },
//   });
// });

// exports.AddAProduct = factoryHandler.createOne(Product);

const multerStorgae = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("Please upload only images", 400), false);
};

const upload = multer({ storage: multerStorgae, fileFilter: multerFilter });

exports.uploadProductImages = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

const uploadToCloudniary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder,
      },
      (error, result) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(cld_upload_stream);
  });
};

exports.AddAProduct = catchAsync(async (req, res, next) => {
  if (!req.files.coverImage)
    return next(new AppError("Cover image is required", 400));

  const coverImage = await uploadToCloudniary(
    req.files.coverImage[0].buffer,
    "product/cover"
  );

  let images = [];

  if (req.files.images) {
    images = await Promise.all(
      req.files.images.map((file) =>
        uploadToCloudniary(file.buffer, "products/gallery")
      )
    );
  }

  const newProduct = await Product.create({
    ...req.body,
    coverImage,
    images,
  });

  res.status(201).json({ status: "Sucess", product: newProduct });
});

exports.updateAProduct = factoryHandler.updateOne(Product);

// exports.updateAProduct = catchAsync(async (req, res, next) => {
//   const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!product) {
//     return next(new AppError("Product Id not found", 404));
//   }

//   res.status(200).json({
//     status: "Sucess",
//     data: {
//       product,
//     },
//   });
// });

exports.removeAProduct = factoryHandler.deleteOne(Product);

// exports.removeAProduct = catchAsync(async (req, res, next) => {
//   const product = await Product.findByIdAndDelete(req.params.id);

//   if (!product) {
//     return next(new AppError("Product Id not found", 404));
//   }

//   res.status(200).json({
//     status: "Sucess",
//     data: null,
//   });
// });
