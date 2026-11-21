"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Mail,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  Database,
  Layers,
  Inbox,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface WaitlistEntry {
  id: number;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  team_size: string | null;
  use_case: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  interest: string | null;
  status: string;
  created_at: string;
}

interface Metrics {
  waitlistCount: number;
  contactsCount: number;
  unreadContacts: number;
  subscribersCount: number;
  teamSizeBreakdown: { team_size: string; count: number }[];
  statusBreakdown: { status: string; count: number }[];
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"waitlist" | "contacts">("waitlist");
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [leadsRes, contactsRes, statsRes] = await Promise.all([
        fetch(`/api/admin/leads?type=waitlist&search=${encodeURIComponent(search)}&status=${statusFilter}`),
        fetch("/api/admin/leads?type=contacts"),
        fetch("/api/admin/stats"),
      ]);

      const leadsData = await leadsRes.json();
      const contactsData = await contactsRes.json();
      const statsData = await statsRes.json();

      if (leadsData.data) setWaitlist(leadsData.data);
      if (contactsData.data) setContacts(contactsData.data);
      if (statsData.metrics) setMetrics(statsData.metrics);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter]);

  const handleStatusChange = async (id: number, newStatus: string, type: "waitlist" | "contacts") => {
    try {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, type }),
      });

      if (type === "waitlist") {
        setWaitlist((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      } else {
        setContacts((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
      setActionMessage("Status updated successfully");
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number, type: "waitlist" | "contacts") => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      await fetch(`/api/admin/leads?id=${id}&type=${type}`, {
        method: "DELETE",
      });

      if (type === "waitlist") {
        setWaitlist((prev) => prev.filter((item) => item.id !== id));
      } else {
        setContacts((prev) => prev.filter((item) => item.id !== id));
      }
      setActionMessage("Record removed");
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeedData = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/admin/seed", { method: "POST" });
      await fetchData();
      setActionMessage("Demo sample data seeded into SQLite database!");
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-20">
      {/* Top Navbar */}
      <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title="Return to Landing Page"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                NovaPulse Admin Hub
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono">
                  Full Stack
                </span>
              </h1>
              <p className="text-xs text-neutral-400">
                Live SQLite Lead Management, Conversion Metrics & Export
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSeedData}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 transition-all flex items-center gap-1.5"
              title="Load demo leads and inquiries"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Seed Demo Leads</span>
            </button>

            <a
              href={`/api/admin/export?type=${activeTab}`}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </a>

            <button
              onClick={() => fetchData()}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {actionMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Waitlist Signups</span>
              <Users className="w-4 h-4 text-brand-400" />
            </div>
            <div className="text-3xl font-black text-white">
              {metrics ? metrics.waitlistCount.toLocaleString() : "--"}
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">Total prospective users</div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Sales Inquiries</span>
              <Mail className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">
              {metrics ? metrics.contactsCount.toLocaleString() : "--"}
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">
              {metrics?.unreadContacts || 0} unread messages
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Newsletter Subscribers</span>
              <Inbox className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-white">
              {metrics ? metrics.subscribersCount.toLocaleString() : "--"}
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">Changelog readers</div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Database Engine</span>
              <Database className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">SQLite 3 (Built-in)</div>
            <div className="text-[11px] text-emerald-400 mt-1">Zero config • ACID synced</div>
          </div>
        </div>

        {/* Tab Controls & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          {/* Tab buttons */}
          <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-neutral-800 w-fit">
            <button
              onClick={() => setActiveTab("waitlist")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "waitlist"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Waitlist Leads ({waitlist.length})
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "contacts"
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Contact Messages ({contacts.length})
            </button>
          </div>

          {/* Search & Status filter */}
          {activeTab === "waitlist" && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter name, email, company..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
              </select>
            </div>
          )}
        </div>

        {/* Content Table */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden shadow-xl">
          {activeTab === "waitlist" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider text-[11px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">User</th>
                    <th className="py-3.5 px-4 font-semibold">Company & Role</th>
                    <th className="py-3.5 px-4 font-semibold">Team Size</th>
                    <th className="py-3.5 px-4 font-semibold">Use Case</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold">Signed Up</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {waitlist.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-neutral-500">
                        No waitlist leads found. Click "Seed Demo Leads" above to populate sample data!
                      </td>
                    </tr>
                  ) : (
                    waitlist.map((lead) => (
                      <tr key={lead.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{lead.name}</div>
                          <div className="text-neutral-400 font-mono text-[11px]">{lead.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-neutral-200">{lead.company || "—"}</div>
                          <div className="text-neutral-500 text-[11px]">{lead.role || "—"}</div>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-300 font-mono">
                          {lead.team_size || "—"}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs text-neutral-300 truncate" title={lead.use_case || ""}>
                          {lead.use_case || "—"}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value, "waitlist")}
                            className="px-2 py-1 rounded-md bg-neutral-950 border border-neutral-800 text-[11px] text-brand-300 focus:outline-none"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="converted">Converted</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-400 whitespace-nowrap">
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDelete(lead.id, "waitlist")}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950/80 text-neutral-400 uppercase tracking-wider text-[11px] border-b border-neutral-800">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">From</th>
                    <th className="py-3.5 px-4 font-semibold">Subject & Interest</th>
                    <th className="py-3.5 px-4 font-semibold">Message</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold">Date</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-neutral-500">
                        No messages received yet. Submit an inquiry through the Contact section to test!
                      </td>
                    </tr>
                  ) : (
                    contacts.map((c) => (
                      <tr key={c.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{c.name}</div>
                          <div className="text-neutral-400 font-mono text-[11px]">{c.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-neutral-200">{c.subject}</div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                            {c.interest}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-sm text-neutral-300">
                          <div className="line-clamp-2">{c.message}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={c.status}
                            onChange={(e) => handleStatusChange(c.id, e.target.value, "contacts")}
                            className="px-2 py-1 rounded-md bg-neutral-950 border border-neutral-800 text-[11px] text-brand-300 focus:outline-none"
                          >
                            <option value="unread">Unread</option>
                            <option value="in_progress">In Progress</option>
                            <option value="replied">Replied</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-400 whitespace-nowrap">
                          {formatDate(c.created_at)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDelete(c.id, "contacts")}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                            title="Delete inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
