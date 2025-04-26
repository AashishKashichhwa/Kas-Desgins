// src/api/ApiEndpoint.js
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Optional for error toast

export const instance = axios.create({
  baseURL: 'http://localhost:4000', // ✅ Correct server URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ Allow cookies to be sent
});

// Common API functions if you want
export const get = (url, params) => instance.get(url, { params });
export const post = (url, data) => instance.post(url, data);
export const put = (url, data) => instance.put(url, data);
export const deleteUser = (url) => instance.delete(url, { withCredentials: true });

// Request Interceptor (optional)
instance.interceptors.request.use(
  config => {
    return config;
  },
  error => Promise.reject(error)
);

// Response Interceptor
instance.interceptors.response.use(
  response => {
    console.log('Interceptor success:', response);
    return response;
  },
  error => {
    console.error('Interceptor error:', error);
    if (error.response && error.response.status === 401) {
      toast.error('Session expired. Please login again.');
      // Optional redirect to login: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
