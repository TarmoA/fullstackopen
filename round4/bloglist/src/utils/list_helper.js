const dummy = () => 1;

const totalLikes = (blogs) => blogs.reduce((total, currentBlog) => total + currentBlog.likes, 0);

const favoriteBlog = (blogs) => blogs.reduce((favorite, current) => {
  if (favorite === null) {
    return current;
  }
  if (favorite.likes >= current.likes) {
    return favorite;
  }
  return current;
}, null);

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
