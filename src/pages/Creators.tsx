import { ArrowRight, ShieldCheck } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { CREATORS } from '../data/prompts'
import { creatorPrompts, formatUses } from '../lib/market'

export function Creators() {
  return (
    <main className="directory-page">
      <header className="page-heading">
        <p className="mono-label">Creator directory</p>
        <h1>Find prompt sellers with a track record.</h1>
        <p>Every creator profile surfaces sales, success rate, refund rate, and their strongest prompt categories.</p>
      </header>

      <section className="creator-grid">
        {CREATORS.map((creator) => {
          const promptCount = creatorPrompts(creator.id).length
          return (
            <Link className="creator-tile glass" key={creator.id} to={`/creator/${creator.handle}`}>
              <span className="creator-avatar">{creator.avatar}</span>
              <div className="creator-tile-main">
                <h2>
                  {creator.displayName}
                  {creator.verified ? <ShieldCheck size={18} weight="fill" aria-label="Verified creator" /> : null}
                </h2>
                <p>@{creator.handle}</p>
                <p>{creator.bio}</p>
                <div className="tag-row">
                  {creator.specialties.map((specialty) => (
                    <span key={specialty}>#{specialty}</span>
                  ))}
                </div>
              </div>
              <div className="creator-tile-stats">
                <strong>{formatUses(creator.totalSales)}</strong>
                <span>sales</span>
                <strong>{creator.successRate}%</strong>
                <span>success</span>
                <strong>{promptCount}</strong>
                <span>prompts</span>
              </div>
              <ArrowRight size={18} weight="bold" aria-hidden />
            </Link>
          )
        })}
      </section>
    </main>
  )
}
