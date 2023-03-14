const blogRouter = require('express').Router();
require('express-async-errors');
const blog = require('../models/blog');

blogRouter.get('/', async (request, response) => {
  const blogs = await blog.getAll();
  return response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
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
  if (!request.user) {
    response.status(400);
    response.end();
    return;
  }
  await blog.create(newBlog, request.user._id);
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
  if (!request.user) {
    response.status(400).send('user error');
    return;
  }
  const userId = request.user._id
  const { id } = request.params;
  if (!id) {
    response.status(400);
    return;
  }
  const existing = await blog.getById(id);
  if (!existing) {
    response.status(404).send('Not found');
    return;
  }
  if (existing.user.toString() !== userId.toString()) {
    response.status(401);
    return;
  }
  await blog.deleteById(id);
  response.end();
});

module.exports = blogRouter;
