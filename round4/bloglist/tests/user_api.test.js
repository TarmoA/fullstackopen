const supertest = require('supertest');
const app = require('../src/app');
const user = require('../src/models/user');

const api = supertest(app);

describe('POST /api/users', () => {
  beforeEach(async () => {
    await user.init();
    await user.deleteAll();
    await user.close();

    // const passwordHash = await bcrypt.hash('sekret', 10);
    // const user = new User({ username: 'root', passwordHash });

    // await user.save();
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
    await user.init();
    const after = await user.getAll();
    await user.close();
    console.log(after);
    expect(after.find((u) => u.username === testUser.username
      && u.name === testUser.name)).toBeTruthy();
  });
});
