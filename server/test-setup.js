import { mockApiKey } from './services/fixtures/forecast-api.fixtures';

process.env.WEATHER_API_KEY = mockApiKey;
process.env.DATABASE_CONNECTION_STRING = 'sqlite::memory:';
