"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Check, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

interface PricingProps {
  onOpenWaitlist: () => void;
}

export function Pricing({ onOpenWaitlist }: PricingProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 relative bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Simple Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Predictable Costs. Infinite Scale.
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg mt-4">
            Start free with full core agentic capabilities. Upgrade when you scale to mission-critical volume.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                !isAnnual
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                isAnnual
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {siteConfig.pricing.plans.map((plan) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 border flex flex-col justify-between relative transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 border-brand-500 shadow-2xl shadow-brand-500/10 md:-translate-y-2"
                    : "bg-neutral-900/50 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-600 to-accent-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  </div>
                  <p className="text-xs text-neutral-400 min-h-[36px]">{plan.tagline}</p>

                  {/* Price */}
                  <div className="mt-6 mb-8 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-white">
                      ${price}
                    </span>
                    <span className="text-xs text-neutral-400">
                      / month {isAnnual && price > 0 ? "(billed annually)" : ""}
                    </span>
                  </div>

                  {/* Features list */}
                  <div className="space-y-3 pt-6 border-t border-neutral-800">
                    <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Included features:
                    </div>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-800/80">
                  <button
                    onClick={onOpenWaitlist}
                    className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 group ${
                      plan.popular
                        ? "bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white shadow-lg shadow-brand-600/30"
                        : "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise SLA Guarantee Banner */}
        <div className="mt-16 max-w-4xl mx-auto rounded-2xl bg-neutral-900/60 border border-neutral-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Need a dedicated VPC or custom BAA?</div>
              <div className="text-xs text-neutral-400">
                We support on-prem air-gapped clusters, dedicated hardware keys, and custom SLA contracts.
              </div>
            </div>
          </div>
          <a
            href="#contact"
            className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-white transition-colors shrink-0"
          >
            Contact Solutions Team
          </a>
        </div>
      </div>
    </section>
  );
}
