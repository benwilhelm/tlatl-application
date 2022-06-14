import { useState } from 'react';

export function useRequest(client, baseRequest) {
  const [fetching, setFetching] = useState(false);
  const [response, setResponse] = useState(null);

  const makeRequest = (reqOverrides = {}) => {
    setFetching(true);
    client.request(baseRequest).then((res) => {
      setFetching(false);
      setResponse({
        status: res.status,
        data: res.data,
      });
    });
  };

  return {
    fetching,
    response,
    error: null,
    makeRequest,
  };
}
