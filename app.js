import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const users = [{ id: 123, name: 'Test User', email: 'test@example.com' }];

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.get('/users/:id', (req, res) => {
  const id = +req.params.id;

  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).send();
  }

  res.json(user);
});

app.post('/users', (req, res) => {
  const body = req.body;

  const id = Math.floor(Math.random() * 10000);
  const user = { ...body, id };
  users.push(user);

  res.json(user);
});

export default app;