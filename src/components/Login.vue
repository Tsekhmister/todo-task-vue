<template>
  <main class="login" role="main">
    <section class="login__container" aria-labelledby="login-heading">
      <header class="login__header">
        <h1 id="login-heading" class="login__title">Sign In</h1>
      </header>

      <form
        @submit.prevent="handleLogin"
        class="login__form"
        novalidate
        aria-describedby="form-instructions"
      >
        <p id="form-instructions" class="visually-hidden">
          Please enter your username and phone number to sign in
        </p>

        <fieldset class="login__fieldset">
          <legend class="visually-hidden">Login credentials</legend>

          <div class="login__form-field">
            <label for="username" class="login__form-label">
              Username
              <abbr title="required" aria-label="required">*</abbr>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              class="login__form-input"
              :class="{ 'login__form-input--error': errors.username }"
              v-model="formData.username"
              @input="validateUsernameField"
              required
              autocomplete="username"
              :aria-invalid="!!errors.username"
              :aria-describedby="errors.username ? 'username-error' : undefined"
              placeholder="Enter your username"
            />
            <div
              v-if="errors.username"
              id="username-error"
              class="login__form-error"
              role="alert"
              aria-live="polite"
            >
              {{ errors.username }}
            </div>
          </div>

          <div class="login__form-field">
            <label for="phoneNumber" class="login__form-label">
              Phone Number
              <abbr title="required" aria-label="required">*</abbr>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              class="login__form-input"
              :class="{ 'login__form-input--error': errors.phoneNumber }"
              v-model="formData.phoneNumber"
              @input="validatePhoneField"
              required
              autocomplete="tel"
              :aria-invalid="!!errors.phoneNumber"
              :aria-describedby="errors.phoneNumber ? 'phone-error' : undefined"
              placeholder="Enter your phone number"
            />
            <div
              v-if="errors.phoneNumber"
              id="phone-error"
              class="login__form-error"
              role="alert"
              aria-live="polite"
            >
              {{ errors.phoneNumber }}
            </div>
          </div>
        </fieldset>

        <div class="login__form-actions">
          <button
            type="submit"
            class="login__form-button"
            :class="{ 'login__form-button--disabled': !isFormValid || isLoading }"
            :disabled="!isFormValid || isLoading"
            :aria-describedby="!isFormValid ? 'submit-help' : undefined"
          >
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
          <div
            id="submit-help"
            class="login__form-help"
            :class="{ 'login__form-help--hidden': isFormValid }"
            aria-live="polite"
          >
            Fill all fields correctly to continue
          </div>
          <div v-if="loginError" class="login__form-auth-error" role="alert" aria-live="polite">
            {{ loginError }}
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
// Login component - handles user authentication
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useUserStore } from '@/stores/user'
import { ROUTE_PATHS } from '@/constants/app'
import { VALIDATION_PATTERNS, VALIDATION_MESSAGES } from '@/constants/app'
import { validateUsername, validatePhone } from '@/utils/validation'
import type { LoginForm, LoginErrors } from '@/types/auth'

const router = useRouter()
const { login, loginError, isLoading, clearError, initializeAuth } = useAuth()
const userStore = useUserStore()

// Check if user is already authenticated
onMounted(() => {
  initializeAuth()

  // If user is already authenticated, redirect to home
  if (userStore.getIsAuthenticated) {
    router.push(ROUTE_PATHS.HOME)
  }
})

const formData = reactive<LoginForm>({
  username: '',
  phoneNumber: '',
})

const errors = reactive<LoginErrors>({
  username: '',
  phoneNumber: '',
})

// Validation functions using utilities
const validateUsernameField = (): boolean => {
  clearError()
  const result = validateUsername(formData, errors)
  return result
}

const validatePhoneField = (): boolean => {
  clearError()
  const result = validatePhone(formData, errors)
  return result
}

// Handle form submission with validation
const handleLogin = async (): Promise<void> => {
  const isUsernameValid: boolean = validateUsernameField()
  const isPhoneValid: boolean = validatePhoneField()

  if (isUsernameValid && isPhoneValid) {
    const response = await login({
      username: formData.username,
      phoneNumber: formData.phoneNumber,
    })

    if (response.success && response.user) {
      router.replace(ROUTE_PATHS.HOME)
    }
  } else {
    console.log('❌ Form is not valid, showing errors')
  }
}

// Computed property to check if form is valid
const isFormValid = computed((): boolean => {
  return (
    formData.username.trim() !== '' &&
    formData.phoneNumber.trim() !== '' &&
    !errors.username &&
    !errors.phoneNumber
  )
})
</script>
