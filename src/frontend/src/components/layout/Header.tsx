'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { useNavigation } from '@/hooks/useNavigation'
import { Button } from '@/components/ui/Button'
import { LogIn, LogOut, Menu, X, User } from '@/components/icons'

interface HeaderProps {
  onAuthClick: () => void
}

export function Header({ onAuthClick }: HeaderProps) {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { navigation, isActive } = useNavigation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-none bg-primary glow-text flex items-center justify-center text-black font-bold">[O]</div>
            <span className="text-xl font-bold font-mono glow-text">&gt; OpenCTF</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.main.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-none text-sm font-bold font-mono transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-black glow-text'
                      : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>[{item.label.toUpperCase()}]</span>
                </Link>
              )
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <User className="h-4 w-4" />
                  <span>{user?.username}</span>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout} className="btn-terminal font-mono font-bold">
                  <LogOut className="h-4 w-4 mr-2" />
                  [LOGOUT]
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={onAuthClick} className="btn-terminal font-mono font-bold">
                <LogIn className="h-4 w-4 mr-2" />
                [SIGN_IN]
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {navigation.main.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              {/* Mobile User Actions */}
              <div className="pt-4 border-t">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <User className="h-4 w-4" />
                      <span>{user?.username}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      onAuthClick()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent w-full text-left"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
