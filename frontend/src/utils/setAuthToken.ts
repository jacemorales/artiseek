import api from '../api/axios';

const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete api.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
