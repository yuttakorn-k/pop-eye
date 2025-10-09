import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  // In Electron/Next dev, DNS/target may be slow; increase a bit but still reasonable
  timeout: API_CONFIG.TIMEOUT ?? 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login or clear token
      localStorage.removeItem('auth_token');
    }
    
    // Suppress timeout error logs in development
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      // Don't log timeout errors to console in development
      if (process.env.NODE_ENV !== 'development') {
        console.error('API Timeout:', error.message);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
