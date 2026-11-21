import { siteConfig } from "@/config/site";
import {
  Zap,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  Code2,
  Database,
  Check,
  Sparkles,
} from "lucide-react";

export function Features() {
  const iconMap: Record<string, React.ReactNode> = {
    Zap: <Zap className="w-6 h-6 text-emerald-400" />,
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-brand-400" />,
    RefreshCw: <RefreshCw className="w-6 h-6 text-teal-400" />,
    TrendingUp: <TrendingUp className="w-6 h-6 text-amber-400" />,
    Code2: <Code2 className="w-6 h-6 text-purple-400" />,
    Database: <Database className="w-6 h-6 text-sky-400" />,
  };

  return (
    <section id="features" className="py-24 relative bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Institutional Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Built for Modern Crypto Execution
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg mt-4 leading-relaxed">
            Eliminating slippage, frontrunning, and custody risk with next-generation decentralized exchange infrastructure.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.features.map((feature, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-7 border transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between ${
                feature.highlight
                  ? "bg-gradient-to-b from-neutral-900/90 to-neutral-950 border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-500/5"
                  : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {iconMap[feature.icon] || <Zap className="w-6 h-6 text-emerald-400" />}
                  </div>
                  {feature.tag && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {feature.tag}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-emerald-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center text-xs text-neutral-400 group-hover:text-neutral-300">
                <Check className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
                <span>Audited on-chain smart contracts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
