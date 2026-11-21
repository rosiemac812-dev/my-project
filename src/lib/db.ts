import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, "landing.db");
  const db = new DatabaseSync(dbPath);

  // Initialize schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      company TEXT,
      role TEXT,
      team_size TEXT,
      use_case TEXT,
      status TEXT DEFAULT 'new',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      interest TEXT,
      status TEXT DEFAULT 'unread',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      source TEXT DEFAULT 'landing',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS crypto_portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      balance REAL NOT NULL,
      avg_buy_price REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS crypto_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pair TEXT NOT NULL,
      side TEXT NOT NULL,
      order_type TEXT NOT NULL,
      price REAL NOT NULL,
      amount REAL NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'filled',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS crypto_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tx_hash TEXT NOT NULL,
      type TEXT NOT NULL,
      from_asset TEXT NOT NULL,
      to_asset TEXT NOT NULL,
      amount REAL NOT NULL,
      value_usd REAL NOT NULL,
      status TEXT DEFAULT 'confirmed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS crypto_stakes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL,
      amount REAL NOT NULL,
      duration_days INTEGER NOT NULL,
      apy REAL NOT NULL,
      rewards_earned REAL DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS workflows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'Custom',
      nodes_json TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      runs_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pipeline_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workflow_id INTEGER,
      workflow_name TEXT NOT NULL,
      input_payload TEXT NOT NULL,
      output_payload TEXT NOT NULL,
      latency_ms INTEGER NOT NULL,
      tokens_used INTEGER NOT NULL,
      cost TEXT NOT NULL,
      status TEXT DEFAULT 'success',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS api_keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      prefix TEXT NOT NULL,
      key_value TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_used_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      user_agent TEXT,
      ip TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  dbInstance = db;
  return dbInstance;
}

export interface WaitlistEntry {
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

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  interest: string | null;
  status: string;
  created_at: string;
}

// Waitlist CRUD
export function addWaitlistEntry(data: {
  name: string;
  email: string;
  company?: string;
  role?: string;
  team_size?: string;
  use_case?: string;
}): { success: boolean; position: number; alreadyExists?: boolean } {
  const db = getDb();

  // Check if email already exists
  const existing = db
    .prepare("SELECT id FROM waitlist WHERE LOWER(email) = LOWER(?)")
    .get(data.email) as { id: number } | undefined;

  if (existing) {
    const countRow = db.prepare("SELECT COUNT(*) as count FROM waitlist WHERE id <= ?").get(existing.id) as { count: number };
    return { success: true, position: countRow.count, alreadyExists: true };
  }

  const insert = db.prepare(`
    INSERT INTO waitlist (name, email, company, role, team_size, use_case)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const info = insert.run(
    data.name.trim(),
    data.email.trim().toLowerCase(),
    data.company?.trim() || null,
    data.role?.trim() || null,
    data.team_size || null,
    data.use_case?.trim() || null
  );

  const total = db.prepare("SELECT COUNT(*) as count FROM waitlist").get() as { count: number };
  return { success: true, position: total.count };
}

export function getWaitlistEntries(search?: string, status?: string): WaitlistEntry[] {
  const db = getDb();
  let query = "SELECT * FROM waitlist WHERE 1=1";
  const params: (string | number)[] = [];

  if (search && search.trim() !== "") {
    query += " AND (name LIKE ? OR email LIKE ? OR company LIKE ?)";
    const term = `%${search.trim()}%`;
    params.push(term, term, term);
  }

  if (status && status !== "all") {
    query += " AND status = ?";
    params.push(status);
  }

  query += " ORDER BY id DESC";

  return db.prepare(query).all(...params) as unknown as WaitlistEntry[];
}

export function updateWaitlistStatus(id: number, status: string, notes?: string): boolean {
  const db = getDb();
  if (notes !== undefined) {
    const stmt = db.prepare("UPDATE waitlist SET status = ?, notes = ? WHERE id = ?");
    stmt.run(status, notes, id);
  } else {
    const stmt = db.prepare("UPDATE waitlist SET status = ? WHERE id = ?");
    stmt.run(status, id);
  }
  return true;
}

export function deleteWaitlistEntry(id: number): boolean {
  const db = getDb();
  const stmt = db.prepare("DELETE FROM waitlist WHERE id = ?");
  stmt.run(id);
  return true;
}

export function getWaitlistCount(): number {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) as count FROM waitlist").get() as { count: number };
  return row?.count || 0;
}

// Contacts CRUD
export function addContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  interest?: string;
}): { success: boolean; id: number } {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO contacts (name, email, subject, message, interest)
    VALUES (?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    data.name.trim(),
    data.email.trim().toLowerCase(),
    data.subject.trim(),
    data.message.trim(),
    data.interest || "general"
  );

  return { success: true, id: Number(info.lastInsertRowid) };
}

export function getContactMessages(): ContactMessage[] {
  const db = getDb();
  return db.prepare("SELECT * FROM contacts ORDER BY id DESC").all() as unknown as ContactMessage[];
}

export function updateContactStatus(id: number, status: string): boolean {
  const db = getDb();
  db.prepare("UPDATE contacts SET status = ? WHERE id = ?").run(status, id);
  return true;
}

export function deleteContactMessage(id: number): boolean {
  const db = getDb();
  db.prepare("DELETE FROM contacts WHERE id = ?").run(id);
  return true;
}

// Newsletter
export function addSubscriber(email: string, source = "footer"): { success: boolean; alreadyExists?: boolean } {
  const db = getDb();
  const cleanEmail = email.trim().toLowerCase();

  const existing = db.prepare("SELECT id FROM subscribers WHERE email = ?").get(cleanEmail);
  if (existing) {
    return { success: true, alreadyExists: true };
  }

  db.prepare("INSERT INTO subscribers (email, source) VALUES (?, ?)").run(cleanEmail, source);
  return { success: true };
}

export function getSubscribersCount(): number {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) as count FROM subscribers").get() as { count: number };
  return row?.count || 0;
}

// Dashboard Stats
export function getDashboardMetrics() {
  const db = getDb();
  const waitlistCount = (db.prepare("SELECT COUNT(*) as c FROM waitlist").get() as { c: number }).c;
  const contactsCount = (db.prepare("SELECT COUNT(*) as c FROM contacts").get() as { c: number }).c;
  const unreadContacts = (db.prepare("SELECT COUNT(*) as c FROM contacts WHERE status = 'unread'").get() as { c: number }).c;
  const subscribersCount = (db.prepare("SELECT COUNT(*) as c FROM subscribers").get() as { c: number }).c;

  // Breakdown by team size
  const teamSizeBreakdown = db
    .prepare("SELECT COALESCE(team_size, 'Unspecified') as team_size, COUNT(*) as count FROM waitlist GROUP BY team_size")
    .all() as { team_size: string; count: number }[];

  // Breakdown by lead status
  const statusBreakdown = db
    .prepare("SELECT status, COUNT(*) as count FROM waitlist GROUP BY status")
    .all() as { status: string; count: number }[];

  return {
    waitlistCount,
    contactsCount,
    unreadContacts,
    subscribersCount,
    teamSizeBreakdown,
    statusBreakdown,
  };
}

// Demo Data Seeder for testing / demoing the Admin panel
export function seedDemoData() {
  const db = getDb();

  const sampleWaitlist = [
    { name: "Alex Thorne", email: "alex.thorne@strataai.com", company: "Strata AI", role: "CTO", team_size: "51-200", use_case: "Multi-agent autonomous support triage & routing" },
    { name: "Elena Ramos", email: "elena@vortexscale.io", company: "Vortex Scale", role: "Head of Engineering", team_size: "201-500", use_case: "Financial OCR and SEC document intelligence pipeline" },
    { name: "Marcus Brody", email: "mbrody@hyperflow.dev", company: "Hyperflow", role: "Staff Architect", team_size: "11-50", use_case: "Low-latency sub-50ms model gateway fallback" },
    { name: "Sophia Lin", email: "sophia@nexushealth.org", company: "Nexus Health", role: "VP of Product", team_size: "500+", use_case: "HIPAA-compliant patient onboarding triage" },
    { name: "David Kim", email: "dkim@finbridge.capital", company: "FinBridge Capital", role: "Managing Director", team_size: "51-200", use_case: "Portfolio risk alerts and automated market briefs" },
  ];

  for (const entry of sampleWaitlist) {
    try {
      db.prepare(`
        INSERT OR IGNORE INTO waitlist (name, email, company, role, team_size, use_case, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(entry.name, entry.email, entry.company, entry.role, entry.team_size, entry.use_case, "contacted");
    } catch {
      // ignore duplicates
    }
  }

  const sampleContacts = [
    { name: "Jordan Ellis", email: "jordan@cyberpoint.tech", subject: "Custom VPC deployment inquiry", message: "We are looking to deploy OrbitX in our AWS GovCloud environment. Could we schedule a technical walkthrough with a solutions architect this Thursday?", interest: "Enterprise Cluster" },
    { name: "Chloe Dupont", email: "cdupont@lumina.fr", subject: "Integration with proprietary fine-tuned models", message: "Hi there! Does OrbitX support self-hosted vLLM inference endpoints with custom bearer token auth?", interest: "Growth Pro" },
  ];

  for (const contact of sampleContacts) {
    try {
      db.prepare(`
        INSERT INTO contacts (name, email, subject, message, interest)
        VALUES (?, ?, ?, ?, ?)
      `).run(contact.name, contact.email, contact.subject, contact.message, contact.interest);
    } catch {
      // ignore
    }
  }

  const sampleSubscribers = ["subscriber1@techdigest.io", "founder@accelerator.co", "dev@matrixcloud.net"];
  for (const s of sampleSubscribers) {
    try {
      db.prepare("INSERT OR IGNORE INTO subscribers (email) VALUES (?)").run(s);
    } catch {
      // ignore
    }
  }

  return { seeded: true };
}

// ==========================================
// Full-Stack App: Workflows, Runs & API Keys
// ==========================================

export interface WorkflowNode {
  id: string;
  type: "trigger" | "retriever" | "llm" | "action";
  name: string;
  config: Record<string, unknown>;
}

export interface Workflow {
  id: number;
  name: string;
  description: string | null;
  category: string;
  nodes_json: string;
  status: string;
  runs_count: number;
  created_at: string;
  updated_at: string;
}

export interface PipelineRun {
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

export interface ApiKeyItem {
  id: number;
  name: string;
  prefix: string;
  key_value?: string;
  status: string;
  created_at: string;
  last_used_at: string | null;
}

export function ensureDefaultWorkflows() {
  const db = getDb();
  const countRow = db.prepare("SELECT COUNT(*) as count FROM workflows").get() as { count: number };
  if (countRow.count > 0) return;

  const defaultWorkflows = [
    {
      name: "Autonomous Support Triage",
      description: "Classifies incoming customer tickets, verifies system health, queries knowledge base and drafts resolution.",
      category: "Customer Support",
      nodes: [
        { id: "node-1", type: "trigger", name: "Inbound Webhook (Zendesk / Slack)", config: { event: "ticket.created" } },
        { id: "node-2", type: "retriever", name: "Vector Index Search", config: { source: "Docs & Incident Reports", topK: 5 } },
        { id: "node-3", type: "llm", name: "Reasoning & Policy Synthesis", config: { model: "Gemini 2.0 Flash", temperature: 0.2 } },
        { id: "node-4", type: "action", name: "Auto-Dispatch Response & Tag CRM", config: { channel: "api.zendesk.com/tickets" } },
      ],
    },
    {
      name: "Sales Lead Enrichment & Scoring",
      description: "Enriches inbound lead emails with company firmographics, calculates ICP fit score and routes to CRM.",
      category: "Revenue Ops",
      nodes: [
        { id: "node-1", type: "trigger", name: "New Lead Capture Form", config: { trigger: "form.submitted" } },
        { id: "node-2", type: "retriever", name: "Clearbit & LinkedIn Firmographics", config: { fields: ["headcount", "tech_stack", "funding"] } },
        { id: "node-3", type: "llm", name: "ICP Propensity Scoring Model", config: { model: "Claude 3.5 Sonnet", threshold: 85 } },
        { id: "node-4", type: "action", name: "Hubspot Sync & Slack Notification", config: { alertChannel: "#sales-tier-1-leads" } },
      ],
    },
    {
      name: "Financial Filing Risk Synthesizer",
      description: "Extracts balance sheet metrics from SEC 10-Q filings, compares YoY margin delta, and flags compliance risks.",
      category: "Finance & Legal",
      nodes: [
        { id: "node-1", type: "trigger", name: "Document Upload Event", config: { mime: "application/pdf" } },
        { id: "node-2", type: "retriever", name: "Table OCR & Section Chunking", config: { parser: "structured_financial_v2" } },
        { id: "node-3", type: "llm", name: "Multi-Step Ratio & Risk Analysis", config: { model: "GPT-4o", strictJson: true } },
        { id: "node-4", type: "action", name: "Executive Briefing PDF Generation", config: { output: "s3://reports/financial-brief.pdf" } },
      ],
    },
    {
      name: "Code Security & Vulnerability Auditor",
      description: "Scans pull request diffs for exposed secrets, OWASP vulnerabilities, and SQL injection flaws.",
      category: "DevSecOps",
      nodes: [
        { id: "node-1", type: "trigger", name: "GitHub Pull Request Opened", config: { branch: "main" } },
        { id: "node-2", type: "retriever", name: "AST Parser & Secret Pattern Matching", config: { ruleset: "OWASP_Top_10" } },
        { id: "node-3", type: "llm", name: "Exploitability Verification Engine", config: { model: "Claude 3.5 Sonnet" } },
        { id: "node-4", type: "action", name: "Post Inline Review Comments", config: { githubToken: "auto_managed" } },
      ],
    },
  ];

  for (const w of defaultWorkflows) {
    db.prepare(`
      INSERT INTO workflows (name, description, category, nodes_json, status, runs_count)
      VALUES (?, ?, ?, ?, 'active', 0)
    `).run(w.name, w.description, w.category, JSON.stringify(w.nodes));
  }

  // Also create a sample API key
  db.prepare(`
    INSERT INTO api_keys (name, prefix, key_value, status)
    VALUES (?, ?, ?, 'active')
  `).run("Default Production Key", "np_live_948a", "np_live_948afbc28e48231908d17203e");
}

export function getWorkflows(): Workflow[] {
  const db = getDb();
  ensureDefaultWorkflows();
  return db.prepare("SELECT * FROM workflows ORDER BY id DESC").all() as unknown as Workflow[];
}

export function getWorkflowById(id: number): Workflow | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM workflows WHERE id = ?").get(id) as unknown as Workflow | undefined;
}

export function createWorkflow(data: {
  name: string;
  description?: string;
  category?: string;
  nodes: WorkflowNode[];
}): Workflow {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO workflows (name, description, category, nodes_json, status)
    VALUES (?, ?, ?, ?, 'active')
  `);
  const info = stmt.run(
    data.name.trim(),
    data.description?.trim() || null,
    data.category || "Custom",
    JSON.stringify(data.nodes)
  );

  return getWorkflowById(Number(info.lastInsertRowid))!;
}

export function updateWorkflow(
  id: number,
  data: { name?: string; description?: string; category?: string; status?: string; nodes?: WorkflowNode[] }
): boolean {
  const db = getDb();
  const existing = getWorkflowById(id);
  if (!existing) return false;

  const updatedName = data.name !== undefined ? data.name : existing.name;
  const updatedDesc = data.description !== undefined ? data.description : existing.description;
  const updatedCat = data.category !== undefined ? data.category : existing.category;
  const updatedStatus = data.status !== undefined ? data.status : existing.status;
  const updatedNodes = data.nodes !== undefined ? JSON.stringify(data.nodes) : existing.nodes_json;

  db.prepare(`
    UPDATE workflows
    SET name = ?, description = ?, category = ?, status = ?, nodes_json = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(updatedName, updatedDesc, updatedCat, updatedStatus, updatedNodes, id);

  return true;
}

export function deleteWorkflow(id: number): boolean {
  const db = getDb();
  db.prepare("DELETE FROM workflows WHERE id = ?").run(id);
  return true;
}

export function recordPipelineRun(data: {
  workflow_id: number;
  workflow_name: string;
  input_payload: string;
  output_payload: string;
  latency_ms: number;
  tokens_used: number;
  cost: string;
  status?: string;
}): PipelineRun {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO pipeline_runs (workflow_id, workflow_name, input_payload, output_payload, latency_ms, tokens_used, cost, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    data.workflow_id,
    data.workflow_name,
    data.input_payload,
    data.output_payload,
    data.latency_ms,
    data.tokens_used,
    data.cost,
    data.status || "success"
  );

  // Increment workflow run count
  db.prepare("UPDATE workflows SET runs_count = runs_count + 1 WHERE id = ?").run(data.workflow_id);

  return db.prepare("SELECT * FROM pipeline_runs WHERE id = ?").get(info.lastInsertRowid) as unknown as PipelineRun;
}

export function getPipelineRuns(limit = 50, workflowId?: number): PipelineRun[] {
  const db = getDb();
  if (workflowId) {
    return db
      .prepare("SELECT * FROM pipeline_runs WHERE workflow_id = ? ORDER BY id DESC LIMIT ?")
      .all(workflowId, limit) as unknown as PipelineRun[];
  }
  return db
    .prepare("SELECT * FROM pipeline_runs ORDER BY id DESC LIMIT ?")
    .all(limit) as unknown as PipelineRun[];
}

export function getApiKeys(): ApiKeyItem[] {
  const db = getDb();
  ensureDefaultWorkflows();
  return db
    .prepare("SELECT id, name, prefix, status, created_at, last_used_at FROM api_keys ORDER BY id DESC")
    .all() as unknown as ApiKeyItem[];
}

export function createApiKey(name: string): { key: string; item: ApiKeyItem } {
  const db = getDb();
  const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
  const fullKey = `np_live_${randomHex}`;
  const prefix = fullKey.substring(0, 12);

  const stmt = db.prepare(`
    INSERT INTO api_keys (name, prefix, key_value, status)
    VALUES (?, ?, ?, 'active')
  `);
  const info = stmt.run(name.trim(), prefix, fullKey);

  const item = db
    .prepare("SELECT id, name, prefix, status, created_at, last_used_at FROM api_keys WHERE id = ?")
    .get(info.lastInsertRowid) as unknown as ApiKeyItem;

  return { key: fullKey, item };
}

export function deleteApiKey(id: number): boolean {
  const db = getDb();
  db.prepare("DELETE FROM api_keys WHERE id = ?").run(id);
  return true;
}

export function getAppStats() {
  const db = getDb();
  ensureDefaultWorkflows();

  const totalWorkflows = (db.prepare("SELECT COUNT(*) as c FROM workflows").get() as { c: number }).c;
  const activeWorkflows = (db.prepare("SELECT COUNT(*) as c FROM workflows WHERE status = 'active'").get() as { c: number }).c;
  const totalRuns = (db.prepare("SELECT COUNT(*) as c FROM pipeline_runs").get() as { c: number }).c;
  const avgLatency = (db.prepare("SELECT AVG(latency_ms) as a FROM pipeline_runs").get() as { a: number | null }).a || 42;
  const totalTokens = (db.prepare("SELECT SUM(tokens_used) as s FROM pipeline_runs").get() as { s: number | null }).s || 0;
  const apiKeysCount = (db.prepare("SELECT COUNT(*) as c FROM api_keys WHERE status = 'active'").get() as { c: number }).c;

  return {
    totalWorkflows,
    activeWorkflows,
    totalRuns,
    avgLatency: Math.round(avgLatency),
    totalTokens,
    apiKeysCount,
  };
}

// ==========================================
// Crypto Exchange Engine, Portfolio & Staking
// ==========================================

export interface CryptoAsset {
  symbol: string;
  name: string;
  balance: number;
  current_price: number;
  value_usd: number;
  change24h: number;
  allocation_percent: number;
}

export interface CryptoOrder {
  id: number;
  pair: string;
  side: "buy" | "sell";
  order_type: "market" | "limit";
  price: number;
  amount: number;
  total: number;
  status: string;
  created_at: string;
}

export interface CryptoTransaction {
  id: number;
  tx_hash: string;
  type: string;
  from_asset: string;
  to_asset: string;
  amount: number;
  value_usd: number;
  status: string;
  created_at: string;
}

export interface CryptoStake {
  id: number;
  symbol: string;
  amount: number;
  duration_days: number;
  apy: number;
  rewards_earned: number;
  status: string;
  created_at: string;
}

const LIVE_PRICES: Record<string, { name: string; price: number; change24h: number }> = {
  ORBX: { name: "OrbitX Token", price: 14.85, change24h: 18.42 },
  BTC: { name: "Bitcoin", price: 96420.0, change24h: 4.18 },
  ETH: { name: "Ethereum", price: 3420.5, change24h: 5.62 },
  SOL: { name: "Solana", price: 214.8, change24h: 8.94 },
  USDT: { name: "Tether USD", price: 1.0, change24h: 0.01 },
  USDC: { name: "USD Coin", price: 1.0, change24h: 0.0 },
};

export function ensureDefaultCryptoData() {
  const db = getDb();
  const countRow = db.prepare("SELECT COUNT(*) as count FROM crypto_portfolio").get() as { count: number };
  if (countRow.count > 0) return;

  const initialAssets = [
    { symbol: "ORBX", name: "OrbitX Token", balance: 5000.0, avg_buy_price: 11.2 },
    { symbol: "BTC", name: "Bitcoin", balance: 0.85, avg_buy_price: 89400.0 },
    { symbol: "ETH", name: "Ethereum", balance: 8.4, avg_buy_price: 3100.0 },
    { symbol: "SOL", name: "Solana", balance: 42.0, avg_buy_price: 185.0 },
    { symbol: "USDT", name: "Tether USD", balance: 18500.0, avg_buy_price: 1.0 },
  ];

  for (const a of initialAssets) {
    db.prepare(`
      INSERT OR REPLACE INTO crypto_portfolio (symbol, name, balance, avg_buy_price)
      VALUES (?, ?, ?, ?)
    `).run(a.symbol, a.name, a.balance, a.avg_buy_price);
  }

  // Pre-seed some recent trading activity
  const sampleTx = [
    { type: "swap", from: "ETH", to: "ORBX", amount: 2.0, val: 6841.0, hash: "0x8f2a...c391" },
    { type: "buy", from: "USDT", to: "SOL", amount: 20.0, val: 4296.0, hash: "0x3e1d...98b2" },
    { type: "stake", from: "ORBX", to: "ORBX Vault", amount: 2000.0, val: 29700.0, hash: "0x77c4...ef14" },
  ];

  for (const tx of sampleTx) {
    db.prepare(`
      INSERT INTO crypto_transactions (tx_hash, type, from_asset, to_asset, amount, value_usd, status)
      VALUES (?, ?, ?, ?, ?, ?, 'confirmed')
    `).run(tx.hash, tx.type, tx.from, tx.to, tx.amount, tx.val);
  }

  // Pre-seed an active stake
  db.prepare(`
    INSERT INTO crypto_stakes (symbol, amount, duration_days, apy, rewards_earned, status)
    VALUES ('ORBX', 2000.0, 365, 24.8, 412.5, 'active')
  `).run();
}

export function getCryptoPortfolio() {
  const db = getDb();
  ensureDefaultCryptoData();

  const rows = db.prepare("SELECT * FROM crypto_portfolio").all() as Array<{
    symbol: string;
    name: string;
    balance: number;
    avg_buy_price: number;
  }>;

  let totalValueUsd = 0;
  const assets: CryptoAsset[] = rows.map((r) => {
    const market = LIVE_PRICES[r.symbol] || { name: r.name, price: 1.0, change24h: 0.0 };
    const valueUsd = r.balance * market.price;
    totalValueUsd += valueUsd;
    return {
      symbol: r.symbol,
      name: r.name,
      balance: r.balance,
      current_price: market.price,
      value_usd: valueUsd,
      change24h: market.change24h,
      allocation_percent: 0,
    };
  });

  // Calculate allocations
  for (const a of assets) {
    a.allocation_percent = totalValueUsd > 0 ? (a.value_usd / totalValueUsd) * 100 : 0;
  }

  return {
    totalValueUsd,
    dayChangeUsd: totalValueUsd * 0.084, // simulated +8.4% 24h PnL
    dayChangePercent: 8.4,
    assets: assets.sort((a, b) => b.value_usd - a.value_usd),
  };
}

export function executeCryptoTrade(data: {
  pair: string;
  side: "buy" | "sell";
  order_type: "market" | "limit";
  price: number;
  amount: number;
}) {
  const db = getDb();
  ensureDefaultCryptoData();

  const total = data.price * data.amount;
  const [base, quote] = data.pair.split("/"); // e.g. ["ORBX", "USDT"]

  // Insert order
  const orderStmt = db.prepare(`
    INSERT INTO crypto_orders (pair, side, order_type, price, amount, total, status)
    VALUES (?, ?, ?, ?, ?, ?, 'filled')
  `);
  const info = orderStmt.run(data.pair, data.side, data.order_type, data.price, data.amount, total);

  // Update portfolio balances
  if (data.side === "buy") {
    // Deduct quote (USDT), add base (e.g. ORBX)
    db.prepare("UPDATE crypto_portfolio SET balance = balance - ? WHERE symbol = ?").run(total, quote);
    db.prepare(`
      INSERT INTO crypto_portfolio (symbol, name, balance, avg_buy_price)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(symbol) DO UPDATE SET balance = balance + excluded.balance
    `).run(base, LIVE_PRICES[base]?.name || base, data.amount, data.price);
  } else {
    // Sell base, receive quote
    db.prepare("UPDATE crypto_portfolio SET balance = balance - ? WHERE symbol = ?").run(data.amount, base);
    db.prepare(`
      INSERT INTO crypto_portfolio (symbol, name, balance, avg_buy_price)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(symbol) DO UPDATE SET balance = balance + excluded.balance
    `).run(quote, "Tether USD", total, 1.0);
  }

  // Record transaction
  const randomHex = Math.random().toString(36).substring(2, 8);
  const txHash = `0x${randomHex}...${Math.random().toString(36).substring(2, 6)}`;
  db.prepare(`
    INSERT INTO crypto_transactions (tx_hash, type, from_asset, to_asset, amount, value_usd, status)
    VALUES (?, ?, ?, ?, ?, ?, 'confirmed')
  `).run(
    txHash,
    data.side,
    data.side === "buy" ? quote : base,
    data.side === "buy" ? base : quote,
    data.amount,
    total
  );

  return {
    success: true,
    orderId: Number(info.lastInsertRowid),
    txHash,
    pair: data.pair,
    side: data.side,
    amount: data.amount,
    price: data.price,
    total,
  };
}

export function executeCryptoSwap(fromAsset: string, toAsset: string, fromAmount: number) {
  const fromPrice = LIVE_PRICES[fromAsset]?.price || 1.0;
  const toPrice = LIVE_PRICES[toAsset]?.price || 1.0;
  const valueUsd = fromAmount * fromPrice;
  const toAmount = valueUsd / toPrice;

  const db = getDb();
  ensureDefaultCryptoData();

  // Deduct fromAsset, credit toAsset
  db.prepare("UPDATE crypto_portfolio SET balance = MAX(0, balance - ?) WHERE symbol = ?").run(fromAmount, fromAsset);
  db.prepare(`
    INSERT INTO crypto_portfolio (symbol, name, balance, avg_buy_price)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(symbol) DO UPDATE SET balance = balance + excluded.balance
  `).run(toAsset, LIVE_PRICES[toAsset]?.name || toAsset, toAmount, toPrice);

  const randomHex = Math.random().toString(36).substring(2, 8);
  const txHash = `0x${randomHex}...${Math.random().toString(36).substring(2, 6)}`;
  db.prepare(`
    INSERT INTO crypto_transactions (tx_hash, type, from_asset, to_asset, amount, value_usd, status)
    VALUES (?, 'swap', ?, ?, ?, ?, 'confirmed')
  `).run(txHash, fromAsset, toAsset, toAmount, valueUsd);

  return {
    success: true,
    txHash,
    fromAsset,
    toAsset,
    fromAmount,
    toAmount,
    valueUsd,
  };
}

export function stakeCryptoTokens(symbol: string, amount: number, durationDays: number, apy: number) {
  const db = getDb();
  ensureDefaultCryptoData();

  db.prepare("UPDATE crypto_portfolio SET balance = MAX(0, balance - ?) WHERE symbol = ?").run(amount, symbol);

  const info = db.prepare(`
    INSERT INTO crypto_stakes (symbol, amount, duration_days, apy, rewards_earned, status)
    VALUES (?, ?, ?, ?, 0.0, 'active')
  `).run(symbol, amount, durationDays, apy);

  const randomHex = Math.random().toString(36).substring(2, 8);
  const txHash = `0x${randomHex}...${Math.random().toString(36).substring(2, 6)}`;
  db.prepare(`
    INSERT INTO crypto_transactions (tx_hash, type, from_asset, to_asset, amount, value_usd, status)
    VALUES (?, 'stake', ?, 'Staking Vault', ?, ?, 'confirmed')
  `).run(txHash, symbol, amount, amount * (LIVE_PRICES[symbol]?.price || 1.0));

  return {
    success: true,
    stakeId: Number(info.lastInsertRowid),
    txHash,
    symbol,
    amount,
    durationDays,
    apy,
  };
}

export function getCryptoTransactions(limit = 25): CryptoTransaction[] {
  const db = getDb();
  ensureDefaultCryptoData();
  return db
    .prepare("SELECT * FROM crypto_transactions ORDER BY id DESC LIMIT ?")
    .all(limit) as unknown as CryptoTransaction[];
}

export function getCryptoOrders(limit = 25): CryptoOrder[] {
  const db = getDb();
  ensureDefaultCryptoData();
  return db
    .prepare("SELECT * FROM crypto_orders ORDER BY id DESC LIMIT ?")
    .all(limit) as unknown as CryptoOrder[];
}

export function getCryptoStakes(): CryptoStake[] {
  const db = getDb();
  ensureDefaultCryptoData();
  return db
    .prepare("SELECT * FROM crypto_stakes ORDER BY id DESC")
    .all() as unknown as CryptoStake[];
}
