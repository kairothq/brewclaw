'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  DollarSign,
  LogOut,
  type LucideIcon
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
}

interface NavSection {
  title: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'MAIN',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    title: 'ACCOUNT',
    items: [
      { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings }
    ]
  }
]

interface UserData {
  userId: string
  email?: string
  name?: string
}

interface SidebarProps {
  collapsed: boolean
  user?: UserData | null
  credits?: string
  onLogout?: () => void
}

export default function Sidebar({ collapsed, user, credits = '0.00', onLogout }: SidebarProps) {
  const pathname = usePathname()

  // Get initials from user name (first letter of first + last name)
  const getUserInitials = () => {
    // Try name first
    if (user?.name && typeof user.name === 'string' && user.name.trim()) {
      const names = user.name.trim().split(' ')
      if (names.length === 1) {
        return names[0][0]?.toUpperCase() || 'U'
      }
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    // Fallback to email initial
    if (user?.email && typeof user.email === 'string' && user.email.trim()) {
      return user.email[0].toUpperCase()
    }
    // Default
    return 'U'
  }

  // Truncate text helper
  const truncate = (text: string | undefined, maxLength: number) => {
    if (!text) return ''
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo and Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        {/* Logo */}
        <div className="mb-8 px-1">
          {collapsed ? (
            <div className="flex items-center justify-center">
              <span className="text-xl font-bold text-orange-500">B</span>
            </div>
          ) : (
            <span className="text-xl font-bold text-white">
              Brew<span className="text-orange-500">Claw</span>
            </span>
          )}
        </div>

        {/* Navigation Sections */}
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-6">
            {!collapsed && (
              <div className="px-2 mb-2 text-xs text-zinc-500 uppercase tracking-wider">
                {section.title}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative flex items-center gap-3 py-2.5 rounded-md transition-all duration-200
                      ${collapsed ? 'justify-center px-2' : 'px-3'}
                      ${
                        isActive
                          ? 'bg-zinc-800 text-orange-500 border-l-2 border-orange-500'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 border-l-2 border-transparent'
                      }
                    `}
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon
                      className={`flex-shrink-0 transition-colors duration-200 ${
                        isActive ? 'text-orange-500' : ''
                      }`}
                      size={20}
                    />
                    {!collapsed && (
                      <span className="text-sm font-medium truncate">
                        {item.name}
                      </span>
                    )}
                    {/* Subtle glow effect for active item */}
                    {isActive && (
                      <div className="absolute inset-0 bg-orange-500/5 rounded-md pointer-events-none" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Credits Section */}
      <div className="border-t border-zinc-800 p-4">
        {!collapsed ? (
          <div>
            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
              <DollarSign size={16} />
              <span>Credits</span>
            </div>
            <div className="text-xl font-bold text-white">${credits}</div>
            <Link
              href="/dashboard/billing"
              className="text-sm text-orange-500 hover:text-orange-400 mt-1 inline-block transition-colors"
            >
              Add credits &gt;
            </Link>
          </div>
        ) : (
          <div className="flex justify-center" title={`$${credits}`}>
            <DollarSign size={20} className="text-zinc-500" />
          </div>
        )}
      </div>

      {/* User Profile Section */}
      <div className="border-t border-zinc-800 p-4">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            {/* Avatar with initials */}
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              {/* Name truncated at 20 chars */}
              <div className="text-sm font-medium text-white truncate">
                {truncate(user?.name, 20) || 'User'}
              </div>
              {/* Email truncated at 25 chars */}
              <div className="text-xs text-zinc-500 truncate">
                {truncate(user?.email, 25) || 'No email'}</div>
            </div>
            {/* Logout button */}
            <button
              onClick={onLogout}
              className="text-zinc-400 hover:text-white flex-shrink-0 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          /* Collapsed: show only avatar */
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-sm font-semibold text-white"
              title={user?.name || 'User'}
            >
              {getUserInitials()}
            </div>
            <button
              onClick={onLogout}
              className="text-zinc-400 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
