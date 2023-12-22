const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.headers['authorization']
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    console.log(config.get("jwtPrivateKey"))
    req.userId = decoded._id;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}

module.exports = auth;
