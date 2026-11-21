# NovaPulse AI — Full-Stack Workflow Automation Platform & Landing Engine

A modern, production-grade Full-Stack Application built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Node.js built-in SQLite (`node:sqlite`)**.

This project provides both a high-converting **Business Landing Page** and the complete **NovaPulse Cloud Studio Web Application** with live agentic workflow builders, execution sandboxes, telemetry logs, API credential management, and an administrative hub.

---

## 🌟 Key Application Features

### 🎮 Cloud Studio App (`/dashboard`)
- **Workspace Overview**:
  - Real-time KPI metrics: Active Pipelines, Execution Count, Average Latency Waterfall, and Token Usage.
  - Quick Test Runner directly on the overview board.
  - Recent live execution stream with status tags and latency records.
- **Workflow Studio & Pipeline Builder**:
  - Create and configure custom multi-agent autonomous chains (Trigger → Vector Ingestion → Multi-Model LLM Reasoner → Webhook Delivery).
  - Pre-seeded with 4 ready-to-run enterprise workflows:
    1. *Autonomous Support Triage*
    2. *Sales Lead Enrichment & Scoring*
    3. *Financial Filing Risk Synthesizer*
    4. *Code Security & Vulnerability Auditor*
  - Toggle workflows between active and paused states.
- **Live Execution Sandbox**:
  - Test any pipeline with arbitrary JSON or text event prompts.
  - Real-time step-by-step node execution simulation with latency waterfalls.
  - Granular token counters, cost estimates, and syntax-highlighted synthesized JSON output.
- **Pipeline Telemetry & Execution Logs**:
  - Complete searchable audit trail of all pipeline runs.
  - Inspect input prompts, synthesized output schemas, latency breakdowns, and timestamps.
- **API Credentials Manager**:
  - Generate and manage live API keys (`np_live_...`).
  - Copy-to-clipboard secret modals and instant revocation controls.
- **Model Routing & Settings**:
  - Dynamic routing between Gemini 2.0 Flash/Pro, Claude 3.5 Sonnet, and GPT-4o based on latency targets and cost budgets.

---

### 🖥️ Public Landing Page (`/`)
- **Hero & Value Proposition**: High-impact banner, live status pill, interactive agent mesh preview canvas, and conversion CTAs.
- **Hands-on Live Product Sandbox**: Try autonomous triage live on the landing page.
- **Interactive ROI & Savings Calculator**: Interactive sliders for team size, manual hours, and compensation calculating annual reclaimed capital.
- **Predictable Pricing Matrix**: Monthly/Annual toggle (with 20% discount badge), feature breakdown, and enterprise SLA guarantee.
- **Bento Grid Feature Showcase**: Detailed breakdown of autonomous agent orchestration, unified knowledge sync, sub-millisecond routing, and SOC2 compliance.
- **Filterable Customer Testimonials**: Industry-segmented social proof (SaaS, Fintech, E-Commerce, Enterprise) with verified metrics.
- **Searchable FAQ Accordion**: Instant question lookup by keywords or categories.
- **Dark / Light Theme Switcher**: Theme toggle respecting user and system preferences.

---

### 💼 Executive Admin Portal (`/admin`)
- Real-time metrics on waitlist signups, unread customer inquiries, and changelog subscribers.
- Filterable lead table with search by name, email, or company.
- Pipeline status manager (`new` → `contacted` → `qualified` → `converted`).
- One-click **CSV Data Export** (`/api/admin/export`).
- One-click **Demo Data Seeder** (`/api/admin/seed`).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

* **Landing Page**: [http://localhost:3000](http://localhost:3000)
* **Cloud Studio App**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
* **Admin Hub**: [http://localhost:3000/admin](http://localhost:3000/admin)

### 3. Build for Production
```bash
npm run build && npm start
```

---

## 🎨 Easy Brand & Site Customization

All text copy, pricing tiers, FAQs, feature highlights, and company metadata can be customized in a single configuration file:

📁 **[`src/config/site.ts`](file:///home/runner/work/my-project/my-project/src/config/site.ts)**

---

## 📁 Project Architecture

```
├── src/
│   ├── app/
│   │   ├── page.tsx               # Main Landing Page
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Cloud Studio App (Workflows, Sandbox, Logs, Keys)
│   │   ├── admin/
│   │   │   └── page.tsx           # Admin Leads & Inquiries Dashboard
│   │   ├── layout.tsx             # Root Layout & Metadata
│   │   ├── globals.css            # Tailwind & Theme Styles
│   │   └── api/
│   │       ├── app/
│   │       │   ├── workflows/     # Workflow CRUD
│   │       │   ├── run/           # Workflow Execution Engine
│   │       │   ├── runs/          # Telemetry & Logs
│   │       │   ├── apikeys/       # API Key Generation & Revocation
│   │       │   └── stats/         # Workspace Stats API
│   │       ├── waitlist/route.ts  # Waitlist POST & GET
│   │       ├── contact/route.ts   # Contact inquiry POST
│   │       ├── newsletter/route.ts# Newsletter subscription POST
│   │       ├── demo/route.ts      # Interactive workflow simulation
│   │       └── admin/             # Admin management & export APIs
│   ├── components/                # Modular React UI components
│   ├── config/
│   │   └── site.ts                # Centralized site & brand configuration
│   └── lib/
│       ├── db.ts                  # node:sqlite database queries & migrations
│       └── utils.ts               # Formatting and validation helpers
├── data/
│   └── landing.db                 # SQLite database (auto-generated)
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 📄 License
MIT License.
