import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Forecast } from './forecast.js';
import { server } from '../test-helpers/test-server.js';

beforeAll(() => server.listen());
beforeEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('<Forecast />', () => {
  test('should initially display empty forecast', () => {
    const component = render(<Forecast />);
    screen.getByText(/enter your zip code/i);
  });

  test('should fetch forecast with valid zip', async () => {
    const component = render(<Forecast />);

    const input = component.getByLabelText('ZIP');
    const submit = component.getByText('Submit', { selector: 'input' });

    // @TODO - SWAP THIS OUT FOR USER-EVENT
    fireEvent.change(input, { target: { value: '60660' } });
    fireEvent.click(submit);

    await waitFor(() => {
      component.getByText(/fetching/i);
    });

    await waitFor(() => {
      component.getByText(/skies: DB Response - Current/i);
    });
  });
  test.todo('should display...something... for zip with no info');
});
