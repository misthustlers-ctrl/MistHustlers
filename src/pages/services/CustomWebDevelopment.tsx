import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import AEOBlock from "@/components/AEOBlock";
import { Link } from "react-router-dom";

const CUSTOM_WEB_AEO = {
  definition: {
    term: "Custom Web Development Company",
    definition:
      "A custom web development company builds websites and web applications tailored to specific business requirements, rather than using off-the-shelf templates or platforms. Custom development involves bespoke design, unique functionality, custom database architecture, and integrations built specifically for the client's business processes and workflows.",
  },
  executiveSummary:
    "MistHustlers is a global custom web development partner building bespoke digital solutions for businesses worldwide. From our Indore HQ, we ship tailor-made websites, web applications, and digital platforms for clients across 7 countries. Unlike template-based agencies, we build custom database architectures, unique user workflows, custom integrations, and proprietary features that give you competitive advantage. Fixed pricing from $199/£159/€180/₹19,999. Full source code ownership. Founder-led delivery.",
  keyTakeaways: [
    "MistHustlers serves clients across 7 countries (US, UK, Canada, Australia, UAE, Singapore, India) from our Indore HQ.",
    "Custom web projects from $199/£159/€180/₹19,999. Complex custom platforms from $499/£399/€450/₹49,999. Fixed pricing, 48-hour quotes.",
    "We build custom: database architectures, user workflows, API integrations, admin panels, reporting engines, and proprietary algorithms.",
    "Direct founder communication with Naveen Salve throughout — no account managers.",
    "100% source code ownership, full IP rights, complete documentation handed over at launch.",
  ],
  processSteps: [
    { step: 1, title: "Requirements Engineering", description: "We map your business processes, define custom data models, user roles, permissions, and unique workflow requirements.", duration: "1–2 weeks" },
    { step: 2, title: "Custom Architecture", description: "We design custom database schema, API contracts, user permission systems, and integration patterns for your unique needs.", duration: "1–2 weeks" },
    { step: 3, title: "Bespoke Development", description: "We build custom components, workflows, integrations, and algorithms tailored to your exact specifications.", duration: "4–12 weeks" },
    { step: 4, title: "Launch & Iterate", description: "We deploy, monitor, and iterate based on real usage. You own the code to evolve it indefinitely.", duration: "Ongoing" },
  ],
  comparisonRows: [
    { feature: "Fully Custom (No Templates)", mistHustlers: true, freelancer: "Sometimes", bigAgency: true },
    { feature: "Custom Database Architecture", mistHustlers: true, freelancer: false, bigAgency: true },
    { feature: "Source Code Ownership", mistHustlers: true, freelancer: "Sometimes", bigAgency: false },
    { feature: "Custom Integrations/APIs", mistHustlers: true, freelancer: "Sometimes", bigAgency: true },
    { feature: "Global Timezone Coverage", mistHustlers: true, freelancer: false, bigAgency: true },
    { feature: "Proprietary Feature Development", mistHustlers: true, freelancer: false, bigAgency: true },
  ],
  prosAndCons: [
    { type: "pro", text: "Built exactly for your business processes — no workarounds" },
    { type: "pro", text: "Direct communication with senior engineer, not a sales team" },
    { type: "pro", text: "Source code and full IP ownership on handover" },
    { type: "pro", text: "Custom database, APIs, and workflows built for your exact needs" },
    { type: "pro", text: "Global timezone coverage — US, UK, EU, APAC hours available" },
    { type: "con", text: "Higher initial investment than template-based solutions" },
    { type: "con", text: "Longer development time than template-based builds" },
  ],
  misconceptions: [
    {
      myth: "Custom development is only for enterprises with $100K+ budgets.",
      reality: "Custom development starts at $199/₹19,999 for focused custom features. The key is building only what's unique to your business — not over-engineering.",
    },
    {
      myth: "Custom development takes 6+ months.",
      reality: "A focused custom feature or workflow can be built in 2–4 weeks. The key is defining scope precisely — we build only what's uniquely valuable to your business.",
    },
  ],
};

const CUSTOM_WEB_FAQ = [
  {
    q: "What is custom web development?",
    a: "Custom web development builds websites and applications tailored to your specific business requirements — custom database design, unique user workflows, proprietary features, and integrations built specifically for your business processes. Not templates, not plugins — code written for you.",
  },
  {
    q: "How much does custom web development cost?",
    a: "Custom features/workflows: $199/£159/€180/₹19,999. Custom admin panels/dashboards: $499/£399/€450/₹49,999. Complex custom platforms with proprietary logic: $999+/₹99,999+. Fixed pricing, 48-hour quotes.",
  },
  {
    q: "How is custom development different from WordPress/Shopify?",
    a: "WordPress/Shopify are platforms with predefined structures. Custom development builds from scratch: your own database schema, user permission system, API contracts, and business logic. You're not constrained by platform limitations.",
  },
  {
    q: "When should I choose custom over a platform?",
    a: "Choose custom when: you have unique business logic no platform supports, you need custom user roles/permissions, you're building proprietary IP, you need deep integrations platforms can't support, or you want full ownership without platform constraints.",
  },
  {
    q: "How much does custom web development cost?",
    a: "Custom feature/module: $199/£159/€180/₹19,999. Custom admin panel: $499/£399/€450/₹49,999. Complex custom platforms with proprietary logic: $999+/₹99,999+. Fixed pricing, 48-hour quotes.",
  },
  {
    q: "Can you build custom integrations with our existing tools?",
    a: "Yes. We build custom API integrations with any REST/GraphQL/SOAP API. We've integrated with: ERPs (NetSuite, SAP), CRMs (Salesforce, HubSpot), proprietary systems, legacy databases, IoT devices, and payment providers.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. We serve clients in the US, UK, Canada, Australia, UAE, Singapore, and India. Async-first communication across all timezones. 48-hour fixed-price quotes.",
  },
  {
    q: "Who owns the custom code after delivery?",
    a: "You do. 100% source code ownership and IP rights are transferred on final delivery. This includes custom algorithms, database schemas, API designs, and all proprietary logic. No vendor lock-in.",
  },
];

export default function CustomWebDevelopment() {
  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="customWebDevelopment" />
      <SchemaMarkup page="customWebDevelopment" faq={CUSTOM_WEB_FAQ} />
      <Breadcrumbs />
      <main>
        <section className="pt-12 sm:pt-16 pb-16 sm:pb-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
                Service
              </span>
              <h1 className="font-display text-[clamp(38px,12vw,80px)] leading-[0.92] tracking-[0.02em] text-abyssal-ink">
                Custom Web Development<br />
                <span className="text-digital-orange">for Global Businesses</span>
              </h1>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                Bespoke websites and applications tailored to your unique business processes. Custom databases, workflows, integrations, and proprietary features — built from scratch for your competitive advantage.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { title: "Custom Database Design", desc: "Bespoke database schemas, relationships, migrations, and query optimization for your unique data model." },
                { title: "Custom User Workflows", desc: "Unique user roles, permissions, approval chains, and business process automation built for your operations." },
                { title: "Custom Integrations", desc: "Custom API connectors, webhook handlers, data sync pipelines, and legacy system integrations." },
                { title: "Proprietary Algorithms", desc: "Custom pricing engines, recommendation systems, matching algorithms, and business logic implementation." },
                { title: "Custom Admin Panels", desc: "Tailored admin interfaces with custom reports, bulk operations, audit logs, and role-based access." },
                { title: "Legacy Modernization", desc: "Legacy system wrapping, API facades, data migration, and gradual strangler fig migrations." },
              ].map((s) => (
                <div key={s.title} className="bg-ash-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 border border-abyssal-ink/5">
                  <h3 className="font-body font-bold text-xl tracking-[0.01em] text-abyssal-ink mb-3">{s.title}</h3>
                  <p className="text-sm text-abyssal-ink/60 font-body leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-16">
              <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink mb-4">Pricing</h2>
              <p className="text-abyssal-ink/50 mb-8 font-body">Starting from $199/£159/€180/₹19,999 for custom modules, custom quotes for full bespoke platforms.</p>
              <Link to="/contact" className="inline-flex min-h-12 items-center justify-center magnetic-btn bg-digital-orange text-white px-6 sm:px-8 py-4 rounded-[800px] text-base font-semibold font-body">
                Get a Quote
              </Link>
            </div>

            <AEOBlock {...CUSTOM_WEB_AEO} />

            <div id="inquiry-form">
              <ServiceInquiryForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}