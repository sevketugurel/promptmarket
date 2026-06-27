import { CaretDown, Wallet } from '@phosphor-icons/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function WalletControl({ unlockedCount, totalSpent }: { unlockedCount: number; totalSpent: number }) {
  return (
    <ConnectButton.Custom>
      {({ account, chain, mounted, openAccountModal, openChainModal, openConnectModal }) => {
        const connected = mounted && account && chain

        if (!connected) {
          return (
            <button className="wallet-pill wallet-connect" onClick={openConnectModal}>
              <Wallet size={17} weight="bold" aria-hidden />
              Connect
            </button>
          )
        }

        if (chain.unsupported) {
          return (
            <button className="wallet-pill wallet-warning" onClick={openChainModal}>
              Wrong network
            </button>
          )
        }

        return (
          <button className="wallet-pill" onClick={openAccountModal}>
            <Wallet size={17} weight="bold" aria-hidden />
            <span>{account.displayBalance ?? '0 MON'}</span>
            <span className="wallet-divider" />
            <span>{account.displayName}</span>
            <CaretDown size={14} weight="bold" aria-hidden />
            <span className="wallet-stats">
              {unlockedCount} revealed · {totalSpent.toFixed(2)} MON
            </span>
          </button>
        )
      }}
    </ConnectButton.Custom>
  )
}
