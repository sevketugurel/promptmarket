import { ArrowRight, ShieldCheck, Sparkle, TrendUp, UsersThree } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PromptCard } from '../components/PromptCard'
import { PROMPTS } from '../data/prompts'
import { formatUses } from '../lib/market'
import type { Prompt, RevealPhase } from '../types'

export function Home({
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
  const featured = PROMPTS.filter((prompt) => prompt.featured).slice(0, 4)
  const trending = PROMPTS.filter((prompt) => prompt.trendingRank).sort((a, b) => (a.trendingRank ?? 99) - (b.trendingRank ?? 99))
  const newest = [...PROMPTS].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 4)
  const totalUses = PROMPTS.reduce((sum, prompt) => sum + prompt.uses, 0)

  return (
    <main>
      <header className="hero-band home-hero">
        <div>
          <p className="mono-label">Monad micro-transactions</p>
          <h1>
            FluidPrompt
            <span>Five cents clears the glass.</span>
          </h1>
          <p>
            A creator marketplace where paying is the reveal. Browse proven prompts, unlock the payload, copy it into your
            favorite model, and keep the purchase in your library.
          </p>
          <div className="hero-actions">
            <Link className="primary-link" to="/marketplace">
              Explore marketplace
              <ArrowRight size={17} weight="bold" aria-hidden />
            </Link>
            <Link className="secondary-link" to="/how-it-works">
              Reveal model
            </Link>
          </div>
        </div>

        <section className="hero-panel glass">
          <p className="rail-label">Marketplace signal</p>
          <div className="trust-grid">
            <TrustStat icon={<Sparkle size={18} weight="fill" />} value={PROMPTS.length.toString()} label="curated prompts" />
            <TrustStat icon={<TrendUp size={18} weight="fill" />} value={formatUses(totalUses)} label="tracked uses" />
            <TrustStat icon={<ShieldCheck size={18} weight="fill" />} value="1.9%" label="median refund" />
            <TrustStat icon={<UsersThree size={18} weight="fill" />} value="6" label="verified creators" />
          </div>
        </section>
      </header>

      <PromptShelf
        title="Featured"
        eyebrow="Editor picks"
        prompts={featured}
        connected={connected}
        copiedId={copiedId}
        getPhase={getPhase}
        onReveal={onReveal}
        onCopy={onCopy}
      />

      <PromptShelf
        title="Trending now"
        eyebrow="Live demand"
        prompts={trending.slice(0, 4)}
        connected={connected}
        copiedId={copiedId}
        getPhase={getPhase}
        onReveal={onReveal}
        onCopy={onCopy}
      />

      <PromptShelf
        title="Newest drops"
        eyebrow="Fresh payloads"
        prompts={newest}
        connected={connected}
        copiedId={copiedId}
        getPhase={getPhase}
        onReveal={onReveal}
        onCopy={onCopy}
      />

      <section className="creator-cta">
        <div>
          <p className="mono-label">For prompt creators</p>
          <h2>Sell one useful prompt at a time.</h2>
          <p>Submit focused prompts, earn on every reveal, and let buyer outcomes build your trust score.</p>
        </div>
        <Link className="primary-link" to="/sell">
          Start selling
          <ArrowRight size={17} weight="bold" aria-hidden />
        </Link>
      </section>
    </main>
  )
}

function PromptShelf({
  title,
  eyebrow,
  prompts,
  connected,
  copiedId,
  getPhase,
  onReveal,
  onCopy,
}: {
  title: string
  eyebrow: string
  prompts: Prompt[]
  connected: boolean
  copiedId: number | null
  getPhase: (prompt: Prompt) => RevealPhase
  onReveal: (prompt: Prompt) => void
  onCopy: (prompt: Prompt) => void
}) {
  return (
    <section className="shelf">
      <div className="section-heading">
        <div>
          <p className="mono-label">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <Link to="/marketplace">View all</Link>
      </div>
      <div className="shelf-grid">
        {prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            compact
            connected={connected}
            copied={copiedId === prompt.id}
            phase={getPhase(prompt)}
            onReveal={() => onReveal(prompt)}
            onCopy={() => onCopy(prompt)}
          />
        ))}
      </div>
    </section>
  )
}

function TrustStat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="trust-stat">
      <span aria-hidden>{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  )
}
