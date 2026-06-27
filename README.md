# FluidPrompt

> A prompt marketplace built on Monad. Buy the payload, not a subscription.

FluidPrompt lets users discover, purchase, and generate AI prompts on-chain. Every prompt stays locked behind a frost layer until the buyer pays in MON — then the payload reveals with a satisfying glass-dissolve animation. Can't find what you need? The **Generators** page builds a custom, production-ready prompt for you in seconds.

---

## Features

**Marketplace** — Browse a curated library of prompts filtered by model, category, success rate, and price. Sorted by featured rank, trending position, or user-defined criteria.

**On-chain Reveal** — Each purchase calls `buyPrompt` on a Monad smart contract. The prompt text stays hidden until the transaction confirms, then animates into view with an iridescent sheen effect.

**Prompt Generator** — Can't find the right prompt? Describe your topic, pay 1.0 MON, and watch a three-step generation flow (Researching → Optimizing → Generating) produce a structured, expert-level prompt template tailored to your input. Also accessible from the Marketplace empty state when a search yields no results.

**Library** — All purchased prompts in one place, copyable at any time.

**Sell** — List your own prompts on the marketplace.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Routing | React Router v7 |
| Blockchain | Wagmi v2 + Viem + RainbowKit |
| Data fetching | TanStack Query v5 |
| Styling | Tailwind CSS v4 + hand-crafted CSS variables |
| Icons | Phosphor Icons |
| Linting | oxlint |

**Network:** Monad — EVM-compatible, low-latency L1

---

## Smart Contract

```
Network:  Monad Testnet (Chain ID: 10143)
RPC:      https://testnet-rpc.monad.xyz
Explorer: https://testnet.monadexplorer.com
```

**ABI (minimal):**

```solidity
function buyPrompt(uint256 id) external payable;
function hasPurchased(address buyer, uint256 promptId) external view returns (bool);
event PromptUnlocked(uint256 indexed id, address buyer);
```

### Wallet Integration

The app uses **RainbowKit + Wagmi v2** for wallet connection. To wire up your own WalletConnect project ID:

1. Create a free project at [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Copy your Project ID
3. Open `src/config/wagmi.ts` and replace the placeholder:

```ts
export const wagmiConfig = getDefaultConfig({
  appName: 'PromptMarket',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // ← paste here
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http('https://testnet-rpc.monad.xyz'),
  },
})
```

Wagmi is pre-configured for **Monad Testnet** with the public RPC. All purchase transactions call `buyPrompt` with the prompt's ID and the MON price as `value`. The Generators page sends a flat **1.0 MON** transaction to the contract address for prompt generation.

**Adding Monad Testnet to MetaMask manually:**

| Field | Value |
|---|---|
| Network Name | Monad Testnet |
| RPC URL | `https://testnet-rpc.monad.xyz` |
| Chain ID | `10143` |
| Currency Symbol | `MON` |
| Block Explorer | `https://testnet.monadexplorer.com` |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type-check
npx tsc --noEmit

# Build for production
npm run build
```

Connect a Monad-compatible wallet (MetaMask, Rainbow, etc.) via the wallet button in the nav to interact with the marketplace.

---

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx            # Nav, search bar, toast, outlet
│   ├── MarketplaceFilters.tsx
│   ├── MoltenField.tsx       # Animated background
│   ├── PayloadFrost.tsx      # Locked / revealed prompt panel
│   ├── PromptCard.tsx
│   └── WalletControl.tsx
├── config/
│   ├── abi.ts                # Contract address + ABI
│   └── wagmi.ts              # Chain + connector config
├── data/
│   └── prompts.ts            # Seed data
├── hooks/
│   ├── useGeneratePrompt.ts  # Sends 1.0 MON for generation
│   ├── usePromptMarket.ts    # buyPrompt wrapper
│   └── useTimer.ts
├── lib/
│   └── market.ts             # Filter, sort, format helpers
├── pages/
│   ├── Home.tsx
│   ├── Marketplace.tsx
│   ├── Generators.tsx        # Prompt generator flow
│   ├── PromptDetail.tsx
│   ├── CreatorProfile.tsx
│   ├── Library.tsx
│   ├── Sell.tsx
│   ├── HowItWorks.tsx
│   └── NotFound.tsx
└── types/
    └── index.ts
```

---

## Design System

The UI uses a **liquid glass** aesthetic — deep obsidian backgrounds, amber-molten accents, and frosted glass cards with multi-layer `backdrop-filter` blurs. All design tokens are CSS custom properties under `:root`, shared across every component without a CSS-in-JS runtime.

Key tokens: `--obsidian`, `--molten`, `--amber-flare`, `--glass-bg`, `--grad-iridescent`.

---

## License

MIT
