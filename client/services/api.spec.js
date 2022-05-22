import { getInstance } from './api.js';

describe('getInstance', () => {
  test('returns same client every time', () => {
    const client1 = getInstance();
    const client2 = getInstance();

    expect(client1).toBe(client2);
  });
});
