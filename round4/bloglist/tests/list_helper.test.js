const listHelper = require('../src/utils/list_helper');

const oneBlog = [{
  _id: '1',
  title: 'test',
  author: 'testAuthor',
  url: 'test',
  likes: 1,
}];

const threeBlogs = [
  {
    _id: '1',
    title: 'test',
    author: 'testAuthor',
    url: 'test',
    likes: 1,
  },
  {
    _id: '2',
    title: 'test2',
    author: 'otherAuthor',
    url: 'test',
    likes: 6,
  },
  {
    _id: '3',
    title: 'test3',
    author: 'otherAuthor',
    url: 'test',
    likes: 3,
  },
  {
    _id: '4',
    title: 'test4',
    author: 'thirdAuthor',
    url: 'test',
    likes: 1,
  },
];

describe('dummy', () => {
  test('should return one', () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
  });
});

describe('totalLikes', () => {
  test('should return zero for empty list', () => {
    const blogs = [];

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(0);
  });
  test('should return correct value for one blog', () => {
    const result = listHelper.totalLikes(oneBlog);
    expect(result).toBe(oneBlog[0].likes);
  });
  test('should return correct value for multiple blogs', () => {
    const totalCount = 11;
    const result = listHelper.totalLikes(threeBlogs);
    expect(result).toBe(totalCount);
  });
});

describe('favoriteBlog', () => {
  test('should return null for empty list', () => {
    const blogs = [];

    const result = listHelper.favoriteBlog(blogs);
    expect(result).toBe(null);
  });
  test('should return the first value if list is length one', () => {
    const result = listHelper.favoriteBlog(oneBlog);
    expect(result).toEqual(oneBlog[0]);
  });
  test('should return correct value for multiple blogs', () => {
    const result = listHelper.favoriteBlog(threeBlogs);
    expect(result).toEqual(threeBlogs[1]);
  });
});

describe('mostBlogs', () => {
  test('should return null for empty list', () => {
    const blogs = [];

    const result = listHelper.mostBlogs(blogs);
    expect(result).toBe(null);
  });
  test('should return the first value if list is length one', () => {
    const result = listHelper.mostBlogs(oneBlog);
    expect(result).toEqual({
      author: oneBlog[0].author,
      blogs: 1,
    });
  });
  test('should return correct value for multiple blogs', () => {
    const result = listHelper.mostBlogs(threeBlogs);
    expect(result).toEqual({
      author: 'otherAuthor',
      blogs: 2,
    });
  });
});
