var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var config = require('config');
const ExcelJS = require('exceljs');

var app = express();
app.use(cors());

// Import the swagger module
const swagger = require('./swagger');

// Other middleware and configurations

require('./startup/routes')(app);
require('./startup/db')();

// Other middleware and configurations

// Use Swagger documentation middleware
app.use('/api-docs', swagger.serveSwaggerUI, swagger.setupSwaggerUI);

// Other middleware and configurations

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
