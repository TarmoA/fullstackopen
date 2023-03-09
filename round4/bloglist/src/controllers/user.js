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
  const errors = [];
  const userParams = request.body;
  if (!userParams.password) {
    errors.push('Missing password');
  }
  if (!userParams.username) {
    errors.push('Missing username');
  }
  if (userParams.password && userParams.password.length < 3) {
    errors.push('Password must be at least 3 characters long');
  }
  if (userParams.username && userParams.username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  const existing = await user.getAll();
  if (existing.find((u) => u.username === userParams.username)) {
    errors.push('Username must be unique');
  }
  if (errors.length) {
    response.status(400).json({ error: errors.join(', ') });
    return;
  }

  const newUser = await user.create(userParams);
  response.status(201).json(newUser);
});

module.exports = userRouter;
