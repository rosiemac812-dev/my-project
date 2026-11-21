"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { TrendingUp, Coins, Lock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface StakingCalculatorProps {
  onOpenWaitlist: () => void;
}

export function StakingCalculator({ onOpenWaitlist }: StakingCalculatorProps) {
  const [stakeAmount, setStakeAmount] = useState<number>(5000);
  const [selectedDuration, setSelectedDuration] = useState<number>(365);

  const orbxPrice = siteConfig.cryptoPrices.find((c) => c.symbol === "ORBX")?.price || 14.85;

  const activeTier =
    siteConfig.stakingTiers.find((t) => t.durationDays === selectedDuration) ||
    siteConfig.stakingTiers[3];

  const totalUsdStaked = stakeAmount * orbxPrice;
  const annualRewardTokens = Math.round(stakeAmount * (activeTier.apyPercent / 100));
  const annualRewardUsd = Math.round(annualRewardTokens * orbxPrice);
  const dailyRewardUsd = (annualRewardUsd / 365).toFixed(2);

  return (
    <section id="staking" className="py-24 relative bg-neutral-950/70 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-4">
            <Coins className="w-3.5 h-3.5" />
            Liquid Staking & Real Yield
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Stake $ORBX. Earn Real DEX Protocol Revenue.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg mt-3">
            Lock your tokens in non-custodial smart contracts to receive continuous daily yield distributed from trading fee collections.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders & Duration (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Stake Amount Slider */}
              <div>
                <div className="flex justify-between items-center text-sm font-semibold mb-2">
                  <span className="text-neutral-300">Amount to Stake ($ORBX)</span>
                  <span className="font-mono text-emerald-400 text-base font-bold bg-neutral-950 px-2.5 py-0.5 rounded-lg border border-neutral-800">
                    {stakeAmount.toLocaleString()} ORBX
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 mt-1 font-mono">
                  <span>500</span>
                  <span>25,000</span>
                  <span>50,000</span>
                  <span>100,000+</span>
                </div>
              </div>

              {/* Lock Duration Selector */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5 block">
                  Lockup Duration & APY Multiplier
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {siteConfig.stakingTiers.map((tier) => {
                    const isSelected = tier.durationDays === selectedDuration;
                    return (
                      <button
                        key={tier.durationDays}
                        onClick={() => setSelectedDuration(tier.durationDays)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? "bg-emerald-950/60 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                            : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                        }`}
                      >
                        <div className="text-xs font-bold">{tier.durationDays} Days</div>
                        <div className="text-base font-mono font-black text-emerald-400 mt-0.5">
                          {tier.apyPercent}%
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-0.5 font-mono">
                          {tier.multiplier} APY
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4 text-xs text-neutral-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  Audited by CertiK
                </span>
                <span className="flex items-center gap-1.5 text-brand-400">
                  <Sparkles className="w-4 h-4" />
                  Auto-compounding daily
                </span>
              </div>
            </div>

            {/* Estimated Rewards Card (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-neutral-950 to-neutral-900 border border-emerald-500/30 p-6 flex flex-col justify-between space-y-6 shadow-xl">
              <div>
                <div className="text-xs uppercase font-semibold tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  Projected Annual Rewards
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  ${annualRewardUsd.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-400 font-mono mt-1">
                  +{annualRewardTokens.toLocaleString()} ORBX @ {activeTier.apyPercent}% APY
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-neutral-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Daily Payout Rate:</span>
                  <span className="font-mono font-bold text-white">${dailyRewardUsd} / day</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Total Capital Committed:</span>
                  <span className="font-mono font-bold text-white">${Math.round(totalUsdStaked).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Unstake Penalty:</span>
                  <span className="font-mono font-bold text-emerald-400">0% (Timelocked)</span>
                </div>
              </div>

              <button
                onClick={onOpenWaitlist}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 group"
              >
                <Lock className="w-4 h-4" />
                <span>Stake Tokens & Start Earning</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
