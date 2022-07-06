import { rest } from 'msw';
import { setupServer } from 'msw/node/lib/index.js';
import { mockZip } from '../../test-helpers/fixtures.js';
import {
  responseThreeDayHourly,
  updateForecastTimes,
  mockApiKey,
} from '../fixtures/forecast-api.fixtures.js';

export const mock401Error = {
  code: 2006,
  message: 'API key is invalid',
};

const handlers = [
  rest.get('https://api.weatherapi.com/v1/forecast.json', (req, res, ctx) => {
    const zip = req.url.searchParams.get('q');
    const key = req.url.searchParams.get('key');
    const days = +req.url.searchParams.get('days');

    if (key !== mockApiKey) {
      return res(ctx.status(401), ctx.json({ error: mock401Error }));
    }

    if (zip === '00500') {
      return res(ctx.status(500));
    }

    if (days === 3) {
      const forecast = updateForecastTimes(responseThreeDayHourly, Date.now());
      return res(ctx.json(forecast));
    }

    throw new Error(`unrecognized request: ${req.url}`);
  }),
];

export const server = setupServer(...handlers);
