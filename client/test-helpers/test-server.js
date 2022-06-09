import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { factory } from '../../server/db/fixtures/forecast-hourly.fixtures.js';

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const handlers = [
  rest.get('http://localhost:3000/forecast', async (req, res, ctx) => {
    // console.log(
    //   req.url.searchParams.get('zip'),
    //   req.url.searchParams.get('ts')
    // );
    const zip = req.url.searchParams.get('zip');
    const ts = req.url.searchParams.get('ts');

    await delay(10);

    if (!zip || !ts) {
      return res(ctx.status(400));
    }

    return res(
      ctx.status(200),
      ctx.json(
        factory({
          skies: 'Test Forecast from MSW',
          zip,
          timestamp: ts,
        })
      )
    );
  }),
];

export const server = setupServer(...handlers);
