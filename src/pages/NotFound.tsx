import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <main className="not-found-page">
      <section className="empty-library glass">
        <p className="mono-label">404</p>
        <h1>That route is not listed.</h1>
        <p>Return to the marketplace or browse creators.</p>
        <div className="hero-actions">
          <Link className="primary-link" to="/marketplace">
            Marketplace
          </Link>
          <Link className="secondary-link" to="/creators">
            Creators
          </Link>
        </div>
      </section>
    </main>
  )
}
