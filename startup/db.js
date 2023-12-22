const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
  const mongoURI = config.get("mongo_URI");
  console.log(mongoURI);
  mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      winston.info('Connected to MongoDB...');
    })
    .catch((err) => {
      winston.error('Failed to connect to MongoDB:', err);
    });
}
