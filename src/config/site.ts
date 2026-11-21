export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  announcement: {
    badge: string;
    text: string;
    linkText: string;
  };
  stats: { label: string; value: string; helper: string }[];
  features: {
    title: string;
    description: string;
    icon: string;
    tag?: string;
    highlight?: boolean;
  }[];
  pricing: {
    monthlyDiscountPercent: number;
    plans: {
      id: string;
      name: string;
      tagline: string;
      priceMonthly: number;
      priceAnnual: number;
      popular?: boolean;
      features: string[];
      cta: string;
    }[];
  };
  testimonials: {
    name: string;
    role: string;
    company: string;
    avatar: string;
    rating: number;
    quote: string;
    industry: "SaaS" | "E-Commerce" | "Fintech" | "Enterprise";
    stat: string;
  }[];
  faqs: {
    category: string;
    question: string;
    answer: string;
  }[];
  demoScenarios: {
    id: string;
    title: string;
    category: string;
    description: string;
    prompt: string;
    steps: { name: string; latency: string; status: "success" | "running" }[];
    output: Record<string, unknown>;
  }[];
}

export const siteConfig: SiteConfig = {
  name: "OrbitX",
  tagline: "The Intelligent Workflow & High-Performance Operating Engine",
  description:
    "Automate complex engineering, data pipelines, and mission-critical workflows with autonomous intelligence. Connect your systems, deploy instantly, and scale without limits.",
  url: "https://orbitx.io",
  announcement: {
    badge: "OrbitX v2.4",
    text: "Sub-50ms inference routing & telemetry stream now live",
    linkText: "Read changelog →",
  },
  stats: [
    { label: "Active Pipelines Executed", value: "48M+", helper: "Monthly operations" },
    { label: "Average Latency Reduction", value: "73%", helper: "Optimized model routing" },
    { label: "Global Enterprise SLA", value: "99.99%", helper: "Zero unplanned downtime" },
    { label: "Engineering Hours Saved", value: "140k+", helper: "Across 2,400+ orgs" },
  ],
  features: [
    {
      title: "Autonomous Agent Orchestration",
      description:
        "Chain complex multi-step reasoning models with dynamic fallback strategies, self-healing retries, and strict schema compliance.",
      icon: "Cpu",
      tag: "Core Engine",
      highlight: true,
    },
    {
      title: "Unified Knowledge Ingestion",
      description:
        "Connect PostgreSQL, Snowflake, Notion, GitHub, and S3 in minutes with hybrid vector-keyword retrieval and automatic index freshness.",
      icon: "Database",
      tag: "Data Sync",
    },
    {
      title: "Sub-Millisecond Inference Routing",
      description:
        "Intelligently routes requests between Gemini, Claude, and local open-source models based on real-time cost, latency, and capability targets.",
      icon: "Zap",
      tag: "Smart Routing",
      highlight: true,
    },
    {
      title: "Enterprise Security & Compliance",
      description:
        "SOC2 Type II certified, HIPAA compliant, automated PII scrubbing, end-to-end data encryption at rest and in transit.",
      icon: "ShieldCheck",
      tag: "Security",
    },
    {
      title: "Granular Cost & Observability",
      description:
        "Full token accounting, semantic tracing, latency waterfall charts, and per-tenant rate limiting out of the box.",
      icon: "BarChart3",
      tag: "Observability",
    },
    {
      title: "Instant Developer SDKs & Webhooks",
      description:
        "Drop-in SDKs for TypeScript, Python, and Go with automatic streaming backpressure and real-time webhook delivery.",
      icon: "Code2",
      tag: "Extensible",
    },
  ],
  pricing: {
    monthlyDiscountPercent: 20,
    plans: [
      {
        id: "starter",
        name: "Developer",
        tagline: "Perfect for indie builders and prototype validation.",
        priceMonthly: 0,
        priceAnnual: 0,
        features: [
          "Up to 25,000 monthly workflow runs",
          "3 active autonomous agents",
          "Standard community support",
          "Basic vector storage (500MB)",
          "Community integrations (Slack & Webhooks)",
          "7-day execution logs retention",
        ],
        cta: "Start Free",
      },
      {
        id: "pro",
        name: "Growth Pro",
        tagline: "For scaling engineering and operations teams.",
        priceMonthly: 49,
        priceAnnual: 39,
        popular: true,
        features: [
          "500,000 monthly workflow runs",
          "Unlimited autonomous agents & chains",
          "Sub-second priority inference routing",
          "20GB vector knowledge storage",
          "100+ native integrations (Salesforce, Hubspot, GitHub)",
          "90-day telemetry & full semantic tracing",
          "Priority 24/7 Slack & email support",
          "Role-based access controls (RBAC)",
        ],
        cta: "Start 14-Day Free Trial",
      },
      {
        id: "enterprise",
        name: "Enterprise Fleet",
        tagline: "Dedicated clusters, custom models, and compliance guarantees.",
        priceMonthly: 299,
        priceAnnual: 239,
        features: [
          "Unlimited monthly workflow executions",
          "Dedicated VPC / On-premise deployment option",
          "Custom fine-tuned model hosting",
          "99.99% uptime SLA with financial guarantees",
          "Custom SOC2 / HIPAA BAA agreements",
          "Real-time PII anonymization engine",
          "Dedicated solutions engineer & onboarding",
          "Custom integrations & procurement support",
        ],
        cta: "Contact Enterprise Sales",
      },
    ],
  },
  testimonials: [
    {
      name: "Sarah Chen",
      role: "VP of Engineering",
      company: "LinearScale AI",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      industry: "SaaS",
      stat: "+340% throughput",
      quote:
        "OrbitX replaced three fragmented internal pipelines with a single unified platform. Our team shipped autonomous support triage in 4 days instead of 3 months.",
    },
    {
      name: "Marcus Vance",
      role: "Head of Infrastructure",
      company: "NordicFin Tech",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      industry: "Fintech",
      stat: "62% cost reduction",
      quote:
        "The smart routing engine alone cut our LLM monthly spend by 62% while improving response accuracy. The SOC2 compliance reporting made audit a breeze.",
    },
    {
      name: "Elena Rostova",
      role: "Chief Product Officer",
      company: "Veloce Commerce",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      industry: "E-Commerce",
      stat: "18h saved/wk per rep",
      quote:
        "Our operations team automated order dispute analysis and supplier sync effortlessly. OrbitX is the standard operating system for modern business logic.",
    },
    {
      name: "David Sterling",
      role: "Lead Systems Architect",
      company: "Aether Dynamics",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      rating: 5,
      industry: "Enterprise",
      stat: "99.995% uptime",
      quote:
        "Reliability at scale is where OrbitX shines. Handling millions of mission-critical customer transactions every single week without a hiccup.",
    },
  ],
  faqs: [
    {
      category: "General",
      question: "What is OrbitX and how does it integrate with existing stacks?",
      answer:
        "OrbitX is an enterprise-grade agentic workflow engine. You can connect it to your databases, APIs, and SaaS tools using our REST APIs, TypeScript/Python SDKs, or pre-built connectors. Workflows can run serverless or within your dedicated private VPC.",
    },
    {
      category: "General",
      question: "Do I need machine learning expertise to build with OrbitX?",
      answer:
        "Not at all. You can design workflows using our intuitive web canvas, prompt templates, or clean TypeScript SDK. We handle context window management, token chunking, model routing, and error recovery automatically.",
    },
    {
      category: "Security",
      question: "How is our proprietary company data protected?",
      answer:
        "Your data is never used to train public models. We enforce zero-retention policies with LLM providers, encrypt all secrets with AES-256-GCM, and support automated PII masking before payloads touch any inference provider.",
    },
    {
      category: "Security",
      question: "Is OrbitX SOC2 Type II and HIPAA compliant?",
      answer:
        "Yes, our infrastructure undergoes annual SOC2 Type II audits and satisfies HIPAA requirements. Business Associate Agreements (BAAs) are available for all Growth Pro and Enterprise customers.",
    },
    {
      category: "Billing",
      question: "Can I upgrade, downgrade, or cancel at any time?",
      answer:
        "Yes, you have full freedom. Subscriptions can be changed or cancelled directly in the billing dashboard at any time with zero long-term commitments, with prorated adjustments.",
    },
    {
      category: "Integrations",
      question: "Which LLMs and models are supported out of the box?",
      answer:
        "We support Gemini 1.5/2.0/Pro, Claude 3.5 Sonnet/Opus, GPT-4o, Mistral Large, Llama 3.3, and custom fine-tuned endpoints hosted on Hugging Face, AWS Bedrock, or Azure OpenAI.",
    },
  ],
  demoScenarios: [
    {
      id: "support-triage",
      title: "Support Ticket Smart Triage",
      category: "Customer Experience",
      description: "Classify incoming tickets, extract sentiment, query docs, and draft verified solutions.",
      prompt: "Incoming priority ticket #4819: Customer reports billing webhook timeout on EU-Central cluster.",
      steps: [
        { name: "Parse intent & extract entity tokens", latency: "14ms", status: "success" },
        { name: "Query vector knowledge base (Docs & Incidents)", latency: "28ms", status: "success" },
        { name: "Analyze cluster health metrics via Datadog API", latency: "36ms", status: "success" },
        { name: "Synthesize resolution & draft personalized response", latency: "62ms", status: "success" },
      ],
      output: {
        classification: "Urgent - Infrastructure / Billing Webhook",
        customer_tier: "Enterprise Tier 1",
        confidence_score: "99.4%",
        resolution_draft:
          "Identified temporary DNS propagation delay on EU-Central worker node b4. Webhook queue has automatically drained and retry succeeded with HTTP 200. Follow-up ping sent to customer Slack channel.",
        suggested_action: "Auto-resolve & notify on-call engineer",
      },
    },
    {
      id: "lead-enrichment",
      title: "Sales Lead Enrichment & Scoring",
      category: "Revenue Operations",
      description: "Enrich incoming leads with firmographic data, score buying intent, and route to account executive.",
      prompt: "Inbound lead: alex@scalevector.com (VP Engineering, ScaleVector, 250 employees)",
      steps: [
        { name: "Scrape company metadata & funding rounds", latency: "22ms", status: "success" },
        { name: "Assess tech stack compatibility (Next.js, Postgres)", latency: "31ms", status: "success" },
        { name: "Calculate ICP fit score & propensity to buy", latency: "18ms", status: "success" },
        { name: "Draft tailored outbound deck & schedule in CRM", latency: "45ms", status: "success" },
      ],
      output: {
        company: "ScaleVector Dynamics",
        industry: "Cloud Data Engineering",
        fit_score: "96 / 100 (Tier A - High Value)",
        estimated_contract_value: "$45,000 / yr",
        assigned_rep: "Sarah Jenkins (Enterprise AE)",
        next_step: "Meeting invite sent for Tuesday 10:00 AM PST",
      },
    },
    {
      id: "doc-synthesis",
      title: "Automated Financial Report Synthesis",
      category: "Finance & Legal",
      description: "Ingest raw SEC 10-Q filings, compare quarter-over-quarter metrics, and generate executive summaries.",
      prompt: "Analyze Q3 SEC Filing PDF (84 pages) and highlight margin compression risks.",
      steps: [
        { name: "OCR & chunk unstructured financial tables", latency: "42ms", status: "success" },
        { name: "Calculate YoY gross margin delta vs forecast", latency: "29ms", status: "success" },
        { name: "Flag regulatory & foreign exchange risk factors", latency: "38ms", status: "success" },
        { name: "Export formatted executive briefing PDF", latency: "51ms", status: "success" },
      ],
      output: {
        gross_margin_change: "-1.8% QoQ (due to semiconductor supply costs)",
        recurring_revenue_growth: "+32.4% YoY ($112.4M ARR)",
        primary_risk_flag: "Foreign exchange volatility in APAC region",
        executive_recommendation: "Hedge Q4 currency risk & renegotiate foundry supplier tiers",
      },
    },
  ],
};
