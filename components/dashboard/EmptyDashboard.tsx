'use client';

import Link from 'next/link';
import { Bot } from 'lucide-react';

export function EmptyDashboard() {
  return (
    <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
      {/* Bot icon */}
      <Bot className="w-16 h-16 text-zinc-600 mx-auto" />

      {/* Heading */}
      <h2 className="text-xl font-semibold text-white mt-4">
        No AI Assistant Yet
      </h2>

      {/* Subtext */}
      <p className="text-zinc-400 mt-2">
        Deploy your first AI assistant to get started
      </p>

      {/* CTA button */}
      <Link
        href="/onboarding"
        className="inline-block bg-orange-500 hover:bg-orange-400 text-white rounded-lg px-6 py-3 mt-6 font-medium transition-all duration-200"
      >
        Deploy Your First Assistant
      </Link>
    </div>
  );
}
