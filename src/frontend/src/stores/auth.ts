import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { User, LoginDto, RegisterDto } from '@/types/api'
import { apiClient } from '@/lib/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (credentials: LoginDto) => Promise<void>
  register: (userData: RegisterDto) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  clearError: () => void
  setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginDto) => {
        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          const { user, token } = await apiClient.login(credentials)
          
          set((state) => {
            state.user = user
            state.token = token
            state.isAuthenticated = true
            state.isLoading = false
          })
        } catch (error: any) {
          set((state) => {
            state.error = error.response?.data?.message || 'Login failed'
            state.isLoading = false
          })
          throw error
        }
      },

      register: async (userData: RegisterDto) => {
        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          const { user, token } = await apiClient.register(userData)
          
          set((state) => {
            state.user = user
            state.token = token
            state.isAuthenticated = true
            state.isLoading = false
          })
        } catch (error: any) {
          set((state) => {
            state.error = error.response?.data?.message || 'Registration failed'
            state.isLoading = false
          })
          throw error
        }
      },

      logout: () => {
        apiClient.logout()
        set((state) => {
          state.user = null
          state.token = null
          state.isAuthenticated = false
          state.error = null
        })
      },

      refreshUser: async () => {
        if (!get().token) return

        try {
          const user = await apiClient.me()
          set((state) => {
            state.user = user
            state.isAuthenticated = true
          })
        } catch (error) {
          // Token is invalid, logout
          get().logout()
        }
      },

      clearError: () => {
        set((state) => {
          state.error = null
        })
      },

      setLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading
        })
      },
    })),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          apiClient.setToken(state.token)
        }
      },
    }
  )
)
