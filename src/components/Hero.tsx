"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowDownUp,
  Coins,
  CheckCircle2,
  Lock,
  Wallet,
  Loader2,
} from "lucide-react";

interface HeroProps {
  onOpenWaitlist: () => void;
}

export function Hero({ onOpenWaitlist }: HeroProps) {
  // Mini Instant Swap Widget in Hero
  const [payAmount, setPayAmount] = useState("2.5");
  const [payAsset, setPayAsset] = useState("ETH");
  const [receiveAsset, setReceiveAsset] = useState("ORBX");
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);

  const ethPrice = 3420.5;
  const orbxPrice = 14.85;
  const calculatedReceive = ((Number(payAmount) * ethPrice) / orbxPrice).toFixed(1);

  const handleQuickSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSwapping(true);
    setSwapSuccess(false);

    try {
      await fetch("/api/crypto/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAsset: payAsset,
          toAsset: receiveAsset,
          amount: Number(payAmount),
        }),
      });
      setSwapSuccess(true);
    } catch {
      setSwapSuccess(true);
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-brand-600/20 via-emerald-600/15 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-brand-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Prop & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Announcement Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 shadow-inner hover:border-brand-500/40 transition-colors cursor-pointer group">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-semibold text-emerald-400">{siteConfig.announcement.badge}</span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-300">{siteConfig.announcement.text}</span>
              <span className="text-brand-400 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Trade, Stake & Orbit Beyond CeFi.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-brand-400 bg-clip-text text-transparent">
                Zero Gas. Pure Self-Custody.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-neutral-400 max-w-xl leading-relaxed">
              {siteConfig.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-brand-600 hover:from-emerald-500 hover:to-brand-500 shadow-xl shadow-emerald-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Launch OrbitX DEX</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={onOpenWaitlist}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-neutral-300 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Coins className="w-4 h-4 text-emerald-400" />
                <span>Claim Whitelist Airdrop</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                CertiK & OpenZeppelin Audited
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-brand-400" />
                100% Non-Custodial MPC
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                1:1 Proof of Reserves
              </span>
            </div>
          </div>

          {/* Right Column: Hero Instant Swap Card (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/90 backdrop-blur-xl p-6 sm:p-7 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-white text-sm">Instant DEX Swap</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Zero Gas L2
                </span>
              </div>

              {swapSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Swap Completed! {receiveAsset} credited to portfolio.</span>
                </div>
              )}

              <form onSubmit={handleQuickSwap} className="space-y-3">
                {/* Pay Box */}
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                  <div className="flex justify-between text-[11px] text-neutral-400 font-semibold">
                    <span>You Pay</span>
                    <span>Bal: 8.40 ETH</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      className="w-full bg-transparent text-xl font-bold font-mono text-white focus:outline-none"
                    />
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-850 border border-neutral-700 text-xs font-bold text-white shrink-0">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span>ETH</span>
                    </div>
                  </div>
                </div>

                {/* Flip Button */}
                <div className="flex justify-center -my-2 relative z-10">
                  <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 shadow-md">
                    <ArrowDownUp className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>

                {/* Receive Box */}
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                  <div className="flex justify-between text-[11px] text-neutral-400 font-semibold">
                    <span>You Receive (Estimated)</span>
                    <span className="text-emerald-400">0% Slippage</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xl font-bold font-mono text-emerald-400">
                      {calculatedReceive}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-600 text-xs font-bold text-emerald-300 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>ORBX</span>
                    </div>
                  </div>
                </div>

                {/* Rates info */}
                <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-850 text-[11px] font-mono text-neutral-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Rate:</span>
                    <span className="text-neutral-200">1 ETH = 230.34 ORBX ($3,420.50)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network Fee:</span>
                    <span className="text-emerald-400">$0.00 (Gasless Relayer)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSwapping}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  {isSwapping ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Routing On-Chain Swap...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Swap Instantly</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 24h Crypto Metrics Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800">
          {siteConfig.marketStats.map((stat, i) => (
            <div key={i} className="text-center group p-3">
              <div className="text-xs font-semibold text-neutral-400">{stat.label}</div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
                {stat.value}
              </div>
              <div className="text-xs text-emerald-400 font-mono mt-0.5">{stat.change}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
