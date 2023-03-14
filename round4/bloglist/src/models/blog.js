/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const user = require('./user');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    /* eslint-disable no-param-reassign, */
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    /* eslint-enable no-param-reassign */
  },
});

const Blog = mongoose.model('Blog', blogSchema);

const getAll = () => Blog
  .find({}).populate('user', { username: true, name: true });

const create = async (params) => {
  const users = await user.getAll();
  const owner = users[0];
  const blog = new Blog({ ...params, user: owner._id });
  const savedBlog = await blog
    .save();
  owner.blogs = owner.blogs.concat(savedBlog._id);
  await owner.save();
  return savedBlog;
};

// allow editing only url and likes
const update = (params) => Blog.updateOne(
  { _id: params.id },
  { url: params.url, likes: params.likes },
  { runValidators: true },
);

const deleteById = (id) => Blog.deleteOne({ _id: id });

const deleteAll = () => Blog.deleteMany({});

module.exports = {
  Blog, getAll, create, deleteAll, deleteById, update,
};
