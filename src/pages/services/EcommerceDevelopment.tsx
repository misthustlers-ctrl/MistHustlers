import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import AEOBlock from "@/components/AEOBlock";
import { Link } from "react-router-dom";

const ECOMMERCE_AEO = {
  definition: {
    term: "Ecommerce Development Company",
    definition:
      "An ecommerce development company builds online stores and digital commerce platforms that enable businesses to sell products and services online. This includes shopping carts, payment gateway integration, inventory management, order processing, customer accounts, and integration with shipping and tax providers.",
  },
  executiveSummary:
    "MistHustlers is a global ecommerce development partner building online stores for businesses worldwide. From our Indore HQ, we ship custom Shopify, WooCommerce, and headless commerce solutions for clients across 7 countries. We build D2C brands, B2B wholesale portals, marketplace platforms, and subscription commerce. Fixed pricing from $99/£79/€90/₹9,999. Full source code ownership. Founder-led delivery.",
  keyTakeaways: [
    "MistHustlers serves clients across 7 countries (US, UK, Canada, Australia, UAE, Singapore, India) from our Indore HQ.",
    "Shopify stores from $99/£79/€90/₹9,999. Custom headless commerce from $499/£399/€450/₹49,999. Fixed pricing, 48-hour quotes.",
    "Platforms: Shopify, WooCommerce, headless (Next.js + Shopify/BigCommerce), custom Node.js/PostgreSQL.",
    "Direct founder communication with Naveen Salve throughout — no account managers.",
    "100% source code ownership, full IP rights, complete documentation handed over at launch.",
  ],
  processSteps: [
    { step: 1, title: "Strategy & Platform Selection", description: "We help you choose the right platform (Shopify, WooCommerce, headless) based on your catalog, scale, and technical requirements.", duration: "1 week" },
    { step: 2, title: "Design & UX", description: "We design conversion-optimized product pages, checkout flows, and mobile-first shopping experiences.", duration: "2–3 weeks" },
    { step: 3, title: "Development & Integrations", description: "We build the store, integrate payments (Stripe/Razorpay), shipping, tax, ERP/CRM, and email marketing.", duration: "3–8 weeks" },
    { step: 4, title: "Launch & Optimization", description: "We run QA, load testing, SEO audit, and launch with 30 days support + analytics setup.", duration: "1–2 weeks" },
  ],
  comparisonRows: [
    { feature: "Fixed Price Ecommerce", mistHustlers: true, freelancer: false, bigAgency: false },
    { feature: "Source Code Ownership", mistHustlers: true, freelancer: "Sometimes", bigAgency: false },
    { feature: "Platform Agnostic", mistHustlers: true, freelancer: "Sometimes", bigAgency: false },
    { feature: "Custom Checkout/Features", mistHustlers: true, freelancer: "Varies", bigAgency: true },
    { feature: "Global Timezone Coverage", mistHustlers: true, freelancer: false, bigAgency: true },
    { feature: "Post-Launch Support Included", mistHustlers: true, freelancer: false, bigAgency: "Extra Cost" },
  ],
  prosAndCons: [
    { type: "pro", text: "Fixed transparent pricing — no surprise invoices" },
    { type: "pro", text: "Direct communication with senior engineer, not a sales team" },
    { type: "pro", text: "Source code and full IP ownership on handover" },
    { type: "pro", text: "Platform agnostic — Shopify, WooCommerce, headless, or custom" },
    { type: "pro", text: "Global timezone coverage — US, UK, EU, APAC hours available" },
    { type: "con", text: "Not suitable for enterprise Magento/Enterprise projects requiring 50+ person teams" },
    { type: "con", text: "Focused on web commerce — not POS or native mobile app development" },
  ],
  misconceptions: [
    {
      myth: "Shopify is only for small stores — enterprise needs custom Magento.",
      reality: "Shopify Plus handles $100M+ GMV brands. Headless Shopify + Next.js gives enterprise flexibility with lower TCO. MistHustlers builds both.",
    },
    {
      myth: "Ecommerce development is just installing a theme and adding products.",
      reality: "Production ecommerce requires: custom checkout flows, inventory sync, multi-currency/tax, subscription billing, B2B wholesale logic, ERP/CRM integration, and performance optimization for Core Web Vitals.",
    },
  ],
};

const ECOMMERCE_FAQ = [
  {
    q: "What ecommerce platforms do you build on?",
    a: "We work with Shopify/Shopify Plus, WooCommerce, headless commerce (Next.js + Shopify/BigCommerce/BigCommerce), and custom Node.js/PostgreSQL builds. We recommend the platform based on your catalog size, complexity, and growth plans.",
  },
  {
    q: "How much does ecommerce development cost?",
    a: "Shopify store setup: $99/£79/€90/₹9,999. Custom Shopify theme: $299/£239/€270/₹29,999. Headless commerce (Next.js + Shopify): $499/£399/€450/₹49,999. Custom B2B wholesale portal: $999+/₹99,999+. Fixed pricing, 48-hour quotes.",
  },
  {
    q: "How long does ecommerce development take?",
    a: "Shopify store: 2–4 weeks. Custom theme: 4–6 weeks. Headless commerce: 6–12 weeks. B2B wholesale portal: 8–16 weeks. We provide exact timeline in the fixed-price proposal.",
  },
  {
    q: "What payment gateways do you integrate?",
    a: "Stripe, Razorpay, PayPal, Square, Adyen, and local gateways (Paytm, PhonePe, etc.). We also implement subscription billing (Stripe Billing, Recharge), Apple Pay, Google Pay, and buy-now-pay-later (Klarna, Afterpay).",
  },
  {
    q: "Can you migrate from another platform?",
    a: "Yes. We handle migrations from Magento, BigCommerce, Wix, Squarespace, and custom platforms — including product data, customer accounts, order history, SEO redirects, and SEO preservation.",
  },
  {
    q: "Do you build B2B wholesale portals?",
    a: "Yes. We build B2B ecommerce with: customer-specific pricing, minimum order quantities, net payment terms, quote-to-order workflows, sales rep portals, and ERP integration (NetSuite, SAP, custom).",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. We serve clients in the US, UK, Canada, Australia, UAE, Singapore, and India. Multi-currency, multi-language, and regional tax compliance built-in. Async-first communication across all timezones.",
  },
  {
    q: "Who owns the code after delivery?",
    a: "You do. 100% source code ownership and IP rights are transferred on final delivery. For Shopify, you own the theme code and app configurations. No vendor lock-in.",
  },
];

export default function EcommerceDevelopment() {
  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="ecommerceDevelopment" />
      <SchemaMarkup page="ecommerceDevelopment" faq={ECOMMERCE_FAQ} />
      <Breadcrumbs />
      <main>
        <section className="pt-12 sm:pt-16 pb-16 sm:pb-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
                Service
              </span>
              <h1 className="font-display text-[clamp(38px,12vw,80px)] leading-[0.92] tracking-[0.02em] text-abyssal-ink">
                Ecommerce Development<br />
                <span className="text-digital-orange">for Global Brands</span>
              </h1>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                Custom Shopify, WooCommerce, headless commerce, and B2B wholesale portals. Built for conversion, scale, and global sales.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { title: "Shopify Stores", desc: "Custom Shopify/Shopify Plus themes, app integrations, and conversion-optimized checkout." },
                { title: "Headless Commerce", desc: "Next.js + Shopify/BigCommerce for full design freedom, performance, and omnichannel selling." },
                { title: "WooCommerce", desc: "Custom WordPress + WooCommerce builds with custom plugins, subscriptions, and B2B features." },
                { title: "B2B Wholesale Portals", desc: "Customer-specific pricing, MOQs, net terms, quote-to-order, sales rep portals, ERP integration." },
                { title: "Subscription Commerce", desc: "Recurring billing, subscription management, customer portal, dunning, and churn reduction." },
                { title: "Marketplace Platforms", desc: "Multi-vendor marketplaces with seller dashboards, commissions, payouts, and moderation." },
              ].map((s) => (
                <div key={s.title} className="bg-ash-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 border border-abyssal-ink/5">
                  <h3 className="font-body font-bold text-xl tracking-[0.01em] text-abyssal-ink mb-3">{s.title}</h3>
                  <p className="text-sm text-abyssal-ink/60 font-body leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-16">
              <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink mb-4">Pricing</h2>
              <p className="text-abyssal-ink/50 mb-8 font-body">Starting from $99/£79/€90/₹9,999 for Shopify stores, custom quotes for headless and B2B platforms.</p>
              <Link to="/contact" className="inline-flex min-h-12 items-center justify-center magnetic-btn bg-digital-orange text-white px-6 sm:px-8 py-4 rounded-[800px] text-base font-semibold font-body">
                Get a Quote
              </Link>
            </div>

            <AEOBlock {...ECOMMERCE_AEO} />

            <div id="inquiry-form">
              <ServiceInquiryForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}