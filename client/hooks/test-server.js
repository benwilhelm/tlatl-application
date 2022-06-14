import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const error404 = { message: 'not found' };
export const error500 = { message: 'server error' };

const domain = 'https://example.com';

const respond = (res, ctx, { delay, status, payload }) => {
  return res(
    ctx.delay(delay || 3),
    ctx.status(status || 200),
    ctx.json(payload)
  );
};

const handlers = [
  rest.get(`${domain}/200`, async (req, res, ctx) => {
    const hello = req.url.searchParams.get('hello') || 'world';
    return respond(res, ctx, {
      payload: { hello },
    });
  }),

  rest.get(`${domain}/404`, async (req, res, ctx) =>
    respond(res, ctx, {
      status: 404,
      payload: error404,
    })
  ),

  rest.get(`${domain}/500`, async (req, res, ctx) =>
    respond(res, ctx, {
      status: 500,
      payload: error500,
    })
  ),
];

export const server = setupServer(...handlers);
