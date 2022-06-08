import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Forecast } from './components/Forecast.jsx';

const fakeForecast = {
  zip: '11111',
  timestamp: 1654713921,
  windSpeed: 10,
  windDirection: 'N',
  windDegree: 277,
  temperature: 65,
  skies: 'Fake Forecast',
  createdAt: new Date(1654713921678000),
  updatedAt: new Date(1654713921678000),
};

const appDiv = document.getElementById('app');
const App = () => {
  return (
    <div className="container">
      <Forecast forecast={fakeForecast} />
    </div>
  );
};

createRoot(appDiv).render(<App />);
