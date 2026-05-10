const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception Shutting Down ..........");
  process.exit(1);
});

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => console.log("DB connected"));

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`App is running in the port : ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandle Rejection Shutting Down ..........");
  server.close(() => {
    process.exit(1);
  });
});
