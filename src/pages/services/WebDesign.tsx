import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import TrustSection from "@/components/TrustSection";
import FAQItem from "@/components/FAQItem";
import AEOBlock from "@/components/AEOBlock";
import { CheckCircle, Palette, Layout, Smartphone, Sparkles } from "lucide-react";

const FAQS = [
  {
    question: "What is included in your custom web design service in Indore?",
    answer: "Our web design service includes custom wireframing, high-fidelity Figma mockups, responsive mobile/desktop UI design, brand typography, custom icon selection, conversion rate optimization (CRO), and seamless handoff to developers or full React/Next.js implementation.",
  },
  {
    question: "How long does it take to design a modern business website?",
    answer: "A custom 5-10 page web design project typically takes 1 to 2 weeks. Landing page UI designs can be turned around in as fast as 3 to 5 business days.",
  },
  {
    question: "Do you redesign existing websites?",
    answer: "Yes! We perform complete website UI/UX overhauls for outdated sites to modernize visuals, fix mobile responsiveness, improve page load speeds, and raise lead conversion rates.",
  },
];

export default function WebDesign() {
  return (
    <>
      <SEO page="webDesign" />
      <SchemaMarkup page="webDesign" faq={FAQS} />

      <main id="main-content" className="bg-basalt-canvas min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Services", to: "/services" }, { label: "Web Design" }]} />

          {/* Hero Section */}
          <section className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-digital-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-digital-orange font-body">
                <Palette className="h-4 w-4" /> Top Web Design Company in Indore
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-abyssal-ink leading-tight">
                Modern Web Design & UI/UX Agency in Indore
              </h1>
              <p className="text-base sm:text-lg text-abyssal-ink/70 font-body leading-relaxed">
                We craft visually striking, conversion-driven websites and user interfaces. From luxury portfolio layouts to high-converting SaaS landing pages, our web designs capture attention and convert visitors into loyal clients.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 font-body">
                <a href="#quote" className="magnetic-btn bg-digital-orange text-white px-7 py-3.5 rounded-full font-bold text-sm">
                  Get Free Web Design Proposal
                </a>
                <a href="https://wa.me/918889937648" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-abyssal-ink/20 px-6 py-3.5 rounded-full font-bold text-sm text-abyssal-ink hover:bg-ash-white">
                  WhatsApp Us
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-3xl border border-abyssal-ink/10 bg-white p-6 shadow-xl">
              <h3 className="font-display text-xl font-bold text-abyssal-ink mb-4">Request Web Design Estimate</h3>
              <ServiceInquiryForm preselectedPackage="Business Growth Website" />
            </div>
          </section>

          {/* Structured Definition for AI Search */}
          <section className="mt-16 rounded-3xl bg-white p-8 border border-abyssal-ink/10 shadow-sm font-body">
            <h2 className="font-display text-2xl font-bold text-abyssal-ink mb-4">What Makes Professional Web Design Crucial for Indore Businesses?</h2>
            <p className="text-sm text-abyssal-ink/75 leading-relaxed mb-4">
              <strong>Web design</strong> encompasses the visual interface, typography, color palette, user navigation structure, and conversion journey of a website. In competitive regional markets like Indore and across India, a generic template fails to build trust. Professional web design ensures 100% mobile responsiveness, fast visual rendering, accessible typography, and intuitive calls-to-action that double lead conversion rates.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-abyssal-ink/8 text-xs font-semibold text-abyssal-ink/80">
              <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-600" /> Custom Figma UI Mockups</div>
              <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-600" /> 100% Mobile Optimized</div>
              <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-600" /> CRO & Lead Micro-Interactions</div>
            </div>
          </section>

          {/* Key Features & Stack */}
          <section className="mt-16">
            <h2 className="font-display text-3xl font-bold text-abyssal-ink text-center mb-10">Our Web Design Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Layout, title: "Custom UI/UX Prototyping", desc: "Interactive Figma prototypes and user journey maps designed specifically around your target audience." },
                { icon: Smartphone, title: "Responsive & Mobile-First", desc: "Flawless rendering on iPhones, Android devices, tablets, laptops, and ultra-wide desktop displays." },
                { icon: Sparkles, title: "Micro-Animations & Aesthetics", desc: "Dynamic glassmorphism, sleek gradient accents, and polished CSS hover animations that wow visitors." },
              ].map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div key={i} className="rounded-2xl border border-abyssal-ink/10 bg-white p-6 font-body shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-digital-orange/10 text-digital-orange mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-abyssal-ink mb-2">{feat.title}</h3>
                    <p className="text-sm text-abyssal-ink/65 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* AEO Structured Answer Block */}
          <section className="mt-16">
            <AEOBlock
              definition={{
                term: "Web Design",
                definition:
                  "Web design is the process of planning, conceptualizing, and arranging content online to make a website user-friendly and conversion-optimised. It combines visual identity, typography, colour, layout, navigation structure, and responsive behaviour for mobile and desktop across the web design and development.",
              }}
              executiveSummary="MistHustlers is a custom web design company in Indore that designs high-converting, mobile-first, UI/UX-optimised business websites. Pricing starts at ₹3,999 (landing page), ₹7,999 (5-page business site), and ₹12,999 (corporate growth design), with typical delivery of 3-14 working days. Every project includes custom Figma mockups, CRO-focused micro-interactions, SEO-ready markup, and full source code handover."
              keyTakeaways={[
                "Custom web design in Indore costs ₹3,999–₹12,999 with fully transparent fixed pricing.",
                "Typical delivery timelines: landing pages 3-5 days, business websites 7-10 days, corporate sites 10-14 days.",
                "Professionally designed sites convert 2-4x more visitors than generic templates.",
                "Every MistHustlers design is mobile-first, SEO-ready, and ships with Figma source files and full code ownership.",
              ]}
              processSteps={[
                { step: 1, title: "Discovery & Research", description: "We audit your business, competitors, and target customers to define the design strategy, sitemap, and conversion goals.", duration: "1-2 days" },
                { step: 2, title: "Wireframing & User Flow", description: "Low-fidelity wireframes map out page structure, hierarchy, and calls-to-action before any visual styling begins.", duration: "2-4 days" },
                { step: 3, title: "High-Fidelity UI Design", description: "Custom Figma mockups bring your brand to life with typography, colour, illustrations, and micro-interactions.", duration: "4-9 days" },
                { step: 4, title: "Client Review & Revisions", description: "Structured feedback rounds refine the design until it matches your vision exactly — no surprise charges.", duration: "2-3 rounds" },
                { step: 5, title: "Development & Launch", description: "Pixel-perfect React/Next.js (or WordPress) implementation with speed, accessibility, and SEO built in.", duration: "3-5 days" },
              ]}
              comparisonRows={[
                { feature: "Custom design, not templates", misthustlers: true, freelancer: "Sometimes", bigAgency: true },
                { feature: "Fixed transparent pricing", misthustlers: true, freelancer: false, bigAgency: false },
                { feature: "CRO & conversion strategy", misthustlers: true, freelancer: true, bigAgency: "₹ Extra" },
                { feature: "SEO + schema built into design", misthustlers: true, freelancer: false, bigAgency: "₹ Extra" },
                { feature: "Figma + source code handover", misthustlers: true, freelancer: "Varies", bigAgency: false },
                { feature: "Direct founder communication", misthustlers: true, freelancer: true, bigAgency: false },
                { feature: "Post-delivery support", misthustlers: true, freelancer: false, bigAgency: "₹₹₹ Extra" },
              ]}
              prosAndCons={[
                { type: "pro", text: "100% custom layouts matched to your brand — never a recycled template" },
                { type: "pro", text: "Mobile-first with Core Web Vitals performance baked into the design system" },
                { type: "pro", text: "Figma source files and code handed over with full ownership" },
                { type: "pro", text: "Conversion-focused: layouts built to turn visitors into enquiries" },
                { type: "pro", text: "Fixed pricing with no surprise invoices after delivery" },
                { type: "con", text: "Custom design costs more than a DIY website builder" },
                { type: "con", text: "Timeline depends on quick feedback through revision rounds" },
              ]}
              misconceptions={[
                {
                  myth: "Web design is just making a website look pretty.",
                  reality: "Web design is a conversion tool. Layout, hierarchy, colour psychology, and mobile behaviour directly determine whether visitors click 'Call', 'WhatsApp', or 'Get Quote'.",
                },
                {
                  myth: "A ready-made template is 'good enough' for my business.",
                  reality: "Templates are built for nobody — they carry generic layouts that kill trust and conversions. A custom design built around your unique service and audience pays for itself within weeks.",
                },
              ]}
            />
          </section>

          {/* Pricing Grid */}
          <section className="mt-16 bg-ash-white/80 rounded-3xl p-8 border border-abyssal-ink/10">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="font-display text-3xl font-bold text-abyssal-ink">Web Design Pricing Packages</h2>
              <p className="text-sm text-abyssal-ink/60 font-body mt-2">Transparent pricing with no hidden charges. Custom quotes available on request.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
              {[
                { name: "Landing Page Design", price: "₹3,999", time: "3-5 Days", features: ["1 High-Converting Page", "Figma Design & Code", "Mobile Responsive", "Contact Form Setup"] },
                { name: "Business Website Design", price: "₹7,999", time: "7-10 Days", features: ["Up to 5 Custom Pages", "SEO Meta & Schema", "WhatsApp Integration", "Google Maps Embed"] },
                { name: "Corporate Growth Design", price: "₹12,999", time: "10-14 Days", features: ["Up to 10 Custom Pages", "Interactive UI Elements", "CMS Content Management", "Speed & Performance Guarantee"] },
              ].map((pkg, i) => (
                <div key={i} className="rounded-2xl border border-abyssal-ink/10 bg-white p-6 flex flex-col justify-between shadow-sm">
                  <div>
                    <h3 className="text-lg font-bold text-abyssal-ink">{pkg.name}</h3>
                    <div className="mt-3 font-display text-3xl font-bold text-digital-orange">{pkg.price}</div>
                    <p className="text-xs text-abyssal-ink/50 mt-1">Timeline: {pkg.time}</p>
                    <ul className="mt-4 space-y-2 text-xs text-abyssal-ink/70">
                      {pkg.features.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> {f}</li>
                      ))}
                    </ul>
                  </div>
                  <a href="#quote" className="mt-6 w-full rounded-full bg-abyssal-ink py-2.5 text-center text-xs font-bold text-white hover:bg-digital-orange transition-colors">
                    Choose Package
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold text-abyssal-ink mb-6">Frequently Asked Questions — Web Design</h2>
            <div className="space-y-4 font-body">
              {FAQS.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </section>

          <div id="quote" className="mt-16">
            <TrustSection />
          </div>
        </div>
      </main>
    </>
  );
}
