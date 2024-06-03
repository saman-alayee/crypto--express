var express = require('express');
var indexRouter = require('../routes/index');
var demoBlog = require('../routes/blog');
var demoAuth = require('../routes/auth');
var demoUser = require('../routes/user');
var demoProduct = require('../routes/product');
var demoCart = require('../routes/cart');
var demoCharge= require('../routes/charge');
var demoClinic= require('../routes/clinic');
var demoShelter= require('../routes/shelter');
var demoHash= require('../routes/hash');
var demoUserHash= require('../routes/userHash');
var demoAuthHash= require('../routes/authHash');




// Import the swagger module
const swagger = require('../swagger');

module.exports = function (app) {
  app.use(express.json());

  // Add Swagger documentation routes
  app.use('/api-docs', swagger.serveSwaggerUI, swagger.setupSwaggerUI);

  // Define your API routes
  app.use('/api', indexRouter);
  
  app.use('/api/blogs', demoBlog);
  app.use('/api/auth', demoAuth);
  app.use('/api/users', demoUser);
  app.use('/api/products', demoProduct);
  app.use('/api/cart', demoCart);
  app.use('/api/charge', demoCharge);
  app.use('/api/clinics', demoClinic);
  app.use('/api/shelters', demoShelter);
  app.use('/api/hash', demoHash);
  app.use('/api/userhash', demoUserHash);
  app.use('/api/authhash', demoAuthHash);

};
