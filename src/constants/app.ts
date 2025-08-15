import type {
  AppConfig,
  RouteNames,
  RoutePaths,
  FormFields,
  AnimationDuration,
  Breakpoints,
  ValidationPatterns,
  ValidationMessages,
} from '@/types/constants'

// Application constants
export const APP_CONFIG: AppConfig = {
  NAME: 'Todo Vue App',
  VERSION: '1.0.0',
  DESCRIPTION: 'Modern Todo application built with Vue 3, TypeScript, and Composition API',
  AUTHOR: 'Vue Developer',
  WEBSITE: 'https://todo-vue-app.com',
} as const

// Route names
export const ROUTE_NAMES: RouteNames = {
  LOGIN: 'Login',
  HOME: 'Home',
} as const

// Route paths
export const ROUTE_PATHS: RoutePaths = {
  LOGIN: '/login',
  HOME: '/',
} as const

// Form field names
export const FORM_FIELDS: FormFields = {
  USERNAME: 'username',
  PHONE_NUMBER: 'phoneNumber',
} as const

// Animation durations
export const ANIMATION_DURATION: AnimationDuration = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 600,
} as const

// Breakpoints for responsive design
export const BREAKPOINTS: Breakpoints = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
} as const

// Validation patterns
export const VALIDATION_PATTERNS: ValidationPatterns = {
  USERNAME: /^[a-zA-Z0-9\s\-']+$/,
  PHONE: /^[\d\s\-\(\)\+x]+$/,
} as const

// Validation messages
export const VALIDATION_MESSAGES: ValidationMessages = {
  USERNAME: 'Username can contain letters, numbers, spaces, hyphens, and apostrophes',
  PHONE:
    'Phone number can contain digits, spaces, hyphens, parentheses, plus signs, and x for extensions',
  REQUIRED: (field: string) => `${field} is required`,
} as const
