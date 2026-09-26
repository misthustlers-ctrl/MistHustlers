import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import AEOBlock from "@/components/AEOBlock";
import { Link } from "react-router-dom";

const WEB_DEV_AEO = {
  definition: {
    term: "Web Development Company",
    definition:
      "A web development company is a technology services firm that designs, builds, and maintains websites and web applications for businesses, startups, and organizations globally. These companies provide services including custom website development, web application development, e-commerce platforms, content management systems, and ongoing maintenance and support.",
  },
  executiveSummary:
    "MistHustlers is a global web development and AI technology partner headquartered in Indore, India. We build custom websites, web applications, and digital products for businesses worldwide — from US and UK startups to enterprises in Australia, UAE, and Singapore. Our founder-led team delivers production-grade React, Next.js, and Node.js solutions with transparent fixed pricing, 48-hour quotes, and complete source code ownership.",
  keyTakeaways: [
    "MistHustlers serves clients across 7 countries (US, UK, Canada, Australia, UAE, Singapore, India) from our Indore HQ.",
    "Fixed pricing starting at ₹14,999 for landing pages, ₹29,999 for business websites, ₹49,999 for growth websites.",
    "Every project includes SEO-optimized markup, JSON-LD schema, Core Web Vitals optimization (LCP <2s), and AI search readiness.",
    "Direct founder communication with Naveen Salve throughout the project — no account managers.",
    "100% source code ownership and IP rights transferred on project delivery.",
  ],
  processSteps: [
    { step: 1, title: "Discovery", description: "We understand your business, target audience, requirements, and expected outcomes before recommending a build path.", duration: "1–2 days" },
    { step: 2, title: "Planning", description: "We define project scope, deliverables, technical approach, milestones, and timeline before development begins.", duration: "2–3 days" },
    { step: 3, title: "Design & Development", description: "We design, develop, test, and share progress throughout execution so the work stays aligned with requirements.", duration: "2–8 weeks" },
    { step: 4, title: "Launch & Support", description: "We deploy the final product, complete project handover with full source code, and provide agreed post-launch support.", duration: "Ongoing" },
  ],
  comparisonRows: [
    { feature: "Fixed Transparent Pricing", mistHustlers: true, freelancer: false, bigAgency: false },
    { feature: "Source Code Handover", mistHustlers: true, freelancer: "Sometimes", bigAgency: false },
    { feature: "Direct Founder Communication", mistHustlers: true, freelancer: true, bigAgency: false },
    { feature: "Global Timezone Coverage", mistHustlers: true, freelancer: false, bigAgency: true },
    { feature: "Post-Delivery Support", mistHustlers: true, freelancer: false, bigAgency: "Extra Cost" },
    { feature: "SEO + Schema Built-In", mistHustlers: true, freelancer: false, bigAgency: "Extra Cost" },
    { feature: "AI Search Optimization", mistHustlers: true, freelancer: false, bigAgency: false },
  ],
  prosAndCons: [
    { type: "pro", text: "Fixed transparent pricing — no surprise invoices after delivery" },
    { type: "pro", text: "Direct communication with senior engineer, not a sales team" },
    { type: "pro", text: "Source code and full IP ownership on handover" },
    { type: "pro", text: "SEO, schema, Core Web Vitals optimized by default on every build" },
    { type: "pro", text: "Global timezone coverage — US, UK, EU, APAC hours available" },
    { type: "con", text: "Not suitable for large enterprise projects requiring 20+ person teams" },
    { type: "con", text: "Focused on web, mobile, and AI — not print or traditional media" },
  ],
  misconceptions: [
    {
      myth: "Indian web agencies are cheaper but lower quality than Western firms.",
      reality: "MistHustlers uses the same production-grade tech stack (React, Next.js, Node.js, PostgreSQL) as top US/EU agencies, but with significantly lower overhead and faster delivery.",
    },
    {
      myth: "You need to be in the same timezone to work effectively with a remote agency.",
      reality: "100% of MistHustlers' client communication, design reviews, and project delivery happens remotely via WhatsApp, Zoom, and Google Meet — we cover US, UK, EU, and APAC business hours.",
    },
  ],
};

export default function WebDevelopment() {
  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="webDevelopment" />
      <SchemaMarkup page="webDevelopment" faq={WEB_DEV_FAQ} />
      <Breadcrumbs />
      <main>
        <section className="pt-12 sm:pt-16 pb-16 sm:pb-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
                Service
              </span>
              <h1 className="font-display text-[clamp(38px,12vw,80px)] leading-[0.92] tracking-[0.02em] text-abyssal-ink">
                Web Development<br />
                <span className="text-digital-orange">for Global Businesses</span>
              </h1>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                Custom business websites, landing pages, and full-stack web applications. Built with modern tech, deployed in days not months. Serving clients worldwide.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { title: "Business Websites", desc: "Multi-page websites with CMS, contact forms, SEO optimization, and analytics integration." },
                { title: "Landing Pages", desc: "High-converting single-page sites with custom design, A/B testing ready, starting at ₹14,999." },
                { title: "Full-Stack Web Apps", desc: "Complete web applications with database, authentication, API integration, and cloud deployment." },
                { title: "E-Commerce Platforms", desc: "Online stores with payment gateway integration, inventory management, and order tracking." },
                { title: "Portfolio Sites", desc: "Showcase your work with custom galleries, case studies, and client testimonial sections." },
                { title: "Corporate Websites", desc: "Professional company websites with team pages, service listings, and blog integration." },
              ].map((s) => (
                <div key={s.title} className="bg-ash-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 border border-abyssal-ink/5">
                  <h3 className="font-body font-bold text-xl tracking-[0.01em] text-abyssal-ink mb-3">{s.title}</h3>
                  <p className="text-sm text-abyssal-ink/60 font-body leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-16">
              <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink mb-4">Pricing</h2>
              <p className="text-abyssal-ink/50 mb-8 font-body">Starting from ₹14,999 for landing pages, ₹29,999 for business websites, custom quotes for larger projects.</p>
              <Link to="/contact" className="inline-flex min-h-12 items-center justify-center magnetic-btn bg-digital-orange text-white px-6 sm:px-8 py-4 rounded-[800px] text-base font-semibold font-body">
                Get a Quote
              </Link>
            </div>

            <AEOBlock {...WEB_DEV_AEO} />

            <div id="inquiry-form">
              <ServiceInquiryForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const WEB_DEV_FAQ = [
  {
    q: "What is web development?",
    a: "Web development is the process of building and maintaining websites and web applications. It involves front-end development (what users see), back-end development (server logic, databases), and often DevOps for deployment and hosting.",
  },
  {
    q: "How much does custom web development cost?",
    a: "Custom web development costs vary by scope. Landing pages start at ₹14,999. Business websites (up to 7 pages) start at ₹29,999. Growth websites (up to 15 pages) start at ₹49,999. Complex web applications with databases, authentication, and APIs start at ₹2,49,999+. MistHustlers provides fixed-price quotes within 48 hours.",
  },
  {
    q: "How long does website development take?",
    a: "Timeline depends on scope. Landing pages: 5–7 working days. Business websites (up to 7 pages): 10–14 working days. Growth websites (up to 15 pages): 3–4 weeks. Full-stack web applications with database, auth, and APIs: 4–16 weeks. MVPs: 3–4 weeks.",
  },
  {
    q: "What technologies do you use for web development?",
    a: "MistHustlers primarily uses React, Next.js, TypeScript, Node.js, PostgreSQL, and Tailwind CSS. We also work with WordPress for content-heavy sites and use AI integration platforms for workflow automation.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. 60% of our clients are outside India. We work US Eastern (6:30–9:30 PM IST), UK (1:00–4:00 PM IST), EU, and APAC timezones. All communication is async-first via WhatsApp, email, and Google Meet.",
  },
  {
    q: "Who owns the code after delivery?",
    a: "You do. 100% source code ownership and IP rights are transferred on final delivery. No vendor lock-in, no ongoing license fees for the code we write.",
  },
  {
    q: "Can you redesign an existing website?",
    a: "Yes. We offer website redesign services including visual redesign, UX improvement, technology migration (e.g., WordPress to Next.js), performance optimization, and SEO preservation.",
  },
  {
    q: "What is included in your web development packages?",
    a: "All packages include: responsive design, SEO-optimized markup, JSON-LD schema, Core Web Vitals optimization (LCP <2s), analytics setup, SSL/deployment, and 15–30 days bug support. Source code and documentation included.",
  },
];