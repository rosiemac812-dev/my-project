# NovaPulse AI — Full-Stack Business Landing Page & Lead Engine

A high-converting, modern Full-Stack Business Landing Page built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Node.js built-in SQLite (`node:sqlite`)**.

Designed for SaaS, AI startups, and modern digital businesses with live interactive components, lead/waitlist capture, ROI calculators, interactive sandbox, and a built-in admin dashboard.

---

## 🌟 Key Features

### 🖥️ Frontend & UX
- **Hero & Value Proposition**: High-impact hero section with live status pill, dynamic animated agent mesh preview, and conversion CTAs.
- **Interactive Sandbox Demo**: Hands-on AI workflow playground with live step-by-step latency simulation and telemetry analysis.
- **ROI & Cost Savings Calculator**: Interactive sliders for team size, manual hours, and compensation calculating annual reclaimed capital.
- **Predictable Pricing Matrix**: Monthly/Annual toggle (with 20% discount badge), feature breakdown, and enterprise SLA guarantee.
- **Bento Grid Feature Showcase**: Detailed breakdown of autonomous agent orchestration, unified knowledge sync, sub-millisecond routing, and SOC2 compliance.
- **Filterable Customer Testimonials**: Industry-segmented social proof (SaaS, Fintech, E-Commerce, Enterprise) with verified metrics.
- **Searchable FAQ Accordion**: Instant question lookup by keywords or categories.
- **Dark / Light Theme Switcher**: Persistent theme toggle respecting user and system preferences.

### ⚙️ Full-Stack & Backend Capabilities
- **Early Access Waitlist System**:
  - Modal form with real-time validation and anti-spam duplicate prevention.
  - Generates real-time waitlist line position badge and fireworks confetti upon reservation.
  - Automatically persisted in local SQLite database (`data/landing.db`).
- **Contact & Enterprise Inquiries**:
  - Validated contact form with department/interest routing and SLA response guarantees.
- **Engineering Newsletter Capture**:
  - Fast email subscriber signup in the footer with duplicate detection.
- **Interactive Admin Dashboard (`/admin`)**:
  - KPI overview: Total waitlist signups, inquiry count, unread notifications, newsletter subscribers.
  - Live filterable table with search by name, email, or company.
  - Status pipeline manager (`new` → `contacted` → `qualified` → `converted`).
  - One-click **CSV Data Export** (`/api/admin/export`).
  - One-click **Demo Data Seeder** (`/api/admin/seed`) to preview live entries instantly.
- **Zero-Dependency Database**:
  - Powered by Node.js 22/24 built-in `node:sqlite` (`DatabaseSync`), requiring zero external native compilation or database drivers.

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

Open [http://localhost:3000](http://localhost:3000) with your browser to view the landing page.
Visit [http://localhost:3000/admin](http://localhost:3000/admin) to access the lead management panel.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🎨 Easy Brand Customization

All text copy, pricing tiers, FAQs, feature highlights, and company metadata can be customized in a single configuration file:

📁 **[`src/config/site.ts`](file:///home/runner/work/my-project/my-project/src/config/site.ts)**

```typescript
export const siteConfig = {
  name: "Your Business Name",
  tagline: "Your compelling value proposition",
  description: "Detailed description of your product or services...",
  // customize features, pricing plans, testimonials, faqs, and more
};
```

---

## 📁 Project Architecture

```
├── src/
│   ├── app/
│   │   ├── page.tsx               # Main Landing Page
│   │   ├── layout.tsx             # Root Layout & Metadata
│   │   ├── globals.css            # Tailwind & Theme Styles
│   │   ├── admin/
│   │   │   └── page.tsx           # Admin Leads & Inquiries Dashboard
│   │   └── api/
│   │       ├── waitlist/route.ts  # Waitlist POST & GET
│   │       ├── contact/route.ts   # Contact inquiry POST
│   │       ├── newsletter/route.ts# Newsletter subscription POST
│   │       ├── demo/route.ts      # Interactive workflow simulation
│   │       └── admin/             # Admin management & export APIs
│   ├── components/                # Modular React UI components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── InteractiveDemo.tsx
│   │   ├── SocialProof.tsx
│   │   ├── Features.tsx
│   │   ├── RoiCalculator.tsx
│   │   ├── Pricing.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Faq.tsx
│   │   ├── ContactSection.tsx
│   │   ├── Footer.tsx
│   │   ├── WaitlistModal.tsx
│   │   └── ThemeToggle.tsx
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
