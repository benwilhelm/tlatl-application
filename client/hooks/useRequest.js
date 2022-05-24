import { useState, useRef } from 'react';

export function useRequest(client, req) {
  const controller = useRef(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  function processResponse(res) {
    setLoading(false);
    setError(null);
    setResponse({
      status: res.status,
      payload: res.data,
    });
  }

  function processError(err) {
    setLoading(false);
    if (err.response?.status) {
      processResponse(err.response);
    } else {
      setResponse(null);
      setError(err);
    }
  }

  return {
    loading,
    response,
    error,
    makeRequest: async (reqOverrides) => {
      setLoading(true);
      try {
        controller.current.abort();
      } catch {}

      try {
        controller.current = new AbortController();
        const response = await client.request({
          ...req,
          ...reqOverrides,
          signal: controller.current.signal,
        });
        processResponse(response);
      } catch (err) {
        processError(err);
      } finally {
        controller.current = null;
        setLoading(false);
      }
    },
    cancel: () => {
      controller.current.abort();
      setLoading(false);
      setResponse(null);
      setError(null);
    },
  };
}
