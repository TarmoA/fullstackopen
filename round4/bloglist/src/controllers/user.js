const userRouter = require('express').Router();
require('express-async-errors');
const user = require('../models/user');
const errorHandler = require('../utils/errorHandler');

userRouter.use(async (req, res, next) => {
  // open db connection
  await user.init();
  next();
});

userRouter.get('/', async (request, response) => {
  const users = await user.getAll();
  await user.close();
  return response.json(users);
});

userRouter.post('/', async (request, response) => {
  const userParams = request.body;
  if (!userParams.password || !userParams.name || !userParams.username) {
    response.status(400).end();
    return;
  }

  const newUser = await user.create(userParams);
  await user.close();
  response.status(201).json(newUser);
});

userRouter.use(errorHandler);

module.exports = userRouter;
