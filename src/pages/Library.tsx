import { useMemo, useState } from 'react'
import { ArrowRight, Check, Copy, FileText, LockKey, MagnifyingGlass, Sparkle, Tag } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { PROMPTS } from '../data/prompts'
import { formatMon, getCreator } from '../lib/market'
import type { Prompt } from '../types'

const LIBRARY_FILTERS = ['All', 'LLMs', 'Image Generation', 'Code', 'Marketing', 'Research'] as const

export function Library({
  unlockedIds,
  copiedId,
  onCopy,
}: {
  unlockedIds: number[]
  copiedId: number | null
  onCopy: (prompt: Prompt) => void
}) {
  const [librarySearch, setLibrarySearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<(typeof LIBRARY_FILTERS)[number]>('All')
  const unlockedPrompts = useMemo(() => PROMPTS.filter((prompt) => unlockedIds.includes(prompt.id)), [unlockedIds])
  const filteredPrompts = useMemo(() => {
    const normalizedSearch = librarySearch.trim().toLowerCase()

    return unlockedPrompts.filter((prompt) => {
      const creator = getCreator(prompt.creatorId)
      const matchesFilter = activeFilter === 'All' || prompt.category === activeFilter
      const matchesSearch =
        !normalizedSearch ||
        [
          prompt.title,
          prompt.description,
          prompt.secretPrompt,
          prompt.tool,
          prompt.category,
          creator.displayName,
          creator.handle,
          ...prompt.tags,
        ].some((value) => value.toLowerCase().includes(normalizedSearch))

      return matchesFilter && matchesSearch
    })
  }, [activeFilter, librarySearch, unlockedPrompts])
  const totalSpent = unlockedPrompts.reduce((sum, prompt) => sum + prompt.price, 0)
  const topTool = unlockedPrompts.length
    ? Object.entries(
        unlockedPrompts.reduce<Record<string, number>>((counts, prompt) => {
          counts[prompt.tool] = (counts[prompt.tool] ?? 0) + 1
          return counts
        }, {})
      ).sort((a, b) => b[1] - a[1])[0][0]
    : 'None yet'

  return (
    <main className="library-page">
      <header className="library-hero">
        <div className="library-hero-copy">
          <p className="mono-label">My library</p>
          <h1>Your revealed prompts stay here.</h1>
          <p>{unlockedPrompts.length} revealed prompts · {formatMon(totalSpent)} total spend.</p>
        </div>

        <div className="library-summary-grid" aria-label="Library summary">
          <div className="library-stat glass">
            <FileText size={18} weight="bold" aria-hidden />
            <span>Owned</span>
            <strong>{unlockedPrompts.length}</strong>
          </div>
          <div className="library-stat glass">
            <Sparkle size={18} weight="fill" aria-hidden />
            <span>Top tool</span>
            <strong>{topTool}</strong>
          </div>
          <div className="library-stat glass">
            <Tag size={18} weight="bold" aria-hidden />
            <span>Spend</span>
            <strong>{formatMon(totalSpent)}</strong>
          </div>
        </div>
      </header>

      {unlockedPrompts.length === 0 ? (
        <section className="empty-library glass">
          <div className="empty-library-copy">
            <LockKey size={32} weight="fill" aria-hidden />
            <h2>No revealed prompts yet.</h2>
            <p>Reveal a marketplace prompt and it will appear here with copy access.</p>
            <Link className="primary-link" to="/marketplace">
              Browse marketplace
              <ArrowRight size={16} weight="bold" aria-hidden />
            </Link>
          </div>

          <div className="library-empty-preview" aria-hidden>
            {PROMPTS.slice(0, 3).map((prompt) => (
              <div className="library-preview-card" key={prompt.id}>
                <span>{prompt.tool}</span>
                <strong>{prompt.title}</strong>
                <i />
                <i />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="library-stack">
          <div className="library-toolbar glass">
            <label className="library-search">
              <MagnifyingGlass size={17} weight="bold" aria-hidden />
              <input
                value={librarySearch}
                onChange={(event) => setLibrarySearch(event.target.value)}
                placeholder="Search your revealed prompts"
                aria-label="Search your revealed prompts"
              />
            </label>

            <div className="library-filter-pills" aria-label="Filter library prompts">
              {LIBRARY_FILTERS.map((filter) => (
                <button
                  key={filter}
                  className={activeFilter === filter ? 'is-active' : ''}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {filteredPrompts.length === 0 ? (
            <section className="library-no-results glass">
              <h2>No prompts match that view.</h2>
              <p>Clear the search or switch categories to see the rest of your library.</p>
            </section>
          ) : (
            <section className="library-grid">
              {filteredPrompts.map((prompt) => {
                const creator = getCreator(prompt.creatorId)
                return (
                  <article className="library-card glass" key={prompt.id}>
                    <div className="library-card-top">
                      <span className="tool-badge">
                        <Sparkle size={14} weight="fill" aria-hidden />
                        {prompt.tool}
                      </span>
                      <span className="success-metric">
                        <span aria-hidden />
                        {prompt.successRate}% success
                      </span>
                    </div>

                    <div className="library-card-title">
                      <p className="mono-label">@{creator.handle}</p>
                      <h2>{prompt.title}</h2>
                      <p>{prompt.description}</p>
                    </div>

                    <pre className="library-prompt">
                      <code>{prompt.secretPrompt}</code>
                    </pre>

                    <div className="tag-row">
                      {prompt.tags.map((tag) => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </div>

                    <footer className="library-actions">
                      <Link to={`/prompt/${prompt.slug}`}>
                        Open detail
                        <ArrowRight size={14} weight="bold" aria-hidden />
                      </Link>
                      <button className="copy-button" onClick={() => onCopy(prompt)}>
                        {copiedId === prompt.id ? <Check size={16} weight="bold" aria-hidden /> : <Copy size={16} weight="bold" aria-hidden />}
                        {copiedId === prompt.id ? 'Copied' : 'Copy prompt'}
                      </button>
                    </footer>
                  </article>
                )
              })}
            </section>
          )}
        </section>
      )}
    </main>
  )
}
