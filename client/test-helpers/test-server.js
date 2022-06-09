import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { factory as forecastFactory } from '../../server/db/fixtures/forecast-hourly.fixtures.js';

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const handlers = [
  rest.get('http://localhost:3000/forecast', async (req, res, ctx) => {
    const zip = req.url.searchParams.get('zip');
    const ts = req.url.searchParams.get('ts');

    await delay(10);

    if (!zip || !ts) {
      return res(ctx.status(400));
    }
    const forecast = forecastFactory({
      skies: 'Test Forecast from MSW',
      zip,
      timestamp: ts,
    });
    return res(ctx.status(200), ctx.json(forecast));
  }),
];

export const server = setupServer(...handlers);
