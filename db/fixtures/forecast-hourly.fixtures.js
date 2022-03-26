import {
  mockTimeNowTopOfHour,
  mockTimeNow,
  mockZip,
} from '../../test-helpers/fixtures.js';
const staleInterval = 3 * 3600; // three hours
const staleCutoff = (mockTimeNow - staleInterval) * 1000;
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

export const wrongZip = {
  zip: '10101',
  timestamp: mockTimeNowTopOfHour,
  windSpeed: 10,
  windDirection: 'N',
  windDegree: 277,
  temperature: 65,
  skies: 'DB RESPONSE - Wrong Zip',
  createdAt: new Date(mockTimeNowMS),
  updatedAt: new Date(mockTimeNowMS),
};

export const wrongTimestamp = {
  zip: mockZip,
  timestamp: mockTimeNowTopOfHour - 7200,
  windSpeed: 10,
  windDirection: 'N',
  windDegree: 277,
  temperature: 65,
  skies: 'DB RESPONSE - WrongTimestamp',
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

export const notQuiteStale = {
  zip: mockZip,
  timestamp: mockTimeNowTopOfHour,
  windSpeed: 10,
  windDirection: 'N',
  windDegree: 277,
  temperature: 65,
  skies: 'DB RESPONSE - Not Quite Stale',
  createdAt: new Date(staleCutoff + 1),
  updatedAt: new Date(staleCutoff + 1),
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
