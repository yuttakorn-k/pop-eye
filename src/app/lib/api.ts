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
    console.log('🚀 Axios Request:', config.method?.toUpperCase(), config.baseURL + config.url);
    
    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Axios Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Axios Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Axios Response Error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login or clear token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
