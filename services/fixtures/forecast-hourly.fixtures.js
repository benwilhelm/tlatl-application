import { mockTimeNowTopOfHour, mockTimeNow } from './forecast-api.fixtures';
const staleInterval = 3 * 3600; // three hours
const staleCutoff = (mockTimeNowTopOfHour - staleInterval) * 1000;

export const current = {
  zip: '60660',
  timestamp: mockTimeNowTopOfHour,
  windSpeed: 10,
  windDirection: 'N',
  windDegree: 277,
  temperature: 65,
  skies: 'DB RESPONSE - Current',
  createdAt: mockTimeNow,
  updatedAt: mockTimeNow,
};

export const stale = {
  zip: '60660',
  timestamp: mockTimeNowTopOfHour,
  windSpeed: 10,
  windDirection: 'N',
  windDirection: 277,
  temperature: 65,
  skies: 'DB RESPONSE - Stale',
  createdAt: staleCutoff,
  updatedAt: staleCutoff,
};
