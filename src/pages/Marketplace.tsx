import { useMemo, useState } from 'react'
import { Sparkle } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { MarketplaceFilters } from '../components/MarketplaceFilters'
import { PromptCard } from '../components/PromptCard'
import { filterPrompts } from '../lib/market'
import type { Prompt, PromptCategory, RevealPhase, SortMode } from '../types'

export function Marketplace({
  searchTerm,
  connected,
  copiedId,
  getPhase,
  onReveal,
  onCopy,
}: {
  searchTerm: string
  connected: boolean
  copiedId: number | null
  getPhase: (prompt: Prompt) => RevealPhase
  onReveal: (prompt: Prompt) => void
  onCopy: (prompt: Prompt) => void
}) {
  const navigate = useNavigate()
  const [category, setCategory] = useState<PromptCategory>('All')
  const [tool, setTool] = useState('All')
  const [price, setPrice] = useState('All')
  const [minimumSuccess, setMinimumSuccess] = useState(0)
  const [sortMode, setSortMode] = useState<SortMode>('featured')

  const prompts = useMemo(
    () =>
      filterPrompts({
        searchTerm,
        category,
        tool,
        price,
        minimumSuccess,
        sortMode,
      }),
    [category, minimumSuccess, price, searchTerm, sortMode, tool]
  )

  return (
    <main className="market-page">
      <header className="page-heading">
        <p className="mono-label">Prompt marketplace</p>
        <h1>Buy the payload, not a subscription.</h1>
        <p>Filter by model, category, trust score, and price. Locked prompt text stays hidden until reveal.</p>
      </header>

      <div className="market-layout">
        <MarketplaceFilters
          category={category}
          tool={tool}
          price={price}
          minimumSuccess={minimumSuccess}
          sortMode={sortMode}
          onCategoryChange={setCategory}
          onToolChange={setTool}
          onPriceChange={setPrice}
          onMinimumSuccessChange={setMinimumSuccess}
          onSortModeChange={setSortMode}
        />

        <section className="prompt-results">
          <div className="results-bar">
            <span>{prompts.length} prompts</span>
            <span>{searchTerm.trim() ? `Search: ${searchTerm.trim()}` : 'All marketplace prompts'}</span>
          </div>
          <div className="prompt-masonry" aria-live="polite">
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

            {prompts.length === 0 && (
              <section className="empty-state glass">
                <p className="mono-label">No matches</p>
                <h2>No prompt clears that filter yet.</h2>
                <p>Try a broader tool, category, tag, or creator search.</p>
                <button
                  className="generate-cta-box"
                  onClick={() => navigate('/generators', { state: { topic: searchTerm.trim() } })}
                >
                  <div className="generate-cta-icon">
                    <Sparkle size={20} weight="fill" />
                  </div>
                  <div className="generate-cta-copy">
                    <strong>Bu prompt henüz yazılmadı — sen yaptır.</strong>
                    <span>1.0 MON · Monad üzerinde, saniyeler içinde</span>
                  </div>
                  <Sparkle size={14} weight="fill" className="generate-cta-arrow" />
                </button>
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
