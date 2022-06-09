import React from 'react';
import { render } from '@testing-library/react';
import { ForecastSearch } from './ForecastSearch.jsx';
import userEvent from '@testing-library/user-event';
import { server } from '../test-helpers/test-server.js';

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<ForecastSearch />', () => {
  test('should prompt for ZIP initialy', () => {
    const component = render(<ForecastSearch />);
    const el = component.getByText(/enter your zip/i);
  });

  test('should fetch forecast by input zip', async () => {
    const component = render(<ForecastSearch />);
    const input = component.getByLabelText('ZIP');
    const submit = component.getByRole('button', { name: /submit/i });
    const user = userEvent.setup();

    input.focus();
    await user.keyboard('60660');
    await user.click(submit);

    // ensure Fetching appearing
    await component.findByText(/fetching/i);
    expect(component.queryByText(/enter your zip/i)).toBeNull();

    await component.findByText(/test forecast from msw/i);
    expect(component.queryByText(/fetching/i)).toBeNull();
    expect(component.queryByText(/enter your zip/i)).toBeNull();
  });
});
