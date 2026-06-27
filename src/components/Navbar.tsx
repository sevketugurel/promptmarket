import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Navbar() {
  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="text-sm font-semibold tracking-tight">
          ⚡{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #836EFD, #6EFD8A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            PromptMarket
          </span>
        </span>
        <ConnectButton />
      </div>
    </nav>
  )
}
