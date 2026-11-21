"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { X, Sparkles, CheckCircle2, ArrowRight, Loader2, AlertCircle, Shield } from "lucide-react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "Engineering",
    team_size: "11-50",
    use_case: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; position: number; alreadyExists?: boolean } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
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
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to join waitlist.");
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
        {/* Glow behind modal */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/15 blur-3xl pointer-events-none rounded-full" />

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
                {result.alreadyExists ? "Spot Already Reserved!" : "You're In Early Access!"}
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
                We are onboarding teams in batches. Your access credentials and sandbox API key will arrive in your inbox.
              </p>
            </div>

            {/* Position in line badge */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 max-w-xs mx-auto">
              <div className="text-[11px] font-mono uppercase text-neutral-500">
                Current Position in Line
              </div>
              <div className="text-3xl font-black text-brand-400 mt-1">
                #{result.position.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400 font-medium mt-1">
                Priority Tier • Developer Preview
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl font-semibold text-xs text-white bg-neutral-800 hover:bg-neutral-700 transition-colors"
            >
              Done & Return to Site
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-400 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Private Beta Access
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Claim Your Early Access Key
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Join 12,000+ engineers building autonomous multi-agent pipelines.
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
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Work Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Acme Inc"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Team Size
                  </label>
                  <select
                    value={formData.team_size}
                    onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="1-10">1 - 10 people</option>
                    <option value="11-50">11 - 50 people</option>
                    <option value="51-200">51 - 200 people</option>
                    <option value="201-500">201 - 500 people</option>
                    <option value="500+">500+ people</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Primary Use Case or Workflow
                </label>
                <input
                  type="text"
                  value={formData.use_case}
                  onChange={(e) => setFormData({ ...formData, use_case: e.target.value })}
                  placeholder="e.g. Support ticket auto-triage, lead scoring, SEC filings"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-accent-600 hover:from-brand-500 hover:to-accent-500 disabled:opacity-50 transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Reserving Spot...</span>
                    </>
                  ) : (
                    <>
                      <span>Secure Early Access Spot</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-neutral-500 text-center flex items-center justify-center gap-1.5 pt-1">
                <Shield className="w-3 h-3 text-neutral-400" />
                <span>Zero spam. Encrypted database storage. Unsubscribe anytime.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
