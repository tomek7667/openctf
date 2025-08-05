'use client'

import React, { useState, useEffect } from 'react'
import { Header } from './Header'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuthStore } from '@/stores/auth'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { refreshUser } = useAuthStore()

  useEffect(() => {
    // Try to refresh user data on app load
    refreshUser()
  }, [refreshUser])

  const handleAuthClick = () => {
    setIsAuthModalOpen(true)
  }

  const handleAuthClose = () => {
    setIsAuthModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onAuthClick={handleAuthClick} />
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthClose}
      />
    </div>
  )
}
