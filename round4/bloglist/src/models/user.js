const bcrypt = require('bcrypt');

const mongoose = require('mongoose');
const config = require('../utils/config');

const mongoUrl = config.MONGODB_URI;

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    /* eslint-disable no-param-reassign, no-underscore-dangle */
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
    /* eslint-enable no-param-reassign, no-underscore-dangle */
  },
});

const User = mongoose.model('User', userSchema);

const init = () => mongoose.connect(mongoUrl);

const close = () => mongoose.connection.close();

const getAll = () => User
  .find({});

const create = async (params) => {
  const saltRound = 10;
  const hashed = await bcrypt.hash(params.password, saltRound);
  const user = new User({ ...params, password: hashed });
  return user.save();
};

const deleteAll = () => User.deleteMany({});

module.exports = {
  init, close, create, deleteAll, getAll,
};
