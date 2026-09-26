import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import AEOBlock from "@/components/AEOBlock";
import { Link } from "react-router-dom";

const WEB_APP_AEO = {
  definition: {
    term: "Web Application Development Company",
    definition:
      "A web application development company builds browser-based software applications that run on web servers and are accessed via web browsers. Unlike static websites, web applications include dynamic functionality such as user authentication, database interactions, real-time data processing, APIs, and complex business logic.",
  },
  executiveSummary:
    "MistHustlers is a global web application development partner building custom web apps for businesses worldwide. From our Indore HQ, we ship production-grade React, Next.js, Node.js, and TypeScript applications for clients across 7 countries. We build SaaS platforms, admin dashboards, customer portals, marketplace platforms, and API-first products. Fixed pricing from $199/£159/€180/₹19,999. Full source code ownership. Founder-led delivery.",
  keyTakeaways: [
    "MistHustlers serves clients across 7 countries (US, UK, Canada, Australia, UAE, Singapore, India) from our Indore HQ.",
    "Custom web apps from $199/£159/€180/₹19,999. SaaS platforms from $499/£399/€450/₹49,999. Fixed pricing, 48-hour quotes.",
    "Tech stack: Next.js, React, TypeScript, Node.js, PostgreSQL, Prisma, Tailwind CSS, Vercel/AWS.",
    "Direct founder communication with Naveen Salve throughout — no account managers.",
    "100% source code ownership, full IP rights, complete documentation handed over at launch.",
  ],
  processSteps: [
    { step: 1, title: "Discovery & Architecture", description: "We define user roles, data models, API contracts, and technical architecture before writing code.", duration: "1–2 weeks" },
    { step: 2, title: "Core Development", description: "We build auth, database, API layer, and core workflows first. Daily updates via WhatsApp/email.", duration: "3–8 weeks" },
    { step: 3, title: "Frontend & Integration", description: "We build the UI with React/Next.js, connect APIs, implement real-time features, and integrate third-party services.", duration: "2–4 weeks" },
    { step: 4, title: "Testing & Launch", description: "We run automated tests, load testing, security audit, and deploy with zero-downtime CI/CD.", duration: "1–2 weeks" },
  ],
  comparisonRows: [
    { feature: "Fixed Price Web Apps", mistHustlers: true, freelancer: false, bigAgency: false },
    { feature: "Source Code Ownership", mistHustlers: true, freelancer: "Sometimes", bigAgency: false },
    { feature: "Founder-Led Engineering", mistHustlers: true, freelancer: true, bigAgency: false },
    { feature: "Production-Grade Stack", mistHustlers: true, freelancer: "Varies", bigAgency: true },
    { feature: "Global Timezone Coverage", mistHustlers: true, freelancer: false, bigAgency: true },
    { feature: "Post-Launch Support Included", mistHustlers: true, freelancer: false, bigAgency: "Extra Cost" },
  ],
  prosAndCons: [
    { type: "pro", text: "Fixed transparent pricing — no surprise invoices" },
    { type: "pro", text: "Direct communication with senior engineer, not a sales team" },
    { type: "pro", text: "Source code and full IP ownership on handover" },
    { type: "pro", text: "Production-grade stack: Next.js, React, TypeScript, PostgreSQL, Prisma" },
    { type: "pro", text: "Global timezone coverage — US, UK, EU, APAC hours available" },
    { type: "con", text: "Not suitable for enterprise projects requiring 20+ person teams" },
    { type: "con", text: "Focused on web applications — not native mobile app development" },
  ],
  misconceptions: [
    {
      myth: "Custom web applications take 6+ months and cost $100K+.",
      reality: "A focused web application with core workflows can be built in 8–16 weeks by a senior team. The key is ruthless scope discipline — we build what validates the business first.",
    },
    {
      myth: "You need a large team to build a production web application.",
      reality: "A senior full-stack engineer with the right architecture can build a scalable web app. MistHustlers uses modular architecture and proven patterns so 1–2 engineers can ship production-grade apps.",
    },
  ],
};

const WEB_APP_FAQ = [
  {
    q: "What is a web application?",
    a: "A web application is browser-based software that runs on a web server and provides interactive functionality — user accounts, data processing, real-time updates, API integrations — unlike static websites which only display content.",
  },
  {
    q: "How much does custom web application development cost?",
    a: "Simple web apps (auth, dashboard, CRUD): $199/£159/€180/₹19,999. SaaS platforms with payments, multi-tenancy: $499–$1,999/₹49,999–₹1,99,999. Complex platforms: $2,999+/₹2,99,999+. Fixed pricing, 48-hour quotes.",
  },
  {
    q: "How long does web application development take?",
    a: "Simple web apps: 4–8 weeks. SaaS platforms with payments, multi-tenancy: 8–16 weeks. Complex platforms with real-time features: 16–24 weeks. We provide exact timeline in the fixed-price proposal.",
  },
  {
    q: "What technologies do you use for web applications?",
    a: "Next.js, React, TypeScript, Node.js, PostgreSQL, Prisma ORM, Tailwind CSS. Real-time: WebSockets, Server-Sent Events. Payments: Stripe, Razorpay. Deployment: Vercel, AWS. We choose proven, scalable technology.",
  },
  {
    q: "Do you build SaaS applications?",
    a: "Yes. We build multi-tenant SaaS platforms with subscription billing (Stripe), user management, role-based access, admin dashboards, and API access for customers.",
  },
  {
    q: "Can you integrate with our existing systems?",
    a: "Yes. We build REST/GraphQL APIs and integrate with CRMs (HubSpot, Salesforce), ERPs, payment gateways, email services, and third-party APIs via webhooks and scheduled jobs.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. We serve clients in the US, UK, Canada, Australia, UAE, Singapore, and India. Async-first communication via WhatsApp, email, and Google Meet. We cover US Eastern, UK, EU, and APAC timezones. 48-hour fixed-price quotes.",
  },
  {
    q: "Who owns the code after delivery?",
    a: "You do. 100% source code ownership and IP rights are transferred on final delivery. No vendor lock-in, no ongoing license fees for the code we write.",
  },
];

export default function WebApplicationDevelopment() {
  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="webApplicationDevelopment" />
      <SchemaMarkup page="webApplicationDevelopment" faq={WEB_APP_FAQ} />
      <Breadcrumbs />
      <main>
        <section className="pt-12 sm:pt-16 pb-16 sm:pb-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
                Service
              </span>
              <h1 className="font-display text-[clamp(38px,12vw,80px)] leading-[0.92] tracking-[0.02em] text-abyssal-ink">
                Web Application Development<br />
                <span className="text-digital-orange">for Global Businesses</span>
              </h1>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                Custom web applications, SaaS platforms, admin dashboards, and API-first products. Built with Next.js, React, TypeScript, and Node.js. Deployed worldwide.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { title: "SaaS Platforms", desc: "Multi-tenant SaaS with subscription billing, user management, role-based access, and admin dashboards." },
                { title: "Admin Dashboards", desc: "Data visualization, user management, analytics, reporting, and admin panels for business operations." },
                { title: "Customer Portals", desc: "Self-service portals with account management, order history, support tickets, and knowledge bases." },
                { title: "Marketplace Platforms", desc: "Multi-vendor marketplaces with listings, search, transactions, reviews, and seller dashboards." },
                { title: "API-First Products", desc: "Backend-first applications with documented REST/GraphQL APIs, ready for mobile or frontend consumption." },
                { title: "Real-Time Applications", desc: "Collaborative tools, chat apps, live dashboards, and real-time data sync with WebSockets/SSE." },
              ].map((s) => (
                <div key={s.title} className="bg-ash-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 border border-abyssal-ink/5">
                  <h3 className="font-body font-bold text-xl tracking-[0.01em] text-abyssal-ink mb-3">{s.title}</h3>
                  <p className="text-sm text-abyssal-ink/60 font-body leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-16">
              <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink mb-4">Pricing</h2>
              <p className="text-abyssal-ink/50 mb-8 font-body">Starting from $199/£159/€180/₹19,999 for simple web apps, custom quotes for larger platforms.</p>
              <Link to="/contact" className="inline-flex min-h-12 items-center justify-center magnetic-btn bg-digital-orange text-white px-6 sm:px-8 py-4 rounded-[800px] text-base font-semibold font-body">
                Get a Quote
              </Link>
            </div>

            <AEOBlock {...WEB_APP_AEO} />

            <div id="inquiry-form">
              <ServiceInquiryForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}