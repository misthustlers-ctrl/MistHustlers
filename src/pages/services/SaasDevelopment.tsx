import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import AEOBlock from "@/components/AEOBlock";
import { Link } from "react-router-dom";

const SAAS_AEO = {
  definition: {
    term: "SaaS Development Company",
    definition:
      "A SaaS (Software as a Service) development company builds cloud-based software applications delivered over the internet on a subscription basis. SaaS development involves multi-tenant architecture, subscription billing, user management, role-based access control, API access for customers, and scalable cloud infrastructure.",
  },
  executiveSummary:
    "MistHustlers is a global SaaS development partner building subscription-based software platforms for businesses worldwide. From our Indore HQ, we ship production-grade multi-tenant SaaS platforms for clients across 7 countries. We build B2B SaaS with subscription billing (Stripe), user management, role-based access, admin dashboards, customer-facing APIs, and usage analytics. Fixed pricing from $499/£399/€450/₹49,999. Full source code ownership. Founder-led delivery.",
  keyTakeaways: [
    "MistHustlers serves clients across 7 countries (US, UK, Canada, Australia, UAE, Singapore, India) from our Indore HQ.",
    "SaaS MVPs from $499/£399/€450/₹49,999. Production SaaS platforms from $1,999/£1,599/€1,800/₹1,99,999. Fixed pricing, 48-hour quotes.",
    "Tech stack: Next.js, React, TypeScript, Node.js, PostgreSQL, Prisma, Stripe Billing, AWS/Vercel.",
    "Direct founder communication with Naveen Salve throughout — no account managers.",
    "100% source code ownership, full IP rights, complete documentation handed over at launch.",
  ],
  processSteps: [
    { step: 1, title: "SaaS Strategy & Architecture", description: "We define multi-tenant data model, subscription tiers, feature gating, user roles, and API architecture.", duration: "1–2 weeks" },
    { step: 2, title: "Core Platform Development", description: "We build auth, multi-tenancy, subscription billing (Stripe), user management, and admin dashboard.", duration: "4–8 weeks" },
    { step: 3, title: "Customer-Facing Features", description: "We build customer dashboard, subscription management, usage analytics, API access, and developer portal.", duration: "3–6 weeks" },
    { step: 4, title: "Launch & Scale", description: "We deploy with CI/CD, set up monitoring, implement feature flags, and provide launch support.", duration: "2–4 weeks" },
  ],
  comparisonRows: [
    { feature: "Fixed Price SaaS", mistHustlers: true, freelancer: false, bigAgency: false },
    { feature: "Source Code Ownership", mistHustlers: true, freelancer: "Sometimes", bigAgency: false },
    { feature: "Multi-Tenant Architecture", mistHustlers: true, freelancer: false, bigAgency: true },
    { feature: "Stripe Billing Integration", mistHustlers: true, freelancer: "Varies", bigAgency: true },
    { feature: "Customer API/Developer Portal", mistHustlers: true, freelancer: false, bigAgency: true },
    { feature: "Post-Launch Support Included", mistHustlers: true, freelancer: false, bigAgency: "Extra Cost" },
  ],
  prosAndCons: [
    { type: "pro", text: "Fixed transparent pricing — no surprise invoices" },
    { type: "pro", text: "Direct communication with senior engineer, not a sales team" },
    { type: "pro", text: "Source code and full IP ownership on handover" },
    { type: "pro", text: "Production-grade multi-tenancy with Stripe Billing" },
    { type: "pro", text: "Global timezone coverage — US, UK, EU, APAC hours available" },
    { type: "con", text: "Not suitable for enterprise SaaS requiring 20+ person teams" },
    { type: "con", text: "Focused on B2B SaaS — not consumer mobile apps or marketplaces" },
  ],
  misconceptions: [
    {
      myth: "Building a SaaS takes 12+ months and $200K+.",
      reality: "A focused B2B SaaS MVP with core workflow, billing, and admin can launch in 8–16 weeks. The key is ruthless scope discipline — build one core workflow that solves one painful problem.",
    },
    {
      myth: "You need a large team to build a SaaS product.",
      reality: "A senior full-stack team of 2–3 engineers can build a production SaaS. MistHustlers uses proven SaaS patterns (Next.js, Prisma, Stripe) so small teams ship production-grade platforms.",
    },
  ],
};

const SAAS_FAQ = [
  {
    q: "What is SaaS development?",
    a: "SaaS development builds cloud-based software delivered via subscription. It includes: multi-tenant architecture, subscription billing, user management, role-based access, customer dashboards, admin panels, and customer-facing APIs — all hosted in the cloud.",
  },
  {
    q: "How much does SaaS development cost?",
    a: "SaaS MVP (core workflow + billing + admin): $499/£399/€450/₹49,999. Production SaaS (multi-tenant, API, analytics): $1,999/£1,599/€1,800/₹1,99,999. Enterprise SaaS: $4,999+/₹4,99,999+. Fixed pricing, 48-hour quotes.",
  },
  {
    q: "How long does SaaS development take?",
    a: "SaaS MVP: 8–16 weeks. Production SaaS: 16–24 weeks. Enterprise SaaS: 24–36 weeks. We provide exact timeline in the fixed-price proposal.",
  },
  {
    q: "What technologies do you use for SaaS?",
    a: "Next.js, React, TypeScript, Node.js, PostgreSQL, Prisma ORM, Stripe Billing, Redis, Tailwind CSS. Auth: NextAuth.js/Clerk. Deployment: Vercel, AWS. Monitoring: Sentry, Datadog.",
  },
  {
    q: "Do you handle subscription billing?",
    a: "Yes. We integrate Stripe Billing for: subscription plans, trials, coupons, proration, dunning management, customer portal, invoices, and revenue recognition. We also support Paddle, LemonSqueezy, and custom billing.",
  },
  {
    q: "Do you build multi-tenant architecture?",
    a: "Yes. We build: shared database with row-level security, schema-per-tenant, or database-per-tenant — depending on your data isolation and compliance requirements. Row-level security with Prisma is our default for B2B SaaS.",
  },
  {
    q: "Do you build customer-facing APIs?",
    a: "Yes. We build REST/GraphQL APIs for your customers with: API keys, rate limiting, usage analytics, developer portal, webhooks, and API versioning. Your customers can integrate your SaaS into their workflows.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. We serve clients in the US, UK, Canada, Australia, UAE, Singapore, and India. Multi-currency billing, regional tax compliance, and async-first communication across all timezones.",
  },
];

export default function SaasDevelopment() {
  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="saasDevelopment" />
      <SchemaMarkup page="saasDevelopment" faq={SAAS_FAQ} />
      <Breadcrumbs />
      <main>
        <section className="pt-12 sm:pt-16 pb-16 sm:pb-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
                Service
              </span>
              <h1 className="font-display text-[clamp(38px,12vw,80px)] leading-[0.92] tracking-[0.02em] text-abyssal-ink">
                SaaS Development<br />
                <span className="text-digital-orange">for Global Founders</span>
              </h1>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                Build subscription-based software platforms with multi-tenancy, billing, and customer APIs. Production-grade B2B SaaS shipped in 8–16 weeks.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { title: "Multi-Tenant SaaS", desc: "Row-level security, tenant isolation, custom domains, white-labeling, and per-tenant configuration." },
                { title: "Subscription Billing", desc: "Stripe Billing integration: plans, trials, coupons, proration, dunning, customer portal, invoices." },
                { title: "Admin Dashboard", desc: "Tenant management, user impersonation, usage analytics, feature flags, audit logs, and billing overview." },
                { title: "Customer Dashboard", desc: "Self-service portal: subscription management, usage analytics, API keys, team management, billing history." },
                { title: "Customer-Facing API", desc: "REST/GraphQL API for your customers: API keys, rate limiting, webhooks, developer portal, docs." },
                { title: "Usage Analytics", desc: "Feature adoption, feature flags, cohort analysis, churn prediction, and revenue analytics." },
              ].map((s) => (
                <div key={s.title} className="bg-ash-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 border border-abyssal-ink/5">
                  <h3 className="font-body font-bold text-xl tracking-[0.01em] text-abyssal-ink mb-3">{s.title}</h3>
                  <p className="text-sm text-abyssal-ink/60 font-body leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-16">
              <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink mb-4">Pricing</h2>
              <p className="text-abyssal-ink/50 mb-8 font-body">SaaS MVP from $499/£399/€450/₹49,999. Production SaaS from $1,999/£1,599/€1,800/₹1,99,999.</p>
              <Link to="/contact" className="inline-flex min-h-12 items-center justify-center magnetic-btn bg-digital-orange text-white px-6 sm:px-8 py-4 rounded-[800px] text-base font-semibold font-body">
                Get a Quote
              </Link>
            </div>

            <AEOBlock {...SAAS_AEO} />

            <div id="inquiry-form">
              <ServiceInquiryForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}