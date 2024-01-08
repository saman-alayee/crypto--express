var express = require('express');
var indexRouter = require('../routes/index');
var demoBlog = require('../routes/blog');
var demoAuth = require('../routes/auth');
var demoUser = require('../routes/user');
var demoProduct = require('../routes/product');
var demoCart = require('../routes/cart');

// Import the swagger module
const swagger = require('../swagger');

module.exports = function (app) {
  app.use(express.json());

  // Add Swagger documentation routes
  app.use('/api-docs', swagger.serveSwaggerUI, swagger.setupSwaggerUI);

  // Define your API routes
  app.use('/api', indexRouter);
  
  app.use('/api/blog', demoBlog);
  app.use('/api/auth', demoAuth);
  app.use('/api/users', demoUser);
  app.use('/api/products', demoProduct);
  app.use('/api/carts', demoCart);
};
