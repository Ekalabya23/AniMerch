const User = require("./../model/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "users",
    format: async () => "jpeg",
    public_id: (req, file) => `user-${req.user.id}-${Date.now()}`,
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("Please upload only images", 400), false);
};

const upload = multer({ storage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single("photo");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "Success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: "Success",
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password update", 400));
  }

  console.log(req.body);

  const filterBody = filterObj(req.body, "name", "email");

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "Success",
    data: {
      user: updatedUser,
    },
  });
});

exports.updateUserProfile = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No image uploaded!", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, {
    photo: req.file.path,
  });

  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id, { active: false });

  res.status(200).json({
    status: "Success",
    data: null,
  });
});

exports.addAUser = (req, res) => {
  res.status(500).json({
    message: "The Route is not working yet !",
  });
};

exports.removeAUser = (req, res) => {
  res.status(500).json({
    message: "The Route is not working yet !",
  });
};

exports.updateAUser = (req, res) => {
  res.status(500).json({
    message: "The Route is not working yet !",
  });
};
