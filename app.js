const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const expressMongoClean = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");
const orderRouter = require("./routes/orderRoutes");
const cheackoutRoute = require("./routes/cheakoutRoute");

const AppError = require("./utils/appError");
const errorHandler = require("./controller/errorController");

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(cookieParser());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'self'",
          "http://localhost:4000",
          "https://cdn.jsdelivr.net",
        ],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        imgSrc: ["'self'", "*", "data:"],
      },
    },
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://cdn.jsdelivr.net https://checkout.razorpay.com 'unsafe-inline';"
  );
  next();
});

if (process.env.NODE_ENV === "devplopment") {
  app.use(morgan("dev"));
}

app.use(expressMongoClean());
app.use(xss());

app.use(
  hpp({
    whitelist: ["types", "genre"],
  })
);

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests, please try again later",
});

app.use("/api", limiter);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/", viewRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/cheakout", cheackoutRoute);

app.all("*", (req, res, next) => {
  // const err = new Error(`The url : ${req.originalUrl} not found in the srver`);
  // err.statusCode = 404;
  // err.status = "Fail";

  next(
    new AppError(`The url : ${req.originalUrl} not found in the server`, 404)
  );
});

app.use(errorHandler);

module.exports = app;
