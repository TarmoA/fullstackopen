const userRouter = require('express').Router();
require('express-async-errors');
const user = require('../models/user');

userRouter.get('/', async (request, response) => {
  const users = await user.getAll();
  const notesRemoved = users.map((u) => ({
    name: u.name,
    username: u.username,
    id: u.id,
  }));
  return response.json(notesRemoved);
});

userRouter.post('/', async (request, response) => {
  const userParams = request.body;
  if (!userParams.password || !userParams.name || !userParams.username) {
    response.status(400).end();
    return;
  }

  const newUser = await user.create(userParams);
  response.status(201).json(newUser);
});

module.exports = userRouter;
