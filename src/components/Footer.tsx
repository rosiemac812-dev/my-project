"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Sparkles, ArrowRight, Loader2, CheckCircle2, Shield, Heart } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Subscription failed");
      }
      setStatus({ success: true, message: data.message });
      setEmail("");
    } catch (err: unknown) {
      setStatus({
        success: false,
        message: err instanceof Error ? err.message : "Failed to subscribe",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-900">
          {/* Brand info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                {siteConfig.name}
              </span>
            </Link>

            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              The next-generation autonomous workflow platform. Chain multi-modal reasoning models, stream high-throughput events, and scale zero-devops automation.
            </p>

            {/* Newsletter capture */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-neutral-300 mb-2">
                Subscribe to Engineering Changlog
              </div>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@company.com"
                  className="px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500 flex-1"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shrink-0 flex items-center gap-1"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </form>

              {status && (
                <p
                  className={`text-[11px] mt-2 ${
                    status.success ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {status.message}
                </p>
              )}
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              DEX Platform
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <a href="#markets" className="hover:text-white transition-colors">
                  Live Crypto Markets
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  DEX Trading Terminal
                </Link>
              </li>
              <li>
                <a href="#staking" className="hover:text-white transition-colors">
                  Liquid Staking (24.8% APY)
                </a>
              </li>
              <li>
                <a href="#tokenomics" className="hover:text-white transition-colors">
                  $ORBX Tokenomics
                </a>
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Developers & Admin
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link href="/admin" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Admin Lead Portal
                </Link>
              </li>
              <li>
                <a href="/api/admin/stats" target="_blank" className="hover:text-white transition-colors">
                  REST KPI API
                </a>
              </li>
              <li>
                <a href="/api/admin/export?type=waitlist" className="hover:text-white transition-colors">
                  Export Waitlist CSV
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Architecture FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Trust & Compliance
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="flex items-center gap-1 text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                <span>SOC2 Type II Certified</span>
              </li>
              <li>HIPAA BAA Available</li>
              <li>AES-256 HSM Encryption</li>
              <li>Privacy Policy & GDPR</li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-neutral-400">All Systems Operational • 99.99% Uptime</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
