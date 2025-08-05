/**
 * Authentication Store
 * 
 * Manages global authentication state using Zustand with:
 * - Persistent storage
 * - Immer for immutable updates
 * - Type-safe actions and selectors
 * - Error handling and loading states
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { authApi } from '@/api/services/auth';
import type { User, LoginDto, RegisterDto, AuthResponse } from '@/types/api';
import { ApiClientError, AuthenticationError } from '@/api/client';

// =============================================================================
// Types
// =============================================================================

interface AuthState {
  // Core state
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // UI state
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Session state
  lastActivity: number;
  sessionExpiry: number | null;
}

interface AuthActions {
  // Authentication actions
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: RegisterDto) => Promise<void>;
  logout: () => void;
  
  // User management
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  
  // Session management
  extendSession: () => void;
  checkSession: () => boolean;
  
  // State management
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

// =============================================================================
// Initial State
// =============================================================================

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
  lastActivity: Date.now(),
  sessionExpiry: null,
};

// =============================================================================
// Store Implementation
// =============================================================================

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // =====================================================================
        // Authentication Actions
        // =====================================================================

        login: async (credentials: LoginDto) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const response: AuthResponse = await authApi.login(credentials);
            
            set((state) => {
              state.user = response.user;
              state.token = response.token;
              state.isAuthenticated = true;
              state.isLoading = false;
              state.lastActivity = Date.now();
              state.sessionExpiry = new Date(response.expiresAt).getTime();
            });
          } catch (error) {
            const errorMessage = error instanceof ApiClientError 
              ? error.message 
              : 'Login failed. Please try again.';
            
            set((state) => {
              state.error = errorMessage;
              state.isLoading = false;
              state.isAuthenticated = false;
              state.user = null;
              state.token = null;
            });
            throw error;
          }
        },

        register: async (userData: RegisterDto) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const response: AuthResponse = await authApi.register(userData);
            
            set((state) => {
              state.user = response.user;
              state.token = response.token;
              state.isAuthenticated = true;
              state.isLoading = false;
              state.lastActivity = Date.now();
              state.sessionExpiry = new Date(response.expiresAt).getTime();
            });
          } catch (error) {
            const errorMessage = error instanceof ApiClientError 
              ? error.message 
              : 'Registration failed. Please try again.';
            
            set((state) => {
              state.error = errorMessage;
              state.isLoading = false;
              state.isAuthenticated = false;
              state.user = null;
              state.token = null;
            });
            throw error;
          }
        },

        logout: () => {
          // Call API logout (fire and forget)
          authApi.logout().catch(console.error);
          
          set((state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            state.sessionExpiry = null;
          });
        },

        // =====================================================================
        // User Management
        // =====================================================================

        refreshUser: async () => {
          if (!get().token) return;

          try {
            const user = await authApi.getCurrentUser();
            
            set((state) => {
              state.user = user;
              state.lastActivity = Date.now();
            });
          } catch (error) {
            if (error instanceof AuthenticationError) {
              // Token is invalid, logout
              get().logout();
            }
            throw error;
          }
        },

        updateProfile: async (data: Partial<User>) => {
          if (!get().isAuthenticated) throw new Error('Not authenticated');

          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const updatedUser = await authApi.updateProfile(data);
            
            set((state) => {
              state.user = updatedUser;
              state.isLoading = false;
              state.lastActivity = Date.now();
            });
          } catch (error) {
            const errorMessage = error instanceof ApiClientError 
              ? error.message 
              : 'Profile update failed. Please try again.';
            
            set((state) => {
              state.error = errorMessage;
              state.isLoading = false;
            });
            throw error;
          }
        },

        // =====================================================================
        // Session Management
        // =====================================================================

        extendSession: () => {
          set((state) => {
            state.lastActivity = Date.now();
          });
        },

        checkSession: () => {
          const { sessionExpiry, token } = get();
          
          if (!token || !sessionExpiry) return false;
          
          const now = Date.now();
          const isExpired = now > sessionExpiry;
          
          if (isExpired) {
            get().logout();
            return false;
          }
          
          // Refresh token if it expires in the next 15 minutes
          const refreshThreshold = 15 * 60 * 1000; // 15 minutes
          if (sessionExpiry - now < refreshThreshold) {
            authApi.refreshToken().catch(() => {
              // If refresh fails, logout
              get().logout();
            });
          }
          
          return true;
        },

        // =====================================================================
        // State Management
        // =====================================================================

        clearError: () => {
          set((state) => {
            state.error = null;
          });
        },

        setLoading: (loading: boolean) => {
          set((state) => {
            state.isLoading = loading;
          });
        },

        initialize: async () => {
          set((state) => {
            state.isLoading = true;
          });

          try {
            const { token } = get();
            
            if (token && get().checkSession()) {
              await get().refreshUser();
            }
          } catch (error) {
            console.error('Auth initialization failed:', error);
            get().logout();
          } finally {
            set((state) => {
              state.isLoading = false;
              state.isInitialized = true;
            });
          }
        },
      })),
      {
        name: 'openctf-auth',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
          sessionExpiry: state.sessionExpiry,
        }),
        onRehydrateStorage: () => (state) => {
          if (state?.token) {
            // Set token in API client
            authApi.setAuthToken?.(state.token);
          }
        },
      }
    ),
    { name: 'auth-store' }
  )
);

// =============================================================================
// Selectors (for performance optimization)
// =============================================================================

export const useAuthSelectors = {
  user: () => useAuthStore((state) => state.user),
  isAuthenticated: () => useAuthStore((state) => state.isAuthenticated),
  isLoading: () => useAuthStore((state) => state.isLoading),
  error: () => useAuthStore((state) => state.error),
  isInitialized: () => useAuthStore((state) => state.isInitialized),
};

// =============================================================================
// Session Activity Tracker
// =============================================================================

if (typeof window !== 'undefined') {
  // Track user activity to extend session
  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  
  let activityTimer: NodeJS.Timeout;
  
  const handleActivity = () => {
    const { isAuthenticated, extendSession } = useAuthStore.getState();
    
    if (isAuthenticated) {
      clearTimeout(activityTimer);
      activityTimer = setTimeout(() => {
        extendSession();
      }, 1000); // Debounce for 1 second
    }
  };

  activityEvents.forEach((event) => {
    document.addEventListener(event, handleActivity, true);
  });

  // Check session periodically
  setInterval(() => {
    const { isAuthenticated, checkSession } = useAuthStore.getState();
    if (isAuthenticated) {
      checkSession();
    }
  }, 60000); // Check every minute
}

// =============================================================================
// Auth Guard Hook
// =============================================================================

export const useAuthGuard = (requireAuth: boolean = true) => {
  const { isAuthenticated, isInitialized, user } = useAuthStore();
  
  return {
    isAuthenticated,
    isInitialized,
    canAccess: requireAuth ? isAuthenticated : true,
    user,
    shouldRedirect: requireAuth && isInitialized && !isAuthenticated,
  };
};

export default useAuthStore;
