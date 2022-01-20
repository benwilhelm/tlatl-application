import express from 'express';
const app = express();

const users = [{ id: 123, name: 'Test User', email: 'test@example.com' }];

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.get('/users/:id', (req, res) => {
  const id = +req.params.id;

  const user = users.find((u) => u.id === id);

  res.json(user);
});

export default app;
