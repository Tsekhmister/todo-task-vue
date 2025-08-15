import type { ValidationPatterns, ValidationMessages } from '@/types/constants'

// Validation patterns and utilities
export const VALIDATION_PATTERNS: ValidationPatterns = {
  USERNAME: /^[A-Za-z\s'-]+$/,
  PHONE: /^[0-9+\-\(\)\sx]+$/,
} as const

export const VALIDATION_MESSAGES: ValidationMessages = {
  USERNAME: 'Only english letters, spaces, hyphens and apostrophes allowed',
  PHONE: 'Only numbers, phone symbols and extension (x) allowed',
  REQUIRED: (field: string) => `${field} is required`,
} as const

// Generic validator function with type safety
export const createValidator = (
  data: Record<string, unknown>,
  errors: Record<string, string>,
  field: string,
  pattern: RegExp,
  errorMsg: string,
): (() => boolean) => {
  return (): boolean => {
    if (!data[field]) {
      const requiredMsg = VALIDATION_MESSAGES.REQUIRED(field)
      errors[field] = requiredMsg
    } else if (!pattern.test(String(data[field]))) {
      errors[field] = errorMsg
    } else {
      errors[field] = ''
    }

    const isValid = !errors[field]
    return isValid
  }
}

// Specific validators
export const validateUsername = (
  data: { username: string },
  errors: { username: string },
): boolean => {
  return createValidator(
    data,
    errors,
    'username',
    VALIDATION_PATTERNS.USERNAME,
    VALIDATION_MESSAGES.USERNAME,
  )()
}

export const validatePhone = (
  data: { phoneNumber: string },
  errors: { phoneNumber: string },
): boolean => {
  return createValidator(
    data,
    errors,
    'phoneNumber',
    VALIDATION_PATTERNS.PHONE,
    VALIDATION_MESSAGES.PHONE,
  )()
}
