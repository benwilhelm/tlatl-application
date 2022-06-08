import React, { useState } from 'react';
import { getInstance as getApiClient } from '../services/api.js';
import { Forecast } from './Forecast.jsx';

const apiClient = getApiClient();

export const ForecastSearch = (props) => {
  return (
    <div>
      <form
        role="form"
        className="form row form--forecast"
        onSubmit={() => {
          e.preventDefault();
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
    </div>
  );
};

const InitialPrompt = () => {
  return <p>Enter your ZIP code to get a wind forecast.</p>;
};

const LoadingIndicator = () => {
  return <p>Fetching...</p>;
};
