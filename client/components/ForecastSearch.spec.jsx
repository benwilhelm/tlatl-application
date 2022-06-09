import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ForecastSearch } from './ForecastSearch';
import userEvent from '@testing-library/user-event';

describe('<ForecastSearch />', () => {
  test('should prompt for ZIP initially', () => {
    const component = render(<ForecastSearch />);
    component.getByText(/enter your zip code/i);
  });

  test('should fetch forecast by zip', async () => {
    const component = render(<ForecastSearch />);
    const user = userEvent.setup();
    const input = component.getByLabelText('ZIP');
    const submit = component.getByRole('button', { name: /submit/i });

    input.focus();
    await user.keyboard('60660');

    await user.click(submit);

    await waitFor(() => {
      component.getByText(/fetching/i);
      expect(component.queryByText(/enter your zip code/i)).toBeNull();
    });

    await waitFor(() => {
      component.getByText(/Test Forecast from MSW/i);
      expect(component.queryByText(/fetching/i)).toBeNull();
      expect(component.queryByText(/enter your zip code/i)).toBeNull();
    });
  });
});
