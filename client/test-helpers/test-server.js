import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { current } from '../../db/fixtures/forecast-hourly.fixtures.js';

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const handlers = [
  rest.get('http://localhost:3000/forecast', async (req, res, ctx) => {
    const zip = req.url.searchParams.get('zip');
    const ts = req.url.searchParams.get('ts');

    await delay(10);

    return res(ctx.status(200), ctx.json(current));
  }),
];

export const server = setupServer(...handlers);
