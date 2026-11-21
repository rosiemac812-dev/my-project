export interface SiteConfig {
  name: string;
  symbol: string;
  tagline: string;
  description: string;
  url: string;
  announcement: {
    badge: string;
    text: string;
    linkText: string;
  };
  marketStats: { label: string; value: string; change: string }[];
  cryptoPrices: {
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    volume24h: string;
    high24h: number;
    low24h: number;
    sparkline: number[];
  }[];
  features: {
    title: string;
    description: string;
    icon: string;
    tag?: string;
    highlight?: boolean;
  }[];
  stakingTiers: {
    durationDays: number;
    apyPercent: number;
    multiplier: string;
    recommended?: boolean;
  }[];
  tokenomics: {
    category: string;
    percentage: number;
    amount: string;
    color: string;
  }[];
  testimonials: {
    name: string;
    role: string;
    company: string;
    avatar: string;
    rating: number;
    quote: string;
    stat: string;
  }[];
  faqs: {
    category: string;
    question: string;
    answer: string;
  }[];
}

export const siteConfig: SiteConfig = {
  name: "OrbitX",
  symbol: "ORBX",
  tagline: "The Next-Generation Multi-Chain Crypto Exchange & Liquidity Hub",
  description:
    "Trade, swap, and stake digital assets with institutional-grade latency, zero-gas layer-2 execution, and non-custodial MPC wallet security. The premier platform for modern Web3 finance.",
  url: "https://orbitx.io",
  announcement: {
    badge: "OrbitX DEX 2.0 Live",
    text: "Sub-millisecond orderbook & zero-gas cross-chain bridge now active",
    linkText: "Trade Now →",
  },
  marketStats: [
    { label: "24h Trading Volume", value: "$4.82B+", change: "+14.8%" },
    { label: "Total Value Locked (TVL)", value: "$1.49B", change: "+8.2%" },
    { label: "Active Web3 Traders", value: "1,240,000+", change: "+32.4%" },
    { label: "Average Execution Speed", value: "1.2ms", change: "Institutional SLA" },
  ],
  cryptoPrices: [
    {
      symbol: "ORBX",
      name: "OrbitX Token",
      price: 14.85,
      change24h: 18.42,
      volume24h: "$142.8M",
      high24h: 15.2,
      low24h: 12.4,
      sparkline: [12.4, 12.9, 13.5, 13.2, 14.1, 14.6, 14.85],
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 96420.0,
      change24h: 4.18,
      volume24h: "$42.1B",
      high24h: 97100.0,
      low24h: 93800.0,
      sparkline: [93.8, 94.2, 95.1, 94.8, 95.9, 96.2, 96.42],
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: 3420.5,
      change24h: 5.62,
      volume24h: "$21.8B",
      high24h: 3480.0,
      low24h: 3240.0,
      sparkline: [3.24, 3.28, 3.32, 3.36, 3.39, 3.41, 3.42],
    },
    {
      symbol: "SOL",
      name: "Solana",
      price: 214.8,
      change24h: 8.94,
      volume24h: "$8.4B",
      high24h: 219.0,
      low24h: 198.5,
      sparkline: [198.5, 202.1, 205.4, 208.9, 211.2, 213.5, 214.8],
    },
    {
      symbol: "AVAX",
      name: "Avalanche",
      price: 38.45,
      change24h: 3.21,
      volume24h: "$1.2B",
      high24h: 39.1,
      low24h: 36.8,
      sparkline: [36.8, 37.1, 37.5, 37.9, 38.1, 38.3, 38.45],
    },
  ],
  features: [
    {
      title: "Ultra-Fast Central Limit Order Book",
      description:
        "Off-chain matching with on-chain cryptographic settlement. Experience sub-millisecond fills without frontrunning or toxic MEV extraction.",
      icon: "Zap",
      tag: "Deep Liquidity",
      highlight: true,
    },
    {
      title: "Non-Custodial MPC Security",
      description:
        "Multi-Party Computation (MPC) architecture ensures you maintain 100% control of your private keys. Backed by institutional hardware isolation.",
      icon: "ShieldCheck",
      tag: "Security First",
    },
    {
      title: "Zero-Gas Cross-Chain Bridge",
      description:
        "Seamlessly swap native assets across Ethereum, Solana, Arbitrum, Base, and BNB Chain in a single transaction with automated liquidity routing.",
      icon: "RefreshCw",
      tag: "Cross-Chain",
      highlight: true,
    },
    {
      title: "Smart Yield Staking Vaults",
      description:
        "Earn up to 24.8% APY by locking ORBX tokens or providing liquidity to automated market maker pools with automated compounding.",
      icon: "TrendingUp",
      tag: "DeFi Yield",
    },
    {
      title: "Institutional API & WebSocket Feeds",
      description:
        "Ultra-low latency REST, WebSocket, and FIX protocol APIs for quantitative hedge funds and algorithmic market makers.",
      icon: "Code2",
      tag: "HFT Trading",
    },
    {
      title: "Cryptographic Proof of Reserves",
      description:
        "Real-time Merkle-tree verification guaranteeing all platform user assets are 1:1 backed on-chain with continuous public auditability.",
      icon: "Database",
      tag: "Transparency",
    },
  ],
  stakingTiers: [
    { durationDays: 30, apyPercent: 8.5, multiplier: "1.0x" },
    { durationDays: 90, apyPercent: 14.2, multiplier: "1.5x" },
    { durationDays: 180, apyPercent: 19.4, multiplier: "2.0x" },
    { durationDays: 365, apyPercent: 24.8, multiplier: "3.0x", recommended: true },
  ],
  tokenomics: [
    { category: "Community Staking & Liquidity Rewards", percentage: 40, amount: "400,000,000 ORBX", color: "#10b981" },
    { category: "Ecosystem Development & Grants", percentage: 25, amount: "250,000,000 ORBX", color: "#3b82f6" },
    { category: "Public & Early Community Airdrop", percentage: 15, amount: "150,000,000 ORBX", color: "#8b5cf6" },
    { category: "Core Contributors (4-Year Vesting)", percentage: 12, amount: "120,000,000 ORBX", color: "#f59e0b" },
    { category: "Strategic Security & Insurance Reserve", percentage: 8, amount: "80,000,000 ORBX", color: "#ef4444" },
  ],
  testimonials: [
    {
      name: "Alexey Volkov",
      role: "Managing Partner",
      company: "Kronos Quantitative Capital",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      stat: "$180M Monthly Volume",
      quote:
        "OrbitX order book execution matches the speed of centralized exchanges while keeping our funds non-custodial. Zero slippage routing has saved our desk over $420k in slippage.",
    },
    {
      name: "Sophia Delgado",
      role: "Lead DeFi Strategist",
      company: "Aetheria Fund",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      stat: "+22.4% Annualized Yield",
      quote:
        "The automated staking vaults and multi-chain bridging make OrbitX our primary execution hub. The UI is slick, responsive, and built for serious traders.",
    },
    {
      name: "Kenji Sato",
      role: "Core Contributor",
      company: "Solana Ecosystem Guild",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      stat: "1.2ms Fill Latency",
      quote:
        "The cross-chain bridge between Solana and Arbitrum is blazingly fast. No wrapped tokens, no bridge hacks, just raw native swaps.",
    },
  ],
  faqs: [
    {
      category: "Trading",
      question: "What makes OrbitX different from Uniswap or Binance?",
      answer:
        "OrbitX combines the deep liquidity and advanced limit order book of centralized exchanges with the self-custody and trustless nature of decentralized protocols. You trade with sub-millisecond fills without ever giving up ownership of your private keys.",
    },
    {
      category: "Security",
      question: "Are user funds safe and non-custodial?",
      answer:
        "Yes, 100%. OrbitX never holds your private keys. Every order is cryptographically signed by your connected wallet (MetaMask, Phantom, Ledger, etc.) and settled transparently on-chain. All smart contracts have been thoroughly audited by CertiK and OpenZeppelin.",
    },
    {
      category: "Fees",
      question: "What are the trading fees on OrbitX?",
      answer:
        "Makers pay 0.00% fees! Taker fees start at a low 0.04% and can be reduced by up to 50% by holding or staking ORBX tokens. Layer 2 execution means gas fees are virtually zero (less than $0.001 per trade).",
    },
    {
      category: "Tokens & Staking",
      question: "How do staking rewards and APY work?",
      answer:
        "Stakers earn real yield generated from platform trading fees, distributed in USDC and ORBX. Locking your tokens for longer durations (up to 365 days) provides reward multipliers of up to 3.0x, reaching up to 24.8% APY.",
    },
    {
      category: "Wallets",
      question: "Which crypto wallets are supported?",
      answer:
        "OrbitX supports MetaMask, Phantom, Coinbase Wallet, WalletConnect v2, Rainbow, Rabby, and hardware wallets including Ledger and Trezor.",
    },
  ],
};
