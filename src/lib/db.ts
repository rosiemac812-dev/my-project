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
    { name: "Jordan Ellis", email: "jordan@cyberpoint.tech", subject: "Custom VPC deployment inquiry", message: "We are looking to deploy NovaPulse in our AWS GovCloud environment. Could we schedule a technical walkthrough with a solutions architect this Thursday?", interest: "Enterprise Cluster" },
    { name: "Chloe Dupont", email: "cdupont@lumina.fr", subject: "Integration with proprietary fine-tuned models", message: "Hi there! Does NovaPulse support self-hosted vLLM inference endpoints with custom bearer token auth?", interest: "Growth Pro" },
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
