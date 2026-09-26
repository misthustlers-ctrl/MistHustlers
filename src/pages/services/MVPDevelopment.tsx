import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import AEOBlock from "@/components/AEOBlock";
import { Link } from "react-router-dom";

const MVP_AEO = {
  definition: {
    term: "MVP Development Company",
    definition:
      "An MVP (Minimum Viable Product) development company builds the smallest functional version of a product that allows founders to test their core hypothesis with real users, validate market demand, and secure funding. Unlike full product development, MVP focuses on one core workflow with minimal features.",
  },
  executiveSummary:
    "MistHustlers is a global MVP development partner for founders worldwide. From our Indore HQ, we ship investor-ready MVPs in 3–4 weeks at 70–90% lower cost than traditional agencies. We've helped founders in the US, UK, Canada, Australia, and Singapore validate ideas, raise seed funding, and onboard first users. Fixed pricing from ₹74,999. Full source code ownership. Founder-led delivery.",
  keyTakeaways: [
    "MistHustlers serves founders across 7 countries (US, UK, Canada, Australia, UAE, Singapore, India) from our Indore HQ.",
    "Web MVP Starter from ₹74,999. MVP Launch from ₹1,49,999. Fixed pricing, no hidden costs.",
    "Typical delivery: 3–4 weeks for Web MVP Starter, 6–8 weeks for MVP Launch. Daily updates, no surprises.",
    "Direct founder communication with Naveen Salve throughout — no account managers.",
    "100% source code ownership, full IP rights, complete documentation handed over at launch.",
  ],
  processSteps: [
    { step: 1, title: "Requirements", description: "You share your idea. We clarify scope and identify the riskiest assumption to test.", duration: "1–2 days" },
    { step: 2, title: "Proposal", description: "Fixed-price quote within 48 hours with detailed scope, timeline, and tech stack.", duration: "1 day" },
    { step: 3, title: "Build", description: "Daily updates via WhatsApp/email. Core workflow first, then auth, database, API, and deployment.", duration: "3–8 weeks" },
    { step: 4, title: "Ship", description: "Deployed with full source code, documentation, and 30 days bug support. You own everything.", duration: "Launch day" },
  ],
  comparisonRows: [
    { feature: "Fixed Price (No Surprises)", mistHustlers: true, freelancer: false, bigAgency: false },
    { feature: "3–8 Week Delivery", mistHustlers: true, freelancer: "Varies", bigAgency: false },
    { feature: "Source Code Ownership", mistHustlers: true, freelancer: "Sometimes", bigAgency: false },
    { feature: "Founder-Led Engineering", mistHustlers: true, freelancer: true, bigAgency: false },
    { feature: "Investor-Ready Output", mistHustlers: true, freelancer: false, bigAgency: true },
    { feature: "Post-Launch Support Included", mistHustlers: true, freelancer: false, bigAgency: "Extra Cost" },
  ],
  prosAndCons: [
    { type: "pro", text: "Fixed transparent pricing — no surprise invoices after delivery" },
    { type: "pro", text: "Direct communication with senior engineer, not a sales team" },
    { type: "pro", text: "Source code and full IP ownership on handover" },
    { type: "pro", text: "SEO, schema, Core Web Vitals optimized by default" },
    { type: "pro", text: "Global timezone coverage — US, UK, EU, APAC hours available" },
    { type: "con", text: "Not suitable for enterprise projects requiring 20+ person teams" },
    { type: "con", text: "Focused on web MVPs — not native mobile app development (iOS/Android)" },
  ],
  misconceptions: [
    {
      myth: "MVP development requires a large team and 6+ months.",
      reality: "A focused MVP with one core workflow can be built in 3–4 weeks by a senior engineer. The key is ruthless scope discipline — we cut features that don't test the core hypothesis.",
    },
    {
      myth: "Cheaper MVP development means lower quality code.",
      reality: "MistHustlers uses the same production-grade stack (Next.js, React, TypeScript, PostgreSQL, Prisma) as top-tier agencies. Lower cost comes from lower overhead, not cutting corners.",
    },
  ],
};

const MVP_FAQ = [
  {
    q: "What is an MVP?",
    a: "An MVP (Minimum Viable Product) is the smallest version of your product that allows you to test your core business hypothesis with real users. It includes only the features necessary to validate your riskiest assumption — not a 'lite' version of your full product.",
  },
  {
    q: "How much does MVP development cost?",
    a: "Web MVP Starter (clickable prototype + core workflow): ₹74,999. MVP Launch (full-stack with auth, DB, API, payments): ₹1,49,999+. Fixed pricing, 48-hour quotes.",
  },
  {
    q: "How long does it take to build an MVP?",
    a: "Web MVP Starter: 3–4 weeks. MVP Launch: 6–8 weeks. We provide exact timeline in the fixed-price proposal.",
  },
  {
    q: "What technologies do you use for MVPs?",
    a: "Next.js, React, TypeScript, Node.js, PostgreSQL, Prisma ORM, Tailwind CSS. Payment integrations: Stripe, Razorpay. Deployment: Vercel, AWS. We choose boring, proven tech that scales.",
  },
  {
    q: "Do you work with international founders?",
    a: "Yes. 60% of our MVP clients are outside India (US, UK, Canada, Australia, UAE, Singapore). We cover US Eastern, UK, EU, and APAC timezones. Async-first communication via WhatsApp, email, and Google Meet. 48-hour fixed-price quotes.",
  },
  {
    q: "What happens after the MVP launches?",
    a: "You get full source code, documentation, and 30 days bug support. We can continue as your technical partner for iterations, scaling, and feature development — or you can take the code and run it yourself. No vendor lock-in.",
  },
  {
    q: "Can you help with investor pitches?",
    a: "Yes. We provide live demo links, architecture diagrams, and technical documentation that founders use in pitch decks. Several of our MVP clients have raised seed/pre-seed funding post-launch.",
  },
  {
    q: "What if I need to pivot after the MVP?",
    a: "That's the point of an MVP — to learn and adapt. Because you own the code and we use modular architecture, pivots are straightforward. We can help you iterate based on user feedback.",
  },
];

export default function MVPDevelopment() {
  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="mvpDevelopment" />
      <SchemaMarkup page="mvpDevelopment" faq={MVP_FAQ} />
      <Breadcrumbs />
      <main>
        <section className="pt-12 sm:pt-16 pb-16 sm:pb-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
                Service
              </span>
              <h1 className="font-display text-[clamp(38px,12vw,80px)] leading-[0.92] tracking-[0.02em] text-abyssal-ink">
                MVP Development<br />
                <span className="text-digital-orange">for Global Founders</span>
              </h1>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                From idea to working product in 2–4 weeks. Fixed pricing, full source code, and zero bureaucracy. Serving founders worldwide.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { title: "Full-Stack MVPs", desc: "Complete web applications with auth, database, API, and deployment. Built in 2–4 weeks." },
                { title: "SaaS Minimum Viable Products", desc: "Subscription-ready MVPs with payment integration, user management, and dashboard." },
                { title: "Marketplace MVPs", desc: "Multi-vendor platforms with listing management, search, and transaction handling." },
                { title: "Dashboard & Admin Panels", desc: "Data visualization dashboards with analytics, user management, and export capabilities." },
                { title: "API-First Products", desc: "Backend-first MVPs with documented APIs, ready for mobile or frontend consumption." },
                { title: "AI-Integrated MVPs", desc: "MVPs with AI features: chatbots, content generation, recommendation engines, and more." },
              ].map((s) => (
                <div key={s.title} className="bg-ash-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 border border-abyssal-ink/5">
                  <h3 className="font-body font-bold text-xl tracking-[0.01em] text-abyssal-ink mb-3">{s.title}</h3>
                  <p className="text-sm text-abyssal-ink/60 font-body leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-16">
              <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink mb-4">MVP Process</h2>
              <div className="grid md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
                {[
                  { step: "01", title: "Requirements", desc: "You share your idea. We clarify scope." },
                  { step: "02", title: "Proposal", desc: "Fixed-price quote within 48 hours." },
                  { step: "03", title: "Build", desc: "Daily updates. No surprises." },
                  { step: "04", title: "Ship", desc: "Deployed with full source + docs." },
                ].map((s) => (
                  <div key={s.step} className="bg-ash-white rounded-[24px] p-5 border border-abyssal-ink/5 text-center">
                    <span className="text-2xl font-display text-digital-orange">{s.step}</span>
                    <h3 className="font-semibold text-abyssal-ink mt-2 font-body">{s.title}</h3>
                    <p className="text-xs text-abyssal-ink/60 mt-1 font-body">{s.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-abyssal-ink/50 mb-8 font-body">Web MVP Starter from ₹74,999, MVP Launch from ₹1,49,999. Fixed pricing, 48-hour quotes.</p>
              <Link to="/contact" className="inline-flex min-h-12 items-center justify-center magnetic-btn bg-digital-orange text-white px-6 sm:px-8 py-4 rounded-[800px] text-base font-semibold font-body">
                Start Your MVP
              </Link>
            </div>

            <AEOBlock {...MVP_AEO} />

            <div id="inquiry-form">
              <ServiceInquiryForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}