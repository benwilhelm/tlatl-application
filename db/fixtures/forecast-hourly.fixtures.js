import {
  mockTimeNowTopOfHour,
  mockTimeNow,
  mockZip,
} from '../../services/fixtures/forecast-api.fixtures';
const staleInterval = 3 * 3600; // three hours
const staleCutoff = (mockTimeNowTopOfHour - staleInterval) * 1000;
const mockTimeNowMS = mockTimeNow * 1000;

export const current = {
  zip: mockZip,
  timestamp: mockTimeNowTopOfHour,
  windSpeed: 10,
  windDirection: 'N',
  windDegree: 277,
  temperature: 65,
  skies: 'DB RESPONSE - Current',
  createdAt: new Date(mockTimeNowMS),
  updatedAt: new Date(mockTimeNowMS),
};

export const lessCurrent = {
  zip: mockZip,
  timestamp: mockTimeNowTopOfHour,
  windSpeed: 10,
  windDirection: 'N',
  windDegree: 277,
  temperature: 65,
  skies: 'DB RESPONSE - Less Current',
  createdAt: new Date(mockTimeNowMS - 1000),
  updatedAt: new Date(mockTimeNowMS - 1000),
};

export const stale = {
  zip: mockZip,
  timestamp: mockTimeNowTopOfHour,
  windSpeed: 10,
  windDirection: 'N',
  windDegree: 277,
  temperature: 65,
  skies: 'DB RESPONSE - Stale',
  createdAt: new Date(staleCutoff),
  updatedAt: new Date(staleCutoff),
};
