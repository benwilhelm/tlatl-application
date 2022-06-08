import { useEffect, useState, useRef } from 'react';

export function useRequest(client, baseRequest) {
  const controller = useRef(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [request, setRequest] = useState(null);

  useEffect(() => {
    // console.log('running effect', request);
    if (request === null) return;
    const reqCopy = { ...request };
    const abortController = new AbortController();
    // console.log('making request', request);
    setLoading(true);
    client
      .request({
        ...request,
        signal: abortController.signal,
      })
      .then(processResponse)
      .catch(processError);

    return () => {
      // console.log('aborting', reqCopy);
      abortController.abort();
    };
  }, [request]);

  function processResponse(res) {
    // console.log('processing response', res.data);
    setLoading(false);
    setError(null);
    setResponse({
      status: res.status,
      payload: res.data,
    });
  }

  function processError(err) {
    // console.log('processing error', err);
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
    request,
    makeRequest: (reqOverrides = {}) => {
      // console.log('making request', reqOverrides);
      setRequest({ ...baseRequest, ...reqOverrides });
    },
    cancel: () => {
      setRequest(null);
    },
  };
}
