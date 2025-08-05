'use client'

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import type { Toast, ToastType } from '@/components/ui/Toast'

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void
}

const useToastStore = create<ToastStore>()(
  subscribeWithSelector((set, get) => ({
    toasts: [],
    
    addToast: (toast) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newToast: Toast = { ...toast, id }
      
      set((state) => ({
        toasts: [...state.toasts, newToast]
      }))
      
      return id
    },
    
    removeToast: (id) => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id)
      }))
    },
    
    clearToasts: () => {
      set({ toasts: [] })
    }
  }))
)

export const useToast = () => {
  const { addToast, removeToast, clearToasts } = useToastStore()
  
  const toast = {
    success: (title: string, message?: string, duration?: number) => {
      return addToast({ type: 'success', title, message, duration })
    },
    
    error: (title: string, message?: string, duration?: number) => {
      return addToast({ type: 'error', title, message, duration })
    },
    
    warning: (title: string, message?: string, duration?: number) => {
      return addToast({ type: 'warning', title, message, duration })
    },
    
    info: (title: string, message?: string, duration?: number) => {
      return addToast({ type: 'info', title, message, duration })
    },
    
    custom: (toast: Omit<Toast, 'id'>) => {
      return addToast(toast)
    }
  }
  
  return {
    toast,
    removeToast,
    clearToasts
  }
}

export const useToasts = () => {
  return useToastStore((state) => state.toasts)
}

export default useToast
