import { useEffect, useState, useRef } from 'react';

export function useRequest(client, baseRequest) {
  const controller = useRef(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const abortController = useRef(null);

  function processResponse(res) {
    console.log('processing response', res.data);
    setError(null);
    setResponse({
      status: res.status,
      payload: res.data,
    });
  }

  function processError(err) {
    console.log('processing error', err);
    if (err.response?.status) {
      processResponse(err.response);
    } else {
      setResponse(null);
      setError(err);
    }
  }

  function processCleanup() {
    abortController.current = null;
    setLoading(false);
  }

  return {
    loading,
    response,
    error,
    makeRequest: (reqOverrides = {}) => {
      const req = { ...baseRequest, ...reqOverrides };
      console.log('making request', req, abortController.current);
      if (abortController.current) {
        console.log('aborting?');
        abortController.current.abort();
      }
      setLoading(true);
      setResponse(null);
      setError(null);
      abortController.current = new AbortController();
      client
        .request(req)
        .then(processResponse)
        .catch(processError)
        .finally(processCleanup);
    },
    cancel: () => {
      console.log('cancel');
      if (abortController) {
        abortController.current.abort();
      }
    },
  };
}
