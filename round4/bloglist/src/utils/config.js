require('dotenv').config();

const { PORT, LOGIN_SECRET } = process.env;

const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
  LOGIN_SECRET
};
