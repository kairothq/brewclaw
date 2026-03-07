'use client'

import { useEffect, useState } from 'react'
import { WelcomeSection } from '@/components/dashboard/WelcomeSection'
import MetricsGrid from '@/components/dashboard/MetricsGrid'
import { ModelSelector } from '@/components/dashboard/ModelSelector'
import { LiveActivity } from '@/components/dashboard/LiveActivity'
import { EmptyDashboard } from '@/components/dashboard/EmptyDashboard'

export default function DashboardPage() {
  const [hasInstances, setHasInstances] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for instance data
    const instanceData = localStorage.getItem('brewclaw_instance')
    if (instanceData) {
      try {
        const parsed = JSON.parse(instanceData)
        // User has instance data if userId exists
        if (parsed.userId) {
          setHasInstances(true)
        }
      } catch (e) {
        console.error('Failed to parse instance data:', e)
      }
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-zinc-700 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <WelcomeSection />

      {hasInstances ? (
        <>
          {/* Metrics Grid */}
          <MetricsGrid />

          {/* Two-column grid: Model Selector + Live Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModelSelector />
            <LiveActivity />
          </div>
        </>
      ) : (
        /* Empty Dashboard State */
        <EmptyDashboard />
      )}
    </div>
  )
}
