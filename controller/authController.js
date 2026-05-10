const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

const getToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = getToken(user._id);

  const cookiesOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIES_EXPIRE_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "productions") cookiesOptions.secure = true;

  res.cookie("jwt", token, cookiesOptions);

  res.status(statusCode).json({ status: "Sucess", token, user });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide an email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const isCorrect = await user.correctPassword(password, user.password);
  if (!isCorrect) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 201, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Getting token a check if exits
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  console.log(token);

  if (!token) {
    return next(
      new AppError("You are not logged in. logged in a try again later")
    );
  }

  // 2. Verify the token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_TOKEN);

  // 3. If user still exits
  const freshuser = await User.findById(decode.id);
  if (!freshuser) {
    return next(
      new AppError("This user belonging to this token does not valid", 401)
    );
  }

  req.user = freshuser;
  next();
});

exports.isLogedin = async (req, res, next) => {
  // 1. Getting token a check if exits
  try {
    let token;

    if (req.cookies.jwt) {
      token = req.cookies.jwt;

      console.log(token);

      if (!token) {
        return next();
      }

      // 2. Verify the token
      const decode = await promisify(jwt.verify)(token, process.env.JWT_TOKEN);

      // 3. If user still exits
      const freshuser = await User.findById(decode.id);
      if (!freshuser) {
        return next();
      }

      res.locals.user = freshuser;
      req.user = freshuser;
      return next();
    }
    next();
  } catch (err) {
    next();
  }
};

exports.logout = (req, res, next) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success", message: "logged out" });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You are not allow access to this route !"));
    }

    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // 1. Find the user
  console.log(req.body.email);
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("User does not exist with this email", 404));
  }

  // 2. Gnerate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send the email

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Reset your password here: ${resetURL}.
   If you don't forget the password so igonore this message`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token is valid for 10 min",
      message,
    });

    res.status(200).json({
      status: "Success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log(`resetpass - ${hashedToken}`);
  console.log(`Current time: ${Date.now()}`);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  console.log("Found user:", user);
  console.log("Token expires at:", user?.passwordResetExpires);

  // 2. Check token
  if (!user) {
    return next(new AppError("Token is Invalid or has expired", 400));
  }

  // 3. Change the user password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  (user.passwordResetToken = undefined),
    (user.passwordResetExpires = undefined);

  await user.save();

  // 4. Reset the password change at property
  // 5. Loged in user by sending the jwt
  const token = getToken(user._id);
  res.status(200).json({ status: "Success", token: token, user: user });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. Get the user from collection and include password
  const user = await User.findById(req.user._id).select("+password");

  console.log(user);

  // 2. Check if current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3. If correct, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); // triggers pre-save middleware

  // 4. Log user in, send JWT
  const token = getToken(user._id);
  res.status(200).json({
    status: "Success",
    token,
    user,
  });
});
