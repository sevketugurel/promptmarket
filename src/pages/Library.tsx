import { Check, Copy, LockKey } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { PROMPTS } from '../data/prompts'
import { formatMon, getCreator } from '../lib/market'
import type { Prompt } from '../types'

export function Library({
  unlockedIds,
  copiedId,
  onCopy,
}: {
  unlockedIds: number[]
  copiedId: number | null
  onCopy: (prompt: Prompt) => void
}) {
  const unlockedPrompts = PROMPTS.filter((prompt) => unlockedIds.includes(prompt.id))
  const totalSpent = unlockedPrompts.reduce((sum, prompt) => sum + prompt.price, 0)

  return (
    <main className="library-page">
      <header className="page-heading">
        <p className="mono-label">My library</p>
        <h1>Your revealed prompts stay here.</h1>
        <p>{unlockedPrompts.length} revealed prompts · {formatMon(totalSpent)} total spend.</p>
      </header>

      {unlockedPrompts.length === 0 ? (
        <section className="empty-library glass">
          <LockKey size={32} weight="fill" aria-hidden />
          <h2>No revealed prompts yet.</h2>
          <p>Reveal a marketplace prompt and it will appear here with copy access.</p>
          <Link className="primary-link" to="/marketplace">
            Browse marketplace
          </Link>
        </section>
      ) : (
        <section className="library-list">
          {unlockedPrompts.map((prompt) => {
            const creator = getCreator(prompt.creatorId)
            return (
              <article className="library-item glass" key={prompt.id}>
                <div>
                  <p className="mono-label">{prompt.tool} · @{creator.handle}</p>
                  <h2>{prompt.title}</h2>
                  <p>{prompt.description}</p>
                </div>
                <pre className="library-prompt">
                  <code>{prompt.secretPrompt}</code>
                </pre>
                <footer>
                  <Link to={`/prompt/${prompt.slug}`}>Open detail</Link>
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
    </main>
  )
}
