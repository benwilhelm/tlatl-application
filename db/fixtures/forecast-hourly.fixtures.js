import {
  mockTimeNowTopOfHour,
  mockTimeNow,
  mockZip,
} from '../../test-helpers/fixtures.js';
const staleInterval = 3 * 3600; // three hours
const staleCutoff = (mockTimeNow - staleInterval) * 1000;
const mockTimeNowMS = mockTimeNow * 1000;

export function factory(overrides) {
  const defaults = {
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

  return { ...defaults, ...overrides };
}

export const current = factory();

export const wrongZip = factory({
  zip: '10101',
  skies: 'DB RESPONSE - Wrong Zip',
});

export const wrongTimestamp = factory({
  timestamp: mockTimeNowTopOfHour - 7200,
  skies: 'DB RESPONSE - WrongTimestamp',
});

export const lessCurrent = factory({
  skies: 'DB RESPONSE - Less Current',
  createdAt: new Date(mockTimeNowMS - 1000),
  updatedAt: new Date(mockTimeNowMS - 1000),
});

export const notQuiteStale = factory({
  skies: 'DB RESPONSE - Not Quite Stale',
  createdAt: new Date(staleCutoff + 1),
  updatedAt: new Date(staleCutoff + 1),
});

export const stale = factory({
  skies: 'DB RESPONSE - Stale',
  createdAt: new Date(staleCutoff),
  updatedAt: new Date(staleCutoff),
});
