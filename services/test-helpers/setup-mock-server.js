import { server as weatherApi } from './forecast-api.mock-server';

beforeAll(() => weatherApi.listen({ onUnhandledRequest: 'bypass' }));
beforeEach(() => weatherApi.resetHandlers());
afterAll(() => weatherApi.close());
