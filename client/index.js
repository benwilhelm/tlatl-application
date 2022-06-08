import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ForecastSearch } from './components/ForecastSearch.jsx';

const appDiv = document.getElementById('app');
const App = () => {
  return (
    <div className="container">
      <ForecastSearch />
    </div>
  );
};

createRoot(appDiv).render(<App />);
