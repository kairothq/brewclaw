'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Square, RotateCcw, AlertCircle } from 'lucide-react'

interface InstanceControlsProps {
  userId: string
}

type InstanceStatus = 'running' | 'stopped' | 'error' | 'loading' | 'unknown'

const STATUS_CONFIG: Record<InstanceStatus, { color: string; label: string; bg: string }> = {
  running: { color: 'bg-green-500', label: 'Running', bg: 'bg-green-500/10 text-green-400' },
  stopped: { color: 'bg-zinc-500', label: 'Stopped', bg: 'bg-zinc-500/10 text-zinc-400' },
  error: { color: 'bg-red-500', label: 'Error', bg: 'bg-red-500/10 text-red-400' },
  loading: { color: 'bg-yellow-500 animate-pulse', label: 'Loading...', bg: 'bg-yellow-500/10 text-yellow-400' },
  unknown: { color: 'bg-zinc-600', label: 'Unknown', bg: 'bg-zinc-600/10 text-zinc-500' },
}

export function InstanceControls({ userId }: InstanceControlsProps) {
  const [status, setStatus] = useState<InstanceStatus>('loading')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/containers?userId=${userId}`)
      if (!res.ok) {
        setStatus('unknown')
        return
      }
      const data = await res.json()
      const s = data.status?.toLowerCase()
      if (s === 'running' || s === 'active') setStatus('running')
      else if (s === 'stopped' || s === 'exited') setStatus('stopped')
      else if (s === 'error') setStatus('error')
      else setStatus('unknown')
    } catch {
      setStatus('unknown')
    }
  }, [userId])

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 15000) // Poll every 15s
    return () => clearInterval(interval)
  }, [fetchStatus])

  const handleAction = async (action: 'start' | 'stop' | 'restart') => {
    setActionLoading(action)
    setError(null)
    try {
      const res = await fetch('/api/containers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || `Failed to ${action}`)
      } else {
        // Refetch status after a short delay
        setTimeout(fetchStatus, 2000)
      }
    } catch {
      setError(`Failed to ${action} instance`)
    } finally {
      setActionLoading(null)
    }
  }

  const config = STATUS_CONFIG[status]

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Instance</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg}`}>
          <span className={`inline-block w-2 h-2 rounded-full ${config.color} mr-1.5`} />
          {config.label}
        </span>
      </div>

      {/* Control buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => handleAction('start')}
          disabled={status === 'running' || actionLoading !== null}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {actionLoading === 'start' ? (
            <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
          ) : (
            <Play size={16} />
          )}
          Start
        </button>

        <button
          onClick={() => handleAction('stop')}
          disabled={status === 'stopped' || actionLoading !== null}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {actionLoading === 'stop' ? (
            <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
          ) : (
            <Square size={16} />
          )}
          Stop
        </button>

        <button
          onClick={() => handleAction('restart')}
          disabled={actionLoading !== null}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {actionLoading === 'restart' ? (
            <div className="w-4 h-4 border-2 border-zinc-400/30 border-t-zinc-400 rounded-full animate-spin" />
          ) : (
            <RotateCcw size={16} />
          )}
          Restart
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 mt-3 text-sm text-red-400">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  )
}
