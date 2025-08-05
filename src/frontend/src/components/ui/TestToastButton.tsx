'use client'

import React from 'react'
import { useToast } from '@/hooks/useToast'
import { Button } from './Button'

export const TestToastButton = () => {
  const { toast } = useToast()

  const showTestToasts = () => {
    // Show different types of toasts with delays
    setTimeout(() => {
      toast.success('API Success', 'Teams data loaded successfully!')
    }, 500)

    setTimeout(() => {
      toast.error('Connection Failed', 'Failed to connect to leaderboard service. Network timeout.')
    }, 1500)

    setTimeout(() => {
      toast.warning('Rate Limit', 'Too many requests. Please wait before trying again.')
    }, 2500)

    setTimeout(() => {
      toast.info('System Update', 'Leaderboard rankings are being recalculated.')
    }, 3500)
  }

  return (
    <Button 
      onClick={showTestToasts}
      className="btn-terminal text-xs px-4 py-2"
    >
      [TEST_NOTIFICATIONS]
    </Button>
  )
}

export default TestToastButton
