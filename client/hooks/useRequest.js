import { useState } from 'react';

export function useRequest(client, baseRequest) {
  const [fetching, setFetching] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const startFetching = () => {
    setFetching(true);
    setError(null);
    setResponse(null);
  };

  const resolveWith = (response) => {
    setFetching(false);
    setError(null);
    setResponse(response);
  };

  const errorWith = (error) => {
    setFetching(false);
    setError(error);
    setResponse(null);
  };

  const makeRequest = (reqOverrides = {}) => {
    startFetching();
    client
      .request(baseRequest)
      .then((res) => {
        resolveWith({
          status: res.status,
          data: res.data,
        });
      })
      .catch((e) => {
        if (e.response?.status) {
          e = {
            status: e.response.status,
            data: e.response.data,
          };
        }
        errorWith(e);
      });
  };

  return {
    fetching,
    response,
    error,
    makeRequest,
  };
}
