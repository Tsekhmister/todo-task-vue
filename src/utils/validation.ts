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
    console.log(`🔍 Validating field "${field}":`, data[field])

    if (!data[field]) {
      const requiredMsg = VALIDATION_MESSAGES.REQUIRED(field)
      console.log(`❌ Field "${field}" is empty:`, requiredMsg)
      errors[field] = requiredMsg
    } else if (!pattern.test(String(data[field]))) {
      console.log(`❌ Field "${field}" doesn't match pattern:`, errorMsg)
      console.log(`🔍 Pattern:`, pattern)
      console.log(`🔍 Value:`, data[field])
      errors[field] = errorMsg
    } else {
      console.log(`✅ Field "${field}" is valid`)
      errors[field] = ''
    }

    const isValid = !errors[field]
    console.log(`📊 Validation result for "${field}":`, isValid)
    return isValid
  }
}

// Specific validators
export const validateUsername = (
  data: { username: string },
  errors: { username: string },
): boolean => {
  console.log('🔍 Validating username with pattern:', VALIDATION_PATTERNS.USERNAME)
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
  console.log('🔍 Validating phone with pattern:', VALIDATION_PATTERNS.PHONE)
  return createValidator(
    data,
    errors,
    'phoneNumber',
    VALIDATION_PATTERNS.PHONE,
    VALIDATION_MESSAGES.PHONE,
  )()
}
