const listHelper = require('../src/utils/list_helper');

describe('dummy', () => {
  test('should return one', () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
  });
});

describe('totalLikes', () => {
  const oneBlog = [{
    _id: '1',
    title: 'test',
    author: 'test',
    url: 'test',
    likes: 1,
  }];

  const threeBlogs = [
    {
      _id: '1',
      title: 'test',
      author: 'test',
      url: 'test',
      likes: 1,
    },
    {
      _id: '2',
      title: 'test2',
      author: 'test',
      url: 'test',
      likes: 3,
    },
    {
      _id: '3',
      title: 'test3',
      author: 'test',
      url: 'test',
      likes: 3,
    },
  ];
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
    const totalCount = 7;
    const result = listHelper.totalLikes(threeBlogs);
    expect(result).toBe(totalCount);
  });
});
