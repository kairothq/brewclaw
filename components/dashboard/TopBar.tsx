'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Bell, Search, X } from 'lucide-react'

interface TopBarProps {
  onMenuToggle?: () => void
  showMenuButton?: boolean
  sidebarCollapsed?: boolean
}

export default function TopBar({ onMenuToggle, showMenuButton = false, sidebarCollapsed = false }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Search:', searchQuery)
  }

  return (
    <header className="sticky top-0 z-10 h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        {/* Mobile menu toggle - shows hamburger when collapsed, X when expanded */}
        {showMenuButton && (
          <button
            onClick={onMenuToggle}
            className="flex-shrink-0 w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200 md:hidden"
            aria-label={sidebarCollapsed ? 'Open menu' : 'Close menu'}
          >
            {sidebarCollapsed ? <Menu size={24} /> : <X size={24} />}
          </button>
        )}

        {/* Search - responsive: icon only on mobile, full input on sm+ */}
        <form onSubmit={handleSearchSubmit} className="flex-1 relative max-w-md">
          {/* Mobile: search icon button that toggles search input */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="sm:hidden flex-shrink-0 w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* Mobile search input (shown when searchOpen) */}
          {searchOpen && (
            <div className="sm:hidden absolute top-14 left-0 right-0 bg-zinc-950 border border-zinc-800 rounded-lg p-2 shadow-lg z-20">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all duration-200"
              />
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" />
            </div>
          )}

          {/* Desktop search input */}
          <div className="hidden sm:block relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 md:w-64 bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all duration-200"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications - min 44x44 touch target */}
        <button className="flex-shrink-0 w-11 h-11 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200">
          <Bell size={22} />
        </button>

        {/* Deploy Button - full on sm+, icon only on mobile */}
        <Link
          href="/onboard"
          className="flex-shrink-0 flex items-center justify-center bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
        >
          <span>Deploy</span>
        </Link>
      </div>
    </header>
  )
}
