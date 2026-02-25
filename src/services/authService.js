import api from './api';

export const authAPI = {
  signup: (data) => {
    console.log('Signup request data:', data);
    return api.post('/auth/signup', data).catch((error) => {
      console.error('Signup error response:', error.response?.data || error.message);
      throw error;
    });
  },
  login: (data) => {
    console.log('Login request data:', data);
    return api.post('/auth/login', data).catch((error) => {
      console.error('Login error response:', error.response?.data || error.message);
      throw error;
    });
  },
  getMe: () => api.get('/auth/me'),
};

export default authAPI;
