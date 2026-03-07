'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Key,
  Eye,
  EyeOff,
  LogOut,
  Trash2,
  AlertTriangle,
  Save,
  Sparkles,
  Zap
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();

  // Profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // API Keys state
  const [selectedProvider, setSelectedProvider] = useState<'claude' | 'gpt' | 'gemini' | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Danger zone state
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    try {
      const instance = JSON.parse(localStorage.getItem('brewclaw_instance') || '{}');
      if (instance.name) setName(instance.name);
      if (instance.email) setEmail(instance.email);
    } catch {
      // Handle parse error gracefully
    }
  }, []);

  const handleSaveProfile = () => {
    setIsSaving(true);

    // Simulate save delay
    setTimeout(() => {
      try {
        const instance = JSON.parse(localStorage.getItem('brewclaw_instance') || '{}');
        instance.name = name;
        localStorage.setItem('brewclaw_instance', JSON.stringify(instance));
        console.log('Profile saved:', { name, email });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      } catch {
        console.error('Failed to save profile');
      }
      setIsSaving(false);
    }, 500);
  };

  const handleSaveApiKey = () => {
    setIsSaving(true);

    setTimeout(() => {
      console.log('API Key saved:', { provider: selectedProvider, apiKey: apiKey ? '***' : '' });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      setIsSaving(false);
    }, 500);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('brewclaw_instance');
      router.push('/');
    }, 300);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText === 'DELETE') {
      console.log('Account deletion requested');
      localStorage.removeItem('brewclaw_instance');
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Subtle background accent */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Page Header */}
        <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

        {/* Section 1: Profile */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 transition-all duration-200 hover:border-zinc-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
              <User className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Profile</h2>
              <p className="text-sm text-zinc-500">Manage your account details</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all duration-200"
                  placeholder="Your name"
                />
              </div>
            </div>

            {/* Email Input (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  readOnly
                  className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg pl-10 pr-4 py-3 text-zinc-500 cursor-not-allowed"
                  placeholder="your@email.com"
                />
              </div>
              <p className="mt-1.5 text-xs text-zinc-600">Email cannot be changed</p>
            </div>

            {/* Save Profile Button */}
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="mt-2 flex items-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2.5 transition-all duration-200"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : saveSuccess ? (
                <span className="text-sm">Saved!</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Section 2: API Keys */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 transition-all duration-200 hover:border-zinc-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
              <Key className="w-5 h-5 text-zinc-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white">AI Provider API Keys</h2>
                <span className="px-2 py-0.5 bg-zinc-700 text-zinc-400 text-xs rounded-full">Optional</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-zinc-500 mb-6 ml-[52px]">
            Add your own API key to pay providers directly at cost.
          </p>

          <div className="space-y-4">
            {/* Provider Toggle Buttons */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Select Provider
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => setSelectedProvider(selectedProvider === 'gemini' ? null : 'gemini')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-lg border transition-all duration-200 ${
                    selectedProvider === 'gemini'
                      ? 'bg-orange-500/10 border-orange-500 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">Gemini</span>
                </button>
                <button
                  onClick={() => setSelectedProvider(selectedProvider === 'claude' ? null : 'claude')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-lg border transition-all duration-200 ${
                    selectedProvider === 'claude'
                      ? 'bg-orange-500/10 border-orange-500 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">Claude</span>
                </button>
                <button
                  onClick={() => setSelectedProvider(selectedProvider === 'gpt' ? null : 'gpt')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-lg border transition-all duration-200 ${
                    selectedProvider === 'gpt'
                      ? 'bg-orange-500/10 border-orange-500 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">GPT</span>
                </button>
              </div>
            </div>

            {/* API Key Input (shown when provider selected) */}
            {selectedProvider && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <label htmlFor="apiKey" className="block text-sm font-medium text-zinc-400 mb-2">
                  {selectedProvider === 'claude' ? 'Anthropic' : selectedProvider === 'gemini' ? 'Google Gemini' : 'OpenAI'} API Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-12 py-3 text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none transition-all duration-200"
                    placeholder={selectedProvider === 'claude' ? 'sk-ant-api03-...' : selectedProvider === 'gemini' ? 'AIza...' : 'sk-...'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400 transition-colors"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-zinc-600">
                  Your API key is stored securely and never shared.
                </p>
              </div>
            )}

            {/* Save API Key Button */}
            {selectedProvider && (
              <button
                onClick={handleSaveApiKey}
                disabled={isSaving || !apiKey}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2.5 transition-all duration-200"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save API Key</span>
                  </>
                )}
              </button>
            )}
          </div>
        </section>

        {/* Section 3: Danger Zone */}
        <section className="border border-red-500/30 rounded-xl p-4 sm:p-6 bg-red-500/5 transition-all duration-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
              <p className="text-sm text-zinc-500">Irreversible actions</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Logout Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
              <div>
                <p className="text-sm font-medium text-white">Sign out</p>
                <p className="text-xs text-zinc-500">Sign out of your account on this device</p>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 min-h-[44px] text-red-500 border border-red-500/50 rounded-lg hover:bg-red-500/10 disabled:opacity-50 transition-all duration-200"
              >
                {isLoggingOut ? (
                  <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Logout</span>
                  </>
                )}
              </button>
            </div>

            {/* Delete Account */}
            <div className="p-3 sm:p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">Delete account</p>
                  <p className="text-xs text-zinc-500">Permanently delete your account and all data</p>
                </div>
                {!isDeleteConfirmOpen && (
                  <button
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 min-h-[44px] bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="font-medium">Delete Account</span>
                  </button>
                )}
              </div>

              {/* Delete Confirmation */}
              {isDeleteConfirmOpen && (
                <div className="mt-4 pt-4 border-t border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="text-sm text-red-400 mb-3">
                    This action cannot be undone. Type <span className="font-mono font-bold">DELETE</span> to confirm.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 min-h-[44px] text-white placeholder-zinc-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all duration-200"
                      placeholder="Type DELETE to confirm"
                    />
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== 'DELETE'}
                        className="flex-1 sm:flex-none px-4 py-2 min-h-[44px] bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleteConfirmOpen(false);
                          setDeleteConfirmText('');
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 min-h-[44px] bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 hover:text-white transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
