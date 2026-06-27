import { Copy, Eye, LockKey, Wallet } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

const FLOW = [
  {
    icon: <Wallet size={22} weight="fill" />,
    title: 'Connect wallet',
    body: 'RainbowKit handles wallet connection. Reveals require a connected account on the supported Monad network.',
  },
  {
    icon: <LockKey size={22} weight="fill" />,
    title: 'Locked by default',
    body: 'Cards render teaser text and frosted placeholders. The secret payload is not rendered into locked prompt cards.',
  },
  {
    icon: <Eye size={22} weight="fill" />,
    title: 'Reveal with MON',
    body: 'The purchase hook sends the prompt id and MON value to the marketplace contract, then unlocks the prompt in session state.',
  },
  {
    icon: <Copy size={22} weight="fill" />,
    title: 'Copy from library',
    body: 'Unlocked prompts are shared across marketplace, detail, profile, and library routes for the current browser session.',
  },
]

export function HowItWorks() {
  return (
    <main className="how-page">
      <header className="page-heading">
        <p className="mono-label">How it works</p>
        <h1>The reveal is the product mechanic.</h1>
        <p>
          PromptMarkt models each prompt purchase as a small MON transaction. This demo uses local session state after a
          successful wallet transaction; production payload security still requires a backend or encrypted delivery layer.
        </p>
      </header>

      <section className="process-grid">
        {FLOW.map((step) => (
          <article className="process-card glass" key={step.title}>
            <span aria-hidden>{step.icon}</span>
            <h2>{step.title}</h2>
            <p>{step.body}</p>
          </article>
        ))}
      </section>

      <section className="explain-band">
        <div>
          <p className="mono-label">Trust boundary</p>
          <h2>UI locking is not backend secrecy.</h2>
          <p>
            The app behaves correctly for discovery: locked list and detail views do not render the prompt payload. Because this
            is a static mock catalog, the source bundle still contains demo prompt strings. A real marketplace should serve
            payloads only after contract verification or decrypt them client-side with a purchase-scoped key.
          </p>
        </div>
        <Link className="primary-link" to="/marketplace">
          Browse prompts
        </Link>
      </section>
    </main>
  )
}
