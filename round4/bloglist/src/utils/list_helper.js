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

const mostBlogs = (blogs) => {
  const counts = {};
  blogs.forEach((blog) => {
    if (counts[blog.author] === undefined) {
      counts[blog.author] = 1;
    } else {
      counts[blog.author] += 1;
    }
  });
  const bestAuthor = Object.keys(counts).reduce((best, currentAuthor) => {
    if (best === null) {
      return {
        author: currentAuthor,
        blogs: counts[currentAuthor],
      };
    }
    if (best.blogs >= counts[currentAuthor]) {
      return best;
    }
    return {
      author: currentAuthor,
      blogs: counts[currentAuthor],
    };
  }, null);
  return bestAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
