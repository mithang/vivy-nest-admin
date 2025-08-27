/**
 * API Configuration Constants
 */

// Base API URL - Update this to match your backend server
// For development, you might need to use your computer's IP address
// instead of localhost when testing on a physical device
export const API_BASE_URL = 'http://192.168.1.8:9200' // Vivy Nest Admin port

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    CAPTCHA: '/auth/captcha',
    USER_INFO: '/auth/user/info',
    USER_ROUTERS: '/auth/user/routers',
  },
}

// HTTP Headers
export const HEADERS = {
  CONTENT_TYPE: 'application/json',
  ACCEPT: 'application/json',
}

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER_INFO: 'user_info',
}
