require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const blog = require('./data/blog');

const app = express();

morgan.token('body', (req) => {
  if (req.body) {
    return JSON.stringify(req.body);
  }
  return '';
});
const tinyFormat = ':method :url :status :res[content-length] - :response-time ms';
app.use(cors());
app.use(morgan(`${tinyFormat} :body`));
app.use(express.json());

app.use(async (req, res, next) => {
  // open db connection
  await blog.init();
  next();
});

app.get('/api/blogs', async (request, response) => {
  const blogs = await blog.getAll();
  return response.json(blogs);
});

app.post('/api/blogs', async (request, response) => {
  const newBlog = request.body;
  await blog.create(newBlog);
  response.end();
});

const PORT = process.env.port || 3003;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});
