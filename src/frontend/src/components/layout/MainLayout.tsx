'use client'

import React, { useState } from 'react'
import { Header } from './Header'
import { AuthModal } from '@/components/auth/AuthModal'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handleAuthClick = () => {
    setIsAuthModalOpen(true)
  }

  const handleAuthClose = () => {
    setIsAuthModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-background matrix-bg">
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
