import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { todoService } from '@/services/todoService'
import type { Todo, CreateTodoRequest, TodoFilters } from '@/types/todo'

export const useTodoStore = defineStore('todo', () => {
  // State
  const todos = ref<Todo[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const favorites = ref<number[]>([])

  // Filters
  const filters = ref<TodoFilters>({
    status: 'all',
    userId: 'all',
    searchQuery: '',
  })

  // Load favorites from localStorage
  const loadFavorites = () => {
    try {
      const savedFavorites = localStorage.getItem('todo-favorites')
      if (savedFavorites) {
        favorites.value = JSON.parse(savedFavorites)
      }
    } catch (error) {
      console.error('Failed load favorites:', error)
    }
  }

  // Save favorites to localStorage
  const saveFavorites = () => {
    try {
      localStorage.setItem('todo-favorites', JSON.stringify(favorites.value))
    } catch (error) {
      console.error('Failed to save favorites:', error)
    }
  }

  loadFavorites()

  // Getters
  const getTodos = computed(() => todos.value)
  const getFavorites = computed(() => favorites.value)
  const getIsLoading = computed(() => isLoading.value)
  const getError = computed(() => error.value)

  // Filtered todos
  const filteredTodos = computed(() => {
    let filtered = todos.value

    if (filters.value.status !== 'all') {
      switch (filters.value.status) {
        case 'completed':
          filtered = filtered.filter((todo) => todo.completed)
          break
        case 'uncompleted':
          filtered = filtered.filter((todo) => !todo.completed)
          break
        case 'favorites':
          filtered = filtered.filter((todo) => favorites.value.includes(todo.id))
          break
      }
    }

    // Filter by userId
    if (filters.value.userId !== 'all') {
      filtered = filtered.filter((todo) => todo.userId === filters.value.userId)
    }

    // Filter by search query
    if (filters.value.searchQuery.trim()) {
      const query = filters.value.searchQuery.toLowerCase()
      filtered = filtered.filter((todo) => todo.title.toLowerCase().includes(query))
    }

    return filtered
  })

  // Get unique user IDs
  const uniqueUserIds = computed(() => {
    const userIds = [...new Set(todos.value.map((todo) => todo.userId))]
    return userIds.sort((a, b) => a - b)
  })

  // Actions
  const fetchTodos = async () => {
    isLoading.value = true
    error.value = null

    try {
      const fetchedTodos = await todoService.getTodos()
      todos.value = fetchedTodos
      console.log('📋 Todos loaded successfully:', fetchedTodos.length)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch todos'
      console.error('Error fetching todos:', err)
    } finally {
      isLoading.value = false
    }
  }

  const createTodo = async (todoData: CreateTodoRequest) => {
    isLoading.value = true
    error.value = null

    try {
      const newTodo = await todoService.createTodo(todoData)
      todos.value.unshift(newTodo) // Add to beginning of array
      console.log('✅ Todo created successfully:', newTodo)
      return newTodo
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create todo'
      console.error('Error creating todo:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const toggleFavorite = (todoId: number) => {
    const index = favorites.value.indexOf(todoId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(todoId)
    }
    saveFavorites()
    console.log('⭐ Favorites updated:', favorites.value)
  }

  const isFavorite = (todoId: number) => {
    return favorites.value.includes(todoId)
  }

  const updateFilters = (newFilters: Partial<TodoFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
    console.log('🔍 Filters updated:', filters.value)
  }

  const clearFilters = () => {
    filters.value = {
      status: 'all',
      userId: 'all',
      searchQuery: '',
    }
    console.log('🧹 Filters cleared')
  }

  return {
    // State
    todos,
    isLoading,
    error,
    favorites,
    filters,

    // Getters
    getTodos,
    getFavorites,
    getIsLoading,
    getError,
    filteredTodos,
    uniqueUserIds,

    // Actions
    fetchTodos,
    createTodo,
    toggleFavorite,
    isFavorite,
    updateFilters,
    clearFilters,
  }
})
