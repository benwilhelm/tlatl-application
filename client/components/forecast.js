import React from 'react';
import { getInstance } from '../services/api.js';

const apiClient = getInstance();
import { useRequest } from '../hooks/useRequest.js';

export const Forecast = (props) => {
  const { makeRequest, loading, response } = useRequest(apiClient, {
    method: 'get',
    url: '/forecast',
  });

  return (
    <div>
      <form
        className="form row form--forecast"
        onSubmit={(e) => {
          e.preventDefault();
          makeRequest();
        }}
      >
        <div className="form-floating col-auto">
          <input
            type="text"
            name="zip"
            id="zip"
            className="form-control"
            placeholder="10101"
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

      {!loading && !response && <InitialPrompt />}
      {loading && <LoadingIndicator />}
      {response?.status === 200 && (
        <ForecastResponse forecast={response.payload} />
      )}
    </div>
  );
};

const InitialPrompt = () => {
  return <p>Enter your ZIP code to get a wind forecast.</p>;
};

const LoadingIndicator = () => {
  return <p>Fetching...</p>;
};

const ForecastResponse = (forecast) => {
  return (
    <div>
      <h2 className="forecast--skies">Skies: {forecast.skies}</h2>
    </div>
  );
};
