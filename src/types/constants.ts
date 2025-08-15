// Types for constants
export interface ApiConfig {
  readonly BASE_URL: string
  readonly ENDPOINTS: {
    readonly USERS: string
    readonly TODOS: string
  }
  readonly TIMEOUT: number
}

export interface HttpStatus {
  readonly OK: number
  readonly CREATED: number
  readonly BAD_REQUEST: number
  readonly UNAUTHORIZED: number
  readonly FORBIDDEN: number
  readonly NOT_FOUND: number
  readonly TOO_MANY_REQUESTS: number
  readonly INTERNAL_SERVER_ERROR: number
}

export interface ErrorMessages {
  readonly NETWORK_ERROR: string
  readonly FETCH_FAILED: string
  readonly LOGIN_ERROR: string
  readonly SERVER_ERROR: string
  readonly TIMEOUT_ERROR: string
}

export interface AppConfig {
  readonly NAME: string
  readonly VERSION: string
  readonly DESCRIPTION: string
  readonly AUTHOR: string
  readonly WEBSITE: string
}

export interface RouteNames {
  readonly LOGIN: string
  readonly HOME: string
}

export interface RoutePaths {
  readonly LOGIN: string
  readonly HOME: string
}

export interface FormFields {
  readonly USERNAME: string
  readonly PHONE_NUMBER: string
}

export interface AnimationDuration {
  readonly FAST: number
  readonly NORMAL: number
  readonly SLOW: number
}

export interface Breakpoints {
  readonly MOBILE: number
  readonly TABLET: number
  readonly DESKTOP: number
}

export interface ValidationPatterns {
  readonly USERNAME: RegExp
  readonly PHONE: RegExp
}

export interface ValidationMessages {
  readonly USERNAME: string
  readonly PHONE: string
  readonly REQUIRED: (field: string) => string
}
