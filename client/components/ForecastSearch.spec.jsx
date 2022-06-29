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
    const { component, input, submit, user } = componentFactory();
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

  test('should display error for bad ZIP, and not make request', async () => {
    const { component, input, submit, user } = componentFactory();
    const cb = jest.fn();
    server.events.on('request:start', cb);

    input.focus();
    await user.keyboard('6066');
    await user.click(submit);

    await component.findByText(/invalid zip/i);
    expect(cb).not.toHaveBeenCalled();
  });

  test('should display error for 500 response from API', async () => {
    const { component, input, submit, user } = componentFactory();

    input.focus();
    await user.keyboard('00500');
    await user.click(submit);

    await component.findByText(/something went wrong/i);
  });
});

function componentFactory() {
  const component = render(<ForecastSearch />);
  const input = component.getByLabelText('ZIP');
  const submit = component.getByRole('button', { name: /submit/i });
  const user = userEvent.setup();

  return {
    component,
    input,
    submit,
    user,
  };
}
