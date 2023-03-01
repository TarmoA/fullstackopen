const express = require('express');
const cors = require('cors');
const requestLogger = require('./utils/requestLogger');
const blogRouter = require('./controllers/blog');

const app = express();

app.use(cors());
app.use(requestLogger());
app.use(express.json());

app.use('/api/blogs', blogRouter);

module.exports = app;
