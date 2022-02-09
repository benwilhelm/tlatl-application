import { db } from './db.js';
import { User } from './user.js';

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

test('User model should not save without a name property', () => {
  const params = { email: 'new@example.com' }; // missing name intentionally

  const subject = User.create(params);

  expect(subject).rejects.toThrow(/name is a required field/i);
});

test('User model should not save without an email property', () => {
  const params = { name: 'New User' }; // missing email intentionally

  const subject = User.create(params);

  expect(subject).rejects.toThrow(/email is a required field/i);
});

test('User model should not save with malformed email', () => {
  const params = { name: 'New User', email: 'notanemail.com' };

  const subject = User.create(params);

  expect(subject).rejects.toThrow(/email does not appear valid/i);
});
