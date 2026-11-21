"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { X, Sparkles, CheckCircle2, ArrowRight, Loader2, AlertCircle, Shield, Wallet, Coins } from "lucide-react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    wallet: "",
    chainPreference: "Ethereum & Solana",
    experience: "Active DEX Trader",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; position: number; alreadyExists?: boolean } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.wallet || "Wallet Not Provided",
          role: formData.experience,
          team_size: formData.chainPreference,
          use_case: "Token Airdrop & Early Beta Trading",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to join whitelist.");
      }

      setResult({
        success: true,
        position: data.position,
        alreadyExists: data.alreadyExists,
      });

      triggerConfetti();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-900/95 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/15 blur-3xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {result?.success ? (
          <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">
                {result.alreadyExists ? "Whitelist Spot Reserved!" : "You're On The $ORBX Whitelist!"}
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
                Your wallet and email have been registered for Genesis Airdrop allocations and early beta fee tiers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 max-w-xs mx-auto">
              <div className="text-[11px] font-mono uppercase text-neutral-500">
                Whitelist Queue Position
              </div>
              <div className="text-3xl font-black text-emerald-400 mt-1 font-mono">
                #{result.position.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400 font-medium mt-1">
                Tier 1 Allocation • 2x Airdrop Multiplier
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-neutral-800 hover:bg-neutral-700 transition-colors"
            >
              Done & Return to DEX
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-2">
                <Coins className="w-3.5 h-3.5" />
                $ORBX Genesis Whitelist & Airdrop
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Secure Early Trading Allocation
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Sign up for guaranteed early DEX access, 0% fee tier, and retroactive airdrop distribution.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Trader Name / Alias <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Satoshi_99"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="trader@crypto.io"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center justify-between">
                  <span>Web3 Wallet Address (EVM or Solana)</span>
                  <span className="text-neutral-500 text-[10px]">For Airdrop</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.wallet}
                    onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
                    placeholder="0x... or Solana pubkey"
                    className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                  />
                  <Wallet className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Primary Blockchains
                  </label>
                  <select
                    value={formData.chainPreference}
                    onChange={(e) => setFormData({ ...formData, chainPreference: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Ethereum & Solana">Ethereum & Solana</option>
                    <option value="Arbitrum & Base">Arbitrum & Base (L2)</option>
                    <option value="BNB & Polygon">BNB Chain & Polygon</option>
                    <option value="All Chains">Multi-Chain All</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Trading Experience
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Active DEX Trader">Active DEX Trader</option>
                    <option value="Yield Farmer & Staker">Yield Farmer & Staker</option>
                    <option value="Institutional Desk">Institutional Desk</option>
                    <option value="New to Web3">New to Crypto</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-brand-600 hover:from-emerald-500 hover:to-brand-500 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying on-chain spot...</span>
                    </>
                  ) : (
                    <>
                      <span>Register for $ORBX Whitelist</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-neutral-500 text-center flex items-center justify-center gap-1.5 pt-1">
                <Shield className="w-3 h-3 text-neutral-400" />
                <span>Zero spam. Encrypted database storage. Non-custodial guarantee.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
