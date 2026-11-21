"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Coins, Copy, Check, Flame, Shield, ArrowUpRight } from "lucide-react";

export function Tokenomics() {
  const [copied, setCopied] = useState(false);
  const tokenContract = "0x8f2a74c2e409b8219081e7d48123908fba20orbx";

  const handleCopy = () => {
    navigator.clipboard.writeText(tokenContract);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="tokenomics" className="py-24 relative bg-neutral-950 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-400 mb-4">
            <Coins className="w-3.5 h-3.5" />
            OrbitX Tokenomics ($ORBX)
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Designed for Sustainable Protocol Value
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg mt-3">
            Fixed supply of 1,000,000,000 ORBX with real revenue sharing, deflationary fee burns, and DAO governance.
          </p>

          {/* Token Contract address copy pill */}
          <div className="mt-6 inline-flex items-center gap-2 p-1.5 pl-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300">
            <span className="text-neutral-500">Contract:</span>
            <span>0x8f2a...orbx (ERC-20 & SPL)</span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
              title="Copy full contract address"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Token Distribution Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Left: Token Utility Pillars (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Quarterly Buyback & Burn</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                25% of all DEX trading fees are used to market-buy ORBX from open liquidity and burned forever on-chain.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Coins className="w-4 h-4 text-emerald-400" />
                <span>Trading Fee Reductions</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Holders receive up to 50% discount on taker fees and zero maker fees across spot and perpetual pairs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Shield className="w-4 h-4 text-brand-400" />
                <span>Decentralized DAO Governance</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Vote on new token listings, liquidity pool incentives, protocol upgrades, and treasury grant allocations.
              </p>
            </div>
          </div>

          {/* Right: Allocation Breakdown (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-neutral-900/80 border border-neutral-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <div className="text-xs font-semibold uppercase text-neutral-400">Total Supply Cap</div>
                <div className="text-2xl font-black text-white">1,000,000,000 ORBX</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold uppercase text-neutral-400">Circulating Supply</div>
                <div className="text-2xl font-black text-emerald-400">22.4%</div>
              </div>
            </div>

            {/* Visual allocation progress bars */}
            <div className="space-y-4">
              {siteConfig.tokenomics.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-neutral-300">{item.category}</span>
                    <span className="font-mono text-white font-bold">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono text-right">
                    {item.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
