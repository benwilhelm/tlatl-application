import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ForecastSearch } from './ForecastSearch.jsx';
import { server } from '../test-helpers/test-server.js';

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<ForecastSearch />', () => {
  test('should initially display empty forecast', () => {
    const component = render(<ForecastSearch />);
    screen.getByText(/enter your zip code/i);
  });

  test('should not submit without a zip', async () => {
    const { user, submit } = componentFactory();
    const onRequest = jest.fn();
    server.events.on('request:start', onRequest);

    await user.click(submit);

    expect(onRequest).not.toHaveBeenCalled();
  });

  test('should fetch forecast with valid zip', async () => {
    const { user, component, input, submit } = componentFactory();
    input.focus();
    user.keyboard('60660');

    await user.click(submit);

    await waitFor(() => {
      component.getByText(/fetching/i);
    });

    await waitFor(() => {
      component.getByText(/DB Response - Current/i);
    });
  });

  test.todo('should display...something... for zip with no info');
});

function componentFactory() {
  const user = userEvent.setup();
  const component = render(<ForecastSearch />);

  const input = component.getByLabelText('ZIP');
  const submit = component.getByRole('button', { name: /submit/i });
  const form = component.getByRole('form');

  return {
    user,
    form,
    component,
    input,
    submit,
  };
}
