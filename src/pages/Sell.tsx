import {
  ArrowRight,
  CheckCircle,
  ClipboardText,
  CurrencyDollar,
  Database,
  FileText,
  RocketLaunch,
  ShieldCheck,
  Sparkle,
  WarningCircle,
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

const SELLER_STATS = [
  { label: 'Creator share', value: '70%', note: 'of every approved reveal' },
  { label: 'Review path', value: '4 steps', note: 'quality, safety, fit, final approval' },
  { label: 'Database gain', value: '1 prompt', note: 'added after approval' },
]

const REVIEW_STEPS = [
  {
    icon: <ClipboardText size={22} weight="fill" />,
    title: 'Submit',
    body: 'Add the public listing, exact locked prompt, target model, tags, price, and expected output.',
  },
  {
    icon: <ShieldCheck size={22} weight="fill" />,
    title: 'Screen',
    body: 'We check policy fit, duplicate payloads, private data risk, hidden scraping, and impersonation patterns.',
  },
  {
    icon: <CheckCircle size={22} weight="fill" />,
    title: 'Approve',
    body: 'A reviewer validates that the private prompt actually matches the public promise and produces useful results.',
  },
  {
    icon: <RocketLaunch size={22} weight="fill" />,
    title: 'Go live',
    body: 'The prompt enters the marketplace, strengthens the FluidPrompt database, and starts earning per reveal.',
  },
]

const QUALITY_RULES = [
  'One prompt should solve one concrete job.',
  'The teaser must explain value without leaking the locked payload.',
  'Prompts with private keys, account access, hidden scraping, or impersonation are rejected.',
  'Overpromising, vague outputs, and unavailable context increase review failure risk.',
]

export function Sell() {
  return (
    <main className="seller-page">
      <section className="seller-hero">
        <div className="seller-hero-copy">
          <p className="mono-label">Sell on FluidPrompt</p>
          <h1>Publish private prompts, earn on every reveal.</h1>
          <p>
            External creators can submit their best private prompts to FluidPrompt. Approved prompts enter the marketplace,
            grow our verified prompt database, and pay the author a share whenever a buyer reveals them.
          </p>

          <div className="seller-stat-grid" aria-label="Seller program summary">
            {SELLER_STATS.map((stat) => (
              <div className="seller-stat glass" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.note}</small>
              </div>
            ))}
          </div>
        </div>

        <form className="submission-panel glass">
          <div className="submission-heading">
            <Sparkle size={22} weight="fill" aria-hidden />
            <div>
              <p className="rail-label">Prompt submission</p>
              <h2>Send a prompt for review</h2>
            </div>
          </div>

          <label>
            Prompt title
            <input placeholder="System Prompt Hardener" />
          </label>

          <div className="submission-row">
            <label>
              Tool
              <select defaultValue="Claude">
                <option>Claude</option>
                <option>GPT</option>
                <option>Midjourney</option>
                <option>Sora</option>
              </select>
            </label>
            <label>
              Price
              <select defaultValue="0.10 MON">
                <option>0.03 MON</option>
                <option>0.05 MON</option>
                <option>0.10 MON</option>
                <option>0.15 MON</option>
              </select>
            </label>
          </div>

          <label>
            Public teaser
            <textarea placeholder="Explain what this prompt helps buyers produce without revealing the exact payload." rows={3} />
          </label>

          <label>
            Locked prompt
            <textarea placeholder="Paste the exact prompt buyers receive after reveal." rows={5} />
          </label>

          <button className="submit-preview-button" type="button">
            Submit for review
            <ArrowRight size={17} weight="bold" aria-hidden />
          </button>

          <p className="submission-footnote">
            <WarningCircle size={15} weight="fill" aria-hidden />
            Mock UI only. Final submissions should be wired to the approval backend.
          </p>
        </form>
      </section>

      <section className="seller-system glass">
        <div className="system-copy">
          <Database size={28} weight="fill" aria-hidden />
          <h2>Every approved prompt strengthens the marketplace.</h2>
          <p>
            When a submission passes review, it becomes a structured database entry with creator ownership, target tool,
            safety metadata, tags, performance history, and revenue attribution. The buyer gets a trusted prompt; the
            author earns; FluidPrompt’s prompt library gets smarter.
          </p>
        </div>

        <div className="revenue-card">
          <CurrencyDollar size={24} weight="fill" aria-hidden />
          <span>Revenue split</span>
          <strong>Creator earns on each sale</strong>
          <p>The author share is tracked per prompt, so future reveals continue crediting the original writer.</p>
        </div>
      </section>

      <section className="review-flow">
        <div className="section-heading">
          <div>
            <p className="mono-label">Approval pipeline</p>
            <h2>From draft to live marketplace asset.</h2>
          </div>
          <Link to="/how-it-works">Reveal flow</Link>
        </div>

        <div className="review-grid">
          {REVIEW_STEPS.map((step, index) => (
            <article className="review-step glass" key={step.title}>
              <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="step-icon" aria-hidden>
                {step.icon}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="quality-band">
        <div className="quality-copy">
          <FileText size={24} weight="fill" aria-hidden />
          <h2>What gets approved?</h2>
          <p>We prefer narrow, testable, original prompts that produce a clear result and are safe to sell repeatedly.</p>
        </div>

        <ul className="quality-list glass">
          {QUALITY_RULES.map((rule) => (
            <li key={rule}>
              <CheckCircle size={17} weight="fill" aria-hidden />
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
