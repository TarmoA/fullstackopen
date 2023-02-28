const mongoose = require('mongoose');

const password = process.env.MONGOPASSWORD;

const mongoUrl = `mongodb+srv://mongoapp:${password}@cluster0.ahyualj.mongodb.net/bloglist?retryWrites=true&w=majority`;

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    /* eslint-disable no-param-reassign, no-underscore-dangle */
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    /* eslint-enable no-param-reassign, no-underscore-dangle */
  },
});

const Blog = mongoose.model('Blog', blogSchema);

const init = () => mongoose.connect(mongoUrl);

const close = () => mongoose.connection.close();

const getAll = () => Blog
  .find({});

const create = (params) => {
  const blog = new Blog(params);
  return blog
    .save();
};

module.exports = {
  init, close, getAll, create,
};
