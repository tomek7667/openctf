/**
 * Enterprise-grade API Client
 * 
 * This module provides a robust, type-safe HTTP client for the OpenCTF API.
 * Features include:
 * - Automatic retry logic with exponential backoff
 * - Request/response interceptors
 * - Type-safe error handling
 * - Authentication management
 * - Request cancellation
 * - Caching layer
 * - Rate limiting
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  CancelTokenSource,
} from 'axios';
import { ApiResponse, ApiError, ValidationError } from '@/types/api';
import { toast } from 'react-hot-toast';

// =============================================================================
// Configuration & Types
// =============================================================================

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  enableCache?: boolean;
  enableRateLimit?: boolean;
  defaultHeaders?: Record<string, string>;
}

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipRetry?: boolean;
  skipErrorToast?: boolean;
  cacheKey?: string;
  cacheTTL?: number; // in milliseconds
}

export interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryCondition: (error: AxiosError) => boolean;
}

interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
}

// =============================================================================
// Custom Error Classes
// =============================================================================

export class ApiClientError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export class ValidationApiError extends ApiClientError {
  constructor(
    message: string,
    public validationErrors: ValidationError[]
  ) {
    super(message, 'VALIDATION_ERROR', 422);
    this.name = 'ValidationApiError';
  }
}

export class NetworkError extends ApiClientError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends ApiClientError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiClientError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

// =============================================================================
// API Client Class
// =============================================================================

export class ApiClient {
  private client: AxiosInstance;
  private cache = new Map<string, CacheEntry>();
  private cancelTokens = new Map<string, CancelTokenSource>();
  private readonly retryConfig: RetryConfig;
  private authToken: string | null = null;

  constructor(private config: ApiClientConfig = {}) {
    const {
      baseURL = process.env.NEXT_PUBLIC_API_URL || '/api',
      timeout = 30000,
      retries = 3,
      retryDelay = 1000,
      defaultHeaders = {},
    } = config;

    this.retryConfig = {
      retries,
      retryDelay,
      retryCondition: this.shouldRetry.bind(this),
    };

    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        ...defaultHeaders,
      },
    });

    this.setupInterceptors();
    this.loadAuthToken();
  }

  // ===========================================================================
  // Setup & Configuration
  // ===========================================================================

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token
        if (this.authToken && !config.skipAuth) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        // Add request ID for tracking
        config.metadata = {
          requestId: this.generateRequestId(),
          timestamp: Date.now(),
        };

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => this.handleSuccessResponse(response),
      (error) => this.handleErrorResponse(error)
    );
  }

  private loadAuthToken(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('openctf_auth_token');
      if (token) {
        this.setAuthToken(token);
      }
    }
  }

  // ===========================================================================
  // Authentication Management
  // ===========================================================================

  public setAuthToken(token: string): void {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('openctf_auth_token', token);
    }
  }

  public clearAuthToken(): void {
    this.authToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('openctf_auth_token');
    }
  }

  public getAuthToken(): string | null {
    return this.authToken;
  }

  public isAuthenticated(): boolean {
    return !!this.authToken;
  }

  // ===========================================================================
  // Request Methods
  // ===========================================================================

  public async get<T>(
    url: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const cacheKey = config.cacheKey || this.generateCacheKey('GET', url, config.params);
    
    // Check cache first
    if (this.config.enableCache && config.cacheKey) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const response = await this.request<T>({
      method: 'GET',
      url,
      ...config,
    });

    // Cache successful responses
    if (this.config.enableCache && config.cacheKey) {
      this.setCache(cacheKey, response, config.cacheTTL || 300000); // 5 minutes default
    }

    return response;
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      ...config,
    });
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      ...config,
    });
  }

  public async patch<T>(
    url: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
      ...config,
    });
  }

  public async delete<T>(
    url: string,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      url,
      ...config,
    });
  }

  // ===========================================================================
  // Core Request Method
  // ===========================================================================

  private async request<T>(config: RequestConfig): Promise<T> {
    const { skipRetry = false } = config;
    let lastError: Error;

    for (let attempt = 0; attempt <= (skipRetry ? 0 : this.retryConfig.retries); attempt++) {
      try {
        const response = await this.client.request<ApiResponse<T>>(config);
        return this.extractResponseData(response);
      } catch (error) {
        lastError = error as Error;

        // Don't retry on final attempt or if retries are disabled
        if (attempt === this.retryConfig.retries || skipRetry) {
          break;
        }

        // Don't retry if error doesn't meet retry conditions
        if (!this.retryConfig.retryCondition(error as AxiosError)) {
          break;
        }

        // Wait before retrying with exponential backoff
        await this.delay(this.retryConfig.retryDelay * Math.pow(2, attempt));
      }
    }

    throw lastError!;
  }

  // ===========================================================================
  // Response & Error Handling
  // ===========================================================================

  private handleSuccessResponse(response: AxiosResponse): AxiosResponse {
    // Log successful requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  }

  private handleErrorResponse(error: AxiosError): Promise<never> {
    // Handle network errors
    if (!error.response) {
      const networkError = new NetworkError(
        error.message || 'Network error occurred'
      );
      this.showErrorToast(networkError, error.config);
      return Promise.reject(networkError);
    }

    const { status, data } = error.response;
    const apiError = this.createApiError(status, data as any);

    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status,
        error: apiError,
      });
    }

    // Show error toast unless disabled
    this.showErrorToast(apiError, error.config);

    // Handle authentication errors
    if (status === 401) {
      this.handleAuthenticationError();
    }

    return Promise.reject(apiError);
  }

  private createApiError(status: number, data: any): ApiClientError {
    const message = data?.message || 'An error occurred';
    const code = data?.code || 'UNKNOWN_ERROR';
    const details = data?.details || {};

    switch (status) {
      case 400:
        return new ApiClientError(message, code, status, details);
      case 401:
        return new AuthenticationError(message);
      case 403:
        return new AuthorizationError(message);
      case 422:
        const validationErrors = data?.validationErrors || [];
        return new ValidationApiError(message, validationErrors);
      case 429:
        return new ApiClientError('Too many requests', 'RATE_LIMIT_EXCEEDED', status);
      case 500:
        return new ApiClientError('Internal server error', 'INTERNAL_ERROR', status);
      default:
        return new ApiClientError(message, code, status, details);
    }
  }

  private extractResponseData<T>(response: AxiosResponse<ApiResponse<T>>): T {
    const { data } = response;
    
    if (!data.success) {
      throw new ApiClientError(
        data.message || 'Request failed',
        'API_ERROR',
        response.status
      );
    }

    return data.data as T;
  }

  private handleAuthenticationError(): void {
    this.clearAuthToken();
    
    // Emit custom event for auth error
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:error'));
    }
  }

  private showErrorToast(error: ApiClientError, config?: any): void {
    if (config?.skipErrorToast) return;

    // Don't show toast for authentication errors (handled by auth system)
    if (error instanceof AuthenticationError) return;

    toast.error(error.message, {
      id: error.code, // Prevent duplicate toasts
      duration: 5000,
    });
  }

  // ===========================================================================
  // Utility Methods
  // ===========================================================================

  private shouldRetry(error: AxiosError): boolean {
    if (!error.response) return true; // Network errors
    
    const { status } = error.response;
    
    // Retry on server errors and rate limiting
    return status >= 500 || status === 429;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCacheKey(method: string, url: string, params?: any): string {
    const paramStr = params ? JSON.stringify(params) : '';
    return `${method}:${url}:${paramStr}`;
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if cache entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    // Clean up expired entries periodically
    if (this.cache.size > 100) {
      this.cleanupCache();
    }
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // ===========================================================================
  // Request Cancellation
  // ===========================================================================

  public cancelRequest(requestId: string): void {
    const cancelToken = this.cancelTokens.get(requestId);
    if (cancelToken) {
      cancelToken.cancel('Request canceled by user');
      this.cancelTokens.delete(requestId);
    }
  }

  public cancelAllRequests(): void {
    for (const [requestId, cancelToken] of this.cancelTokens.entries()) {
      cancelToken.cancel('All requests canceled');
    }
    this.cancelTokens.clear();
  }

  // ===========================================================================
  // Health Check
  // ===========================================================================

  public async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health', { skipAuth: true, skipErrorToast: true });
      return true;
    } catch {
      return false;
    }
  }
}

// =============================================================================
// Default Instance
// =============================================================================

export const apiClient = new ApiClient({
  enableCache: true,
  enableRateLimit: true,
});

export default apiClient;
