/**
 * API configuration for frontend
 * Centralized API settings and constants
 */

const API_CONFIG = {
  // Use same-origin API path in production by default (e.g., Hostinger domain + /api)
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '/api'),
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh'
  },
  
  PRODUCTS: {
    LIST: '/api/products',
    GET: (id) => `/api/products/${id}`,
    SEARCH: '/api/products/search'
  },
  
  CART: {
    GET: '/api/cart',
    ADD: '/api/cart/add',
    REMOVE: '/api/cart/remove',
    UPDATE: '/api/cart/update',
    CLEAR: '/api/cart/clear'
  },
  
  ORDERS: {
    CREATE: '/api/orders',
    LIST: '/api/orders',
    GET: (id) => `/api/orders/${id}`,
    TRACK: (id) => `/api/orders/${id}/track`
  },
  
  PAYMENTS: {
    CREATE: '/api/payments/create',
    VERIFY: '/api/payments/verify'
  },
  
  HEALTH: {
    STATUS: '/api/health',
    DB: '/api/health/db'
  }
};

export default API_CONFIG;
