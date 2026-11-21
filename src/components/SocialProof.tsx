import { siteConfig } from "@/config/site";
import { CheckCircle2, Shield, Award, Users } from "lucide-react";

export function SocialProof() {
  const companies = [
    "LinearScale",
    "NordicFin",
    "Veloce",
    "Aether Dynamics",
    "QuantumStack",
    "Prism Health",
  ];

  return (
    <section className="py-12 border-y border-neutral-800/80 bg-neutral-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metric stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pb-12 border-b border-neutral-800/60">
          {siteConfig.stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-neutral-200 mt-1">{stat.label}</div>
              <div className="text-xs text-neutral-400 mt-0.5">{stat.helper}</div>
            </div>
          ))}
        </div>

        {/* Company logos ticker */}
        <div className="pt-10 flex flex-col items-center">
          <p className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-6 text-center">
            Powering intelligent operations for 2,400+ forward-thinking teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75">
            {companies.map((name, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 font-bold text-lg tracking-wider text-neutral-400 hover:text-white transition-colors"
              >
                <div className="w-2.5 h-2.5 rounded-sm bg-neutral-700" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
