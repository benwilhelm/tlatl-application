import React from 'react';
import { Forecast } from './Forecast.jsx';
import { factory as forecastFactory } from '../../server/db/fixtures/forecast-hourly.fixtures.js';
import { render } from '@testing-library/react';
import {
  mockTimeNow,
  mockTimeNowTopOfHour,
  mockZip,
} from '../../server/test-helpers/fixtures.js';

describe('<Forecast />', () => {
  test('it renders a given forecast', () => {
    const forecast = forecastFactory({
      skies: 'Beautifully Tested',
    });
    const component = render(<Forecast forecast={forecast} />);

    component.getByText(`Forecast for ${mockZip}`);
    component.getByText(/Sat, Mar 26 at/);
    component.getByText('Skies are Beautifully Tested');
    component.getByText('Winds from the North at 10mph');
    component.getByText('Temperature: 65°F');
  });
});
