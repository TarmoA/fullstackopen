const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};
const tokenExtractor = async (req, res, next) => {
  const token = getTokenFrom(req);
  if (token) {
    req.token = token;
  }
  next();
};

module.exports = tokenExtractor;
