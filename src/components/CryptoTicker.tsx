"use client";

import { siteConfig } from "@/config/site";
import { TrendingUp, TrendingDown } from "lucide-react";

export function CryptoTicker() {
  return (
    <div className="w-full bg-neutral-950/90 border-b border-neutral-850 py-2.5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 shrink-0 uppercase tracking-wider font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Markets:</span>
        </div>

        <div className="flex items-center gap-8 text-xs font-mono">
          {siteConfig.cryptoPrices.map((coin) => {
            const isPositive = coin.change24h >= 0;
            return (
              <div key={coin.symbol} className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-white">{coin.symbol}/USDT</span>
                <span className="text-neutral-200">
                  ${coin.price > 100 ? coin.price.toLocaleString() : coin.price.toFixed(2)}
                </span>
                <span
                  className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    isPositive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5" />
                  )}
                  {isPositive ? "+" : ""}
                  {coin.change24h}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
