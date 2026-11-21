"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Zap,
  BarChart2,
  RefreshCw,
  CheckCircle2,
  Loader2,
  Lock,
} from "lucide-react";

export function InteractiveTradingView() {
  const [selectedPair, setSelectedPair] = useState("ORBX/USDT");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [tradeAmount, setTradeAmount] = useState("250");
  const [limitPrice, setLimitPrice] = useState("14.85");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const activeCoin = siteConfig.cryptoPrices.find((c) => `${c.symbol}/USDT` === selectedPair) || siteConfig.cryptoPrices[0];
  const currentPrice = activeCoin.price;

  // Order Book Mock data
  const bids = [
    { price: (currentPrice * 0.998).toFixed(2), amount: "1,420", total: "$21,087" },
    { price: (currentPrice * 0.995).toFixed(2), amount: "3,890", total: "$57,766" },
    { price: (currentPrice * 0.991).toFixed(2), amount: "6,200", total: "$92,070" },
    { price: (currentPrice * 0.988).toFixed(2), amount: "12,400", total: "$184,140" },
  ];

  const asks = [
    { price: (currentPrice * 1.012).toFixed(2), amount: "8,950", total: "$132,907" },
    { price: (currentPrice * 1.008).toFixed(2), amount: "5,120", total: "$76,032" },
    { price: (currentPrice * 1.005).toFixed(2), amount: "2,840", total: "$42,174" },
    { price: (currentPrice * 1.002).toFixed(2), amount: "1,150", total: "$17,077" },
  ];

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOrderSuccess(null);

    try {
      const res = await fetch("/api/crypto/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pair: selectedPair,
          side,
          order_type: orderType,
          price: orderType === "limit" ? Number(limitPrice) : currentPrice,
          amount: Number(tradeAmount),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderSuccess(`Order Filled! ${side.toUpperCase()} ${tradeAmount} ${selectedPair.split("/")[0]} @ $${data.price}`);
      }
    } catch {
      setOrderSuccess("Simulated order executed on-chain!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="markets" className="py-24 relative bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-400 mb-4">
            <BarChart2 className="w-3.5 h-3.5" />
            Institutional DEX Engine
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Central Limit Order Book with 0% Gas
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg mt-3">
            Experience ultra-low latency matching, deep liquidity books, and native on-chain trade settlement.
          </p>
        </div>

        {/* Pair selector pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {siteConfig.cryptoPrices.map((c) => {
            const pairName = `${c.symbol}/USDT`;
            const isSelected = pairName === selectedPair;
            return (
              <button
                key={c.symbol}
                onClick={() => {
                  setSelectedPair(pairName);
                  setLimitPrice(c.price.toString());
                  setOrderSuccess(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all border flex items-center gap-2 ${
                  isSelected
                    ? "bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-600/30"
                    : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700"
                }`}
              >
                <span>{pairName}</span>
                <span className={c.change24h >= 0 ? "text-emerald-400" : "text-red-400"}>
                  {c.change24h >= 0 ? "+" : ""}{c.change24h}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Trading Terminal Mockup */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-neutral-800 bg-neutral-900/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Header Bar */}
          <div className="px-6 py-4 bg-neutral-950/80 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-black text-white font-mono">{selectedPair}</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                ${currentPrice > 100 ? currentPrice.toLocaleString() : currentPrice.toFixed(2)}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                24h: +{activeCoin.change24h}%
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
              <div>
                24h High: <strong className="text-white">${activeCoin.high24h.toLocaleString()}</strong>
              </div>
              <div>
                24h Volume: <strong className="text-white">{activeCoin.volume24h}</strong>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Fill SLA: 1.2ms</span>
              </div>
            </div>
          </div>

          {/* Terminal Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-800">
            {/* Left: Order Book Depth (6 cols) */}
            <div className="lg:col-span-6 p-6 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between text-neutral-400 uppercase tracking-wider text-[11px] pb-2 border-b border-neutral-800">
                <span>Price (USDT)</span>
                <span>Size ({selectedPair.split("/")[0]})</span>
                <span>Total</span>
              </div>

              {/* Asks (Sell orders - Red) */}
              <div className="space-y-1">
                {asks.map((ask, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 text-red-400 hover:bg-neutral-800/40 px-1 rounded">
                    <span className="font-bold">{ask.price}</span>
                    <span className="text-neutral-300">{ask.amount}</span>
                    <span className="text-neutral-400">{ask.total}</span>
                  </div>
                ))}
              </div>

              {/* Mid Spread Indicator */}
              <div className="py-2.5 px-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-400">Spread: 0.01 USDT (0.00%)</span>
                <span className="text-emerald-400 font-bold">L2 Instant Settled</span>
              </div>

              {/* Bids (Buy orders - Green) */}
              <div className="space-y-1">
                {bids.map((bid, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 text-emerald-400 hover:bg-neutral-800/40 px-1 rounded">
                    <span className="font-bold">{bid.price}</span>
                    <span className="text-neutral-300">{bid.amount}</span>
                    <span className="text-neutral-400">{bid.total}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Instant Order Execution Panel (6 cols) */}
            <div className="lg:col-span-6 p-6 flex flex-col justify-between space-y-4">
              <div>
                {/* Buy / Sell switch */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-neutral-950 border border-neutral-800 mb-4">
                  <button
                    onClick={() => setSide("buy")}
                    className={`py-2 rounded-lg font-bold text-xs transition-all ${
                      side === "buy"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Buy {selectedPair.split("/")[0]}
                  </button>
                  <button
                    onClick={() => setSide("sell")}
                    className={`py-2 rounded-lg font-bold text-xs transition-all ${
                      side === "sell"
                        ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    Sell {selectedPair.split("/")[0]}
                  </button>
                </div>

                {/* Market / Limit switch */}
                <div className="flex gap-4 mb-4 text-xs font-semibold text-neutral-400">
                  <button
                    onClick={() => setOrderType("market")}
                    className={orderType === "market" ? "text-white underline underline-offset-4" : "hover:text-white"}
                  >
                    Market Order
                  </button>
                  <button
                    onClick={() => setOrderType("limit")}
                    className={orderType === "limit" ? "text-white underline underline-offset-4" : "hover:text-white"}
                  >
                    Limit Order
                  </button>
                </div>

                {orderSuccess && (
                  <div className="mb-3 p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{orderSuccess}</span>
                  </div>
                )}

                <form onSubmit={handlePlaceOrder} className="space-y-3.5 text-xs">
                  {orderType === "limit" && (
                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1">Limit Price (USDT)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between text-neutral-400 font-semibold mb-1">
                      <span>Order Amount</span>
                      <span>Avail: 18,500.00 USDT</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        step="1"
                        required
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:outline-none focus:border-brand-500"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-mono">
                        {selectedPair.split("/")[0]}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] font-mono text-neutral-400 pt-1">
                    <span>Est. Fee (0% Maker):</span>
                    <span className="text-emerald-400">$0.00 (Gasless L2)</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                      side === "buy"
                        ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
                        : "bg-red-600 hover:bg-red-500 shadow-red-600/30"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirming Swap...</span>
                      </>
                    ) : (
                      <>
                        <span>{side === "buy" ? "Instant Buy" : "Instant Sell"} {selectedPair.split("/")[0]}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 text-center">
                Non-custodial execution • Cryptographically signed by connected wallet
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
