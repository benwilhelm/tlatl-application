import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
import morgan from 'morgan';

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(routes);

export default app;
