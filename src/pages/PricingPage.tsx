import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustSection from "@/components/TrustSection";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import FAQItem from "@/components/FAQItem";
import { CheckCircle, ShieldCheck } from "lucide-react";

const PACKAGES = [
  {
    category: "Websites",
    name: "Landing Page",
    price: "₹14,999",
    period: "one-time",
    tagline: "High-conversion landing page for campaigns & launches",
    features: [
      "1 High-Converting Responsive Page",
      "Figma UI Design + Clean React Code",
      "Contact Form & WhatsApp Integration",
      "SEO Meta Tags & Speed Optimization",
      "Source Code Handover",
      "Delivery in 5–7 Days",
    ],
  },
  {
    category: "Websites",
    name: "Business Website",
    price: "₹29,999",
    period: "one-time",
    popular: true,
    tagline: "Professional website for companies needing strong online presence",
    features: [
      "Up to 7 Custom Pages (Home, About, Services, Projects, Contact, Blog, FAQ)",
      "SEO Titles, Descriptions & Schema Markup",
      "Google Maps & Local Business NAP Embed",
      "Mobile-First Responsive Layout",
      "CMS for Easy Content Updates",
      "1 Year Technical Support & Updates",
      "Delivery in 10–14 Days",
    ],
  },
  {
    category: "Websites",
    name: "Business Growth Website",
    price: "₹49,999",
    period: "one-time",
    tagline: "Advanced site with richer pages, conversion architecture & integrations",
    features: [
      "Up to 15 Custom Pages + CMS Blog",
      "Interactive UI Micro-Animations",
      "Lead Capture & CRM Sync Integration",
      "Core Web Vitals Speed Guarantee (LCP < 2s)",
      "AEO & AI Search Readiness Setup",
      "Custom API Integrations (up to 3)",
      "Delivery in 3–4 Weeks",
    ],
  },
  {
    category: "Websites",
    name: "Corporate / Premium Website",
    price: "₹79,999",
    period: "one-time",
    tagline: "Premium custom website for established brands & organizations",
    features: [
      "Unlimited Custom Pages & Sections",
      "Custom Design System & Component Library",
      "Advanced Integrations (CRM, ERP, Marketing Stack)",
      "Multi-language & Multi-region Ready",
      "Enterprise-grade Security & Compliance",
      "Dedicated Project Manager",
      "Delivery in 4–6 Weeks",
    ],
  },
  {
    category: "Ecommerce",
    name: "Ecommerce Starter",
    price: "₹59,999",
    period: "one-time",
    tagline: "Launch your online store with essential features",
    features: [
      "Shopify / WooCommerce Setup",
      "Up to 50 Products",
      "Payment Gateway Integration (Razorpay/Stripe)",
      "Shipping & Tax Configuration",
      "Basic SEO & Speed Optimization",
      "Source Code / Theme Handover",
      "Delivery in 3–4 Weeks",
    ],
  },
  {
    category: "Ecommerce",
    name: "Ecommerce Professional",
    price: "₹99,999",
    period: "one-time",
    popular: true,
    tagline: "Full-featured store for growing brands",
    features: [
      "Custom Theme Development (React/Next.js or Shopify Plus)",
      "Up to 500 Products with Variants",
      "Advanced Filtering, Search & Wishlist",
      "Subscription / Recurring Orders Support",
      "Abandoned Cart Recovery & Email Flows",
      "Analytics & Conversion Tracking Setup",
      "Delivery in 4–6 Weeks",
    ],
  },
  {
    category: "Ecommerce",
    name: "Custom Ecommerce",
    price: "₹1,49,999+",
    period: "one-time",
    tagline: "Enterprise-grade commerce platform with custom workflows",
    features: [
      "Headless Commerce (Next.js + Shopify/BigCommerce/Medusa)",
      "Unlimited Products & Custom Catalogs",
      "B2B Wholesale Portal with Tiered Pricing",
      "Custom Checkout & Subscription Logic",
      "ERP / POS / Inventory Sync",
      "Multi-currency & Multi-region",
      "Delivery in 6–10 Weeks",
    ],
  },
  {
    category: "MVP & SaaS",
    name: "Mobile App MVP",
    price: "₹24,999+",
    period: "one-time",
    tagline: "Cross-platform mobile app MVP for iOS & Android",
    features: [
      "Flutter / React Native Cross-Platform Build",
      "iOS & Android App Store Deployment",
      "Push Notifications & Offline-First Sync",
      "Backend API + Database (Node.js/PostgreSQL)",
      "Complete IP & Code Rights Handover",
      "Delivery in 3–5 Weeks",
    ],
  },
  {
    category: "MVP & SaaS",
    name: "Web MVP Starter",
    price: "₹74,999+",
    period: "one-time",
    tagline: "Investor-ready prototype to validate your idea",
    features: [
      "Clickable Prototype (Figma) + Core User Flows",
      "Auth, Database, API Setup (Next.js + PostgreSQL)",
      "Admin Dashboard for Content Management",
      "Payment Gateway Integration (Stripe/Razorpay)",
      "Complete IP & Code Rights Handover",
      "Delivery in 3–4 Weeks",
    ],
  },
  {
    category: "MVP & SaaS",
    name: "MVP Launch",
    price: "₹1,49,999+",
    period: "one-time",
    tagline: "Production-ready MVP for market launch",
    features: [
      "Full-Stack Web App (React/Next.js + Node/PostgreSQL)",
      "Multi-role Auth & User Management",
      "Core Business Logic & Workflows",
      "Third-party API Integrations (up to 5)",
      "CI/CD, Monitoring & Error Tracking",
      "Delivery in 6–8 Weeks",
    ],
  },
  {
    category: "MVP & SaaS",
    name: "SaaS / Custom Web Application",
    price: "₹2,49,999+",
    period: "one-time",
    popular: true,
    tagline: "Multi-tenant SaaS platform with billing & user management",
    features: [
      "Multi-tenant Architecture with Row-level Security",
      "Stripe Billing (Subscriptions, Trials, Coupons)",
      "Customer Portal & Admin Dashboard",
      "Customer-facing API with Rate Limiting",
      "Feature Flags & Usage Analytics",
      "Delivery in 8–12 Weeks",
    ],
  },
  {
    category: "MVP & SaaS",
    name: "Advanced SaaS / Platform",
    price: "₹4,99,999+",
    period: "one-time",
    tagline: "Enterprise-grade platform with custom infrastructure",
    features: [
      "Custom Infrastructure (AWS/GCP) with IaC",
      "Advanced Security (SSO, RBAC, Audit Logs)",
      "Real-time Features (WebSockets, Presence)",
      "Microservices Architecture Ready",
      "SLA-backed Support & Maintenance",
      "Delivery in 12–16 Weeks",
    ],
  },
  {
    category: "AI & Automation",
    name: "Basic Automation",
    price: "₹14,999+",
    period: "one-time",
    tagline: "Eliminate repetitive manual tasks",
    features: [
      "1–2 Tool Workflow (Zapier/Make/n8n)",
      "Trigger → Action Automation",
      "Error Handling & Notifications",
      "Documentation & Runbook",
      "Delivery in 1–2 Weeks",
    ],
  },
  {
    category: "AI & Automation",
    name: "Business Automation",
    price: "₹29,999+",
    period: "one-time",
    tagline: "Connect multiple tools & automate business processes",
    features: [
      "3–5 Connected Workflows",
      "CRM / ERP / Spreadsheet Sync",
      "AI-assisted Steps (Summarization, Classification)",
      "Custom Dashboard for Monitoring",
      "Delivery in 2–3 Weeks",
    ],
  },
  {
    category: "AI & Automation",
    name: "AI Automation",
    price: "₹49,999+",
    period: "one-time",
    popular: true,
    tagline: "Intelligent workflows with LLM-powered decision making",
    features: [
      "Custom AI Agents (LangGraph / LangChain)",
      "RAG-based Knowledge Retrieval",
      "Document Processing & Extraction",
      "Human-in-the-loop Approval Flows",
      "Delivery in 4–6 Weeks",
    ],
  },
  {
    category: "AI & Automation",
    name: "Advanced AI Agent / Workflow",
    price: "₹99,999+",
    period: "one-time",
    tagline: "Autonomous multi-agent systems for complex operations",
    features: [
      "Multi-agent Orchestration (Planning, Tools, Memory)",
      "Custom Model Fine-tuning (LoRA/QLoRA)",
      "Evaluation Loops & Guardrails",
      "Observability & A/B Testing",
      "Delivery in 8–12 Weeks",
    ],
  },
  {
    category: "Maintenance",
    name: "Essential Care",
    price: "₹1,499",
    period: "month",
    tagline: "Basic health monitoring for small websites",
    features: [
      "Monthly Backup & Uptime Monitoring",
      "SSL & Domain Expiry Alerts",
      "Core Dependency Updates",
      "Up to 30 mins Content Changes/Month",
      "Email Support",
    ],
  },
  {
    category: "Maintenance",
    name: "Business Care",
    price: "₹2,999",
    period: "month",
    popular: true,
    tagline: "Proactive maintenance for business websites",
    features: [
      "Weekly Backups & Daily Uptime Checks",
      "Form & Integration Health Monitoring",
      "Security Scanning & Malware Cleanup",
      "Up to 2 Hours Content/Code Changes/Month",
      "Priority Email + WhatsApp Support",
      "Monthly Performance Report",
    ],
  },
  {
    category: "Maintenance",
    name: "Growth Care",
    price: "₹5,999",
    period: "month",
    tagline: "Growth-focused support for scaling businesses",
    features: [
      "Everything in Business Care",
      "Automation & AI Workflow Monitoring",
      "Content Updates & New Page Builds",
      "Up to 5 Hours Changes/Month",
      "Quarterly Strategy Call",
      "Conversion Rate Optimization Review",
    ],
  },
  {
    category: "Maintenance",
    name: "Premium / Priority",
    price: "₹9,999+",
    period: "month",
    tagline: "Dedicated support for mission-critical platforms",
    features: [
      "Everything in Growth Care",
      "24/7 Incident Response (SLA-backed)",
      "Infrastructure Management (AWS/Vercel)",
      "Unlimited Reasonable Changes",
      "Dedicated Account Engineer",
      "Custom SLA & Compliance Reporting",
    ],
  },
];

const FAQS = [
  {
    question: "Are there any hidden costs after project delivery?",
    answer: "Zero hidden costs. What we quote is what you pay. Domain, hosting, and third-party API costs are paid directly to providers or bundled transparently.",
  },
  {
    question: "What payment terms do you follow?",
    answer: "We typically work on a 50% upfront deposit upon scope lock, and 50% upon final project review and approval before server deployment.",
  },
  {
    question: "Can I upgrade my package later?",
    answer: "Yes. You can start with a smaller package and upgrade as your needs grow. We'll credit your previous investment toward the new scope.",
  },
  {
    question: "Do you offer international pricing in USD/EUR?",
    answer: "Our base pricing is in INR for the Indian market. For international clients, we provide custom quotes based on project scope, timeline, and regional factors — not simple currency conversion.",
  },
];

export default function PricingPage() {
  return (
    <>
      <SEO page="pricing" />
      <SchemaMarkup page="pricing" faq={FAQS} />

      <main id="main-content" className="bg-basalt-canvas min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Pricing" }]} />

          <div className="text-center max-w-3xl mx-auto my-8 font-body">
            <div className="inline-flex items-center gap-2 rounded-full bg-digital-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-digital-orange mb-4">
              <ShieldCheck className="h-4 w-4" /> 100% Fixed & Transparent Pricing
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-abyssal-ink">
              Clear Fixed Pricing for Web Development, Ecommerce, MVP & AI
            </h1>
            <p className="mt-4 text-base sm:text-lg text-abyssal-ink/70 leading-relaxed">
              No vague hourly billing or surprise invoices. Choose a fixed package starting at ₹14,999 with guaranteed timelines and complete source code handover.
            </p>
          </div>

          {/* Category Filters */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-2 justify-center">
              {["All", "Websites", "Ecommerce", "MVP & SaaS", "AI & Automation", "Maintenance"].map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    cat === "All"
                      ? "bg-digital-orange text-white"
                      : "bg-abyssal-ink/5 text-abyssal-ink/60 hover:bg-abyssal-ink/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-12 font-body">
            {PACKAGES.map((pkg, i) => (
              <div
                key={i}
                className={`relative flex flex-col justify-between rounded-3xl border p-6 bg-white shadow-sm transition-all hover:shadow-lg ${
                  pkg.popular ? "border-digital-orange ring-2 ring-digital-orange/20" : "border-abyssal-ink/10"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-digital-orange px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
                    Most Popular
                  </span>
                )}
                <span className="text-xs font-semibold uppercase tracking-widest text-digital-orange">{pkg.category}</span>
                <div>
                  <h2 className="text-xl font-bold text-abyssal-ink">{pkg.name}</h2>
                  <p className="mt-2 text-xs text-abyssal-ink/60 min-h-[36px]">{pkg.tagline}</p>
                  <div className="mt-4 font-display text-3xl sm:text-4xl font-bold text-digital-orange">
                    {pkg.price}
                    <span className="text-xs font-normal text-abyssal-ink/50 ml-1 font-body">/ {pkg.period}</span>
                  </div>
                  <ul className="mt-6 space-y-2.5 border-t border-abyssal-ink/8 pt-4 text-xs text-abyssal-ink/75">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href="#quote"
                  className={`mt-8 block w-full rounded-full py-3 text-center text-xs font-bold transition-all ${
                    pkg.popular ? "bg-digital-orange text-white hover:bg-digital-orange/90" : "bg-abyssal-ink text-white hover:bg-digital-orange"
                  }`}
                >
                  {pkg.price.includes("+") || Number(pkg.price.replace(/[^0-9]/g, "")) >= 49999 ? "Discuss Your Project" : "Get Started"}
                </a>
              </div>
            ))}
          </div>

          {/* Custom Quote Form */}
          <div id="quote" className="my-16 rounded-3xl bg-white p-8 border border-abyssal-ink/10 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-abyssal-ink mb-2 text-center">Need a Custom Proposal?</h2>
            <p className="text-xs text-abyssal-ink/60 font-body text-center mb-6">Fill out your project details and get a free 48-hour consultation.</p>
            <div className="max-w-xl mx-auto">
              <ServiceInquiryForm />
            </div>
          </div>

          <section className="my-16">
            <h2 className="font-display text-2xl font-bold text-abyssal-ink mb-6">Pricing FAQs</h2>
            <div className="space-y-4 font-body">
              {FAQS.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </section>

          <TrustSection />
        </div>
      </main>
    </>
  );
}