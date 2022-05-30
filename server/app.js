import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
import morgan from 'morgan';
import cors from 'cors';

const newApp = () => {
  const app = express();
  app.use(cors());
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(routes);

  return app;
};

export default newApp;
