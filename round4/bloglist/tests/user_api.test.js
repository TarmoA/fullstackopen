const supertest = require('supertest');
const app = require('../src/app');
const user = require('../src/models/user');
const db = require('../src/utils/db');

const api = supertest(app);

describe('POST /api/users', () => {
  beforeEach(async () => {
    await db.connect();
    await user.deleteAll();
  });

  afterEach(async () => {
    await db.close();
  });

  test('creation succeeds with a fresh username', async () => {
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
});
