'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'

// Helper to safely access localStorage (handles Brave Shields blocking)
function safeLocalStorage() {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return localStorage
  } catch {
    return null
  }
}

// Helper to get/set cookies as fallback
function setCookie(name: string, value: string, days: number = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

// Loading component
function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-orange-500 animate-pulse mx-auto mb-4 flex items-center justify-center">
          <span className="text-xl font-bold text-white">B</span>
        </div>
        <p className="text-zinc-400">Loading...</p>
      </div>
    </div>
  )
}

// Inner component that uses useSearchParams
function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<{ userId: string; email?: string; name?: string } | null>(null)
  const [credits, setCredits] = useState('0.00')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Try multiple sources for auth data
    let instanceData: string | null = null
    const storage = safeLocalStorage()

    // 1. Try localStorage first
    if (storage) {
      instanceData = storage.getItem('brewclaw_instance')
    }

    // 2. Fallback to cookie if localStorage blocked (Brave)
    if (!instanceData) {
      instanceData = getCookie('brewclaw_instance')
    }

    // 3. Check URL parameter as last resort
    const urlId = searchParams.get('id')

    if (!instanceData && !urlId) {
      router.push('/onboard')
      return
    }

    try {
      let parsed: any = {}

      if (instanceData) {
        parsed = JSON.parse(instanceData)
        // Sync to cookie as backup for Brave
        setCookie('brewclaw_instance', instanceData)
      } else if (urlId) {
        // Minimal data from URL param
        parsed = { userId: urlId }
      }

      // Handle missing data gracefully with clear defaults
      const userId = parsed.userId || 'user'
      const userEmail = parsed.email && typeof parsed.email === 'string'
        ? parsed.email
        : ''
      const userName = parsed.name && typeof parsed.name === 'string' && parsed.name.trim()
        ? parsed.name.trim()
        : userEmail
          ? userEmail.split('@')[0]
          : 'User'

      setUser({
        userId,
        email: userEmail,
        name: userName
      })
      setIsLoading(false)
    } catch (e) {
      console.error('Failed to parse instance data:', e)
      router.push('/onboard')
    }
  }, [router, searchParams])

  const handleLogout = () => {
    // Clear localStorage if available
    const storage = safeLocalStorage()
    if (storage) {
      storage.removeItem('brewclaw_instance')
    }
    // Clear cookie fallback
    document.cookie = 'brewclaw_instance=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/')
  }

  // Auto-collapse sidebar on mobile and track mobile state
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarCollapsed(true)
      } else {
        setSidebarCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex overflow-x-hidden">
      {/* Mobile Backdrop - shown when sidebar is open on mobile */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full bg-zinc-900 border-r border-zinc-800
          transition-all duration-300 z-50
          ${sidebarCollapsed ? 'w-16' : 'w-64'}
          ${isMobile && sidebarCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
        `}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          user={user}
          credits={credits}
          onLogout={handleLogout}
        />
      </aside>

      {/* Main Content */}
      <div
        className={`
          flex-1 transition-all duration-300 min-w-0
          ${isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-16' : 'ml-64'}
        `}
      >
        {/* Top Bar */}
        <TopBar
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          showMenuButton={true}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page Content */}
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}

// Export with Suspense wrapper
export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<LoadingState />}>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </Suspense>
  )
}
