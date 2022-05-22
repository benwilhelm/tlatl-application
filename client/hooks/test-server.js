import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const error404 = { message: 'not found' };
export const error500 = { message: 'server error' };
export const payload = { hello: 'world' };
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const domain = 'https://example.com';

async function processRequestOptions(req) {
  const ms = req.url.searchParams.get('delay') || 10;
  await delay(ms);
}

const handlers = [
  rest.get(`${domain}/200`, async (req, res, ctx) => {
    await processRequestOptions(req);
    const hello = req.url.searchParams.get('hello') || 'world';
    return res(ctx.status(200), ctx.json({ hello }));
  }),

  // rest.post(`${domain}/200`, async(req, res, ctx) => {

  // })

  rest.get(`${domain}/404`, async (req, res, ctx) => {
    return res(ctx.status(404), ctx.json(error404));
  }),
];

export const server = setupServer(...handlers);
