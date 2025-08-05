'use client'

import React from 'react'
import { motion } from 'framer-motion'
import ToastComponent from './Toast'
import { useToasts, useToast } from '@/hooks/useToast'

const ToastContainer = () => {
  const toasts = useToasts()
  const { removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999] space-y-2 pointer-events-none">
      {toasts.map((toast, index) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="pointer-events-auto"
        >
          <ToastComponent
            toast={toast}
            onRemove={removeToast}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default ToastContainer
