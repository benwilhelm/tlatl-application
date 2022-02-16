import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { responseOneDayHourly } from './forecast-api.fixtures';

const handlers = [
  rest.get('https://api.weatherapi.com/v1/forecast.json', (req, res, ctx) => {
    const zip = req.url.searchParams.get('q');
    return res(ctx.json(responseOneDayHourly));
  }),
];

export const server = setupServer(...handlers);
