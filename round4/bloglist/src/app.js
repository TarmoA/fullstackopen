const express = require('express');
const cors = require('cors');
const requestLogger = require('./utils/requestLogger');
const blogRouter = require('./controllers/blog');
const userRouter = require('./controllers/user');

const app = express();

app.use(cors());
app.use(requestLogger());
app.use(express.json());

app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);

module.exports = app;
