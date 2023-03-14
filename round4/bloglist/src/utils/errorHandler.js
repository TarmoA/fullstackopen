const db = require('./db');
const logger = require('./logger');

const errorHandler = async (error, req, res, next) => {
  logger.error(error);
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
  res.status(500).send({ error: 'Server error' });
  next();
};

module.exports = errorHandler;
