import React from 'react';
import { createRoot } from 'react-dom/client';

const appDiv = document.getElementById('app');
const App = () => {
  return (
    <div className="container">
      <form className="form row form--forecast">
        <div className="form-floating col-auto">
          <input
            type="text"
            name="zip"
            className="form-control"
            placeholder="10101"
          />
          <label htmlFor="zip">ZIP</label>
        </div>
        <div className="col-auto">
          <input
            className="form-control btn btn-primary submit"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

createRoot(appDiv).render(<App />);
