import { ArrowRight, Bank, FileText, ShieldCheck, Sparkle } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

const STEPS = [
  {
    icon: <FileText size={22} weight="fill" />,
    title: 'Submit a narrow prompt',
    body: 'Focus on one useful outcome, include the target model, and write a teaser that explains the result without leaking the payload.',
  },
  {
    icon: <ShieldCheck size={22} weight="fill" />,
    title: 'Pass marketplace review',
    body: 'Prompts are checked for clarity, policy fit, duplicated payloads, and whether the locked text matches the public promise.',
  },
  {
    icon: <Bank size={22} weight="fill" />,
    title: 'Earn on reveals',
    body: 'Each purchase records the buyer unlock in their library and contributes to your sales, success, and refund metrics.',
  },
]

export function Sell() {
  return (
    <main className="seller-page">
      <header className="page-heading">
        <p className="mono-label">Sell on FluidPrompt</p>
        <h1>Turn useful prompt craft into paid reveals.</h1>
        <p>FluidPrompt favors compact, testable prompts with clear outcomes over giant prompt packs.</p>
      </header>

      <section className="seller-value">
        <div className="seller-copy">
          <Sparkle size={26} weight="fill" aria-hidden />
          <h2>A marketplace for single-use value.</h2>
          <p>
            Buyers see the purpose, tool, tags, and trust metrics first. The exact prompt remains hidden until payment clears.
            That keeps the discovery experience honest while protecting creator payloads in the UI.
          </p>
          <Link className="primary-link" to="/how-it-works">
            Learn the reveal flow
            <ArrowRight size={17} weight="bold" aria-hidden />
          </Link>
        </div>

        <div className="seller-rules glass">
          <p className="rail-label">Submission guide</p>
          <ul>
            <li>One prompt, one concrete job.</li>
            <li>Include the model or tool it was tuned for.</li>
            <li>Show expected output shape in the teaser.</li>
            <li>Do not include private keys, hidden scraping, or impersonation workflows.</li>
            <li>Refund risk increases when the prompt overpromises or depends on unavailable context.</li>
          </ul>
        </div>
      </section>

      <section className="process-grid">
        {STEPS.map((step) => (
          <article className="process-card glass" key={step.title}>
            <span aria-hidden>{step.icon}</span>
            <h2>{step.title}</h2>
            <p>{step.body}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
