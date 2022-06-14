import React, { useState } from 'react';
import { getInstance as getApiClient } from '../services/api.js';
import { Forecast } from './Forecast.jsx';
import { server } from '../test-helpers/test-server.js';
import { useRequest } from '../hooks/useRequest.js';

const apiClient = getApiClient();

const getForecastByZip = async (zip) => {
  return apiClient.get('/forecast', {
    params: {
      zip,
      ts: Math.floor(Date.now() / 1000),
    },
  });
};

export const ForecastSearch = (props) => {
  const [zip, setZip] = useState('');
  const { fetching, response, error, makeRequest } = useRequest(apiClient, {
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
          makeRequest();
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
    </div>
  );
};

const InitialPrompt = () => {
  return <p>Enter your ZIP code to get a wind forecast.</p>;
};

const LoadingIndicator = () => {
  return <p>Fetching...</p>;
};
