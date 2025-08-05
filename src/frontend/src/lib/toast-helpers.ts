import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from './utils'

/**
 * Toast helper functions for common scenarios
 */
export const createToastHelpers = () => {
  const { toast } = useToast()

  return {
    /**
     * Show success toast for API operations
     */
    apiSuccess: (operation: string, details?: string) => {
      toast.success(
        `${operation} successful`,
        details || `Operation completed successfully`,
        5000
      )
    },

    /**
     * Show error toast for API operations
     */
    apiError: (operation: string, error: unknown) => {
      const message = getErrorMessage(error)
      toast.error(
        `${operation} failed`,
        message,
        7000
      )
    },

    /**
     * Show loading toast for long operations
     */
    apiLoading: (operation: string) => {
      return toast.custom({
        type: 'info',
        title: `${operation} in progress`,
        message: 'Please wait while we process your request...',
        duration: Infinity // Manual dismiss
      })
    },

    /**
     * Show network error toast
     */
    networkError: () => {
      toast.error(
        'Network connection error',
        'Please check your internet connection and try again.',
        10000
      )
    },

    /**
     * Show validation error toast
     */
    validationError: (field: string, message: string) => {
      toast.warning(
        `Validation error: ${field}`,
        message,
        6000
      )
    },

    /**
     * Show authentication error toast
     */
    authError: (message?: string) => {
      toast.error(
        'Authentication failed',
        message || 'Please log in to continue.',
        8000
      )
    },

    /**
     * Show rate limit error toast
     */
    rateLimitError: () => {
      toast.warning(
        'Rate limit exceeded',
        'Too many requests. Please wait a moment before trying again.',
        10000
      )
    },

    /**
     * Show server error toast
     */
    serverError: () => {
      toast.error(
        'Server error',
        'Something went wrong on our end. Please try again later.',
        8000
      )
    }
  }
}

/**
 * Hook for easy access to toast helpers
 */
export const useToastHelpers = () => {
  return createToastHelpers()
}

export default useToastHelpers
