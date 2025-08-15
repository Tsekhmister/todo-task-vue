import { ref } from 'vue'
import { authService } from '@/services/authService'
import type { LoginCredentials, LoginResponse } from '@/types/user'
import { ERROR_MESSAGES } from '@/constants/api'
import { useUserStore } from '@/stores/user'

export function useAuth() {
  const loginError = ref('')
  const isLoading = ref(false)
  const isInitialized = ref(false)
  const userStore = useUserStore()

  // Initialize authentication state from localStorage
  const initializeAuth = () => {
    if (isInitialized.value) return

    try {
      const savedUser = localStorage.getItem('todo-user')
      const savedAuth = localStorage.getItem('todo-auth')

      if (savedUser && savedAuth === 'true') {
        const user = JSON.parse(savedUser)
        userStore.setUser(user)
        console.log('🔐 Authentication restored from localStorage')
      }
    } catch (error) {
      console.error('Failed to restore authentication:', error)
      // Clear corrupted data
      localStorage.removeItem('todo-user')
      localStorage.removeItem('todo-auth')
    } finally {
      isInitialized.value = true
    }
  }

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    console.log('🚀 Starting login process...')
    isLoading.value = true
    loginError.value = ''

    try {
      console.log('📡 Calling AuthService.login...')
      const response = await authService.login(credentials)

      if (response.success && response.user) {
        console.log('🎉 Login successful!')
        userStore.login(response.user)
        loginError.value = ''
        return response
      } else {
        console.log('💥 Login failed:', response.error)
        loginError.value = response.error || ERROR_MESSAGES.LOGIN_ERROR
        return response
      }
    } catch {
      console.log('🌐 Network error in useAuth')
      loginError.value = ERROR_MESSAGES.NETWORK_ERROR
      return {
        success: false,
        error: ERROR_MESSAGES.NETWORK_ERROR,
      }
    } finally {
      isLoading.value = false
      console.log('🏁 Login process completed')
    }
  }

  const logout = () => {
    userStore.logout()
    console.log('🚪 User logged out')
  }

  const clearError = () => {
    loginError.value = ''
  }

  return {
    login,
    logout,
    loginError,
    isLoading,
    isInitialized,
    initializeAuth,
    clearError,
  }
}
