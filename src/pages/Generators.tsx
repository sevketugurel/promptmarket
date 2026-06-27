import { useEffect, useRef, useState } from 'react'
import { ArrowCounterClockwise, Check, CircleNotch, Copy, Cpu, MagnifyingGlass, Sparkle } from '@phosphor-icons/react'
import { useLocation } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { useGeneratePrompt } from '../hooks/useGeneratePrompt'

type GenPhase = 'idle' | 'paying' | 'generating' | 'done'

const STEPS = [
  {
    Icon: MagnifyingGlass,
    label: 'Researching',
    detail: (topic: string) => `"${topic}" konusundaki kaynaklar, best practice'ler ve güncel yaklaşımlar taranıyor…`,
  },
  {
    Icon: Cpu,
    label: 'Optimizing',
    detail: (topic: string) => `En yüksek etkili ${topic} stratejisi için parametreler ve kısıtlar optimize ediliyor…`,
  },
  {
    Icon: Sparkle,
    label: 'Generating',
    detail: () => 'Production-ready, özelleştirilmiş prompt oluşturuluyor…',
  },
]

function buildPrompt(topic: string): string {
  const t = topic.trim()
  return `You are a world-class ${t} specialist with 15+ years of hands-on experience across high-stakes, real-world environments. Your expertise spans both foundational principles and cutting-edge methodologies specific to ${t}.

## Role & Context
Act as a senior ${t} consultant engaged to deliver a comprehensive, immediately actionable strategy. Assume the recipient has intermediate domain knowledge but requires expert-level depth, precision, and prioritization.

## Primary Objective
Analyze the ${t} landscape and produce a structured, evidence-based response that moves beyond surface-level advice into precise, executable recommendations with measurable outcomes.

## Instructions
1. Open with a concise situational diagnosis of ${t} — current state, key dynamics, critical variables, and emerging shifts
2. Identify the three highest-leverage opportunities within ${t}, ranked by impact-to-effort ratio
3. For each opportunity, deliver:
   — A concrete, step-by-step implementation path
   — Success metrics and measurable milestones
   — Required resources, tools, and dependencies
4. Surface the two most common failure modes specific to ${t} and provide targeted mitigation strategies
5. Conclude with a prioritized 30 / 60 / 90 day action plan calibrated to ${t}

## Constraints
- Ground every recommendation in first-principles reasoning, not surface-level heuristics
- Reference relevant frameworks, mental models, or domain-specific research where applicable
- Match the vocabulary, conventions, and norms of the ${t} domain throughout
- Every sentence must carry actionable signal — eliminate filler and generic statements
- If trade-offs exist between approaches, make them explicit and provide decision criteria

## Output Format
Structure the response strictly as follows:

**Situation Analysis**
**Opportunities × 3** (each with Implementation Path, Metrics, Dependencies)
**Risk Mitigation** (top 2 failure modes + mitigations)
**30 / 60 / 90 Day Action Plan**

Begin immediately. No preamble, no disclaimers.`
}

export function Generators() {
  const { state } = useLocation()
  const { isConnected } = useAccount()
  const { pay } = useGeneratePrompt()
  const [topic, setTopic] = useState<string>((state as { topic?: string } | null)?.topic ?? '')
  const [phase, setPhase] = useState<GenPhase>('idle')
  const [stepIndex, setStepIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)
  const outputRef = useRef<string>('')

  const handleGenerate = async () => {
    if (!topic.trim()) return
    if (!isConnected) return

    setPayError(null)
    outputRef.current = buildPrompt(topic.trim())
    setPhase('paying')

    try {
      await pay()
      setStepIndex(0)
      setPhase('generating')
    } catch {
      setPhase('idle')
      setPayError('İşlem reddedildi veya başarısız oldu. Tekrar dene.')
    }
  }

  useEffect(() => {
    if (phase !== 'generating') return

    if (stepIndex < STEPS.length - 1) {
      const id = window.setTimeout(() => setStepIndex((i) => i + 1), 1600)
      return () => window.clearTimeout(id)
    } else {
      const id = window.setTimeout(() => setPhase('done'), 1600)
      return () => window.clearTimeout(id)
    }
  }, [phase, stepIndex])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputRef.current)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const handleReset = () => {
    setPhase('idle')
    setTopic('')
    setStepIndex(0)
    setPayError(null)
    outputRef.current = ''
  }

  return (
    <main className="generator-page">
      <header className="page-heading">
        <p className="mono-label">Prompt Generator</p>
        <h1>
          İstediğin promptu bulamadın mı?
          <span>Üret.</span>
        </h1>
        <p>
          Aradığın konuyu yaz, 1.0 MON öde — saniyeler içinde araştırılmış, optimize edilmiş, production-ready bir
          prompt al.
        </p>
      </header>

      {phase === 'idle' && (
        <section className="generator-form glass">
          <label className="generator-label" htmlFor="gen-topic">
            Hangi konuda prompt üretmek istiyorsun?
          </label>
          <textarea
            id="gen-topic"
            className="generator-topic"
            placeholder="örn. e-commerce conversion optimization, Python async debugging, sosyal medya içerik stratejisi…"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={4}
          />
          {payError && <p className="generator-error">{payError}</p>}
          <div className="generator-footer">
            <div className="generator-price">
              <span className="price-badge">1.0 MON</span>
              <span className="price-sub">Monad üzerinde sabit ücret</span>
            </div>
            <button
              className="reveal-button generator-cta"
              disabled={!topic.trim() || !isConnected}
              onClick={handleGenerate}
            >
              <Sparkle size={16} weight="fill" />
              Generate
            </button>
          </div>
          {!isConnected && (
            <p className="generator-wallet-warn">Cüzdan bağlı değil — generate etmek için önce bağlan.</p>
          )}
        </section>
      )}

      {phase === 'paying' && (
        <section className="generator-flow glass">
          <div className="generator-paying">
            <div className="generator-paying-icon">
              <CircleNotch size={28} className="spin" />
            </div>
            <p>Cüzdan onayı bekleniyor…</p>
            <small>1.0 MON gönderilecek · Monad ağı</small>
          </div>
        </section>
      )}

      {phase === 'generating' && (
        <section className="generator-flow glass">
          <p className="generator-topic-pill">
            <span>"{topic}"</span>
          </p>
          <div className="generator-steps">
            {STEPS.map(({ Icon, label, detail }, i) => {
              const isActive = i === stepIndex
              const isDone = i < stepIndex
              return (
                <div key={i} className={`generator-step ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}>
                  <div className="gen-step-icon">
                    <Icon size={18} weight={isActive ? 'fill' : 'regular'} />
                  </div>
                  <div className="gen-step-body">
                    <strong>{label}</strong>
                    {isActive && <p>{detail(topic)}</p>}
                  </div>
                  <div className="gen-step-indicator">
                    {isDone && <Check size={13} weight="bold" />}
                    {isActive && <CircleNotch size={13} className="spin" />}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {phase === 'done' && (
        <section className="generator-output glass">
          <div className="generator-output-header">
            <div>
              <p className="mono-label">Generated Prompt</p>
              <h2 className="generator-output-title">"{topic}"</h2>
            </div>
            <div className="generator-output-actions">
              <button className="copy-button" onClick={handleCopy}>
                {copied ? <Check size={15} weight="bold" /> : <Copy size={15} weight="bold" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button className="secondary-link generator-reset-btn" onClick={handleReset}>
                <ArrowCounterClockwise size={15} weight="bold" />
                Yeni Generate
              </button>
            </div>
          </div>
          <div className="generator-prompt-shell">
            <pre className="generator-prompt-text">{outputRef.current}</pre>
          </div>
        </section>
      )}
    </main>
  )
}
