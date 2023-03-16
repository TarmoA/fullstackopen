const db = require('./db');
const logger = require('./logger');

const errorHandler = async (error, req, res, next) => {
  try {
    db.close();
  } catch {
    // don't care if closing fails here
  }
  if (error.name === 'CastError') {
    res.status(400).send({ error: 'malformatted id' });
    res.end();
    return;
  }
  if (error.name === 'JsonWebTokenError') {
    res.status(400).json({ error: 'token error' });
    return;
  }
  res.status(500).send({ error: 'Server error' });
  logger.error(error);
  next();
};

module.exports = errorHandler;
