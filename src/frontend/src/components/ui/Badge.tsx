'use client'

import React from 'react'
import { clsx } from 'clsx'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success'
  size?: 'sm' | 'md'
  children: React.ReactNode
}

export function Badge({ 
  variant = 'default', 
  size = 'md',
  className, 
  children, 
  ...props 
}: BadgeProps) {
  return (
    <div
      className={clsx(
        'inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        {
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80': variant === 'default',
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80': variant === 'destructive',
          'text-foreground': variant === 'outline',
          'border-transparent bg-green-500 text-white hover:bg-green-600': variant === 'success',
        },
        {
          'px-2.5 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
