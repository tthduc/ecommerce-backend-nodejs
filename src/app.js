require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
require("./dbs/init.mongodb.js");
// const { checkOverload } = require("./helpers/check.connect.js");
// checkOverload();

// init router
app.use('/', require('./routes'))

// handling error

module.exports = app;
