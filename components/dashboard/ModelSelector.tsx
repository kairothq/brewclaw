'use client'

import { useState } from 'react'

const AI_MODELS = [
  {
    value: 'claude-sonnet',
    label: 'Claude Sonnet 4.5',
    description: 'Fast & highly capable',
  },
  {
    value: 'claude-opus',
    label: 'Claude Opus 4.5',
    description: 'Most capable',
  },
  {
    value: 'gpt-4o',
    label: 'GPT-4o',
    description: 'OpenAI flagship',
  },
  {
    value: 'gemini-2.0',
    label: 'Gemini 2.0 Flash',
    description: 'Fast & affordable',
  },
]

export function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState('claude-sonnet')

  const handleSave = () => {
    console.log('Selected model:', selectedModel)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">AI Model</h3>

      <div className="space-y-2">
        {AI_MODELS.map((model) => (
          <button
            key={model.value}
            onClick={() => setSelectedModel(model.value)}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
              selectedModel === model.value
                ? 'border-orange-500 bg-orange-500/10'
                : 'border-zinc-700 hover:border-zinc-600'
            }`}
          >
            <div className="font-medium text-white">{model.label}</div>
            <div className="text-sm text-zinc-400">{model.description}</div>
          </button>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-4 w-full bg-orange-500 hover:bg-orange-400 text-white rounded-lg px-4 py-2.5 font-medium transition-all duration-200"
      >
        Save
      </button>
    </div>
  )
}
