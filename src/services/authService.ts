import type { User, LoginCredentials, LoginResponse } from '@/types/user'
import { API_CONFIG, HTTP_STATUS, ERROR_MESSAGES } from '@/constants/api'

export class AuthService {
  private readonly API_URL = API_CONFIG.BASE_URL

  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${this.API_URL}${API_CONFIG.ENDPOINTS.USERS}`)

      if (!response.ok) {
        if (response.status === HTTP_STATUS.NOT_FOUND) {
          throw new Error('Users endpoint not found')
        }
        if (response.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
          throw new Error('Server error')
        }
        throw new Error(`HTTP ${response.status}`)
      }

      const users = await response.json()
      const firstUser = users[0]

      return users
    } catch (error) {
      throw new Error(ERROR_MESSAGES.FETCH_FAILED)
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const users = await this.getUsers()

      const user = users.find(
        (user) =>
          user.username.toLowerCase() === credentials.username.toLowerCase() &&
          user.phone === credentials.phoneNumber,
      )

      if (user) {
        return {
          success: true,
          user,
        }
      } else {
        return {
          success: false,
          error: ERROR_MESSAGES.LOGIN_ERROR,
        }
      }
    } catch {
      return {
        success: false,
        error: ERROR_MESSAGES.NETWORK_ERROR,
      }
    }
  }
}

// Export singleton instance
export const authService = new AuthService()
