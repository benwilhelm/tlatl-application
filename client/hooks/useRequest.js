import { useState } from 'react';

export function useRequest(client, baseRequest) {
  const [fetching, setFetching] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const makeRequest = (reqOverrides = {}) => {
    setFetching(true);
    client
      .request(baseRequest)
      .then((res) => {
        // console.log(res);
        setFetching(false);
        setResponse({
          status: res.status,
          data: res.data,
        });
      })
      .catch((e) => {
        setFetching(false);
        console.log(e.response);
        if (e.response?.status) {
          e = {
            status: e.response.status,
            data: e.response.data,
          };
        }
        console.log('hook error', e);
        setError(e);
      });
  };

  return {
    fetching,
    response,
    error,
    makeRequest,
  };
}
