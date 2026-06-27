import { useState } from 'react'
import { Prompt } from '../types'
import { LockedOverlay } from './LockedOverlay'

interface PromptCardProps {
  prompt: Prompt
  isUnlocked: boolean
  onUnlock: (id: number, priceInMon: number) => Promise<void>
  isPending: boolean
}

export function PromptCard({ prompt, isUnlocked, onUnlock, isPending }: PromptCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.secretPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article className="glass rounded-2xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex flex-col gap-1">
          <span
            className="text-xs monad-text"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {prompt.tag}
          </span>
          <h3 className="font-semibold text-white leading-snug">{prompt.title}</h3>
        </div>
        <span
          className="glass rounded-full px-3 py-0.5 text-sm font-bold neon-text whitespace-nowrap"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {prompt.price} MON
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-white/60 leading-relaxed">{prompt.description}</p>

      {/* Code block */}
      <div className="relative rounded-xl overflow-hidden">
        <pre
          className={`text-xs text-white/80 bg-black/30 p-4 min-h-[120px] whitespace-pre-wrap transition-all duration-700 ease-in-out ${
            isUnlocked ? '' : 'glass-blur-locked'
          }`}
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <code>{prompt.secretPrompt}</code>
        </pre>
        {!isUnlocked && <LockedOverlay price={prompt.price} />}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-white/40">{prompt.authorHandle}</span>
        {isUnlocked ? (
          <button
            onClick={handleCopy}
            className="glass rounded-lg px-3 py-1.5 text-xs neon-text transition-all duration-200"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        ) : (
          <button
            onClick={() => onUnlock(prompt.id, prompt.price)}
            disabled={isPending}
            className="rounded-lg px-4 py-1.5 text-xs text-white font-semibold disabled:opacity-60 flex items-center gap-2 transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #836EFD 0%, #A15EFA 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)',
            }}
          >
            {isPending && (
              <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            Unlock for {prompt.price} MON
          </button>
        )}
      </div>
    </article>
  )
}
