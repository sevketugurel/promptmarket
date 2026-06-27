import { List, MagnifyingGlass, X } from '@phosphor-icons/react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { MoltenField } from './MoltenField'
import { WalletControl } from './WalletControl'

const NAV_ITEMS = [
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/creators', label: 'Creators' },
  { to: '/sell', label: 'Sell' },
  { to: '/library', label: 'Library' },
]

export function Layout({
  searchTerm,
  onSearchTermChange,
  unlockedCount,
  totalSpent,
  toast,
}: {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  unlockedCount: number
  totalSpent: number
  toast: string | null
}) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    navigate('/marketplace')
    setMenuOpen(false)
  }

  return (
    <div className="fluid-app">
      <MoltenField />

      <nav className="nav-glass">
        <div className="nav-inner">
          <NavLink className="brand-mark" to="/" aria-label="FluidPrompt">
            <span className="brand-sigil">FP</span>
            <span>FluidPrompt</span>
          </NavLink>

          <button className="mobile-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">
            {menuOpen ? <X size={20} weight="bold" aria-hidden /> : <List size={20} weight="bold" aria-hidden />}
          </button>

          <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/how-it-works" onClick={() => setMenuOpen(false)}>
              How it works
            </NavLink>
          </div>

          <form className="search-shell" onSubmit={submitSearch}>
            <MagnifyingGlass size={17} weight="bold" aria-hidden />
            <input
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder="Search prompts, tools, creators"
              aria-label="Search prompts, tools, and creators"
            />
          </form>

          <WalletControl unlockedCount={unlockedCount} totalSpent={totalSpent} />
        </div>
      </nav>

      <Outlet />

      <div className={`toast glass ${toast ? 'is-visible' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  )
}
