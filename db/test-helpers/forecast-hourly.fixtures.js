import { mockTimeNowTopOfHour } from '../../services/test-helpers/forecast-api.fixtures';

export function paramFactory(overrides = {}) {
  const defaults = {
    zip: '11111',
    timestamp: mockTimeNowTopOfHour,
    windSpeed: 10,
    windDirection: 'N',
    temperature: 65,
    skies: 'DB RESPONSE',
  };

  return { ...defaults, ...overrides };
}

export function stale(overrides = {}) {
  const staleInterval = 3 * 3600;
  const staleCutoff = (mockTimeNowTopOfHour - staleInterval) * 1000;
  overrides.updatedAt = new Date(staleCutoff);
  return paramFactory(overrides);
}

export {
  mockTimeNow,
  mockTimeNowTopOfHour,
  mockTimeNowTopOfDay,
} from '../../services/test-helpers/forecast-api.fixtures';
