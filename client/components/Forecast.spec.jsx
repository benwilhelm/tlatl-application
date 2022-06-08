import React from 'react';
import { Forecast } from './Forecast.jsx';
import { render } from '@testing-library/react';
import { factory as forecastFactory } from '../../server/db/fixtures/forecast-hourly.fixtures.js';

describe('<Forecast />', () => {
  test('it renders a given forecast', () => {
    // arrange
    const forecast = forecastFactory({
      skies: 'Beautifully Tested',
      zip: '11111',
    });

    // act
    const component = render(<Forecast forecast={forecast} />);

    // assert
    component.getByText('Forecast for ZIP Code 11111');
    // @todo use local timezone
    component.getByText('Sat, Mar 26 at 5:00 AM UTC');
    component.getByText('Skies are Beautifully Tested');
    component.getByText('Winds from the North at 10mph');
    component.getByText('Temperature: 65°F');
  });

  describe('Human-friendly wind display', () => {
    test.each([
      ['N', 1, 'North'],
      ['E', 2, 'East'],
      ['S', 3, 'South'],
      ['W', 4, 'West'],
      ['NE', 5, 'Northeast'],
      ['SSW', 6, 'South-Southwest'],
    ])(
      'direction %s, speed %i',
      (windDirection, windSpeed, expandedDirection) => {
        const forecast = forecastFactory({ windDirection, windSpeed });
        const component = render(<Forecast forecast={forecast} />);
        const expected = `Winds from the ${expandedDirection} at ${windSpeed}mph`;
        component.getByText(expected);
      }
    );
  });
});
