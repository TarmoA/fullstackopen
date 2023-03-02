const supertest = require('supertest');
const app = require('../src/app');
const blog = require('../src/models/blog');

const api = supertest(app);

describe('GET /api/blogs', () => {
  const testBlogs = [{
    title: 'test',
    author: 'testAuthor',
    url: 'test',
    likes: 1,
  },
  {
    title: 'test2',
    author: 'testAuthor',
    url: 'test',
    likes: 1,
  }];

  beforeEach(async () => {
    await blog.init();
    await blog.deleteAll();
    await Promise.all(testBlogs.map((testBlog) => blog.create(testBlog)));
    await blog.close();
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  test('correct amount of blogs is returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body.length).toBe(testBlogs.length);
  });
});
