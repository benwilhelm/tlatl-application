import express from 'express';
import bodyParser from 'body-parser';
import { db, User } from './db';
import { ValidationError } from 'sequelize';

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.get('/users/:id', async (req, res) => {
  const id = +req.params.id;

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(404).send();
  }

  res.json(user);
});

app.post('/users', async (req, res, next) => {
  try {
    const body = req.body;
    const user = await User.create(body);
    res.json(user);
  } catch (err) {
    if (err instanceof ValidationError) {
      const errors = err.errors.map((e) => {
        const { message, path, value } = e;
        return { message, path, value };
      });
      return res.status(400).json({
        errors,
      });
    }
    return next(err);
  }
});

export default app;
