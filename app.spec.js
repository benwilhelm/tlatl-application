const request = require('supertest');
const app = require('./app');

describe('/', () => {
  test('should return {hello: "world" }', async () => {
    const rslt = await request(app).get('/');
    expect(rslt.status).toEqual(200);
    expect(rslt.body).toEqual({ hello: 'world' });
  });
});
