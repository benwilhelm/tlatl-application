import { db, User } from './db';

beforeAll(() => db.sync({ force: true }));

test('User model should save with name, email', async () => {
  const params = {
    name: 'New User',
    email: 'new@example.com',
  };

  const subject = await User.create(params);

  expect(subject.id).toBeDefined();
  expect(subject.createdAt).toBeDefined();
  expect(subject.updatedAt).toBeDefined();
  expect(subject).toEqual(expect.objectContaining(params));
});
