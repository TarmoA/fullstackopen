const blogRouter = require('express').Router();
require('express-async-errors');
const jwt = require('jsonwebtoken');
const blog = require('../models/blog');

blogRouter.get('/', async (request, response) => {
  const blogs = await blog.getAll();
  return response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.LOGIN_SECRET);
  if (!decodedToken.id) {
    response.status(401).json({ error: 'token invalid' });
    return;
  }
  const newBlog = request.body;
  if (newBlog.likes === undefined) {
    newBlog.likes = 0;
  }
  if (newBlog.title === undefined) {
    response.status(400);
    response.end();
    return;
  }
  if (newBlog.url === undefined) {
    response.status(400);
    response.end();
    return;
  }
  await blog.create(newBlog, decodedToken.id);
  response.end();
});

blogRouter.put('/:id', async (request, response) => {
  const updatedBlog = request.body;
  const { id } = request.params;
  if (!id) {
    response.status(400);
    response.end();
    return;
  }
  if (updatedBlog.likes === undefined) {
    updatedBlog.likes = 0;
  }
  if (updatedBlog.url === undefined) {
    response.status(400);
    response.end();
    return;
  }
  await blog.update({ id, ...updatedBlog });
  response.end();
});

blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.LOGIN_SECRET);
  if (!decodedToken.id) {
    response.status(401).json({ error: 'token invalid' });
    return;
  }
  const userId = decodedToken.id;
  const { id } = request.params;
  if (!id) {
    response.status(400);
    return;
  }
  const existing = await blog.getById(id);
  if (existing.user.toString() !== userId.toString()) {
    response.status(401);
    return;
  }
  await blog.deleteById(id);
  response.end();
});

module.exports = blogRouter;
