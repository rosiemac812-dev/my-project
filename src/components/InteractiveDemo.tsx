"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import {
  Play,
  CheckCircle2,
  Cpu,
  Zap,
  Terminal,
  Activity,
  ArrowRight,
  Loader2,
  Sparkles,
  Database,
  ShieldCheck,
} from "lucide-react";

export function InteractiveDemo() {
  const [selectedId, setSelectedId] = useState<string>(siteConfig.demoScenarios[0].id);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(3);
  const [executionResult, setExecutionResult] = useState<Record<string, unknown> | null>(
    siteConfig.demoScenarios[0].output
  );
  const [executionStats, setExecutionStats] = useState({
    latency: "140ms",
    tokens: "1,420",
    cost: "$0.0018",
    accuracy: "99.4%",
  });

  const activeScenario =
    siteConfig.demoScenarios.find((s) => s.id === selectedId) || siteConfig.demoScenarios[0];

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setCurrentStepIndex(0);
    setExecutionResult(null);

    // Step-by-step visual animation
    const stepInterval = 250;
    for (let i = 0; i < activeScenario.steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, stepInterval));
      setCurrentStepIndex(i + 1);
    }

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: activeScenario.id }),
      });
      const data = await res.json();
      if (data.scenario) {
        setExecutionResult(data.scenario.output);
        setExecutionStats({
          latency: `${data.stats.totalLatencyMs}ms`,
          tokens: data.stats.tokensProcessed.toLocaleString(),
          cost: data.stats.costEstimate,
          accuracy: data.stats.accuracyConfidence,
        });
      }
    } catch {
      setExecutionResult(activeScenario.output);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden bg-neutral-950/80">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-600/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Live Product Sandbox
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Test the Intelligence Engine Live
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg mt-3">
            Select an enterprise scenario below, trigger the autonomous pipeline, and watch multi-model inference execute with sub-second latency.
          </p>
        </div>

        {/* Scenario selector tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {siteConfig.demoScenarios.map((scenario) => {
            const isSelected = scenario.id === selectedId;
            return (
              <button
                key={scenario.id}
                onClick={() => {
                  setSelectedId(scenario.id);
                  setExecutionResult(scenario.output);
                  setCurrentStepIndex(scenario.steps.length);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border flex items-center gap-2 ${
                  isSelected
                    ? "bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-600/30 scale-102"
                    : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700"
                }`}
              >
                <span>{scenario.title}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {scenario.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sandbox Console Container */}
        <div className="max-w-5xl mx-auto rounded-2xl border border-neutral-800 bg-neutral-900/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Header Bar */}
          <div className="px-5 py-3.5 bg-neutral-950/80 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
              <Terminal className="w-4 h-4 text-brand-400" />
              <span>pipeline_runtime --target=production --mode=autonomous</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRunSimulation}
                disabled={isRunning}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Run Live Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Console Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-neutral-800">
            {/* Left: Input & Steps (7 cols) */}
            <div className="lg:col-span-7 p-6 space-y-6">
              {/* Input Prompt Box */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 block">
                  Simulated Inbound Event Payload
                </label>
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/90 font-mono text-xs text-neutral-200 leading-relaxed">
                  <div className="text-neutral-500 mb-1">// Event Trigger: webhook.received</div>
                  {activeScenario.prompt}
                </div>
              </div>

              {/* Execution Steps */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3 flex items-center justify-between">
                  <span>Pipeline Execution Graph</span>
                  <span className="text-[11px] font-mono text-brand-400">
                    Step {currentStepIndex} of {activeScenario.steps.length}
                  </span>
                </label>

                <div className="space-y-2.5">
                  {activeScenario.steps.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isCurrent = idx === currentStepIndex && isRunning;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                          isCompleted
                            ? "bg-neutral-950/80 border-emerald-500/30 text-neutral-200"
                            : isCurrent
                            ? "bg-brand-950/40 border-brand-500 text-white animate-pulse"
                            : "bg-neutral-950/40 border-neutral-800 text-neutral-500"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : isCurrent ? (
                            <Loader2 className="w-4 h-4 text-brand-400 animate-spin shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-neutral-700 shrink-0 flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </div>
                          )}
                          <span className="font-medium">{step.name}</span>
                        </div>
                        <span className="font-mono text-[11px] text-neutral-400">
                          {isCompleted ? step.latency : "--"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Output Payload & Telemetry (5 cols) */}
            <div className="lg:col-span-5 p-6 bg-neutral-950/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Synthesized Output Payload
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    JSON Object
                  </span>
                </div>

                {isRunning ? (
                  <div className="h-48 rounded-xl border border-neutral-800 bg-neutral-950/80 flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
                    <span className="text-xs text-neutral-400 font-mono">
                      Agents reasoning & verifying constraints...
                    </span>
                  </div>
                ) : executionResult ? (
                  <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 font-mono text-xs overflow-x-auto text-emerald-300 max-h-72">
                    <pre className="whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(executionResult, null, 2)}
                    </pre>
                  </div>
                ) : null}
              </div>

              {/* Execution Metrics Box */}
              <div className="mt-6 pt-4 border-t border-neutral-800/80">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Telemetry Metrics
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                    <div className="text-neutral-500 text-[10px]">TOTAL LATENCY</div>
                    <div className="text-emerald-400 font-bold text-sm mt-0.5">{executionStats.latency}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                    <div className="text-neutral-500 text-[10px]">TOKENS USED</div>
                    <div className="text-white font-bold text-sm mt-0.5">{executionStats.tokens}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                    <div className="text-neutral-500 text-[10px]">ESTIMATED COST</div>
                    <div className="text-brand-400 font-bold text-sm mt-0.5">{executionStats.cost}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                    <div className="text-neutral-500 text-[10px]">CONFIDENCE SCORE</div>
                    <div className="text-purple-400 font-bold text-sm mt-0.5">{executionStats.accuracy}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
