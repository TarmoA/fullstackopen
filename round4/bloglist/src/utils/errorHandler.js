const db = require('./db');

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
  res.status(500);
  next();
};

module.exports = errorHandler;
