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
  beforeEach(async () => {
    await blog.init();
    await blog.deleteAll();
    await blog.close();
  });
  test('blog should have id', async () => {
    const testBlog = {
      title: 'postTest',
      author: 'postTestAuthor',
      url: 'test',
      likes: 1,
    };
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
    const likesMissing = {
      title: 'postTest',
      author: 'postTestAuthor',
      url: 'test',
    };
    await api.post('/api/blogs').send(likesMissing);
    await blog.init();
    const after = await blog.getAll();
    await blog.close();
    expect(after.length).toBe(1);
    expect(after[0].likes).toBe(0);
  });
  test('missing title should give error 400', async () => {
    const titleMissing = {
      author: 'postTestAuthor',
      url: 'test',
      likes: 1,
    };
    await api.post('/api/blogs').send(titleMissing).expect(400);
  });
  test('missing url should give error 400', async () => {
    const urlMissing = {
      title: 'postTest',
      author: 'postTestAuthor',
      likes: 1,
    };
    await api.post('/api/blogs').send(urlMissing).expect(400);
  });
});

describe('DELETE /api/blogs', () => {
  const testBlog = {
    title: 'shouldExist',
    author: 'deleteTestAuthor',
    url: 'test',
    likes: 1,
  };
  const toBeDeleted = {
    title: 'deleteTest',
    author: 'deleteTestAuthor',
    url: 'test',
    likes: 1,
  };
  beforeEach(async () => {
    await blog.init();
    await blog.deleteAll();
    await blog.create(testBlog);
    await blog.create(toBeDeleted);
    await blog.close();
  });
  test('should work', async () => {
    await blog.init();
    const before = await blog.getAll();
    await blog.close();
    expect(before.length).toBe(2);
    const { id } = before.find((b) => b.title === toBeDeleted.title);
    await api.delete(`/api/blogs/${id}`);
    await blog.init();
    const after = await blog.getAll();
    await blog.close();
    expect(after.length).toBe(1);
    expect(after.find((b) => b.title === toBeDeleted.title)).toBe(undefined);
  });
  test('should return 400 on malformed id', async () => {
    await api.delete('/api/blogs/test').expect(400);
  });
});

describe('PUT /api/blogs', () => {
  const testBlog = {
    title: 'putTest',
    author: 'testAuthor',
    url: 'test',
    likes: 0,
  };
  beforeEach(async () => {
    await blog.init();
    await blog.deleteAll();
    await blog.create(testBlog);
    await blog.close();
  });
  test('should change likes and url', async () => {
    await blog.init();
    const before = await blog.getAll();
    await blog.close();
    expect(before.length).toBe(1);
    const { id } = before[0];
    const newLikes = 15;
    const newUrl = 'TEST URL';
    await api.put(`/api/blogs/${id}`).send({ ...testBlog, likes: newLikes, url: newUrl });

    await blog.init();
    const after = await blog.getAll();
    await blog.close();
    expect(after[0].likes).toBe(newLikes);
    expect(after[0].url).toBe(newUrl);
  });
  test('should return 400 on malformed id', async () => {
    await api.delete('/api/blogs/test').expect(400);
  });
});
