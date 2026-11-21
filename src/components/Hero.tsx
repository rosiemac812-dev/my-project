"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  Sparkles,
  ArrowRight,
  Play,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  Cpu,
  Zap,
  Activity,
  Layers,
  Check,
  Rocket,
} from "lucide-react";

interface HeroProps {
  onOpenWaitlist: () => void;
}

export function Hero({ onOpenWaitlist }: HeroProps) {
  const [activeTab, setActiveTab] = useState<"orchestration" | "routing" | "security">("orchestration");

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial gradients & glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-brand-600/20 via-accent-600/15 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-brand-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-accent-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 shadow-inner hover:border-brand-500/40 transition-colors cursor-pointer group">
            <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-ping" />
            <span className="font-semibold text-brand-400">{siteConfig.announcement.badge}</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-300">{siteConfig.announcement.text}</span>
            <span className="text-brand-400 group-hover:translate-x-0.5 transition-transform">→</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Build Autonomous AI Pipelines.
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-accent-400 bg-clip-text text-transparent">
              Zero Infrastructure Overhead.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl leading-relaxed">
            {siteConfig.description}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-accent-600 hover:from-brand-500 hover:to-accent-500 shadow-xl shadow-brand-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <Rocket className="w-4 h-4 text-brand-200" />
              <span>Launch Cloud Studio App</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={onOpenWaitlist}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-neutral-300 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>Get Early Access</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              SOC2 Type II Certified
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              5-minute SDK setup
            </span>
          </div>
        </div>

        {/* Live Interactive Hero Mockup Card */}
        <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl border border-neutral-800/90 bg-neutral-900/60 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden group">
          {/* Top Window Bar */}
          <div className="px-4 py-3 border-b border-neutral-800/80 bg-neutral-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                <Workflow className="w-3.5 h-3.5 text-brand-400" />
                novapulse-pipeline-v2.production.json
              </span>
            </div>

            {/* Mockup Tabs */}
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setActiveTab("orchestration")}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  activeTab === "orchestration"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Agent Mesh
              </button>
              <button
                onClick={() => setActiveTab("routing")}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  activeTab === "routing"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Inference Routing
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-3 py-1 rounded-md transition-all font-medium ${
                  activeTab === "security"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                PII & Security
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Cluster: Healthy (32ms)
            </div>
          </div>

          {/* Interactive Mockup Body */}
          <div className="p-6 md:p-8">
            {activeTab === "orchestration" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        Root Dispatcher Agent
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                          ACTIVE
                        </span>
                      </div>
                      <div className="text-xs text-neutral-400">
                        Evaluates context schema & dynamically routes to specialized task workers
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-neutral-300">
                    <div>
                      <span className="text-neutral-500">Latency:</span> 18ms
                    </div>
                    <div>
                      <span className="text-neutral-500">Tokens:</span> 412
                    </div>
                    <div>
                      <span className="text-neutral-500">Success:</span> 99.98%
                    </div>
                  </div>
                </div>

                {/* Sub-agent pipeline flow */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 relative hover:border-neutral-700 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-sky-400" />
                        1. Knowledge Retriever
                      </span>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Hybrid vector & keyword search over 14M enterprise embeddings.
                    </p>
                    <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                      <span>Index: Postgres pgvector</span>
                      <span className="text-sky-400 font-semibold">14ms</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-brand-500/40 relative shadow-sm shadow-brand-500/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-brand-400" />
                        2. Reasoning Engine
                      </span>
                      <span className="text-[10px] bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded font-mono">
                        STREAMING
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Sub-model task decomposition with self-correction feedback loop.
                    </p>
                    <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                      <span>Model: Claude 3.5 Sonnet</span>
                      <span className="text-brand-400 font-semibold">42ms</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 relative hover:border-neutral-700 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-purple-400" />
                        3. Webhook Dispatcher
                      </span>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Signed HMAC delivery to Slack, GitHub, Salesforce & Hubspot.
                    </p>
                    <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                      <span>HTTP 200 OK</span>
                      <span className="text-purple-400 font-semibold">8ms</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "routing" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-950/70 border border-emerald-500/30">
                    <div className="text-xs font-mono text-emerald-400 font-semibold mb-1">
                      TIER 1 • FAST PATH (Sub-50ms)
                    </div>
                    <div className="text-sm font-bold text-white">Gemini 2.0 Flash / Llama 3.3</div>
                    <div className="text-xs text-neutral-400 mt-2">
                      Used for classification, intent parsing & entity extraction.
                    </div>
                    <div className="mt-3 text-xs font-mono text-neutral-400">
                      Avg: <span className="text-emerald-400 font-bold">22ms</span> • $0.0001 / 1k tokens
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/70 border border-brand-500/30">
                    <div className="text-xs font-mono text-brand-400 font-semibold mb-1">
                      TIER 2 • COMPLEX REASONING
                    </div>
                    <div className="text-sm font-bold text-white">Claude 3.5 Sonnet / GPT-4o</div>
                    <div className="text-xs text-neutral-400 mt-2">
                      Multi-hop synthesis, code generation, and financial verification.
                    </div>
                    <div className="mt-3 text-xs font-mono text-neutral-400">
                      Avg: <span className="text-brand-400 font-bold">58ms</span> • $0.003 / 1k tokens
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/70 border border-purple-500/30">
                    <div className="text-xs font-mono text-purple-400 font-semibold mb-1">
                      TIER 3 • CUSTOM CLUSTERS
                    </div>
                    <div className="text-sm font-bold text-white">Dedicated vLLM / Bedrock</div>
                    <div className="text-xs text-neutral-400 mt-2">
                      Internal proprietary models hosted inside customer VPC.
                    </div>
                    <div className="mt-3 text-xs font-mono text-neutral-400">
                      Avg: <span className="text-purple-400 font-bold">16ms</span> • Zero external egress
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-brand-400 font-semibold">// Automated PII Scrubbing Interceptor</span>
                  <span className="text-emerald-400 font-semibold">ENFORCED</span>
                </div>
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 space-y-1">
                  <div>
                    <span className="text-red-400 line-through">
                      customer_ssn: "000-12-3456"
                    </span>{" "}
                    → <span className="text-emerald-400 font-semibold">"[REDACTED_SSN_HASH_49A]"</span>
                  </div>
                  <div>
                    <span className="text-red-400 line-through">
                      credit_card: "4532-xxxx-xxxx-8891"
                    </span>{" "}
                    → <span className="text-emerald-400 font-semibold">"[REDACTED_PCI_TOKEN]"</span>
                  </div>
                </div>
                <div className="text-[11px] text-neutral-400 flex items-center justify-between">
                  <span>Cryptographic Salt: AES-256-GCM Hardware Security Module (HSM)</span>
                  <span className="text-brand-400 font-semibold">SOC2 & HIPAA Compliant</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
