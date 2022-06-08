import React, { useState } from 'react';
// import DateTimePicker from 'react-datetime-picker';
import { getInstance } from '../services/api.js';
import { Forecast } from './Forecast.jsx';

const apiClient = getInstance();
import { useRequest } from '../hooks/useRequest.js';

export const ForecastSearch = (props) => {
  const [zip, setZip] = useState('');
  const { makeRequest, loading, response } = useRequest(apiClient, {
    method: 'get',
    url: '/forecast',
  });

  return (
    <div>
      <form
        role="form"
        className="form row form--forecast"
        onSubmit={(e) => {
          e.preventDefault();
          if (!zip) return;

          makeRequest({
            params: {
              zip,
              ts: Date.now() / 1000,
            },
          });
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

        {/* <div className="col-auto">
          <DateTimePicker format="y-MM-dd h:mm a" />
        </div> */}
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
      {response?.status === 200 && <Forecast forecast={response.payload} />}
    </div>
  );
};

const InitialPrompt = () => {
  return <p>Enter your ZIP code to get a wind forecast.</p>;
};

const LoadingIndicator = () => {
  return <p>Fetching...</p>;
};
