require('dotenv').config();

const { PORT } = process.env;

const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

const LOGIN_SECRET = process.env.NODE_ENV === 'test' ? 'TESTSECRET' : process.env.LOGIN_SECRET;

module.exports = {
  MONGODB_URI,
  PORT,
  LOGIN_SECRET,
};
