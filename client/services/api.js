import axios from 'axios';

export function createClient({ baseURL }) {
  return axios.create({
    baseURL,
    timeout: 5000,
  });
}

export const getInstance = (() => {
  const instance = createClient({ baseURL: 'http://example.com' });
  return () => instance;
})();
