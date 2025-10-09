// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api/proxy',
  IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_URL || 'http://5.223.78.37:8001',
  TIMEOUT: 5000, // Reduced timeout to 5 seconds
  ENDPOINTS: {
    MENUS: '/menus/',
    ORDERS: '/orders/',
    CATEGORIES: '/categories/',
    PAYMENTS: '/payments/',
    TABLES: '/tables/',
    STAFF: '/staff/',
    IMAGES: '/images/',
    AUTH: {
      LOGIN: '/auth/login',
      ME: '/auth/me',
      TOKEN: '/auth/token'
    }
  }
};

// API Status
export const API_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error'
};
