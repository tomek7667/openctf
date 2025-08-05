import { Users, Shield, MessageSquare, Trophy, Settings, User } from '@/components/icons'

export interface NavigationItem {
  id: string
  label: string
  href: string
  icon: any
  description?: string
  requiresAuth?: boolean
  adminOnly?: boolean
}

export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    id: 'teams',
    label: 'Teams',
    href: '/teams',
    icon: Shield,
    description: 'Browse and manage CTF teams',
  },
  {
    id: 'users',
    label: 'Users',
    href: '/users',
    icon: Users,
    description: 'User profiles and rankings',
  },
  {
    id: 'contests',
    label: 'Contests',
    href: '/contests',
    icon: Trophy,
    description: 'CTF competitions and events',
  },
  {
    id: 'forum',
    label: 'Forum',
    href: '/forum',
    icon: MessageSquare,
    description: 'Community discussions',
  },
]

export const USER_NAVIGATION: NavigationItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    href: '/profile',
    icon: User,
    requiresAuth: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    requiresAuth: true,
  },
]

export const ADMIN_NAVIGATION: NavigationItem[] = [
  {
    id: 'admin',
    label: 'Admin',
    href: '/admin',
    icon: Settings,
    requiresAuth: true,
    adminOnly: true,
  },
]
