"use client"

import { useState } from "react"
import { Key, Bot, Bell, Shield, Save, Eye, EyeOff, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data
const mockSettings = {
  aiProvider: "anthropic",
  apiKeyMasked: "sk-ant-api...XXXX",
  hasApiKey: true,
  notifications: {
    email: true,
    errorAlerts: true,
    weeklyReport: false,
  },
}

// Settings section component
function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Key
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

// Toggle switch component
function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean
  onChange: (enabled: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        enabled ? "bg-emerald-500" : "bg-secondary"
      }`}
    >
      <div
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
          enabled ? "translate-x-5" : ""
        }`}
      />
    </button>
  )
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings)
  const [showApiKey, setShowApiKey] = useState(false)
  const [newApiKey, setNewApiKey] = useState("")
  const [selectedProvider, setSelectedProvider] = useState(settings.aiProvider)

  const providers = [
    {
      id: "gemini",
      name: "Google Gemini",
      description: "Fast and efficient",
      docsUrl: "https://makersuite.google.com/app/apikey",
    },
    {
      id: "openai",
      name: "OpenAI (GPT-4)",
      description: "Most capable",
      docsUrl: "https://platform.openai.com/api-keys",
    },
    {
      id: "anthropic",
      name: "Anthropic (Claude)",
      description: "Best reasoning",
      docsUrl: "https://console.anthropic.com/settings/keys",
    },
  ]

  const selectedProviderData = providers.find((p) => p.id === selectedProvider)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your AI assistant configuration</p>
      </div>

      {/* AI Provider Settings */}
      <SettingsSection
        icon={Bot}
        title="AI Provider"
        description="Choose which AI powers your assistant"
      >
        <div className="space-y-4">
          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Provider</label>
            <div className="grid gap-2">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedProvider === provider.id
                      ? "border-foreground bg-secondary"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  <div>
                    <p className="font-medium text-foreground">{provider.name}</p>
                    <p className="text-sm text-muted-foreground">{provider.description}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedProvider === provider.id
                        ? "border-foreground bg-foreground"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedProvider === provider.id && (
                      <div className="w-2 h-2 rounded-full bg-background" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedProvider !== settings.aiProvider && (
            <p className="text-sm text-amber-500">
              Changing provider will require a new API key
            </p>
          )}
        </div>
      </SettingsSection>

      {/* API Key Settings */}
      <SettingsSection
        icon={Key}
        title="API Key"
        description="Your AI provider credentials"
      >
        <div className="space-y-4">
          {/* Current API Key */}
          {settings.hasApiKey && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Current API Key</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3 rounded-lg bg-secondary text-muted-foreground font-mono text-sm">
                  {showApiKey ? "sk-ant-api-xxxxxxxxxxxxx-XXXX" : settings.apiKeyMasked}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="px-3"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* New API Key */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {settings.hasApiKey ? "Update API Key" : "Enter API Key"}
            </label>
            <input
              type="password"
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Get API Key Link */}
          {selectedProviderData && (
            <a
              href={selectedProviderData.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Get your API key from {selectedProviderData.name}
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <Button disabled={!newApiKey} className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" />
            Save API Key
          </Button>
        </div>
      </SettingsSection>

      {/* Notification Settings */}
      <SettingsSection
        icon={Bell}
        title="Notifications"
        description="Configure how you receive updates"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Email notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Toggle
              enabled={settings.notifications.email}
              onChange={(enabled) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, email: enabled },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Error alerts</p>
              <p className="text-sm text-muted-foreground">Get notified when your bot encounters errors</p>
            </div>
            <Toggle
              enabled={settings.notifications.errorAlerts}
              onChange={(enabled) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, errorAlerts: enabled },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Weekly report</p>
              <p className="text-sm text-muted-foreground">Receive weekly usage summaries</p>
            </div>
            <Toggle
              enabled={settings.notifications.weeklyReport}
              onChange={(enabled) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, weeklyReport: enabled },
                })
              }
            />
          </div>
        </div>
      </SettingsSection>

      {/* Danger Zone */}
      <SettingsSection
        icon={Shield}
        title="Danger Zone"
        description="Irreversible actions"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5">
            <div>
              <p className="text-sm font-medium text-foreground">Delete Instance</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your AI assistant and all data
              </p>
            </div>
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
              Delete
            </Button>
          </div>
        </div>
      </SettingsSection>
    </div>
  )
}
