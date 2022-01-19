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
