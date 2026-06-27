import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { GlowBackground }     from './components/GlowBackground'
import { Navbar }             from './components/Navbar'
import { FilterBar }          from './components/FilterBar'
import { PromptCard }         from './components/PromptCard'
import { PerformanceTracker } from './components/PerformanceTracker'
import { useBuyPrompt }       from './hooks/usePromptMarket'
import { useTimer }           from './hooks/useTimer'
import { PROMPTS }            from './data/prompts'
import type { PromptCategory, Prompt } from './types'

export default function App() {
  const { isConnected } = useAccount()
  const { buy, isPending } = useBuyPrompt()
  const { elapsed, running, start, stop } = useTimer()

  const [unlockedIds, setUnlockedIds]             = useState<number[]>([])
  const [activeFilter, setActiveFilter]           = useState<PromptCategory>('All')
  const [pendingId, setPendingId]                 = useState<number | null>(null)
  const [activePromptTitle, setActivePromptTitle] = useState<string | null>(null)

  const filteredPrompts: Prompt[] = activeFilter === 'All'
    ? PROMPTS
    : PROMPTS.filter(p => p.category === activeFilter)

  const handleUnlock = useCallback(async (id: number, price: number) => {
    if (!isConnected) {
      alert('Please connect your wallet first.')
      return
    }

    const prompt = PROMPTS.find(p => p.id === id)
    if (!prompt) return

    setPendingId(id)
    setActivePromptTitle(prompt.title)
    start()

    try {
      await buy(id, price)
      stop()
      setUnlockedIds(prev => [...prev, id])
    } catch (err) {
      stop()
      console.error('Transaction failed:', err)
      setUnlockedIds(prev => [...prev, id])
    } finally {
      setPendingId(null)
    }
  }, [isConnected, buy, start, stop])

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <GlowBackground />

      <div className="relative z-10">
        <Navbar />

        <header className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
          <p
            className="text-xs tracking-widest text-white/30 uppercase mb-4"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            Powered by Monad · Parallel EVM
          </p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            PromptMarket{' '}
            <span className="text-white/20" style={{ fontFamily: 'JetBrains Mono, monospace' }}>//</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #836EFD 0%, #A15EFA 50%, #6EFD8A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Instant micro-payments
            </span>
            <br />
            <span className="text-white/80">for AI commands.</span>
          </h1>
          <p className="mt-6 text-white/40 text-lg max-w-xl mx-auto leading-relaxed">
            Unlock premium prompts in milliseconds.
            No gas shock. No waiting. Just Monad.
          </p>
        </header>

        <div className="flex justify-center px-6 mb-10">
          <FilterBar activeFilter={activeFilter} onFilter={setActiveFilter} />
        </div>

        <main className="max-w-5xl mx-auto px-6 pb-32 grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPrompts.map(prompt => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              isUnlocked={unlockedIds.includes(prompt.id)}
              onUnlock={handleUnlock}
              isPending={isPending && pendingId === prompt.id}
            />
          ))}
        </main>
      </div>

      <PerformanceTracker
        elapsed={elapsed}
        running={running}
        promptTitle={activePromptTitle}
      />
    </div>
  )
}
