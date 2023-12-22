var express = require("express");
var indexRouter = require("../routes/index");
var demoBlog = require("../routes/blog");
var demoAuth = require("../routes/auth");
var demoUser = require("../routes/user");
var demoProduct = require("../routes/product");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api", indexRouter);
  app.use("/api/blog", demoBlog);
  app.use("/api/auth", demoAuth);
  app.use("/api/users", demoUser);
  app.use("/api/products", demoProduct);
};
