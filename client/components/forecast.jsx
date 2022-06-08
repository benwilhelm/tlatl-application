import React from 'react';

export const Forecast = ({ forecast }) => {
  return (
    <div>
      <p>Forecast for ZIP Code {forecast.zip}</p>
      <p>{formatSecondsToTime(forecast.timestamp)}</p>
      <p>Skies are {forecast.skies}</p>
      <p>
        Winds from the{' '}
        {displayWindData(forecast.windSpeed, forecast.windDirection)}
      </p>
      <p>Temperature: {forecast.temperature}&deg;F</p>
    </div>
  );
};

function formatSecondsToTime(seconds) {
  const ts = seconds * 1000;
  const dateTime = new Date(ts);

  const dateString = dateTime.toLocaleDateString('en-us', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
    timeZone: 'UTC',
  });

  const timeString = dateTime.toLocaleTimeString('en-us', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  });

  return `${dateString} at ${timeString}`;
}

function displayWindData(mph, direction) {
  const directions = {
    N: 'North',
    E: 'East',
    S: 'South',
    W: 'West',
    NE: 'Northeast',
    NW: 'Northwest',
    SE: 'Southeast',
    SW: 'Southwest',
    NNE: 'North-Northeast',
    ENE: 'East-Northeast',
    SSE: 'South-Southeast',
    ESE: 'East-Southeast',
    SSW: 'South-Southwest',
    WSW: 'West-Southwest',
    WNW: 'West-Northwest',
    NNW: 'North-Northwest',
  };

  return `${directions[direction]} at ${mph}mph`;
}
