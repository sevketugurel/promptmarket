import type { RevealPhase } from '../types'

export function PayloadFrost({ phase, secretPrompt }: { phase: RevealPhase; secretPrompt?: string }) {
  const revealed = phase === 'revealed'

  return (
    <section className={`payload-frost ${phase === 'committing' ? 'is-committing' : ''} ${revealed ? 'is-revealed' : ''}`}>
      {revealed && secretPrompt ? (
        <pre className="prompt-text">
          <code>{secretPrompt}</code>
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
