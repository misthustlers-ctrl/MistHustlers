import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustSection from "@/components/TrustSection";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import FAQItem from "@/components/FAQItem";
import { CheckCircle, ShieldCheck } from "lucide-react";

const PACKAGES = [
  {
    name: "Launch Landing Page",
    price: "₹3,999",
    period: "one-time",
    tagline: "Ideal for fast product launches & marketing campaigns",
    features: [
      "1 High-Converting Responsive Page",
      "Figma UI Design + Clean React Code",
      "Contact Form & WhatsApp Integration",
      "SEO Meta Tags & Speed Optimization",
      "Source Code Handover",
      "Delivery in 3 to 5 Days",
    ],
  },
  {
    name: "Business Starter Website",
    price: "₹7,999",
    period: "one-time",
    popular: true,
    tagline: "Complete website for local businesses & service providers in Indore",
    features: [
      "Up to 5 Custom Pages (Home, About, Services, Projects, Contact)",
      "SEO Titles, Descriptions & Schema Markup",
      "Google Maps & Local Business NAP Embed",
      "Mobile-First Responsive Layout",
      "1 Year Technical Support & Updates",
      "Delivery in 7 to 10 Days",
    ],
  },
  {
    name: "Business Growth Package",
    price: "₹12,999",
    period: "one-time",
    tagline: "For growing companies requiring CMS, blog, and high CRO",
    features: [
      "Up to 10 Custom Pages + CMS Blog",
      "Interactive UI Micro-Animations",
      "Lead Capture & CRM Sync Integration",
      "Core Web Vitals Speed Guarantee (LCP < 2s)",
      "AEO & AI Search Readiness Setup",
      "Delivery in 10 to 14 Days",
    ],
  },
  {
    name: "Micro MVP SaaS",
    price: "₹24,999",
    period: "one-time",
    tagline: "Full-stack startup prototype build for tech founders",
    features: [
      "Full-Stack React / Next.js + Node / Database",
      "User Authentication & Payment Gateway",
      "Admin Dashboard & API Integrations",
      "Complete IP & Code Rights Handover",
      "Delivery in 3 to 4 Weeks",
    ],
  },
];

const FAQS = [
  {
    question: "Are there any hidden costs after project delivery?",
    answer: "Zero hidden costs. What we quote is what you pay. Domain and hosting costs are paid directly to your chosen provider or bundled transparently.",
  },
  {
    question: "What payment terms do you follow?",
    answer: "We typically work on a 50% upfront deposit upon scope lock, and 50% upon final project review and approval before server deployment.",
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
              Clear Fixed Pricing for Web Development & Automation
            </h1>
            <p className="mt-4 text-base sm:text-lg text-abyssal-ink/70 leading-relaxed">
              No vague hourly billing or surprise invoices. Choose a fixed package starting at ₹3,999 with guaranteed timelines and complete source code handover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-12 font-body">
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
                  Select Package
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
