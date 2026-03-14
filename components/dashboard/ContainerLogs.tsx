'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Terminal, RefreshCw } from 'lucide-react'

interface ContainerLogsProps {
  userId: string
}

interface LogEntry {
  timestamp?: string
  message: string
}

export function ContainerLogs({ userId }: ContainerLogsProps) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const logsEndRef = useRef<HTMLDivElement>(null)

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch(`/api/containers/logs?userId=${userId}&lines=100`)
      if (!res.ok) {
        setError('Failed to fetch logs')
        setLogs([])
        return
      }
      const data = await res.json()
      // Handle both array of strings and array of objects
      const entries: LogEntry[] = Array.isArray(data.logs)
        ? data.logs.map((l: string | LogEntry) =>
            typeof l === 'string' ? { message: l } : l
          )
        : []
      setLogs(entries)
      setError(null)
    } catch {
      setError('Failed to reach server')
      setLogs([])
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Terminal size={20} className="text-zinc-400" />
          <h3 className="text-lg font-semibold text-white">Container Logs</h3>
        </div>
        <button
          onClick={() => { setLoading(true); fetchLogs() }}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors text-sm"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Log viewer */}
      <div className="bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-xs overflow-auto max-h-[400px] min-h-[200px]">
        {loading && logs.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-zinc-500">
            <div className="w-4 h-4 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin mr-2" />
            Loading logs...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[200px] text-zinc-500">
            {error}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-zinc-500">
            No logs available
          </div>
        ) : (
          <div className="p-3 space-y-0.5">
            {logs.map((entry, i) => (
              <div key={i} className="flex gap-2 hover:bg-zinc-900/50 px-1 py-0.5 rounded">
                {entry.timestamp && (
                  <span className="text-zinc-600 flex-shrink-0">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                )}
                <span className="text-zinc-300 break-all">{entry.message}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
  )
}
