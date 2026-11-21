"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Star, Quote, Sparkles, Building2 } from "lucide-react";

export function Testimonials() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const industries = ["All", "SaaS", "Fintech", "E-Commerce", "Enterprise"];

  const filtered =
    activeFilter === "All"
      ? siteConfig.testimonials
      : siteConfig.testimonials.filter((t) => t.industry === activeFilter);

  return (
    <section className="py-24 relative bg-neutral-950/80 border-t border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Customer Success
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Trusted by the Teams Building the Future
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg mt-3">
            See how high-velocity engineering and operations leaders deploy autonomous agents with OrbitX.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setActiveFilter(ind)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                activeFilter === ind
                  ? "bg-brand-600 border-brand-500 text-white shadow-md shadow-brand-600/25"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-7 bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: item.rating }).map((_, rIdx) => (
                      <Star key={rIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Stat highlight badge */}
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.stat}
                  </span>
                </div>

                <p className="text-sm text-neutral-200 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author footer */}
              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{item.name}</div>
                    <div className="text-[11px] text-neutral-400">
                      {item.role} • {item.company}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                  {item.industry}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
