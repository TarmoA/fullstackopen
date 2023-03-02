const blogRouter = require('express').Router();
const blog = require('../models/blog');

blogRouter.use(async (req, res, next) => {
  // open db connection
  await blog.init();
  next();
});

blogRouter.get('/', async (request, response) => {
  const blogs = await blog.getAll();
  blog.close();
  return response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const newBlog = request.body;
  if (newBlog.likes === undefined) {
    newBlog.likes = 0;
  }
  if (newBlog.title === undefined) {
    response.status(400);
    blog.close();
    response.end();
    return;
  }
  if (newBlog.url === undefined) {
    response.status(400);
    blog.close();
    response.end();
    return;
  }
  await blog.create(newBlog);
  blog.close();
  response.end();
});

module.exports = blogRouter;
