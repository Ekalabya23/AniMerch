const AppError = require("../utils/appError");

function handleCasteErrorDB(err) {
  const errMessage = `Invalid ID ${err.path} : ${err.value}`;

  return new AppError(errMessage, 400);
}

function handleDuplicateNameDB(err) {
  const value = err.keyValue.name;
  const errMessage = `Name Is Already Exit in the database : ${value}`;

  return new AppError(errMessage, 400);
}

function handleValidationDB(err) {
  const errors = Object.values(err.errors).map((error) => error.message);

  const errMessage = `Validations error : ${errors.join(", ")} `;
  return new AppError(errMessage, 400);
}

const handleJWTError = () =>
  new AppError("Invalid Token, Please login again", 401);
const handleJWTTime = () =>
  new AppError("Your token is expried ! Please login again", 401);

function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorPrd(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log("Error From Production : ", err);

    res.status(500).json({
      status: "Error",
      message: "Something worng Internal Server Error !",
    });
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === "devplopment") {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === "productions") {
    let error = Object.create(err);

    console.log(`Hello From Productions `);

    if (error.name === "CastError") error = handleCasteErrorDB(error);
    if (error.code === 11000) error = handleDuplicateNameDB(error);
    if (error.name === "ValidationError") error = handleValidationDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTTime();

    sendErrorPrd(error, res);
  }
};
