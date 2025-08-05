import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export interface ApiConfig {
  baseURL?: string
  timeout?: number
  retries?: number
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

class BaseApiClient {
  protected client: AxiosInstance
  private retries: number

  constructor(config: ApiConfig = {}) {
    const { baseURL = '/api', timeout = 10000, retries = 3 } = config
    
    this.retries = retries
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getStoredToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const { config, response } = error

        // Handle 401 errors (unauthorized)
        if (response?.status === 401) {
          this.handleUnauthorized()
          return Promise.reject(error)
        }

        // Retry logic for network errors
        if (this.shouldRetry(error) && config && !config._retry) {
          config._retry = true
          config._retryCount = (config._retryCount || 0) + 1

          if (config._retryCount <= this.retries) {
            await this.delay(1000 * config._retryCount)
            return this.client.request(config)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private handleUnauthorized() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      // Could emit an event or redirect to login
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }
  }

  private shouldRetry(error: any): boolean {
    return (
      !error.response ||
      error.code === 'NETWORK_ERROR' ||
      error.code === 'TIMEOUT' ||
      (error.response.status >= 500 && error.response.status < 600)
    )
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  public setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  public clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  // Generic request methods
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  protected async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }
}

export default BaseApiClient
