'use client';

import { Zap } from 'lucide-react';

interface LiveActivityProps {
  eventCount?: number;
  isWorking?: boolean;
}

export function LiveActivity({ eventCount = 0, isWorking = false }: LiveActivityProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      {/* Header row */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Live Activity</h3>
        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isWorking ? 'bg-green-500 animate-pulse' : 'bg-green-500'
              }`}
            />
            <span className="text-zinc-400 text-sm">
              {isWorking ? 'Working' : 'Idle'}
            </span>
          </div>
          {/* Event count */}
          <span className="text-zinc-500 text-sm">
            {eventCount} event{eventCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Activity area */}
      <div className="min-h-[200px] flex items-center justify-center">
        {eventCount === 0 ? (
          /* Empty state */
          <div className="text-center">
            <Zap className="w-12 h-12 text-zinc-700 mx-auto" />
            <p className="text-zinc-400 mt-4">No activity yet</p>
            <p className="text-zinc-500 text-sm mt-1">
              Activity appears here when your AI assistant works
            </p>
          </div>
        ) : (
          /* Activity feed placeholder - to be implemented */
          <div className="w-full">
            {/* Future: map over events and render them */}
          </div>
        )}
      </div>
    </div>
  );
}
