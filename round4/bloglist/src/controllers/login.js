const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const user = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;
  const foundUser = await user.getByUsername(username);
  if (!foundUser) {
    response.status(401).json({
      error: 'invalid username or password',
    });
    return;
  }
  const passwordCorrect = foundUser === null
    ? false
    : await bcrypt.compare(password, foundUser.passwordHash);

  if (!passwordCorrect) {
    response.status(401).json({
      error: 'invalid username or password',
    });
    return;
  }

  const userForToken = {
    username: foundUser.username,
    id: foundUser._id,
  };

  const token = jwt.sign(userForToken, process.env.LOGIN_SECRET);

  response
    .status(200)
    .send({ token, username: foundUser.username, name: foundUser.name });
});

module.exports = loginRouter;
