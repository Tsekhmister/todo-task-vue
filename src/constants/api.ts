import type { ApiConfig, HttpStatus, ErrorMessages } from '@/types/constants'

// API configuration constants
export const API_CONFIG: ApiConfig = {
  BASE_URL: 'https://jsonplaceholder.typicode.com',
  ENDPOINTS: {
    USERS: '/users',
    TODOS: '/todos',
  },
  TIMEOUT: 10000, // 10 seconds
} as const

// HTTP status codes
export const HTTP_STATUS: HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const

// Error messages
export const ERROR_MESSAGES: ErrorMessages = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  FETCH_FAILED: 'Failed to fetch data. Please try again.',
  LOGIN_ERROR: 'Invalid username or phone number.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
} as const
