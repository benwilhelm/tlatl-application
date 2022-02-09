import { Router } from 'express';
import users from './users.js';

const routes = new Router();

routes.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

routes.use('/users', users);

export default routes;
