const jwt = require('jsonwebtoken');
const config = require('./config');
const user = require('../models/user');

const userExtractor = async (req, res, next) => {
  if (req.token) {
    const decodedToken = jwt.verify(req.token, config.LOGIN_SECRET);
    if (decodedToken.id) {
      const foundUser = await user.getById(decodedToken.id);
      req.user = foundUser;
    }
  }
  next();
};

module.exports = userExtractor;
