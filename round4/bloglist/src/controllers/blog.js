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
  await blog.create(newBlog);
  blog.close();
  response.end();
});

module.exports = blogRouter;
