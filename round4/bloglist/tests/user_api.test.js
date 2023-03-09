const supertest = require('supertest');
const app = require('../src/app');
const user = require('../src/models/user');
const db = require('../src/utils/db');

const api = supertest(app);

describe('GET /api/users', () => {
  const testUsers = [
    {
      username: 'getTest1',
      name: 'Get Test',
      password: 'password123',
    },
    {
      username: 'getTest2',
      name: 'Get Test',
      password: 'password123',
    },
  ];
  beforeEach(async () => {
    await db.connect();
    await user.deleteAll();
    await Promise.all(testUsers.map((u) => user.create(u)));
  });

  afterEach(async () => {
    await db.close();
  });

  test('should return json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('get all should work', async () => {
    const response = await api.get('/api/users');
    expect(response.body.length).toBe(testUsers.length);
    expect(response.body).toEqual(
      expect.arrayContaining(testUsers.map((u) => expect.objectContaining({
        name: u.name,
        username: u.username,
      }))),
    );
  });
});

describe('POST /api/users', () => {
  beforeEach(async () => {
    await db.connect();
    await user.deleteAll();
  });

  afterEach(async () => {
    await db.close();
  });

  test('create user should work', async () => {
    const testUser = {
      username: 'test',
      name: 'Test User',
      password: 'password123',
    };

    await api
      .post('/api/users')
      .send(testUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const after = await user.getAll();
    expect(after.find((u) => u.username === testUser.username
      && u.name === testUser.name)).toBeTruthy();
  });
  test('should return error on empty username ', async () => {
    const testUser = {
      username: '',
      name: 'Test User',
      password: 'password123',
    };
    const response = await api
      .post('/api/users')
      .send(testUser);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/Missing username/);
  });
  test('should return error on empty password', async () => {
    const testUser = {
      username: 'test',
      name: 'Test User',
      password: '',
    };
    const response = await api
      .post('/api/users')
      .send(testUser);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/Missing password/);
  });
  test('should return error on short password', async () => {
    const testUser = {
      username: 'test',
      name: 'Test User',
      password: '12',
    };
    const response = await api
      .post('/api/users')
      .send(testUser);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/Password must be at least 3 characters long/);
  });
  test('should return error on short username', async () => {
    const testUser = {
      username: '12',
      name: 'Test User',
      password: 'password123',
    };
    const response = await api
      .post('/api/users')
      .send(testUser);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/Username must be at least 3 characters long/);
  });
  test('should return error on duplicate username', async () => {
    const testUser = {
      username: 'duplicateTest',
      name: 'Test User',
      password: 'password123',
    };
    const first = await api
      .post('/api/users')
      .send(testUser);
    expect(first.statusCode).toBe(201);
    const second = await api
      .post('/api/users')
      .send(testUser);
    expect(second.statusCode).toBe(400);
    expect(second.body.error).toMatch(/Username must be unique/);
  });
});
