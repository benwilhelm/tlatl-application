import request from 'supertest';
import app from './app';

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
  expect(response.body).toEqual({
    id: userId,
    name: 'Test User',
    email: 'test@example.com',
  });
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
  expect(response.body).toEqual(expect.objectContaining(payload));

  // temporary assertion on persisted record
  const getResponse = await request(app).get(`/users/${response.body.id}`);
  expect(getResponse.body).toEqual({
    id: response.body.id,
    ...payload,
  });
});
