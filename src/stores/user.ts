import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null)
  const isAuthenticated = ref(false)

  // Load user data from localStorage on store initialization
  const loadUserFromStorage = () => {
    try {
      const savedUser = localStorage.getItem('todo-user')
      const savedAuth = localStorage.getItem('todo-auth')

      if (savedUser && savedAuth === 'true') {
        const user = JSON.parse(savedUser)
        currentUser.value = user
        isAuthenticated.value = true
        console.log('👤 User loaded from localStorage:', user)
      }
    } catch (error) {
      console.error('Failed to load user from localStorage:', error)
      // Clear corrupted data
      localStorage.removeItem('todo-user')
      localStorage.removeItem('todo-auth')
    }
  }

  // Save user data to localStorage
  const saveUserToStorage = (user: User) => {
    try {
      localStorage.setItem('todo-user', JSON.stringify(user))
      localStorage.setItem('todo-auth', 'true')
      console.log('👤 User saved to localStorage')
    } catch (error) {
      console.error('Failed to save user to localStorage:', error)
    }
  }

  // Clear user data from localStorage
  const clearUserFromStorage = () => {
    try {
      localStorage.removeItem('todo-user')
      localStorage.removeItem('todo-auth')
      console.log('👤 User cleared from localStorage')
    } catch (error) {
      console.error('Failed to clear user from localStorage:', error)
    }
  }

  // Load user data on store initialization
  loadUserFromStorage()

  // Getters
  const getUser = computed(() => currentUser.value)
  const getIsAuthenticated = computed(() => isAuthenticated.value)
  const getUserDisplayName = computed(() => {
    if (!currentUser.value) return ''
    return currentUser.value.name || currentUser.value.username
  })

  // Actions
  const setUser = (user: User) => {
    currentUser.value = user
    isAuthenticated.value = true
    saveUserToStorage(user)
    console.log('👤 User set in store:', user)
  }

  const clearUser = () => {
    currentUser.value = null
    isAuthenticated.value = false
    clearUserFromStorage()
    console.log('👤 User cleared from store')
  }

  const login = (user: User) => {
    setUser(user)
  }

  const logout = () => {
    clearUser()
  }

  return {
    // State
    currentUser,
    isAuthenticated,

    // Getters
    getUser,
    getIsAuthenticated,
    getUserDisplayName,

    // Actions
    setUser,
    clearUser,
    login,
    logout,
  }
})
