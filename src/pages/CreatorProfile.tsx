import { ShieldCheck } from '@phosphor-icons/react'
import { Navigate, useParams } from 'react-router-dom'
import { PromptCard } from '../components/PromptCard'
import { CREATORS } from '../data/prompts'
import { creatorPrompts, formatUses } from '../lib/market'
import type { Prompt, RevealPhase } from '../types'

export function CreatorProfile({
  connected,
  copiedId,
  getPhase,
  onReveal,
  onCopy,
}: {
  connected: boolean
  copiedId: number | null
  getPhase: (prompt: Prompt) => RevealPhase
  onReveal: (prompt: Prompt) => void
  onCopy: (prompt: Prompt) => void
}) {
  const { handle } = useParams()
  const creator = CREATORS.find((item) => item.handle === handle)

  if (!creator) return <Navigate to="/creators" replace />

  const prompts = creatorPrompts(creator.id)

  return (
    <main className="profile-page">
      <header className="profile-hero glass">
        <span className="creator-avatar is-large">{creator.avatar}</span>
        <div>
          <p className="mono-label">@{creator.handle}</p>
          <h1>
            {creator.displayName}
            {creator.verified ? <ShieldCheck size={24} weight="fill" aria-label="Verified creator" /> : null}
          </h1>
          <p>{creator.bio}</p>
          <div className="tag-row">
            {creator.specialties.map((specialty) => (
              <span key={specialty}>#{specialty}</span>
            ))}
          </div>
        </div>
        <div className="profile-stats">
          <Metric value={formatUses(creator.totalSales)} label="sales" />
          <Metric value={`${creator.successRate}%`} label="success" />
          <Metric value={`${creator.refundRate}%`} label="refund" />
        </div>
      </header>

      <section className="shelf">
        <div className="section-heading">
          <div>
            <p className="mono-label">Catalog</p>
            <h2>{prompts.length} prompts from {creator.displayName}</h2>
          </div>
        </div>
        <div className="shelf-grid">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              phase={getPhase(prompt)}
              copied={copiedId === prompt.id}
              connected={connected}
              onReveal={() => onReveal(prompt)}
              onCopy={() => onCopy(prompt)}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}
