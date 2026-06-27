import type { RevealPhase } from '../types'

export function PayloadFrost({ phase, secretPrompt }: { phase: RevealPhase; secretPrompt?: string }) {
  const revealed = phase === 'revealed'

  return (
    <section className={`payload-frost ${phase === 'committing' ? 'is-committing' : ''} ${revealed ? 'is-revealed' : ''}`}>
      {secretPrompt ? (
        <>
          <pre className={`prompt-text ${revealed ? '' : 'is-preview'}`} aria-label={revealed ? 'Revealed prompt payload' : 'Locked prompt preview'}>
            <code>{secretPrompt}</code>
          </pre>
          {!revealed && <div className="payload-lock">Reveal full prompt</div>}
        </>
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
