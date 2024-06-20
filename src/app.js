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
require("./dbs/init.mongodb");

// Check conection interval db
// const {checkOverload} = require('./helpers/check-connect')
// checkOverload()

//init db

//init route

app.use("/", require("./routers/index"));

//handle errors

module.exports = app;
