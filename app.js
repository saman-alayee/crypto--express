var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nodemailer = require("nodemailer");
var cors = require('cors')
var config = require('config');
const ExcelJS = require("exceljs");

var app = express();
app.use(cors())

require('./startup/routes')(app);
require('./startup/db')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Define your base URL (e.g., localhost:5000)
const baseUrl = 'http://localhost:5000';

app.use((req, res, next) => {
  const clientIP = req.ip; // This will give you the IP address of the client
  console.log(`Request from IP: ${clientIP}`);
  next();
});

// Middleware to prepend base URL to image paths
app.use((req, res, next) => {
  res.locals.baseUrl = baseUrl;
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
