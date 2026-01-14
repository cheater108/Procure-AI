import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Request Interceptor: Attach Session ID to every request
api.interceptors.request.use((config) => {
  const sessionId = localStorage.getItem('session_id');
  if (sessionId) {
    config.headers['x-session-id'] = sessionId;
  }
  return config;
});

// Response Interceptor: If server generates a NEW ID, save it
api.interceptors.response.use((response) => {
  const newSessionId = response.headers['x-session-id'];
  if (newSessionId) {
    localStorage.setItem('session_id', newSessionId);
  }
  return response;
});

export default api;