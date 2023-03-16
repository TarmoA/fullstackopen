const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const blog = require('../src/models/blog');
const user = require('../src/models/user');
const db = require('../src/utils/db');
const config = require('../src/utils/config');

const api = supertest(app);

let testUser;
let authToken;
beforeEach(async () => {
  await db.connect();
  await blog.deleteAll();
  await user.deleteAll();
  await user.create({
    username: 'blogTest',
    name: 'test',
    password: 'test',
  });
  testUser = await user.getByUsername('blogTest');
  authToken = jwt.sign({
    username: testUser.username,
    id: testUser._id,
  }, config.LOGIN_SECRET);

  await db.close();
});

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
    await db.connect();
    await blog.deleteAll();
    await blog.create(testBlogs[0], testUser._id);
    await blog.create(testBlogs[1], testUser._id);
  });

  afterEach(async () => {
    await db.close();
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

describe('POST /api/blogs', () => {
  beforeEach(async () => {
    await db.connect();
    await blog.deleteAll();
  });

  afterEach(async () => {
    await db.close();
  });

  test('should fail with no authentication header', async () => {
    const testBlog = {
      title: 'noAuthTest',
      author: 'postTestAuthor',
      url: 'test',
      likes: 1,
    };
    await api.post('/api/blogs').send(testBlog).expect(401);
  });

  test('should work', async () => {
    const testBlog = {
      title: 'postTest',
      author: 'postTestAuthor',
      url: 'test',
      likes: 1,
    };
    await api.post('/api/blogs').set('Authorization', `Bearer ${authToken}`).send(testBlog).expect(200);
    const after = await blog.getAll();
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
    await api.post('/api/blogs').set('Authorization', `Bearer ${authToken}`).send(likesMissing);
    const after = await blog.getAll();
    expect(after.length).toBe(1);
    expect(after[0].likes).toBe(0);
  });
  test('missing title should give error 400', async () => {
    const titleMissing = {
      author: 'postTestAuthor',
      url: 'test',
      likes: 1,
    };
    await api.post('/api/blogs').set('Authorization', `Bearer ${authToken}`).send(titleMissing).expect(400);
  });
  test('missing url should give error 400', async () => {
    const urlMissing = {
      title: 'postTest',
      author: 'postTestAuthor',
      likes: 1,
    };
    await api.post('/api/blogs').set('Authorization', `Bearer ${authToken}`).send(urlMissing).expect(400);
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
    await db.connect();
    await blog.deleteAll();
    await blog.create(testBlog, testUser._id);
    await blog.create(toBeDeleted, testUser._id);
  });

  afterEach(async () => {
    await db.close();
  });

  test('should return 401 with no auth field', async () => {
    const before = await blog.getAll();
    expect(before.length).toBe(2);
    const { id } = before.find((b) => b.title === toBeDeleted.title);
    await api.delete(`/api/blogs/${id}`).expect(401);
  });
  test('should work', async () => {
    const before = await blog.getAll();
    expect(before.length).toBe(2);
    const { id } = before.find((b) => b.title === toBeDeleted.title);
    await api.delete(`/api/blogs/${id}`).set('Authorization', `Bearer ${authToken}`).expect(200);
    const after = await blog.getAll();
    expect(after.length).toBe(1);
    expect(after.find((b) => b.title === toBeDeleted.title)).toBe(undefined);
  });
  test('should return 400 on malformed id', async () => {
    await api.delete('/api/blogs/test').set('Authorization', `Bearer ${authToken}`).expect(400);
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
    await db.connect();
    await blog.deleteAll();
    await blog.create(testBlog, testUser._id);
  });

  afterEach(async () => {
    await db.close();
  });

  test('should change likes and url', async () => {
    const before = await blog.getAll();
    expect(before.length).toBe(1);
    const { id } = before[0];
    const newLikes = 15;
    const newUrl = 'TEST URL';
    await api.put(`/api/blogs/${id}`).send({ ...testBlog, likes: newLikes, url: newUrl }).expect(200);

    const after = await blog.getAll();
    expect(after[0].likes).toBe(newLikes);
    expect(after[0].url).toBe(newUrl);
  });
  test('should return 400 on malformed id', async () => {
    await api.put('/api/blogs/test').send(testBlog).expect(400);
  });
});
