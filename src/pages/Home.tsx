import { ArrowRight, Fire, Sparkle, TrendUp } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PromptCard } from '../components/PromptCard'
import { PROMPTS } from '../data/prompts'
import { formatUses } from '../lib/market'
import type { Prompt, PromptCategory, RevealPhase } from '../types'

const FEED_CATEGORIES: PromptCategory[] = ['All', 'Code', 'Marketing', 'Image Generation', 'Research']

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
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory>('All')

  const feedPrompts = useMemo(
    () =>
      [...PROMPTS]
        .filter((prompt) => selectedCategory === 'All' || prompt.category === selectedCategory)
        .sort(sortHomeFeed),
    [selectedCategory]
  )

  const totalUses = PROMPTS.reduce((sum, prompt) => sum + prompt.uses, 0)
  const trendingCount = PROMPTS.filter((prompt) => prompt.trendingRank).length

  return (
    <main className="home-page">
      <header className="feed-hero">
        <div className="feed-hero-copy">
          <p className="mono-label">Prompt marketplace</p>
          <h1>Buy a working prompt for one specific outcome.</h1>
          <p>
            Browse proven prompts, read the opening lines, unlock the full payload for a micro-payment, then copy it
            straight into your model.
          </p>
        </div>

        <aside className="feed-signal" aria-label="Marketplace signal">
          <FeedStat icon={<Sparkle size={17} weight="fill" />} value={PROMPTS.length.toString()} label="curated prompts" />
          <FeedStat icon={<TrendUp size={17} weight="fill" />} value={formatUses(totalUses)} label="tracked uses" />
          <FeedStat icon={<Fire size={17} weight="fill" />} value={trendingCount.toString()} label="trending now" />
        </aside>
      </header>

      <section className="home-feed-section">
        <div className="feed-toolbar">
          <div>
            <p className="mono-label">Solution feed</p>
            <h2>Pick the outcome, reveal the prompt.</h2>
          </div>
          <Link to="/marketplace">
            Advanced filters
            <ArrowRight size={15} weight="bold" aria-hidden />
          </Link>
        </div>

        <div className="feed-tabs" role="tablist" aria-label="Prompt categories">
          {FEED_CATEGORIES.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? 'is-active' : ''}
              type="button"
              role="tab"
              aria-selected={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
              <span>{category === 'All' ? PROMPTS.length : PROMPTS.filter((prompt) => prompt.category === category).length}</span>
            </button>
          ))}
        </div>

        <div className="home-feed" aria-live="polite">
          {feedPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              connected={connected}
              copied={copiedId === prompt.id}
              phase={getPhase(prompt)}
              onReveal={() => onReveal(prompt)}
              onCopy={() => onCopy(prompt)}
            />
          ))}
        </div>
      </section>

      <section className="creator-cta">
        <div>
          <p className="mono-label">For prompt creators</p>
          <h2>Sell a prompt that solves one job clearly.</h2>
          <p>Submit focused payloads, earn on every reveal, and let buyer outcomes build your trust score.</p>
        </div>
        <Link className="primary-link" to="/sell">
          Start selling
          <ArrowRight size={17} weight="bold" aria-hidden />
        </Link>
      </section>
    </main>
  )
}

function FeedStat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="feed-stat">
      <span aria-hidden>{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  )
}

function sortHomeFeed(a: Prompt, b: Prompt) {
  const aRank = a.trendingRank ?? Number.MAX_SAFE_INTEGER
  const bRank = b.trendingRank ?? Number.MAX_SAFE_INTEGER

  return (
    Number(b.featured) - Number(a.featured) ||
    aRank - bRank ||
    b.successRate - a.successRate ||
    b.uses - a.uses ||
    Date.parse(b.createdAt) - Date.parse(a.createdAt)
  )
}
