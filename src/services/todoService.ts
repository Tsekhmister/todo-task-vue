import type { Todo, CreateTodoRequest, CreateTodoResponse } from '@/types/todo'
import { API_CONFIG, HTTP_STATUS, ERROR_MESSAGES } from '@/constants/api'

export class TodoService {
  private readonly API_URL = API_CONFIG.BASE_URL

  async getTodos(): Promise<Todo[]> {
    try {
      const response = await fetch(`${this.API_URL}/todos`)

      if (!response.ok) {
        if (response.status === HTTP_STATUS.NOT_FOUND) {
          throw new Error('Todos endpoint not found')
        }
        if (response.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
          throw new Error('Server error')
        }
        throw new Error(`HTTP ${response.status}`)
      }

      const todos = await response.json()
      console.log('📋 Fetched todos:', todos.length)

      return todos
    } catch (error) {
      console.error('Error fetching todos:', error)
      throw new Error(ERROR_MESSAGES.FETCH_FAILED)
    }
  }

  async createTodo(todo: CreateTodoRequest): Promise<CreateTodoResponse> {
    try {
      const response = await fetch(`${this.API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const createdTodo = await response.json()
      console.log('✅ Created todo:', createdTodo)

      return createdTodo
    } catch (error) {
      console.error('Error creating todo:', error)
      throw new Error('Failed to create todo')
    }
  }
}

// Export singleton instance
export const todoService = new TodoService()
