"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  BarChart2,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Zap,
  Lock,
  Coins,
  RefreshCw,
  Plus,
  ArrowLeft,
  Key,
  Settings,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Loader2,
  ShieldCheck,
  ArrowDownUp,
  History,
  Activity,
  Trash2,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { formatDate } from "@/lib/utils";

interface PortfolioAsset {
  symbol: string;
  name: string;
  balance: number;
  current_price: number;
  value_usd: number;
  change24h: number;
  allocation_percent: number;
}

interface PortfolioData {
  totalValueUsd: number;
  dayChangeUsd: number;
  dayChangePercent: number;
  assets: PortfolioAsset[];
}

interface CryptoTransaction {
  id: number;
  tx_hash: string;
  type: string;
  from_asset: string;
  to_asset: string;
  amount: number;
  value_usd: number;
  status: string;
  created_at: string;
}

interface CryptoStake {
  id: number;
  symbol: string;
  amount: number;
  duration_days: number;
  apy: number;
  rewards_earned: number;
  status: string;
  created_at: string;
}

interface ApiKeyItem {
  id: number;
  name: string;
  prefix: string;
  status: string;
  created_at: string;
}

export default function CryptoDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "terminal" | "portfolio" | "staking" | "history" | "keys" | "settings"
  >("terminal");

  // Market & Trading state
  const [selectedPair, setSelectedPair] = useState("ORBX/USDT");
  const [tradeSide, setTradeSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [tradeAmount, setTradeAmount] = useState("100");
  const [limitPrice, setLimitPrice] = useState("14.85");
  const [timeframe, setTimeframe] = useState<"15m" | "1h" | "1D" | "1W">("1h");

  // Data collections
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [transactions, setTransactions] = useState<CryptoTransaction[]>([]);
  const [stakes, setStakes] = useState<CryptoStake[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTrading, setIsTrading] = useState(false);

  // Staking Modal
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [stakeAmountInput, setStakeAmountInput] = useState("1000");
  const [stakeDuration, setStakeDuration] = useState(365);
  const [isStaking, setIsStaking] = useState(false);

  // API Key creation
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [portRes, txRes, stakesRes, keysRes] = await Promise.all([
        fetch("/api/crypto/portfolio"),
        fetch("/api/crypto/transactions"),
        fetch("/api/crypto/stake"),
        fetch("/api/app/apikeys"),
      ]);

      const portData = await portRes.json();
      const txData = await txRes.json();
      const stakesData = await stakesRes.json();
      const keysData = await keysRes.json();

      if (portData.assets) setPortfolio(portData);
      if (txData.transactions) setTransactions(txData.transactions);
      if (stakesData.stakes) setStakes(stakesData.stakes);
      if (keysData.keys) setApiKeys(keysData.keys);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentPrice =
    selectedPair === "ORBX/USDT"
      ? 14.85
      : selectedPair === "BTC/USDT"
      ? 96420.0
      : selectedPair === "ETH/USDT"
      ? 3420.5
      : 214.8;

  const handleExecuteTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTrading(true);

    try {
      const res = await fetch("/api/crypto/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pair: selectedPair,
          side: tradeSide,
          order_type: orderType,
          price: orderType === "limit" ? Number(limitPrice) : currentPrice,
          amount: Number(tradeAmount),
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(
          `Order Executed! ${tradeSide.toUpperCase()} ${tradeAmount} ${selectedPair.split("/")[0]} @ $${data.price}`
        );
        loadData();
      }
    } catch {
      showToast("Trade execution failed");
    } finally {
      setIsTrading(false);
    }
  };

  const handleCreateStake = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStaking(true);

    try {
      const apy = stakeDuration === 365 ? 24.8 : stakeDuration === 180 ? 19.4 : stakeDuration === 90 ? 14.2 : 8.5;
      const res = await fetch("/api/crypto/stake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: "ORBX",
          amount: Number(stakeAmountInput),
          durationDays: stakeDuration,
          apy,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Staked ${stakeAmountInput} ORBX @ ${apy}% APY!`);
        setIsStakeModalOpen(false);
        loadData();
      }
    } catch {
      showToast("Staking transaction failed");
    } finally {
      setIsStaking(false);
    }
  };

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      const res = await fetch("/api/app/apikeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });

      const data = await res.json();
      if (data.success) {
        setCreatedSecret(data.key);
        setApiKeys([data.item, ...apiKeys]);
        setNewKeyName("");
      }
    } catch {
      showToast("Failed to create key");
    }
  };

  const handleDeleteApiKey = async (id: number) => {
    if (!confirm("Revoke this HFT API Key?")) return;
    try {
      await fetch(`/api/app/apikeys?id=${id}`, { method: "DELETE" });
      setApiKeys(apiKeys.filter((k) => k.id !== id));
      showToast("API Key revoked");
    } catch {
      showToast("Failed to delete key");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-xl bg-neutral-900 border border-emerald-500 text-white text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-neutral-900/60 border-r border-neutral-800/90 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-neutral-800/80 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-brand-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                  OrbitX DEX
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                    PRO
                  </span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Non-Custodial Terminal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 text-xs">
            <button
              onClick={() => setActiveTab("terminal")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "terminal"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-850"
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>DEX Trading Terminal</span>
            </button>

            <button
              onClick={() => setActiveTab("portfolio")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "portfolio"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-850"
              }`}
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-4 h-4" />
                <span>Wallet Portfolio</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-emerald-400">
                ${portfolio ? Math.round(portfolio.totalValueUsd).toLocaleString() : "--"}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("staking")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "staking"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-850"
              }`}
            >
              <div className="flex items-center gap-3">
                <Coins className="w-4 h-4" />
                <span>Liquid Staking</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                24.8% APY
              </span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "history"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-850"
              }`}
            >
              <div className="flex items-center gap-3">
                <History className="w-4 h-4" />
                <span>Transaction History</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                {transactions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("keys")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "keys"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-850"
              }`}
            >
              <Key className="w-4 h-4" />
              <span>HFT API Keys</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "settings"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-850"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>DEX Slippage & Gas</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-800/80 space-y-3">
          <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="font-semibold text-white">Connected Wallet</span>
              <span className="text-[10px] text-emerald-400 font-mono">EVM / SOL</span>
            </div>
            <div className="text-[11px] font-mono text-neutral-300">0x71C4...49b2</div>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main App Content View */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Bar */}
        <header className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-white capitalize">
              {activeTab === "terminal" && "DEX Spot & Limit Order Terminal"}
              {activeTab === "portfolio" && "Crypto Multi-Chain Portfolio"}
              {activeTab === "staking" && "Liquid Staking Vaults (ORBX)"}
              {activeTab === "history" && "On-Chain Transaction Audit"}
              {activeTab === "keys" && "Algorithmic & HFT API Keys"}
              {activeTab === "settings" && "Slippage & Network Configuration"}
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              0% Gas L2
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsStakeModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Stake $ORBX</span>
            </button>

            <button
              onClick={loadData}
              className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title="Refresh balances"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </header>

        {/* Dynamic Views */}
        <div className="p-6 md:p-8 space-y-8 flex-1">
          {/* TAB 1: TRADING TERMINAL */}
          {activeTab === "terminal" && (
            <div className="space-y-6 animate-in fade-in">
              {/* Pair Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                <div className="flex items-center gap-4">
                  <select
                    value={selectedPair}
                    onChange={(e) => {
                      setSelectedPair(e.target.value);
                      const base = e.target.value.split("/")[0];
                      const coin = portfolio?.assets.find((a) => a.symbol === base);
                      if (coin) setLimitPrice(coin.current_price.toString());
                    }}
                    className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ORBX/USDT">ORBX / USDT</option>
                    <option value="BTC/USDT">BTC / USDT</option>
                    <option value="ETH/USDT">ETH / USDT</option>
                    <option value="SOL/USDT">SOL / USDT</option>
                  </select>

                  <div className="flex items-baseline gap-2 font-mono">
                    <span className="text-2xl font-black text-white">
                      ${currentPrice > 100 ? currentPrice.toLocaleString() : currentPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">+18.4%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 p-1 rounded-xl text-xs font-mono">
                  {(["15m", "1h", "1D", "1W"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeframe(t)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        timeframe === t ? "bg-neutral-800 text-white font-bold" : "text-neutral-500 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trading Workspace Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Chart & Order Book (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Candlestick / Chart Area Simulation */}
                  <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                      <span>ORBX/USDT • 1h Candle Chart</span>
                      <span className="text-emerald-400">Order Matching: L2 Relayer (0ms MEV)</span>
                    </div>

                    {/* Chart Mock SVG */}
                    <div className="h-64 w-full bg-neutral-950/80 rounded-xl border border-neutral-850 p-4 relative overflow-hidden flex flex-col justify-end">
                      <div className="absolute inset-0 flex items-center justify-around pointer-events-none opacity-10">
                        <div className="w-px h-full bg-white" />
                        <div className="w-px h-full bg-white" />
                        <div className="w-px h-full bg-white" />
                        <div className="w-px h-full bg-white" />
                      </div>

                      {/* Line Graphic */}
                      <svg viewBox="0 0 500 150" className="w-full h-full text-emerald-500 overflow-visible">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,130 Q50,110 100,120 T200,90 T300,70 T400,45 T500,20 L500,150 L0,150 Z"
                          fill="url(#chartGradient)"
                        />
                        <path
                          d="M0,130 Q50,110 100,120 T200,90 T300,70 T400,45 T500,20"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                        />
                      </svg>

                      <div className="flex justify-between text-[10px] font-mono text-neutral-500 pt-2 border-t border-neutral-900">
                        <span>12:00</span>
                        <span>13:00</span>
                        <span>14:00</span>
                        <span>15:00</span>
                        <span>16:00</span>
                        <span>17:00</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Book Depth */}
                  <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3 font-mono text-xs">
                    <div className="text-xs font-bold text-white uppercase tracking-wider">
                      Order Book Liquidity
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Bids */}
                      <div className="space-y-1">
                        <div className="text-[10px] text-neutral-500 uppercase flex justify-between">
                          <span>Bid Price</span>
                          <span>Size</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 font-bold">
                          <span>14.84</span>
                          <span className="text-neutral-300">2,400</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 font-bold">
                          <span>14.81</span>
                          <span className="text-neutral-300">5,820</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 font-bold">
                          <span>14.78</span>
                          <span className="text-neutral-300">11,200</span>
                        </div>
                      </div>

                      {/* Asks */}
                      <div className="space-y-1">
                        <div className="text-[10px] text-neutral-500 uppercase flex justify-between">
                          <span>Ask Price</span>
                          <span>Size</span>
                        </div>
                        <div className="flex justify-between text-red-400 font-bold">
                          <span>14.86</span>
                          <span className="text-neutral-300">1,940</span>
                        </div>
                        <div className="flex justify-between text-red-400 font-bold">
                          <span>14.89</span>
                          <span className="text-neutral-300">4,120</span>
                        </div>
                        <div className="flex justify-between text-red-400 font-bold">
                          <span>14.92</span>
                          <span className="text-neutral-300">8,900</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Order Form (4 cols) */}
                <div className="lg:col-span-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 p-6 space-y-4 flex flex-col justify-between">
                  <div>
                    {/* Buy / Sell switch */}
                    <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-neutral-950 border border-neutral-800 mb-4">
                      <button
                        onClick={() => setTradeSide("buy")}
                        className={`py-2 rounded-lg font-bold text-xs transition-all ${
                          tradeSide === "buy"
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        Buy {selectedPair.split("/")[0]}
                      </button>
                      <button
                        onClick={() => setTradeSide("sell")}
                        className={`py-2 rounded-lg font-bold text-xs transition-all ${
                          tradeSide === "sell"
                            ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        Sell {selectedPair.split("/")[0]}
                      </button>
                    </div>

                    <form onSubmit={handleExecuteTrade} className="space-y-4 text-xs">
                      <div>
                        <label className="block text-neutral-400 font-semibold mb-1">Order Type</label>
                        <select
                          value={orderType}
                          onChange={(e) => setOrderType(e.target.value as "market" | "limit")}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500 font-mono"
                        >
                          <option value="market">Market (Instant Fill)</option>
                          <option value="limit">Limit Order</option>
                        </select>
                      </div>

                      {orderType === "limit" && (
                        <div>
                          <label className="block text-neutral-400 font-semibold mb-1">Limit Price (USDT)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={limitPrice}
                            onChange={(e) => setLimitPrice(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      )}

                      <div>
                        <div className="flex justify-between text-neutral-400 font-semibold mb-1">
                          <span>Amount ({selectedPair.split("/")[0]})</span>
                          <span>Avail: 18,500.00 USDT</span>
                        </div>
                        <input
                          type="number"
                          step="1"
                          required
                          value={tradeAmount}
                          onChange={(e) => setTradeAmount(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-850 font-mono text-[11px] space-y-1">
                        <div className="flex justify-between text-neutral-400">
                          <span>Total Value:</span>
                          <span className="text-white font-bold">
                            ${(Number(tradeAmount) * (orderType === "limit" ? Number(limitPrice) : currentPrice)).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Maker Fee:</span>
                          <span className="text-emerald-400">0.00%</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isTrading}
                        className={`w-full py-3 rounded-xl font-bold text-xs text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                          tradeSide === "buy"
                            ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
                            : "bg-red-600 hover:bg-red-500 shadow-red-600/30"
                        }`}
                      >
                        {isTrading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Confirming Trade...</span>
                          </>
                        ) : (
                          <>
                            <span>{tradeSide === "buy" ? "Buy" : "Sell"} {selectedPair.split("/")[0]}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  <div className="text-[10px] text-neutral-500 font-mono text-center">
                    Gasless Layer 2 • Cryptographic settlement
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PORTFOLIO */}
          {activeTab === "portfolio" && (
            <div className="space-y-6 animate-in fade-in">
              {/* Portfolio Balance Banner */}
              <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-6">
                <div>
                  <div className="text-xs uppercase font-semibold tracking-wider text-emerald-400 mb-1">
                    Total Estimated Net Worth
                  </div>
                  <div className="text-4xl font-black text-white font-mono">
                    ${portfolio ? portfolio.totalValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "--"}
                  </div>
                  <div className="text-xs text-emerald-400 font-mono mt-1">
                    +${portfolio ? portfolio.dayChangeUsd.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "--"} (+8.4% 24h PnL)
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab("terminal")}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/30"
                  >
                    Trade Assets
                  </button>
                  <button
                    onClick={() => setIsStakeModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs border border-neutral-700 transition-all"
                  >
                    Stake & Earn
                  </button>
                </div>
              </div>

              {/* Asset Holdings Table */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider text-[11px] border-b border-neutral-800">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Asset</th>
                        <th className="py-3.5 px-4 font-semibold">Holdings</th>
                        <th className="py-3.5 px-4 font-semibold">Current Price</th>
                        <th className="py-3.5 px-4 font-semibold">Total Value (USD)</th>
                        <th className="py-3.5 px-4 font-semibold">24h Change</th>
                        <th className="py-3.5 px-4 font-semibold">Allocation</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80">
                      {portfolio?.assets.map((asset) => (
                        <tr key={asset.symbol} className="hover:bg-neutral-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{asset.symbol}</div>
                            <div className="text-[11px] text-neutral-500">{asset.name}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-white">
                            {asset.balance.toLocaleString()} {asset.symbol}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-neutral-300">
                            ${asset.current_price > 100 ? asset.current_price.toLocaleString() : asset.current_price.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-white">
                            ${asset.value_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-emerald-400">
                            +{asset.change24h}%
                          </td>
                          <td className="py-3.5 px-4 font-mono text-neutral-400">
                            {asset.allocation_percent.toFixed(1)}%
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedPair(`${asset.symbol === "USDT" ? "ORBX" : asset.symbol}/USDT`);
                                setActiveTab("terminal");
                              }}
                              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-[11px] transition-colors"
                            >
                              Trade
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIQUID STAKING */}
          {activeTab === "staking" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white">ORBX Liquid Staking Vaults</h2>
                  <p className="text-xs text-neutral-400">
                    Earn up to 24.8% APY by participating in protocol validation and fee distribution.
                  </p>
                </div>

                <button
                  onClick={() => setIsStakeModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Stake Vault</span>
                </button>
              </div>

              {/* Active Stakes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {stakes.map((s) => (
                  <div
                    key={s.id}
                    className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-emerald-400" />
                        <span className="font-bold text-white text-sm">{s.symbol} Staking Vault</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {s.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                      <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-850">
                        <div className="text-[10px] text-neutral-500">STAKED AMOUNT</div>
                        <div className="font-bold text-white mt-0.5">{s.amount.toLocaleString()} ORBX</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-850">
                        <div className="text-[10px] text-neutral-500">APY RATE</div>
                        <div className="font-bold text-emerald-400 mt-0.5">{s.apy}% APY</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-850">
                        <div className="text-[10px] text-neutral-500">REWARDS EARNED</div>
                        <div className="font-bold text-white mt-0.5">+{s.rewards_earned.toFixed(1)} ORBX</div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs text-neutral-400">
                      <span>Lockup Duration: {s.duration_days} Days</span>
                      <button
                        onClick={() => showToast("Daily yield rewards claimed to portfolio!")}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 font-semibold"
                      >
                        Claim Rewards
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TRANSACTION HISTORY */}
          {activeTab === "history" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">On-Chain Activity Stream</h2>
                  <p className="text-xs text-neutral-400">
                    Real-time transaction record of swaps, trades, and staking payouts.
                  </p>
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  Total Tx: <strong className="text-white">{transactions.length}</strong>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider text-[11px] border-b border-neutral-800">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Tx Hash</th>
                        <th className="py-3.5 px-4 font-semibold">Action</th>
                        <th className="py-3.5 px-4 font-semibold">Pair / Assets</th>
                        <th className="py-3.5 px-4 font-semibold">Amount</th>
                        <th className="py-3.5 px-4 font-semibold">Value (USD)</th>
                        <th className="py-3.5 px-4 font-semibold">Status</th>
                        <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80 font-mono">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-neutral-800/40 transition-colors">
                          <td className="py-3.5 px-4 text-emerald-400 font-semibold">
                            {tx.tx_hash}
                          </td>
                          <td className="py-3.5 px-4 uppercase font-bold text-white">
                            {tx.type}
                          </td>
                          <td className="py-3.5 px-4 text-neutral-300">
                            {tx.from_asset} → {tx.to_asset}
                          </td>
                          <td className="py-3.5 px-4 text-white">
                            {tx.amount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-neutral-300">
                            ${tx.value_usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-neutral-400 whitespace-nowrap">
                            {formatDate(tx.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HFT API KEYS */}
          {activeTab === "keys" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white">Algorithmic & HFT API Keys</h2>
                  <p className="text-xs text-neutral-400">
                    Connect quantitative trading bots via ultra-low latency WebSocket & REST endpoints.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsKeyModalOpen(true);
                    setCreatedSecret(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create HFT Key</span>
                </button>
              </div>

              {/* Keys list */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider text-[11px] border-b border-neutral-800">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Key Identifier</th>
                        <th className="py-3.5 px-4 font-semibold">Key Prefix</th>
                        <th className="py-3.5 px-4 font-semibold">Permissions</th>
                        <th className="py-3.5 px-4 font-semibold">Status</th>
                        <th className="py-3.5 px-4 font-semibold">Created</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Revoke</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80 font-mono">
                      {apiKeys.map((k) => (
                        <tr key={k.id} className="hover:bg-neutral-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white">{k.name}</td>
                          <td className="py-3.5 px-4 text-neutral-400">{k.prefix}••••••••••••</td>
                          <td className="py-3.5 px-4 text-emerald-400">Read / Trade (No Withdraw)</td>
                          <td className="py-3.5 px-4">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {k.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-neutral-400">{formatDate(k.created_at)}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteApiKey(k.id)}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === "settings" && (
            <div className="max-w-3xl space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-base font-bold text-white">DEX Slippage & Execution Settings</h2>
                <p className="text-xs text-neutral-400">
                  Configure maximum tolerated slippage, MEV protection, and multi-chain gas relayer preferences.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-2">Slippage Tolerance</label>
                  <div className="flex gap-2">
                    {["0.1%", "0.5%", "1.0%", "Custom"].map((val, idx) => (
                      <button
                        key={idx}
                        className={`px-4 py-2 rounded-xl font-mono transition-all ${
                          idx === 1
                            ? "bg-emerald-600 text-white font-bold"
                            : "bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-850 space-y-2">
                  <div className="font-semibold text-white">MEV & Anti-Frontrunning Guard</div>
                  <div className="text-neutral-400 leading-relaxed">
                    Private mempool routing is permanently enabled on OrbitX. Your trades are hidden from toxic sandwich bots and searchers.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: Stake ORBX */}
      {isStakeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Stake $ORBX in Protocol Vault</h3>
            <form onSubmit={handleCreateStake} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Amount to Stake ($ORBX)</label>
                <input
                  type="number"
                  required
                  value={stakeAmountInput}
                  onChange={(e) => setStakeAmountInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Lock Duration</label>
                <select
                  value={stakeDuration}
                  onChange={(e) => setStakeDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                >
                  <option value={30}>30 Days (8.5% APY)</option>
                  <option value={90}>90 Days (14.2% APY)</option>
                  <option value={180}>180 Days (19.4% APY)</option>
                  <option value={365}>365 Days (24.8% APY)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStakeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isStaking}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  {isStaking ? "Staking..." : "Confirm Stake"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Create API Key */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Generate HFT API Key</h3>

            {createdSecret ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200">
                  Key generated! Copy this secret now as it will not be displayed again.
                </div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-emerald-300 flex justify-between items-center">
                  <span className="truncate mr-2">{createdSecret}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(createdSecret);
                      setCopiedKey(true);
                      setTimeout(() => setCopiedKey(false), 2000);
                    }}
                    className="p-1 bg-neutral-800 rounded text-white"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={() => setIsKeyModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateApiKey} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Key Description / Bot Name</label>
                  <input
                    type="text"
                    required
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g. Hummingbot Arbitrage Bot"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsKeyModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    Generate Key
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
