import request from 'supertest';
import app from '../app';
import { db, User } from '../db/index.js';

beforeEach(async () => {
  await db.sync({ force: true });
  await User.bulkCreate([
    { id: 123, name: 'Test User', email: 'test@example.com' },
  ]);
});

test('GET / responds with hello world', async () => {
  // arrange
  const api = request(app);

  // act
  const response = await api.get('/');

  // assert
  expect(response.status).toEqual(200);
  expect(response.body).toEqual({ hello: 'world' });
});

test('GET /users/:id responds with user record', async () => {
  // arrange
  const api = request(app);
  const userId = 123;
  const route = `/users/${userId}`;
  // account for user record?

  // act
  const response = await api.get(route);

  // assert
  expect(response.status).toEqual(200);
  expect(response.body.createdAt).toBeDefined();
  expect(response.body.updatedAt).toBeDefined();
  expect(response.body).toEqual(
    expect.objectContaining({
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
    })
  );
});

test('GET /users/:id responds 404 for non-existent id', async () => {
  // arrange
  const api = request(app);
  const route = '/users/456';
  // lack of user record

  // act
  const response = await api.get(route);

  // assert
  expect(response.status).toEqual(404);
});

test('POST /users creates new user record from JSON payload', async () => {
  // arrange
  const api = request(app);
  const payload = {
    name: 'New User',
    email: 'new@example.com',
  };
  const route = '/users';

  // act
  const response = await api.post(route).send(payload);

  // assert
  expect(response.status).toEqual(200);
  expect(response.body.id).toBeDefined();
  expect(response.body.createdAt).toBeDefined();
  expect(response.body.updatedAt).toBeDefined();
  expect(response.body).toEqual(expect.objectContaining(payload));
});

test('POST /users returns 400 and errors for missing name', async () => {
  // arrange
  const api = request(app);
  const route = '/users';
  const params = { email: 'new@example.com' }; // intentionally missing name

  const response = await api.post(route).send(params);

  expect(response.status).toEqual(400);
  expect(response.body.errors).toEqual([
    {
      message: 'Name is a required field',
      path: 'name',
      value: null,
    },
  ]);
});

// OYO
test.todo('POST /users responds 500 in case of error');
