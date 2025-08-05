import BaseApiClient from '../client'
import type { LoginDto, RegisterDto, AuthResponse, User } from '@/types/api'

export class AuthApiService extends BaseApiClient {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/login', credentials)
    
    if (response.token) {
      this.setToken(response.token)
    }
    
    return response
  }

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/register', userData)
    
    if (response.token) {
      this.setToken(response.token)
    }
    
    return response
  }

  async me(): Promise<{ user: User }> {
    return this.get<{ user: User }>('/auth/me')
  }

  async logout(): Promise<void> {
    this.clearToken()
    // Could also call a logout endpoint if it exists in the backend
    // await this.post('/auth/logout')
  }

  async refreshToken(): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/refresh')
  }

  async resetPassword(email: string): Promise<{ success: boolean }> {
    return this.post<{ success: boolean }>('/auth/reset-password', { email })
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean }> {
    return this.post<{ success: boolean }>('/auth/change-password', {
      currentPassword,
      newPassword,
    })
  }
}

export const authApi = new AuthApiService()
