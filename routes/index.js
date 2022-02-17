import { Router } from 'express';
import users from './users.js';
import forecast from './forecast.js';

const routes = new Router();

routes.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

routes.use('/users', users);
routes.use('/forecast', forecast);

export default routes;
