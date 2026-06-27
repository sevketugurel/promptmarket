import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Layout } from './components/Layout'
import { useBuyPrompt } from './hooks/usePromptMarket'
import { totalSpentFor } from './lib/market'
import { CreatorProfile } from './pages/CreatorProfile'
import { Creators } from './pages/Creators'
import { Home } from './pages/Home'
import { HowItWorks } from './pages/HowItWorks'
import { Library } from './pages/Library'
import { Marketplace } from './pages/Marketplace'
import { NotFound } from './pages/NotFound'
import { PromptDetail } from './pages/PromptDetail'
import { Sell } from './pages/Sell'
import type { Prompt, RevealPhase } from './types'

const MOCK_UNLOCKED_PROMPT_IDS = [4, 1, 0]

export default function App() {
  const { isConnected } = useAccount()
  const { buy, isPending } = useBuyPrompt()

  const [searchTerm, setSearchTerm] = useState('')
  const [unlockedIds, setUnlockedIds] = useState<number[]>(MOCK_UNLOCKED_PROMPT_IDS)
  const [pendingId, setPendingId] = useState<number | null>(null)
  const [failedId, setFailedId] = useState<number | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string, timeout = 3800) => {
    setToast(message)
    window.setTimeout(() => setToast(null), timeout)
  }

  const getPhase = (prompt: Prompt): RevealPhase => {
    if (unlockedIds.includes(prompt.id)) return 'revealed'
    if (pendingId === prompt.id || (isPending && pendingId === prompt.id)) return 'committing'
    if (failedId === prompt.id) return 'failed'
    return 'idle'
  }

  const handleReveal = async (prompt: Prompt) => {
    if (unlockedIds.includes(prompt.id)) return

    if (!isConnected) {
      showToast('Connect a wallet to reveal this prompt.')
      return
    }

    setFailedId(null)
    setPendingId(prompt.id)

    try {
      await buy(prompt.id, prompt.price)
      setUnlockedIds((current) => Array.from(new Set([...current, prompt.id])))
      showToast(`${prompt.title} is now in your library.`, 3000)
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

  const sharedPromptProps = {
    connected: isConnected,
    copiedId,
    getPhase,
    onReveal: handleReveal,
    onCopy: handleCopy,
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              unlockedCount={unlockedIds.length}
              totalSpent={totalSpentFor(unlockedIds)}
              toast={toast}
            />
          }
        >
          <Route index element={<Home {...sharedPromptProps} />} />
          <Route path="marketplace" element={<Marketplace searchTerm={searchTerm} {...sharedPromptProps} />} />
          <Route path="prompt/:id" element={<PromptDetail {...sharedPromptProps} />} />
          <Route path="creators" element={<Creators />} />
          <Route path="creator/:handle" element={<CreatorProfile {...sharedPromptProps} />} />
          <Route path="library" element={<Library unlockedIds={unlockedIds} copiedId={copiedId} onCopy={handleCopy} />} />
          <Route path="sell" element={<Sell />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
