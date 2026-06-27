import { useMemo, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import {
  CaretDown,
  Check,
  CircleNotch,
  ClockCounterClockwise,
  Copy,
  MagnifyingGlass,
  SealCheck,
  Sparkle,
  Wallet,
} from '@phosphor-icons/react'
import { useBuyPrompt } from './hooks/usePromptMarket'
import { PROMPTS } from './data/prompts'
import type { Prompt, PromptCategory } from './types'

type SortMode = 'success' | 'newest' | 'cheapest'
type RevealPhase = 'idle' | 'committing' | 'revealed' | 'failed'

const CATEGORIES: PromptCategory[] = ['All', 'LLMs', 'Image Generation', 'Code']
const SORT_LABELS: Record<SortMode, string> = {
  success: 'Highest success',
  newest: 'Newest',
  cheapest: 'Cheapest',
}

function formatUses(uses: number) {
  if (uses >= 1000) return `${(uses / 1000).toFixed(uses >= 10000 ? 0 : 1)}k`
  return uses.toString()
}

function categoryCount(category: PromptCategory) {
  if (category === 'All') return PROMPTS.length
  return PROMPTS.filter((prompt) => prompt.category === category).length
}

function useFilteredPrompts(searchTerm: string, activeFilter: PromptCategory, sortMode: SortMode) {
  return useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return PROMPTS
      .filter((prompt) => activeFilter === 'All' || prompt.category === activeFilter)
      .filter((prompt) => {
        if (!normalizedSearch) return true
        return [
          prompt.title,
          prompt.description,
          prompt.category,
          prompt.tool,
          prompt.tag,
          prompt.author,
          prompt.authorHandle,
          ...prompt.tags,
        ].some((value) => value.toLowerCase().includes(normalizedSearch))
      })
      .sort((a, b) => {
        if (sortMode === 'cheapest') return a.price - b.price
        if (sortMode === 'newest') return b.id - a.id
        return b.successRate - a.successRate
      })
  }, [activeFilter, searchTerm, sortMode])
}

export default function App() {
  const { isConnected } = useAccount()
  const { buy, isPending } = useBuyPrompt()

  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<PromptCategory>('All')
  const [sortMode, setSortMode] = useState<SortMode>('success')
  const [unlockedIds, setUnlockedIds] = useState<number[]>([])
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [failedId, setFailedId] = useState<number | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const prompts = useFilteredPrompts(searchTerm, activeFilter, sortMode)
  const totalSpent = unlockedIds.reduce((sum, id) => {
    const prompt = PROMPTS.find((item) => item.id === id)
    return sum + (prompt?.price ?? 0)
  }, 0)

  const showToast = (message: string, timeout = 3800) => {
    setToast(message)
    window.setTimeout(() => setToast(null), timeout)
  }

  const handleReveal = async (prompt: Prompt) => {
    if (!isConnected) {
      showToast('Connect a wallet to reveal this prompt.')
      return
    }

    setFailedId(null)
    setPendingId(prompt.id)

    try {
      await buy(prompt.id, prompt.price)
      setUnlockedIds((current) => Array.from(new Set([...current, prompt.id])))
    } catch (error) {
      console.error('Reveal transaction failed:', error)
      setFailedId(prompt.id)
      showToast("Reveal didn't go through. No MON was spent. Try again.", 4600)
      window.setTimeout(() => setFailedId(null), 1800)
    } finally {
      setPendingId(null)
    }
  }

  const handleCopy = async (prompt: Prompt) => {
    if (!unlockedIds.includes(prompt.id)) return
    await navigator.clipboard.writeText(prompt.secretPrompt)
    setCopiedId(prompt.id)
    window.setTimeout(() => setCopiedId(null), 1800)
  }

  return (
    <div className="fluid-app">
      <MoltenField />

      <nav className="nav-glass">
        <div className="nav-inner">
          <a className="brand-mark" href="/" aria-label="FluidPrompt">
            <span className="brand-sigil">FP</span>
            <span>FluidPrompt</span>
          </a>

          <label className="search-shell">
            <MagnifyingGlass size={17} weight="bold" aria-hidden />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Find the prompt that fixes this."
              aria-label="Search prompts, tools, and creators"
            />
          </label>

          <WalletControl unlockedCount={unlockedIds.length} totalSpent={totalSpent} />
        </div>
      </nav>

      <header className="hero-band">
        <p className="mono-label">Monad micro-transactions</p>
        <h1>
          FluidPrompt
          <span>Five cents clears the glass.</span>
        </h1>
        <p>
          A creator marketplace where a single prompt is worth exactly five cents,
          and the act of paying is the act of revealing.
        </p>
      </header>

      <div className="market-layout">
        <aside className="filter-rail glass">
          <section>
            <p className="rail-label">Tools</p>
            <div className="filter-stack">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  className={activeFilter === category ? 'is-active' : ''}
                  onClick={() => setActiveFilter(category)}
                >
                  <span>{category}</span>
                  <span>{categoryCount(category)}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="rail-label">Sort</p>
            <div className="segmented-control">
              {(Object.keys(SORT_LABELS) as SortMode[]).map((mode) => (
                <button
                  key={mode}
                  className={sortMode === mode ? 'is-active' : ''}
                  onClick={() => setSortMode(mode)}
                >
                  {SORT_LABELS[mode]}
                </button>
              ))}
            </div>
          </section>
        </aside>

        <main className="prompt-masonry" aria-live="polite">
          {prompts.map((prompt) => {
            const phase: RevealPhase = unlockedIds.includes(prompt.id)
              ? 'revealed'
              : pendingId === prompt.id || (isPending && pendingId === prompt.id)
                ? 'committing'
                : failedId === prompt.id
                  ? 'failed'
                  : 'idle'

            return (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                phase={phase}
                copied={copiedId === prompt.id}
                connected={isConnected}
                onReveal={() => handleReveal(prompt)}
                onCopy={() => handleCopy(prompt)}
              />
            )
          })}

          {prompts.length === 0 && (
            <section className="empty-state glass">
              <p className="mono-label">No matches</p>
              <h2>No prompt clears that filter yet.</h2>
              <p>Try a broader tool, tag, or creator search.</p>
            </section>
          )}
        </main>
      </div>

      <div className={`toast glass ${toast ? 'is-visible' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  )
}

function WalletControl({ unlockedCount, totalSpent }: { unlockedCount: number; totalSpent: number }) {
  return (
    <ConnectButton.Custom>
      {({ account, chain, mounted, openAccountModal, openChainModal, openConnectModal }) => {
        const connected = mounted && account && chain

        if (!connected) {
          return (
            <button className="wallet-pill wallet-connect" onClick={openConnectModal}>
              <Wallet size={17} weight="bold" aria-hidden />
              Connect Wallet
            </button>
          )
        }

        if (chain.unsupported) {
          return (
            <button className="wallet-pill wallet-warning" onClick={openChainModal}>
              Wrong network
            </button>
          )
        }

        return (
          <button className="wallet-pill" onClick={openAccountModal}>
            <Wallet size={17} weight="bold" aria-hidden />
            <span>{account.displayBalance ?? '0 MON'}</span>
            <span className="wallet-divider" />
            <span>{account.displayName}</span>
            <CaretDown size={14} weight="bold" aria-hidden />
            <span className="wallet-stats">
              {unlockedCount} revealed · {totalSpent.toFixed(2)} MON
            </span>
          </button>
        )
      }}
    </ConnectButton.Custom>
  )
}

function PromptCard({
  prompt,
  phase,
  copied,
  connected,
  onReveal,
  onCopy,
}: {
  prompt: Prompt
  phase: RevealPhase
  copied: boolean
  connected: boolean
  onReveal: () => void
  onCopy: () => void
}) {
  const isRevealed = phase === 'revealed'
  const isCommitting = phase === 'committing'

  return (
    <article className={`prompt-card glass phase-${phase}`}>
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

      <div className="card-copy">
        <h2>{prompt.title}</h2>
        <p>{prompt.description}</p>
      </div>

      <PayloadFrost prompt={prompt} phase={phase} />

      <div className="tag-row">
        {prompt.tags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>

      <footer className="card-footer">
        <div>
          <span className="price-line">{prompt.price.toFixed(2)} MON</span>
          <span className="fiat-line">5c · settles on Monad</span>
        </div>

        {isRevealed ? (
          <button className="copy-button" onClick={onCopy}>
            {copied ? <Check size={16} weight="bold" aria-hidden /> : <Copy size={16} weight="bold" aria-hidden />}
            {copied ? 'Copied' : 'Copy prompt'}
          </button>
        ) : (
          <button className="reveal-button" onClick={onReveal} disabled={isCommitting}>
            {isCommitting ? (
              <CircleNotch className="spin" size={16} weight="bold" aria-hidden />
            ) : (
              <SealCheck size={16} weight="bold" aria-hidden />
            )}
            {isCommitting ? 'Settling' : connected ? 'Reveal ->' : 'Connect to reveal'}
          </button>
        )}
      </footer>
    </article>
  )
}

function PayloadFrost({ prompt, phase }: { prompt: Prompt; phase: RevealPhase }) {
  const revealed = phase === 'revealed'

  return (
    <section className={`payload-frost ${phase === 'committing' ? 'is-committing' : ''} ${revealed ? 'is-revealed' : ''}`}>
      {revealed ? (
        <pre className="prompt-text">
          <code>{prompt.secretPrompt}</code>
        </pre>
      ) : (
        <div className="payload-placeholder" aria-label="Locked prompt payload">
          <span />
          <span />
          <span />
          <span />
        </div>
      )}
    </section>
  )
}

function MoltenField() {
  return (
    <div className="molten-field" aria-hidden>
      <div className="heat-plane" />
      <div className="grid-plane" />
      <ClockCounterClockwise className="field-mark" size={420} weight="thin" />
    </div>
  )
}
