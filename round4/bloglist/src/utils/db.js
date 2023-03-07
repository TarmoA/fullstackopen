const mongoose = require('mongoose');
const config = require('./config');

const mongoUrl = config.MONGODB_URI;

const connect = () => mongoose.connect(mongoUrl);

const close = () => mongoose.connection.close();

module.exports = {
  connect,
  close,
};
