import { server } from './forecast-api.mock-server';

beforeAll(() => server.listen());

beforeEach(() => server.resetHandlers());

afterAll(() => server.close());
