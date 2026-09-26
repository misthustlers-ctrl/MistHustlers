import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import AEOBlock from "@/components/AEOBlock";
import { Link } from "react-router-dom";

const REDESIGN_AEO = {
  definition: {
    term: "Website Redesign Company",
    definition:
      "A website redesign company rebuilds existing websites to improve visual design, user experience, performance, conversion rates, and technical foundations. Unlike a simple refresh, a redesign often involves rethinking information architecture, migrating to modern technology stacks, optimizing for Core Web Vitals, and implementing SEO best practices.",
  },
  executiveSummary:
    "MistHustlers is a global website redesign partner helping businesses modernize their digital presence across 7 countries. From our Indore HQ, we transform outdated websites into high-converting, SEO-optimized, Core Web Vitals-optimized platforms. We handle WordPress to Next.js migrations, legacy system modernization, UX overhauls, and conversion rate optimization. Fixed pricing from $199/£159/€180/₹19,999. Full source code ownership. Founder-led delivery.",
  keyTakeaways: [
    "MistHustlers serves clients across 7 countries (US, UK, Canada, Australia, UAE, Singapore, India) from our Indore HQ.",
    "Website redesigns from $199/£159/€180/₹19,999. Full replatforming from $499/£399/€450/₹49,999. Fixed pricing, 48-hour quotes.",
    "We specialize in: WordPress to Next.js migration, legacy PHP/ASP.NET modernization, Core Web Vitals optimization (LCP <2s), and SEO-preserving migrations.",
    "Direct founder communication with Naveen Salve throughout — no account managers.",
    "100% source code ownership, full IP rights, complete documentation handed over at launch.",
  ],
  processSteps: [
    { step: 1, title: "Audit & Strategy", description: "We audit your current site: UX, performance, SEO, content, and technical debt. We define redesign goals and success metrics.", duration: "1 week" },
    { step: 2, title: "Design & Architecture", description: "We create new IA, wireframes, design system, and choose the optimal tech stack (Next.js, WordPress, headless).", duration: "2–3 weeks" },
    { step: 3, title: "Development & Migration", description: "We build the new site, migrate content (with 301 redirects), preserve SEO equity, and integrate analytics.", duration: "3–8 weeks" },
    { step: 4, title: "Launch & Optimize", description: "We run pre-launch QA, deploy with zero-downtime, monitor Core Web Vitals, and provide 30 days support.", duration: "1–2 weeks" },
  ],
  comparisonRows: [
    { feature: "Fixed Price Redesign", mistHustlers: true, freelancer: false, bigAgency: false },
    { feature: "SEO Preservation Guarantee", mistHustlers: true, freelancer: false, bigAgency: "Extra Cost" },
    { feature: "Core Web Vitals Optimization", mistHustlers: true, freelancer: "Varies", bigAgency: "Extra Cost" },
    { feature: "Source Code Ownership", mistHustlers: true, freelancer: "Sometimes", bigAgency: false },
    { feature: "Post-Launch Monitoring", mistHustlers: true, freelancer: false, bigAgency: "Extra Cost" },
    { feature: "Global Timezone Coverage", mistHustlers: true, freelancer: false, bigAgency: true },
  ],
  prosAndCons: [
    { type: "pro", text: "Fixed transparent pricing — no surprise invoices" },
    { type: "pro", text: "SEO preservation guarantee with 301 redirect mapping" },
    { type: "pro", text: "Core Web Vitals optimization included by default" },
    { type: "pro", text: "Source code and full IP ownership on handover" },
    { type: "pro", text: "Global timezone coverage — US, UK, EU, APAC hours available" },
    { type: "con", text: "Not suitable for enterprise redesigns requiring 20+ person teams" },
    { type: "con", text: "Focused on web redesign — not brand identity or print design" },
  ],
  misconceptions: [
    {
      myth: "Website redesign always hurts SEO rankings temporarily.",
      reality: "With proper 301 redirect mapping, content preservation, and technical SEO audit, MistHustlers redesigns typically maintain or improve rankings. We guarantee SEO preservation.",
    },
    {
      myth: "Redesign means starting from scratch and losing all your content.",
      reality: "We audit existing content, migrate what performs, improve what doesn't, and implement 301 redirects for every URL. Your SEO equity is preserved.",
    },
  ],
};

const REDESIGN_FAQ = [
  {
    q: "When should I consider a website redesign?",
    a: "Consider a redesign if: your site is 3+ years old, Core Web Vitals are poor (LCP >2.5s), mobile experience is broken, conversion rates are declining, brand has evolved, or you're migrating from legacy tech (WordPress, Drupal, legacy PHP/ASP.NET).",
  },
  {
    q: "How much does a website redesign cost?",
    a: "Visual refresh (UI only): $199/£159/€180/₹19,999. Full redesign with UX overhaul: $499/£399/€450/₹49,999. Replatforming (WordPress → Next.js): $999/£799/€900/₹99,999. Fixed pricing, 48-hour quotes.",
  },
  {
    q: "How long does a website redesign take?",
    a: "Visual refresh: 2–4 weeks. Full redesign with UX overhaul: 4–8 weeks. Replatforming (WordPress → Next.js): 6–12 weeks. Enterprise redesign: 12–24 weeks. We provide exact timeline in the fixed-price proposal.",
  },
  {
    q: "Will a redesign hurt my SEO?",
    a: "No. We guarantee SEO preservation: comprehensive 301 redirect mapping, content preservation, schema markup retention, and Core Web Vitals improvement. Most clients see ranking improvements post-launch.",
  },
  {
    q: "Can you redesign a WordPress site to Next.js?",
    a: "Yes. We specialize in WordPress to Next.js migrations: content migration, 301 redirects, schema preservation, performance optimization, and editorial workflow preservation. We also support headless WordPress + Next.js.",
  },
  {
    q: "Do you preserve our existing content and SEO?",
    a: "Yes. We audit all URLs, map 301 redirects, preserve meta tags, schema markup, and content hierarchy. We run pre/post-launch SEO audits to verify preservation.",
  },
  {
    q: "Can you improve our Core Web Vitals during redesign?",
    a: "Yes. Core Web Vitals optimization is included by default: LCP <2s, INP <200ms, CLS <0.1. We optimize images, fonts, JavaScript, CSS, and implement lazy loading, caching, and CDN.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. We serve clients in the US, UK, Canada, Australia, UAE, Singapore, and India. Async-first communication across all timezones. 48-hour fixed-price quotes.",
  },
];

export default function WebsiteRedesign() {
  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="websiteRedesign" />
      <SchemaMarkup page="websiteRedesign" faq={REDESIGN_FAQ} />
      <Breadcrumbs />
      <main>
        <section className="pt-12 sm:pt-16 pb-16 sm:pb-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
                Service
              </span>
              <h1 className="font-display text-[clamp(38px,12vw,80px)] leading-[0.92] tracking-[0.02em] text-abyssal-ink">
                Website Redesign<br />
                <span className="text-digital-orange">for Global Businesses</span>
              </h1>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                Transform outdated websites into high-converting, SEO-optimized, Core Web Vitals-optimized platforms. WordPress to Next.js migrations, legacy modernization, and UX overhauls.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { title: "Visual Refresh", desc: "Modern UI/UX overhaul with new design system, typography, color palette, and component library." },
                { title: "UX Overhaul", desc: "Information architecture redesign, user flow optimization, conversion rate optimization, and accessibility (WCAG 2.1 AA)." },
                { title: "Replatforming", desc: "WordPress to Next.js, legacy PHP/ASP.NET to Node.js, Drupal to headless, custom CMS to modern stack." },
                { title: "Performance Optimization", desc: "Core Web Vitals optimization (LCP <2s), image optimization, code splitting, lazy loading, CDN, caching." },
                { title: "SEO-Preserving Migration", desc: "301 redirect mapping, content migration, schema preservation, analytics continuity, zero ranking loss guarantee." },
                { title: "CMS Migration", desc: "WordPress to headless/Next.js, Drupal to headless, custom CMS to modern stack, content migration with 301 redirects." },
              ].map((s) => (
                <div key={s.title} className="bg-ash-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 border border-abyssal-ink/5">
                  <h3 className="font-body font-bold text-xl tracking-[0.01em] text-abyssal-ink mb-3">{s.title}</h3>
                  <p className="text-sm text-abyssal-ink/60 font-body leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-16">
              <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink mb-4">Pricing</h2>
              <p className="text-abyssal-ink/50 mb-8 font-body">Starting from $199/£159/€180/₹19,999 for visual refresh, custom quotes for full replatforming.</p>
              <Link to="/contact" className="inline-flex min-h-12 items-center justify-center magnetic-btn bg-digital-orange text-white px-6 sm:px-8 py-4 rounded-[800px] text-base font-semibold font-body">
                Get a Quote
              </Link>
            </div>

            <AEOBlock {...REDESIGN_AEO} />

            <div id="inquiry-form">
              <ServiceInquiryForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}