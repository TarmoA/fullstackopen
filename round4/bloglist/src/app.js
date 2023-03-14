const express = require('express');
const cors = require('cors');
const requestLogger = require('./utils/requestLogger');
const blogRouter = require('./controllers/blog');
const userRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');
const db = require('./utils/db');
const errorHandler = require('./utils/errorHandler');
const tokenExtractor = require('./utils/tokenExtractor');

const app = express();

app.use(cors());
app.use(requestLogger());
app.use(express.json());
app.use(tokenExtractor);
app.use(async (req, res, next) => {
  await db.connect();
  next();
});

app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.use(async (req, res, next) => {
  await db.close();
  next();
});
app.use(errorHandler);

module.exports = app;
