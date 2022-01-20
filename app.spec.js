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
