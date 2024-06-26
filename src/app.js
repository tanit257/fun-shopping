const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

//middles ware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
// app.use(morgan('combined'));
// app.use(morgan('tiny'));
// app.use(morgan('short'));
// app.use(morgan('common'));

// Check conection interval db
// const {checkOverload} = require('./helpers/check-connect')
// checkOverload()

//init db
require("./dbs/init.mongodb");

//init route

app.use("/", require("./routers/index"));

//handle errors

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.statusCode = 404;
  next(error);
  // console.log('MUST HERE')
  // next( new NotFoundError());
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.log( err);
  return res.status(statusCode).json({
    status: "error",
    statusCode,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
