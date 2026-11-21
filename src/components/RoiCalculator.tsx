"use client";

import { useState } from "react";
import { Calculator, TrendingUp, Clock, DollarSign, ArrowRight } from "lucide-react";

interface RoiCalculatorProps {
  onOpenWaitlist: () => void;
}

export function RoiCalculator({ onOpenWaitlist }: RoiCalculatorProps) {
  const [teamSize, setTeamSize] = useState<number>(18);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(12);
  const [hourlyCost, setHourlyCost] = useState<number>(65);

  // Calculations
  const weeklyHoursSaved = Math.round(teamSize * hoursPerWeek * 0.72); // 72% automation factor
  const annualHoursSaved = weeklyHoursSaved * 50;
  const annualDollarSavings = annualHoursSaved * hourlyCost;
  const estimatedRoiPercent = Math.round((annualDollarSavings / (teamSize * 49 * 12)) * 100);

  return (
    <section id="roi" className="py-24 relative bg-neutral-950/60 border-y border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-4">
            <Calculator className="w-3.5 h-3.5" />
            ROI & Efficiency Impact
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Calculate Your Organization's Savings
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg mt-3">
            See how much engineering time and operational expense NovaPulse reclaims for your team each year.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Team Size */}
              <div>
                <div className="flex justify-between items-center text-sm font-semibold mb-2">
                  <span className="text-neutral-300">Team Size (Engineers / Ops)</span>
                  <span className="font-mono text-brand-400 text-base font-bold bg-neutral-950 px-2.5 py-0.5 rounded-lg border border-neutral-800">
                    {teamSize} people
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="200"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                  <span>2</span>
                  <span>50</span>
                  <span>100</span>
                  <span>200+</span>
                </div>
              </div>

              {/* Slider 2: Hours spent per week */}
              <div>
                <div className="flex justify-between items-center text-sm font-semibold mb-2">
                  <span className="text-neutral-300">Manual Workflow Hours / Rep / Week</span>
                  <span className="font-mono text-brand-400 text-base font-bold bg-neutral-950 px-2.5 py-0.5 rounded-lg border border-neutral-800">
                    {hoursPerWeek} hrs/wk
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="35"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                  <span>2 hrs</span>
                  <span>15 hrs</span>
                  <span>25 hrs</span>
                  <span>35 hrs</span>
                </div>
              </div>

              {/* Slider 3: Blended hourly rate */}
              <div>
                <div className="flex justify-between items-center text-sm font-semibold mb-2">
                  <span className="text-neutral-300">Blended Hourly Compensation</span>
                  <span className="font-mono text-brand-400 text-base font-bold bg-neutral-950 px-2.5 py-0.5 rounded-lg border border-neutral-800">
                    ${hourlyCost}/hr
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="150"
                  step="5"
                  value={hourlyCost}
                  onChange={(e) => setHourlyCost(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                  <span>$30/hr</span>
                  <span>$65/hr</span>
                  <span>$100/hr</span>
                  <span>$150/hr</span>
                </div>
              </div>
            </div>

            {/* Projected Result Card (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-brand-950/60 via-neutral-950 to-neutral-900 border border-brand-500/30 p-6 flex flex-col justify-between space-y-6 shadow-xl">
              <div>
                <div className="text-xs uppercase font-semibold tracking-wider text-brand-400 mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  Estimated Annual Savings
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  ${annualDollarSavings.toLocaleString()}
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Based on 72% average reduction in manual triage & routing cycles.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    Time Reclaimed / Year:
                  </span>
                  <span className="font-mono font-bold text-white">
                    {annualHoursSaved.toLocaleString()} hours
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Projected ROI Multiple:
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {estimatedRoiPercent > 0 ? `${(estimatedRoiPercent / 100).toFixed(1)}x` : "12.4x"}
                  </span>
                </div>
              </div>

              <button
                onClick={onOpenWaitlist}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all shadow-md shadow-brand-600/30 flex items-center justify-center gap-2 group"
              >
                <span>Reclaim Team Productivity</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
