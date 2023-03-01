const morgan = require('morgan');

const tinyFormat = ':method :url :status :res[content-length] - :response-time ms';

morgan.token('body', (req) => {
  if (req.body) {
    return JSON.stringify(req.body);
  }
  return '';
});

const requestLogger = () => morgan(`${tinyFormat} :body`);

module.exports = requestLogger;
