"use client"

import { useState } from "react"
import {
  Play,
  Square,
  RotateCcw,
  Activity,
  Server,
  Clock,
  CreditCard,
  Bot,
  Key,
  ChevronRight,
  MessageSquare,
  Zap,
  HardDrive,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Status types
type InstanceStatus = "running" | "stopped" | "error" | "starting" | "stopping"

// Mock data - will be replaced with actual data
const mockInstance = {
  status: "running" as InstanceStatus,
  platform: "telegram",
  botUsername: "@my_brewclaw_bot",
  aiProvider: "anthropic",
  model: "Claude 3.5 Sonnet",
  lastActive: "2 minutes ago",
  uptime: "3 days, 14 hours",
  messagesProcessed: 1247,
  tokensUsed: 125000,
  storageUsed: "2.4 GB",
  storageTotal: "10 GB",
}

const mockSubscription = {
  plan: "Pro",
  status: "active",
  nextBilling: "March 15, 2026",
  amount: "₹499",
  startDate: "February 15, 2026",
}

const mockLogs = [
  { time: "14:32:05", type: "info", message: "Bot started successfully" },
  { time: "14:32:10", type: "info", message: "Connected to Telegram API" },
  { time: "14:33:22", type: "info", message: "Message received from user @john_doe" },
  { time: "14:33:24", type: "info", message: "Processing request with Claude 3.5 Sonnet..." },
  { time: "14:33:28", type: "success", message: "Response sent (1,234 tokens)" },
  { time: "14:35:01", type: "info", message: "Message received from user @jane_smith" },
  { time: "14:35:03", type: "info", message: "Processing request with Claude 3.5 Sonnet..." },
  { time: "14:35:08", type: "success", message: "Response sent (892 tokens)" },
  { time: "14:40:15", type: "warning", message: "Rate limit approaching (80%)" },
  { time: "14:42:33", type: "info", message: "Message received from user @alex_dev" },
]

// Status indicator component
function StatusBadge({ status }: { status: InstanceStatus }) {
  const configs = {
    running: {
      color: "bg-emerald-500",
      text: "Running",
      icon: CheckCircle,
    },
    stopped: {
      color: "bg-zinc-500",
      text: "Stopped",
      icon: Square,
    },
    error: {
      color: "bg-red-500",
      text: "Error",
      icon: XCircle,
    },
    starting: {
      color: "bg-amber-500",
      text: "Starting...",
      icon: Activity,
    },
    stopping: {
      color: "bg-amber-500",
      text: "Stopping...",
      icon: Activity,
    },
  }

  const config = configs[status]
  const Icon = config.icon

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${config.color} ${status === "running" || status === "starting" || status === "stopping" ? "animate-pulse" : ""}`} />
      <span className="text-sm font-medium text-foreground">{config.text}</span>
    </div>
  )
}

// Metric card component
function MetricCard({
  icon: Icon,
  label,
  value,
  subValue,
}: {
  icon: typeof Activity
  label: string
  value: string | number
  subValue?: string
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-border/80 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold text-foreground">{value}</p>
          {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
        </div>
      </div>
    </div>
  )
}

// Instance control panel
function InstanceControlPanel({
  status,
  onStart,
  onStop,
  onRestart,
}: {
  status: InstanceStatus
  onStart: () => void
  onStop: () => void
  onRestart: () => void
}) {
  const isRunning = status === "running"
  const isStopped = status === "stopped"
  const isTransitioning = status === "starting" || status === "stopping"

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Instance Control</h2>
          <p className="text-sm text-muted-foreground">Manage your AI bot instance</p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="flex gap-3">
        <Button
          variant={isStopped ? "default" : "outline"}
          onClick={onStart}
          disabled={isRunning || isTransitioning}
          className="flex-1"
        >
          <Play className="w-4 h-4 mr-2" />
          Start
        </Button>
        <Button
          variant="outline"
          onClick={onStop}
          disabled={isStopped || isTransitioning}
          className="flex-1"
        >
          <Square className="w-4 h-4 mr-2" />
          Stop
        </Button>
        <Button
          variant="outline"
          onClick={onRestart}
          disabled={isStopped || isTransitioning}
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Restart
        </Button>
      </div>

      {/* Instance details */}
      <div className="mt-6 pt-6 border-t border-border space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Platform</span>
          <span className="text-foreground font-medium capitalize">{mockInstance.platform}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Bot</span>
          <span className="text-foreground font-medium">{mockInstance.botUsername}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">AI Model</span>
          <span className="text-foreground font-medium">{mockInstance.model}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Uptime</span>
          <span className="text-foreground font-medium">{mockInstance.uptime}</span>
        </div>
      </div>
    </div>
  )
}

// Logs viewer component
function LogsViewer({ logs }: { logs: typeof mockLogs }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Live Logs</h2>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          View all
        </button>
      </div>

      <div className="h-[320px] overflow-y-auto p-4 font-mono text-xs bg-background/50">
        <div className="space-y-1">
          {logs.map((log, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-muted-foreground shrink-0">{log.time}</span>
              <span
                className={`shrink-0 ${
                  log.type === "error"
                    ? "text-red-400"
                    : log.type === "warning"
                    ? "text-amber-400"
                    : log.type === "success"
                    ? "text-emerald-400"
                    : "text-muted-foreground"
                }`}
              >
                [{log.type.toUpperCase().padEnd(7)}]
              </span>
              <span className="text-foreground break-all">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Subscription card
function SubscriptionCard({ subscription }: { subscription: typeof mockSubscription }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Subscription</h2>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">
          {subscription.status}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Plan</span>
          <span className="text-foreground font-semibold">{subscription.plan}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Amount</span>
          <span className="text-foreground font-semibold">{subscription.amount}/month</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Next billing</span>
          <span className="text-foreground">{subscription.nextBilling}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Started</span>
          <span className="text-foreground">{subscription.startDate}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex gap-3">
        <Button variant="outline" className="flex-1" size="sm">
          Manage Plan
        </Button>
        <Button variant="outline" className="flex-1" size="sm">
          Billing History
        </Button>
      </div>
    </div>
  )
}

// Quick actions
function QuickActions() {
  const actions = [
    {
      icon: Key,
      label: "Update API Key",
      description: "Change your AI provider credentials",
      href: "/dashboard/settings",
    },
    {
      icon: Bot,
      label: "Change AI Model",
      description: "Switch between AI providers",
      href: "/dashboard/settings",
    },
    {
      icon: CreditCard,
      label: "Upgrade Plan",
      description: "Get more resources and features",
      href: "/dashboard/billing",
    },
  ]

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="space-y-2">
        {actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                <action.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </a>
        ))}
      </div>
    </div>
  )
}

// Main dashboard page
export default function DashboardPage() {
  const [instanceStatus, setInstanceStatus] = useState<InstanceStatus>(mockInstance.status)

  const handleStart = () => {
    setInstanceStatus("starting")
    setTimeout(() => setInstanceStatus("running"), 2000)
  }

  const handleStop = () => {
    setInstanceStatus("stopping")
    setTimeout(() => setInstanceStatus("stopped"), 2000)
  }

  const handleRestart = () => {
    setInstanceStatus("stopping")
    setTimeout(() => {
      setInstanceStatus("starting")
      setTimeout(() => setInstanceStatus("running"), 1500)
    }, 1500)
  }

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">{getGreeting()}</h1>
        <p className="text-muted-foreground">Here's what's happening with your AI assistant</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={MessageSquare}
          label="Messages"
          value={mockInstance.messagesProcessed.toLocaleString()}
          subValue="Last 30 days"
        />
        <MetricCard
          icon={Zap}
          label="Tokens Used"
          value={`${(mockInstance.tokensUsed / 1000).toFixed(1)}K`}
          subValue="This billing cycle"
        />
        <MetricCard
          icon={HardDrive}
          label="Storage"
          value={mockInstance.storageUsed}
          subValue={`of ${mockInstance.storageTotal}`}
        />
        <MetricCard
          icon={Clock}
          label="Last Active"
          value={mockInstance.lastActive}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <InstanceControlPanel
            status={instanceStatus}
            onStart={handleStart}
            onStop={handleStop}
            onRestart={handleRestart}
          />
          <SubscriptionCard subscription={mockSubscription} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <LogsViewer logs={mockLogs} />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
