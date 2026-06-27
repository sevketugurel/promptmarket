import { Check, CircleNotch, Copy, SealCheck, Sparkle } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { formatUses } from '../lib/market'
import type { Prompt, RevealPhase } from '../types'
import { PayloadFrost } from './PayloadFrost'

export function PromptCard({
  prompt,
  phase,
  copied,
  connected,
  compact = false,
  onReveal,
  onCopy,
}: {
  prompt: Prompt
  phase: RevealPhase
  copied: boolean
  connected: boolean
  compact?: boolean
  onReveal: () => void
  onCopy: () => void
}) {
  const isRevealed = phase === 'revealed'
  const isCommitting = phase === 'committing'

  return (
    <article className={`prompt-card glass phase-${phase} ${compact ? 'is-compact' : ''}`}>
      <div className="molten-trace" aria-hidden />

      <header className="card-meta">
        <span className="tool-badge">
          <Sparkle size={14} weight="fill" aria-hidden />
          {prompt.tool}
        </span>
        <span className="success-metric">
          <span aria-hidden />
          {prompt.successRate}% success
        </span>
        <span className="use-count">~ {formatUses(prompt.uses)}</span>
      </header>

      <Link className="card-copy card-link" to={`/prompt/${prompt.slug}`}>
        <h2>{prompt.title}</h2>
        <p>{prompt.description}</p>
      </Link>

      <PayloadFrost phase={phase} secretPrompt={prompt.secretPrompt} />

      <div className="tag-row">
        {prompt.tags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>

      <footer className="card-footer">
        <div>
          <span className="price-line">{prompt.price.toFixed(2)} MON</span>
          <span className="fiat-line">micro-reveal · settles on Monad</span>
        </div>

        {isRevealed ? (
          <button className="copy-button" onClick={onCopy}>
            {copied ? <Check size={16} weight="bold" aria-hidden /> : <Copy size={16} weight="bold" aria-hidden />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        ) : (
          <button className="reveal-button" onClick={onReveal} disabled={isCommitting}>
            {isCommitting ? (
              <CircleNotch className="spin" size={16} weight="bold" aria-hidden />
            ) : (
              <SealCheck size={16} weight="bold" aria-hidden />
            )}
            {isCommitting ? 'Settling' : connected ? 'Reveal' : 'Connect'}
          </button>
        )}
      </footer>
    </article>
  )
}
