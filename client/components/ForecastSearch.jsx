import React, { useState } from 'react';
import { getInstance as getApiClient } from '../services/api.js';
import { Forecast } from './Forecast.jsx';
import { useRequest } from '../hooks/useRequest.js';

const apiClient = getApiClient();

const isValidZip = (zip) => !!zip.match(/^\d{5}$/);

export const ForecastSearch = (props) => {
  const [zip, setZip] = useState('');
  const [formErrors, setFormErrors] = useState(null);
  const {
    fetching,
    response,
    error: fetchError,
    makeRequest,
  } = useRequest(apiClient, {
    url: '/forecast',
    params: {
      zip,
      ts: Math.floor(Date.now() / 1000),
    },
  });
  const forecast = response?.data;

  return (
    <div>
      <form
        role="form"
        className="form row form--forecast"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!isValidZip(zip)) {
            setFormErrors({
              zip: ['Invalid ZIP'],
            });
          } else {
            makeRequest();
          }
        }}
      >
        <div className="form-floating col-auto">
          <input
            type="text"
            name="zip"
            id="zip"
            required
            className="form-control"
            placeholder="10101"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
          <label htmlFor="zip">ZIP</label>
          {formErrors?.zip &&
            formErrors.zip.map((err) => <p key={err}>{err}</p>)}
        </div>

        <div className="col-auto">
          <input
            className="form-control btn btn-primary submit"
            type="submit"
            value="Submit"
          />
        </div>
      </form>
      {!fetching && !forecast && <InitialPrompt />}
      {fetching && <LoadingIndicator />}
      {forecast && <Forecast forecast={forecast} />}
      {fetchError && <FetchError />}
    </div>
  );
};

const InitialPrompt = () => {
  return <p>Enter your ZIP code to get a wind forecast.</p>;
};

const LoadingIndicator = () => {
  return <p>Fetching...</p>;
};

const FetchError = () => {
  return <p>Something went wrong...</p>;
};
