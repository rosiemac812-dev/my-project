"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  LayoutDashboard,
  Workflow,
  Play,
  Terminal,
  Key,
  Settings,
  ArrowLeft,
  Plus,
  Activity,
  CheckCircle2,
  Clock,
  Cpu,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Search,
  Zap,
  Sliders,
  ExternalLink,
  ChevronRight,
  Loader2,
  Database,
  Layers,
  Send,
  AlertCircle,
  Eye,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { formatDate } from "@/lib/utils";

interface WorkflowItem {
  id: number;
  name: string;
  description: string | null;
  category: string;
  nodes_json: string;
  status: string;
  runs_count: number;
  created_at: string;
}

interface PipelineRunItem {
  id: number;
  workflow_id: number;
  workflow_name: string;
  input_payload: string;
  output_payload: string;
  latency_ms: number;
  tokens_used: number;
  cost: string;
  status: string;
  created_at: string;
}

interface ApiKeyItem {
  id: number;
  name: string;
  prefix: string;
  status: string;
  created_at: string;
  last_used_at: string | null;
}

interface AppStats {
  totalWorkflows: number;
  activeWorkflows: number;
  totalRuns: number;
  avgLatency: number;
  totalTokens: number;
  apiKeysCount: number;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "workflows" | "playground" | "logs" | "keys" | "settings"
  >("overview");

  // State collections
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [runs, setRuns] = useState<PipelineRunItem[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [stats, setStats] = useState<AppStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & form state
  const [isNewWorkflowOpen, setIsNewWorkflowOpen] = useState(false);
  const [newWorkflowData, setNewWorkflowData] = useState({
    name: "",
    description: "",
    category: "Customer Support",
    stepsCount: 3,
  });

  // Playground execution state
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(null);
  const [playgroundInput, setPlaygroundInput] = useState(
    "Inbound inquiry: Customer reports payment timeout on AWS cluster worker 4. Requesting immediate verification."
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    steps?: Array<{ nodeName: string; latencyMs: number; status: string }>;
    stats?: { totalLatencyMs: number; tokensUsed: number; costEstimate: string };
    output?: Record<string, unknown>;
  } | null>(null);

  // API Key creation
  const [isNewKeyOpen, setIsNewKeyOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKeySecret, setCreatedKeySecret] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Inspector modal
  const [inspectRun, setInspectRun] = useState<PipelineRunItem | null>(null);

  // Status message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [wfRes, runsRes, keysRes, statsRes] = await Promise.all([
        fetch("/api/app/workflows"),
        fetch("/api/app/runs"),
        fetch("/api/app/apikeys"),
        fetch("/api/app/stats"),
      ]);

      const wfData = await wfRes.json();
      const runsData = await runsRes.json();
      const keysData = await keysRes.json();
      const statsData = await statsRes.json();

      if (wfData.workflows) {
        setWorkflows(wfData.workflows);
        if (!selectedWorkflowId && wfData.workflows.length > 0) {
          setSelectedWorkflowId(wfData.workflows[0].id);
        }
      }
      if (runsData.runs) setRuns(runsData.runs);
      if (keysData.keys) setApiKeys(keysData.keys);
      if (statsData.stats) setStats(statsData.stats);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Workflow Handlers
  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const defaultNodes = [
        { id: "node-1", type: "trigger", name: "Inbound HTTP Webhook", config: {} },
        { id: "node-2", type: "retriever", name: "Enterprise Vector Knowledge", config: {} },
        { id: "node-3", type: "llm", name: "Multi-Model Reasoning", config: { model: "Gemini 2.0 Flash" } },
        { id: "node-4", type: "action", name: "Signed Webhook Dispatch", config: {} },
      ];

      const res = await fetch("/api/app/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newWorkflowData.name,
          description: newWorkflowData.description,
          category: newWorkflowData.category,
          nodes: defaultNodes,
        }),
      });

      const data = await res.json();
      if (data.workflow) {
        setWorkflows([data.workflow, ...workflows]);
        setIsNewWorkflowOpen(false);
        setNewWorkflowData({ name: "", description: "", category: "Customer Support", stepsCount: 3 });
        showToast("Workflow created successfully!");
      }
    } catch {
      showToast("Failed to create workflow");
    }
  };

  const handleToggleWorkflowStatus = async (workflow: WorkflowItem) => {
    const nextStatus = workflow.status === "active" ? "paused" : "active";
    try {
      await fetch("/api/app/workflows", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: workflow.id, status: nextStatus }),
      });
      setWorkflows(workflows.map((w) => (w.id === workflow.id ? { ...w, status: nextStatus } : w)));
      showToast(`Workflow ${nextStatus === "active" ? "resumed" : "paused"}`);
    } catch {
      showToast("Failed to update status");
    }
  };

  const handleDeleteWorkflow = async (id: number) => {
    if (!confirm("Are you sure you want to delete this pipeline?")) return;
    try {
      await fetch(`/api/app/workflows?id=${id}`, { method: "DELETE" });
      setWorkflows(workflows.filter((w) => w.id !== id));
      showToast("Workflow deleted");
    } catch {
      showToast("Failed to delete workflow");
    }
  };

  // Playground Execution
  const handleExecutePlayground = async () => {
    if (!selectedWorkflowId) return;
    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const res = await fetch("/api/app/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: selectedWorkflowId,
          inputPayload: playgroundInput,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setExecutionResult({
          steps: data.steps,
          stats: data.stats,
          output: data.output,
        });

        // Refresh runs & stats
        const [runsRes, statsRes] = await Promise.all([
          fetch("/api/app/runs"),
          fetch("/api/app/stats"),
        ]);
        const runsData = await runsRes.json();
        const statsData = await statsRes.json();
        if (runsData.runs) setRuns(runsData.runs);
        if (statsData.stats) setStats(statsData.stats);

        showToast("Pipeline executed successfully!");
      }
    } catch {
      showToast("Execution failed. Please check input.");
    } finally {
      setIsExecuting(false);
    }
  };

  // API Key Handlers
  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    try {
      const res = await fetch("/api/app/apikeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });

      const data = await res.json();
      if (data.success) {
        setCreatedKeySecret(data.key);
        setApiKeys([data.item, ...apiKeys]);
        setNewKeyName("");
      }
    } catch {
      showToast("Failed to generate key");
    }
  };

  const handleDeleteApiKey = async (id: number) => {
    if (!confirm("Revoke this API key? Applications using it will lose access.")) return;
    try {
      await fetch(`/api/app/apikeys?id=${id}`, { method: "DELETE" });
      setApiKeys(apiKeys.filter((k) => k.id !== id));
      showToast("API key revoked");
    } catch {
      showToast("Failed to revoke key");
    }
  };

  const handleCopySecret = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-xl bg-neutral-900 border border-brand-500 text-white text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-neutral-900/60 border-r border-neutral-800/90 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-neutral-800/80 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-500 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-tight text-white">
                  OrbitX
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Cloud Studio • v2.4
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation links */}
          <nav className="p-3 space-y-1 text-xs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "overview"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-850"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Workspace Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("workflows")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "workflows"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-850"
              }`}
            >
              <div className="flex items-center gap-3">
                <Workflow className="w-4 h-4" />
                <span>Workflow Studio</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                {workflows.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("playground")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "playground"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-850"
              }`}
            >
              <div className="flex items-center gap-3">
                <Play className="w-4 h-4 fill-current" />
                <span>Execution Playground</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <button
              onClick={() => setActiveTab("logs")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "logs"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-850"
              }`}
            >
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4" />
                <span>Pipeline Logs</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                {runs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("keys")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "keys"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-850"
              }`}
            >
              <Key className="w-4 h-4" />
              <span>API Credentials</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === "settings"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-850"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Model Routing Config</span>
            </button>
          </nav>
        </div>

        {/* Sidebar bottom user info */}
        <div className="p-4 border-t border-neutral-800/80 space-y-3">
          <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs">
            <div className="flex items-center justify-between text-neutral-400 mb-1">
              <span className="font-semibold text-white">Production Cluster</span>
              <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
            </div>
            <div className="text-[11px] text-neutral-500">
              Latency Target: <span className="text-brand-400 font-semibold">&lt;50ms</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <Link
              href="/"
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main App Content View */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white capitalize">
              {activeTab === "overview" && "Workspace Dashboard"}
              {activeTab === "workflows" && "Workflow Studio & Pipelines"}
              {activeTab === "playground" && "Execution Sandbox"}
              {activeTab === "logs" && "Real-Time Telemetry & Logs"}
              {activeTab === "keys" && "API Keys & Integrations"}
              {activeTab === "settings" && "Routing Settings & Model Config"}
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
              Pro Tier
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("playground")}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Test Runner</span>
            </button>

            <button
              onClick={() => setIsNewWorkflowOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Pipeline</span>
            </button>

            <button
              onClick={loadData}
              className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </header>

        {/* View Switching */}
        <div className="p-6 md:p-8 space-y-8 flex-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                    <span>Active Pipelines</span>
                    <Workflow className="w-4 h-4 text-brand-400" />
                  </div>
                  <div className="text-3xl font-black text-white">
                    {stats ? stats.activeWorkflows : "--"}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">
                    {stats ? `${stats.totalWorkflows} total configured` : ""}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                    <span>Pipeline Executions</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-white">
                    {stats ? stats.totalRuns.toLocaleString() : "--"}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1">100% success rate</div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                    <span>Average Latency</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-white">
                    {stats ? `${stats.avgLatency}ms` : "--"}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">Sub-second routing SLA</div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                    <span>Tokens Processed</span>
                    <Cpu className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-black text-white">
                    {stats ? stats.totalTokens.toLocaleString() : "--"}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">Across 4 model endpoints</div>
                </div>
              </div>

              {/* Quick Actions & Recent Runs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Quick Execution Runner (7 cols) */}
                <div className="lg:col-span-7 rounded-2xl bg-neutral-900/60 border border-neutral-800 p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-brand-400" />
                        Quick Test Runner
                      </h2>
                      <p className="text-xs text-neutral-400">
                        Trigger any pipeline with sample data to observe latency & response
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("playground")}
                      className="text-xs text-brand-400 hover:underline flex items-center gap-1"
                    >
                      Open Full Sandbox →
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs text-neutral-400 font-semibold block">
                      Target Workflow
                    </label>
                    <select
                      value={selectedWorkflowId || ""}
                      onChange={(e) => setSelectedWorkflowId(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-brand-500"
                    >
                      {workflows.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.category})
                        </option>
                      ))}
                    </select>

                    <label className="text-xs text-neutral-400 font-semibold block pt-1">
                      Input Payload
                    </label>
                    <textarea
                      rows={3}
                      value={playgroundInput}
                      onChange={(e) => setPlaygroundInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white font-mono focus:outline-none focus:border-brand-500"
                    />

                    <button
                      onClick={handleExecutePlayground}
                      disabled={isExecuting}
                      className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-brand-600/30 flex items-center justify-center gap-2 transition-all"
                    >
                      {isExecuting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Executing Agent Nodes...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Dispatch Execution Run</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right: Recent Runs Feed (5 cols) */}
                <div className="lg:col-span-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        Recent Executions
                      </h2>
                      <button
                        onClick={() => setActiveTab("logs")}
                        className="text-xs text-neutral-400 hover:text-white"
                      >
                        View all
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {runs.slice(0, 4).map((run) => (
                        <div
                          key={run.id}
                          onClick={() => setInspectRun(run)}
                          className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-850 hover:border-neutral-700 cursor-pointer transition-all flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-semibold text-white truncate max-w-[160px]">
                              {run.workflow_name}
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                              {run.latency_ms}ms • {run.tokens_used} tokens
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {run.status}
                            </span>
                            <div className="text-[10px] text-neutral-400 mt-1">
                              {formatDate(run.created_at)}
                            </div>
                          </div>
                        </div>
                      ))}
                      {runs.length === 0 && (
                        <div className="text-center py-8 text-neutral-500 text-xs">
                          No execution runs yet. Click "Dispatch Execution Run" to test!
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>Cluster Host: US-East Edge</span>
                    <span className="text-emerald-400 font-mono">SOC2 Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WORKFLOWS STUDIO */}
          {activeTab === "workflows" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white">Active Autonomous Pipelines</h2>
                  <p className="text-xs text-neutral-400">
                    Configure multi-agent decision chains, data retrieval sources, and webhook delivery targets.
                  </p>
                </div>

                <button
                  onClick={() => setIsNewWorkflowOpen(true)}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30 flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Pipeline</span>
                </button>
              </div>

              {/* Workflows Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {workflows.map((wf) => {
                  let nodes: Array<{ name: string; type: string }> = [];
                  try {
                    nodes = JSON.parse(wf.nodes_json);
                  } catch {
                    nodes = [];
                  }

                  return (
                    <div
                      key={wf.id}
                      className="rounded-2xl p-6 bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-5"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                            {wf.category}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleWorkflowStatus(wf)}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-colors ${
                                wf.status === "active"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                              }`}
                            >
                              {wf.status.toUpperCase()}
                            </button>

                            <button
                              onClick={() => handleDeleteWorkflow(wf.id)}
                              className="p-1 rounded-md text-neutral-500 hover:text-red-400 transition-colors"
                              title="Delete pipeline"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-white mb-1.5">{wf.name}</h3>
                        <p className="text-xs text-neutral-400 leading-relaxed min-h-[34px]">
                          {wf.description || "No description provided."}
                        </p>

                        {/* Pipeline Node Flow representation */}
                        <div className="mt-4 pt-3 border-t border-neutral-850 space-y-2">
                          <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                            Chained Agent Nodes ({nodes.length}):
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {nodes.map((n, idx) => (
                              <div
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 font-mono"
                              >
                                {n.type === "trigger" && <Zap className="w-3 h-3 text-amber-400" />}
                                {n.type === "retriever" && <Database className="w-3 h-3 text-sky-400" />}
                                {n.type === "llm" && <Cpu className="w-3 h-3 text-brand-400" />}
                                {n.type === "action" && <Send className="w-3 h-3 text-purple-400" />}
                                <span>{n.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                        <span className="text-neutral-400 font-mono">
                          Runs: <strong className="text-white">{wf.runs_count}</strong>
                        </span>

                        <button
                          onClick={() => {
                            setSelectedWorkflowId(wf.id);
                            setActiveTab("playground");
                          }}
                          className="px-3 py-1.5 rounded-lg bg-brand-600/20 text-brand-300 hover:bg-brand-600/30 border border-brand-500/30 flex items-center gap-1 transition-all"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Test in Sandbox</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: EXECUTION PLAYGROUND */}
          {activeTab === "playground" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Live Execution Sandbox</h2>
                  <p className="text-xs text-neutral-400">
                    Simulate real-time multi-agent execution, check schema outputs, and inspect latency waterfalls.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Select Workflow:</span>
                  <select
                    value={selectedWorkflowId || ""}
                    onChange={(e) => setSelectedWorkflowId(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    {workflows.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Console Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Input Payload (5 cols) */}
                <div className="lg:col-span-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Input Event / Prompt
                    </label>
                    <span className="text-[10px] font-mono text-brand-400">JSON or Raw Text</span>
                  </div>

                  <textarea
                    rows={8}
                    value={playgroundInput}
                    onChange={(e) => setPlaygroundInput(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 font-mono leading-relaxed focus:outline-none focus:border-brand-500"
                    placeholder="Enter ticket details, customer request, or API payload..."
                  />

                  <button
                    onClick={handleExecutePlayground}
                    disabled={isExecuting || !selectedWorkflowId}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
                  >
                    {isExecuting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Streaming Multi-Agent Nodes...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Execute Live Pipeline</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-[11px] text-neutral-400 space-y-1">
                    <div>• Automatically records run to SQLite database</div>
                    <div>• Simulates model routing with sub-50ms latency</div>
                  </div>
                </div>

                {/* Right: Results & Telemetry (7 cols) */}
                <div className="lg:col-span-7 rounded-2xl bg-neutral-900/70 border border-neutral-800 p-6 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                        Execution Output & Telemetry
                      </span>
                      {executionResult?.stats && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Total: {executionResult.stats.totalLatencyMs}ms
                        </span>
                      )}
                    </div>

                    {isExecuting ? (
                      <div className="py-20 text-center space-y-3">
                        <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
                        <div className="text-xs font-mono text-neutral-400">
                          Resolving constraints & querying vector index...
                        </div>
                      </div>
                    ) : executionResult ? (
                      <div className="space-y-4">
                        {/* Step Latency Waterfall */}
                        {executionResult.steps && (
                          <div className="space-y-2">
                            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                              Node Execution Waterfall:
                            </div>
                            <div className="space-y-1.5">
                              {executionResult.steps.map((step, idx) => (
                                <div
                                  key={idx}
                                  className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="font-medium text-neutral-200">
                                      {step.nodeName}
                                    </span>
                                  </div>
                                  <span className="font-mono text-brand-400 font-semibold">
                                    {step.latencyMs}ms
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Formatted Output Payload */}
                        <div>
                          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                            Synthesized Output JSON:
                          </div>
                          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-60">
                            <pre className="whitespace-pre-wrap leading-relaxed">
                              {JSON.stringify(executionResult.output, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="py-20 text-center text-neutral-500 text-xs font-mono">
                        Ready for execution. Click "Execute Live Pipeline" on the left to start.
                      </div>
                    )}
                  </div>

                  {executionResult?.stats && (
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-800/80 text-xs font-mono">
                      <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                        <div className="text-[10px] text-neutral-500">TOKENS</div>
                        <div className="text-white font-bold">{executionResult.stats.tokensUsed}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                        <div className="text-[10px] text-neutral-500">EST. COST</div>
                        <div className="text-brand-400 font-bold">{executionResult.stats.costEstimate}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                        <div className="text-[10px] text-neutral-500">CACHE HIT</div>
                        <div className="text-emerald-400 font-bold">100% HIT</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PIPELINE LOGS */}
          {activeTab === "logs" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white">Pipeline Execution Telemetry</h2>
                  <p className="text-xs text-neutral-400">
                    Comprehensive audit trail of all autonomous runs, latency records, and cost metrics.
                  </p>
                </div>

                <div className="text-xs font-mono text-neutral-400">
                  Total Logged Runs: <strong className="text-white">{runs.length}</strong>
                </div>
              </div>

              {/* Logs Table */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider text-[11px] border-b border-neutral-800">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Run ID</th>
                        <th className="py-3.5 px-4 font-semibold">Pipeline Name</th>
                        <th className="py-3.5 px-4 font-semibold">Latency</th>
                        <th className="py-3.5 px-4 font-semibold">Tokens</th>
                        <th className="py-3.5 px-4 font-semibold">Cost</th>
                        <th className="py-3.5 px-4 font-semibold">Status</th>
                        <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80">
                      {runs.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-12 text-neutral-500">
                            No execution logs found. Run a pipeline from the Overview or Sandbox!
                          </td>
                        </tr>
                      ) : (
                        runs.map((r) => (
                          <tr key={r.id} className="hover:bg-neutral-800/40 transition-colors">
                            <td className="py-3.5 px-4 font-mono text-neutral-400">
                              #{r.id}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-white">
                              {r.workflow_name}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-brand-400 font-semibold">
                              {r.latency_ms}ms
                            </td>
                            <td className="py-3.5 px-4 font-mono text-neutral-300">
                              {r.tokens_used.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-neutral-400">
                              {r.cost}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {r.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-neutral-400 whitespace-nowrap">
                              {formatDate(r.created_at)}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setInspectRun(r)}
                                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                                title="Inspect payload"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: API KEYS */}
          {activeTab === "keys" && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white">API Keys & Authentication</h2>
                  <p className="text-xs text-neutral-400">
                    Authenticate requests from your backend, CI/CD runners, and edge dispatchers.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsNewKeyOpen(true);
                    setCreatedKeySecret(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30 flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Generate New Key</span>
                </button>
              </div>

              {/* Keys list */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider text-[11px] border-b border-neutral-800">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Name</th>
                        <th className="py-3.5 px-4 font-semibold">Prefix</th>
                        <th className="py-3.5 px-4 font-semibold">Status</th>
                        <th className="py-3.5 px-4 font-semibold">Created</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80">
                      {apiKeys.map((k) => (
                        <tr key={k.id} className="hover:bg-neutral-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white">{k.name}</td>
                          <td className="py-3.5 px-4 font-mono text-neutral-300">
                            {k.prefix}••••••••••••
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {k.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-neutral-400">
                            {formatDate(k.created_at)}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleDeleteApiKey(k.id)}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                              title="Revoke Key"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Code Integration snippet */}
              <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Integration Example (TypeScript SDK)
                </div>
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-850 font-mono text-xs text-neutral-300 overflow-x-auto">
                  <pre>{`import { OrbitX } from "@orbitx/sdk";

const client = new OrbitX({ apiKey: process.env.ORBITX_API_KEY });
const result = await client.workflows.dispatch({
  workflowId: "support-triage",
  payload: { customerTicketId: "4819", priority: "urgent" }
});`}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === "settings" && (
            <div className="max-w-3xl space-y-6 animate-in fade-in">
              <div>
                <h2 className="text-base font-bold text-white">Model Routing & Environment</h2>
                <p className="text-xs text-neutral-400">
                  Control inference fallback rules, strict latency budgets, and security gates.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Inference Providers
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                      <div>
                        <div className="font-semibold text-white">Google Gemini 2.0 Flash / Pro</div>
                        <div className="text-[11px] text-neutral-400">Primary fast path & high throughput</div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ACTIVE • DEFAULT
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                      <div>
                        <div className="font-semibold text-white">Anthropic Claude 3.5 Sonnet</div>
                        <div className="text-[11px] text-neutral-400">Complex multi-hop reasoning & code audit</div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                        ENABLED
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                      <div>
                        <div className="font-semibold text-white">OpenAI GPT-4o</div>
                        <div className="text-[11px] text-neutral-400">Structured financial synthesis</div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                        ENABLED
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Security & Compliance
                  </div>
                  <div className="text-xs text-neutral-400 leading-relaxed">
                    Automated PII scrubbing is enforced on all prompt payloads. Data is encrypted using AES-256-GCM.
                  </div>
                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                      SOC2 Type II Enforced
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/30 font-semibold">
                      Zero Public Model Retention
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: New Workflow */}
      {isNewWorkflowOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Create Autonomous Pipeline</h3>
            <form onSubmit={handleCreateWorkflow} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Pipeline Name</label>
                <input
                  type="text"
                  required
                  value={newWorkflowData.name}
                  onChange={(e) => setNewWorkflowData({ ...newWorkflowData, name: e.target.value })}
                  placeholder="e.g. Inbound Dispute Analyzer"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Category</label>
                <select
                  value={newWorkflowData.category}
                  onChange={(e) => setNewWorkflowData({ ...newWorkflowData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Customer Support">Customer Support</option>
                  <option value="Revenue Ops">Revenue Ops</option>
                  <option value="Finance & Legal">Finance & Legal</option>
                  <option value="DevSecOps">DevSecOps</option>
                  <option value="Custom">Custom Automation</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newWorkflowData.description}
                  onChange={(e) => setNewWorkflowData({ ...newWorkflowData, description: e.target.value })}
                  placeholder="Briefly describe what this agentic chain handles..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewWorkflowOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-colors"
                >
                  Create Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Generate API Key */}
      {isNewKeyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Generate Secret API Key</h3>

            {createdKeySecret ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200">
                  Key generated! Copy this key now as you won't be able to see it again.
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-brand-300 flex items-center justify-between">
                  <span className="truncate mr-2">{createdKeySecret}</span>
                  <button
                    onClick={() => handleCopySecret(createdKeySecret)}
                    className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white transition-colors shrink-0"
                    title="Copy key"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  onClick={() => setIsNewKeyOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateApiKey} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Key Name / Identifier</label>
                  <input
                    type="text"
                    required
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g. Production Ingestion Service"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewKeyOpen(false)}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-colors"
                  >
                    Generate Key
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Run Inspector */}
      {inspectRun && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Execution #{inspectRun.id} Details</h3>
                <div className="text-xs text-neutral-400 font-mono">
                  {inspectRun.workflow_name} • {inspectRun.latency_ms}ms • {inspectRun.cost}
                </div>
              </div>
              <button
                onClick={() => setInspectRun(null)}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="font-semibold text-neutral-400 mb-1">Input Trigger Payload:</div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-neutral-300 text-[11px] whitespace-pre-wrap">
                  {inspectRun.input_payload}
                </div>
              </div>

              <div>
                <div className="font-semibold text-neutral-400 mb-1">Synthesized Output:</div>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-emerald-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                  {inspectRun.output_payload}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
