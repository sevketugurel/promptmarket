import { ArrowLeft, Check, CircleNotch, Copy, SealCheck, ShieldCheck } from '@phosphor-icons/react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PayloadFrost } from '../components/PayloadFrost'
import { PromptCard } from '../components/PromptCard'
import { findPrompt, formatMon, formatUses, getCreator, relatedPrompts } from '../lib/market'
import type { Prompt, RevealPhase } from '../types'

export function PromptDetail({
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
  const { id } = useParams()
  const prompt = findPrompt(id)

  if (!prompt) return <Navigate to="/marketplace" replace />

  const creator = getCreator(prompt.creatorId)
  const phase = getPhase(prompt)
  const revealed = phase === 'revealed'
  const committing = phase === 'committing'

  return (
    <main className="detail-page">
      <Link className="back-link" to="/marketplace">
        <ArrowLeft size={16} weight="bold" aria-hidden />
        Marketplace
      </Link>

      <section className="detail-layout">
        <article className="detail-primary glass">
          <div className="detail-kicker">
            <span>{prompt.tool}</span>
            <span>{prompt.category}</span>
            {prompt.trendingRank ? <span>Trending #{prompt.trendingRank}</span> : null}
          </div>
          <h1>{prompt.title}</h1>
          <p>{prompt.description}</p>

          <div className="detail-stats">
            <Metric value={`${prompt.successRate}%`} label="buyer success" />
            <Metric value={formatUses(prompt.uses)} label="tracked uses" />
            <Metric value={`${prompt.refundRate}%`} label="refund rate" />
            <Metric value={formatMon(prompt.price)} label="reveal price" />
          </div>

          <PayloadFrost phase={phase} secretPrompt={revealed ? prompt.secretPrompt : undefined} />

          <div className="tag-row">
            {prompt.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>

          <div className="detail-actions">
            {revealed ? (
              <button className="copy-button" onClick={() => onCopy(prompt)}>
                {copiedId === prompt.id ? <Check size={16} weight="bold" aria-hidden /> : <Copy size={16} weight="bold" aria-hidden />}
                {copiedId === prompt.id ? 'Copied' : 'Copy prompt'}
              </button>
            ) : (
              <button className="reveal-button" onClick={() => onReveal(prompt)} disabled={committing}>
                {committing ? <CircleNotch className="spin" size={16} weight="bold" aria-hidden /> : <SealCheck size={16} weight="bold" aria-hidden />}
                {committing ? 'Settling reveal' : connected ? `Reveal for ${formatMon(prompt.price)}` : 'Connect to reveal'}
              </button>
            )}
          </div>
        </article>

        <aside className="detail-aside">
          <Link className="creator-card glass" to={`/creator/${creator.handle}`}>
            <span className="creator-avatar">{creator.avatar}</span>
            <div>
              <p>
                {creator.displayName}
                {creator.verified ? <ShieldCheck size={16} weight="fill" aria-label="Verified creator" /> : null}
              </p>
              <small>@{creator.handle}</small>
            </div>
          </Link>

          <section className="trust-panel glass">
            <p className="rail-label">Creator trust</p>
            <Metric value={formatUses(creator.totalSales)} label="total sales" />
            <Metric value={`${creator.successRate}%`} label="success rate" />
            <Metric value={`${creator.refundRate}%`} label="refund rate" />
          </section>
        </aside>
      </section>

      <section className="shelf">
        <div className="section-heading">
          <div>
            <p className="mono-label">Related</p>
            <h2>Similar payloads</h2>
          </div>
        </div>
        <div className="shelf-grid">
          {relatedPrompts(prompt).map((item) => (
            <PromptCard
              key={item.id}
              prompt={item}
              compact
              phase={getPhase(item)}
              copied={copiedId === item.id}
              connected={connected}
              onReveal={() => onReveal(item)}
              onCopy={() => onCopy(item)}
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
