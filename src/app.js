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
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// error handler
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        // stack: err.stack,
        metadata: err.message || 'Internal Server Error'
    });
});

module.exports = app;
