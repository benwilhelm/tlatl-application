import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Forecast } from './components/forecast.js';

const appDiv = document.getElementById('app');
const App = () => {
  return (
    <div className="container">
      <Forecast />
    </div>
  );
};

createRoot(appDiv).render(<App />);
