const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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

const getAll = () => Blog
  .find({});

const create = (params) => {
  const blog = new Blog(params);
  return blog
    .save();
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
  getAll, create, deleteAll, deleteById, update,
};
