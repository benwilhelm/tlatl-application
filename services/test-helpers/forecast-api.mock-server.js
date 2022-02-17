import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { responseOneDayHourly, mockApiKey } from './forecast-api.fixtures';

export const mock401Error = {
  code: 2006,
  message: 'API key is invalid',
};

const handlers = [
  rest.get('https://api.weatherapi.com/v1/forecast.json', (req, res, ctx) => {
    const zip = req.url.searchParams.get('q');
    const key = req.url.searchParams.get('key');

    if (key === mockApiKey) {
      return res(ctx.json(responseOneDayHourly));
    }

    return res(ctx.status(401), ctx.json({ error: mock401Error }));
  }),
];

export const server = setupServer(...handlers);
