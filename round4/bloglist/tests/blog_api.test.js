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
  test('blog should have id', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  });
});

describe('GET /api/blogs', () => {
  const testBlog = {
    title: 'postTest',
    author: 'postTestAuthor',
    url: 'test',
    likes: 1,
  };
  const likesMissing = {
    title: 'postTest',
    author: 'postTestAuthor',
    url: 'test',
  };
  beforeEach(async () => {
    await blog.init();
    await blog.deleteAll();
    await blog.close();
  });
  test('blog should have id', async () => {
    await api.post('/api/blogs').send(testBlog);
    await blog.init();
    const after = await blog.getAll();
    await blog.close();
    expect(after.length).toBe(1);
    expect(after[0].title).toBe(testBlog.title);
    expect(after[0].author).toBe(testBlog.author);
    expect(after[0].url).toBe(testBlog.url);
    expect(after[0].likes).toBe(testBlog.likes);
  });
  test('missing likes should default to 0', async () => {
    await api.post('/api/blogs').send(likesMissing);
    await blog.init();
    const after = await blog.getAll();
    await blog.close();
    expect(after.length).toBe(1);
    expect(after[0].likes).toBe(0);
  });
});
