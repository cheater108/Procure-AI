import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
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