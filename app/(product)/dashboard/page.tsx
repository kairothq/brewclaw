'use client'

import { useEffect, useState } from 'react'
import { WelcomeSection } from '@/components/dashboard/WelcomeSection'
import MetricsGrid from '@/components/dashboard/MetricsGrid'
import { ModelSelector } from '@/components/dashboard/ModelSelector'
import { LiveActivity } from '@/components/dashboard/LiveActivity'
import { EmptyDashboard } from '@/components/dashboard/EmptyDashboard'
import { InstanceControls } from '@/components/dashboard/InstanceControls'
import { ContainerLogs } from '@/components/dashboard/ContainerLogs'

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const instanceData = localStorage.getItem('brewclaw_instance')
    if (instanceData) {
      try {
        const parsed = JSON.parse(instanceData)
        if (parsed.userId) {
          setUserId(parsed.userId)
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

      {userId ? (
        <>
          {/* Instance Controls + Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <InstanceControls userId={userId} />
            <div className="lg:col-span-2">
              <MetricsGrid />
            </div>
          </div>

          {/* Model Selector + Live Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModelSelector />
            <LiveActivity />
          </div>

          {/* Container Logs */}
          <ContainerLogs userId={userId} />
        </>
      ) : (
        <EmptyDashboard />
      )}
    </div>
  )
}
