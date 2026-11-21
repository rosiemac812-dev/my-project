# OrbitX — The Next-Generation Multi-Chain Crypto DEX & Staking Platform

A high-performance Full-Stack Web3 & Crypto Trading Platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Node.js built-in SQLite (`node:sqlite`)**.

Designed for decentralized finance, spot trading, liquid staking, and tokenomics with live order book execution, simulated wallet balances, instant swaps, and an executive administration hub.

---

## 🌟 Key Crypto Features

### 🖥️ Public Landing Page (`/`)
- **Live Crypto Ticker Banner**: Continuous ticker displaying live prices and 24h percentage changes for BTC, ETH, SOL, ORBX, and AVAX.
- **Hero & Instant Swap Widget**:
  - Live DEX swap calculator (e.g. Swap ETH for ORBX with 0% slippage and zero gas fees).
  - 24h volume metrics: **$4.82B+ 24h Volume**, **$1.49B TVL**, **1.2M+ Active Traders**, **1.2ms Fill SLA**.
  - Dual CTAs: *Launch OrbitX DEX* & *Claim Whitelist Airdrop*.
- **Interactive DEX Trading Terminal**:
  - Live Central Limit Order Book with real-time bids and asks.
  - Multi-pair switcher (ORBX/USDT, BTC/USDT, ETH/USDT, SOL/USDT).
  - Market and Limit order simulation with instant balance deductions.
- **Liquid Staking & Real Yield Calculator**:
  - Lock ORBX tokens for 30, 90, 180, or 365 days.
  - Real-time yield calculation up to **24.8% APY** with daily payout projections.
- **$ORBX Tokenomics Breakdown**:
  - Visual allocation chart (Community Rewards, Ecosystem, Public Airdrop, Core Team, Security Reserve).
  - On-chain token contract copy tool and quarterly buyback & burn mechanics.
- **Audited Security & Proof of Reserves**:
  - Non-custodial MPC custody, CertiK & OpenZeppelin smart contract audit badges, 1:1 asset backing.
- **Early Access / Whitelist Modal**:
  - Whitelist registration with name, email, and Web3 wallet address input (`0x...` or Solana).

---

### 🎮 DEX Trading App Dashboard (`/dashboard`)
- **DEX Spot Terminal**:
  - Candlestick & Area depth chart with 15m, 1h, 1D, 1W timeframe selectors.
  - Real-time Order Book and spread monitor.
  - Buy/Sell execution form with instant on-chain order simulation and portfolio balance updates.
- **Multi-Chain Wallet Portfolio**:
  - Total estimated net worth in USD with 24h PnL (+8.4%).
  - Token holdings list (BTC, ETH, SOL, ORBX, USDT) with allocations, values, and quick trade actions.
- **Liquid Staking Vaults**:
  - Active staking positions with accumulated token rewards.
  - One-click *Stake $ORBX* modal and *Claim Rewards* button.
- **Transaction History**:
  - Searchable audit stream of all swaps, spot orders, and staking activities with cryptographic transaction hashes (`0x...`).
- **Algorithmic & HFT API Keys**:
  - Generate programmatic trading bot keys (`np_live_...`) with permission scopes (Read/Trade, No Withdrawals).
- **DEX Settings**:
  - Custom slippage tolerance (0.1%, 0.5%, 1.0%), private mempool anti-frontrunning protection, and gas relayer toggles.

---

### 💼 Executive Admin Hub (`/admin`)
- Real-time metrics on whitelist signups, institutional inquiries, and changelog subscribers.
- Filterable lead table with wallet addresses, trading experience, and status pipeline.
- One-click **CSV Data Export** (`/api/admin/export`).
- One-click **Demo Data Seeder** (`/api/admin/seed`).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

* **Public DEX Landing Page**: [http://localhost:3000](http://localhost:3000)
* **DEX Trading App**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
* **Admin Lead Hub**: [http://localhost:3000/admin](http://localhost:3000/admin)

### 3. Build for Production
```bash
npm run build && npm start
```

---

## 📄 License
MIT License.
