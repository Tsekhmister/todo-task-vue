export interface Todo {
  id: number
  userId: number
  title: string
  completed: boolean
}

export interface CreateTodoRequest {
  userId: number
  title: string
}

export interface CreateTodoResponse {
  id: number
  userId: number
  title: string
  completed: boolean
}

export interface TodoFilters {
  status: 'all' | 'completed' | 'uncompleted' | 'favorites'
  userId: number | 'all'
  searchQuery: string
}

export interface TodoState {
  todos: Todo[]
  filteredTodos: Todo[]
  filters: TodoFilters
  isLoading: boolean
  error: string | null
  favorites: number[]
}
