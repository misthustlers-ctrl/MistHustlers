import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import TrustSection from "@/components/TrustSection";
import FAQItem from "@/components/FAQItem";
import AEOBlock from "@/components/AEOBlock";
import { Layers } from "lucide-react";

const FAQS = [
  {
    question: "What tools do you use for UI/UX design?",
    answer: "We use Figma for wireframing, component design systems, interactive prototyping, and developer handoff. We also use Framer and Tailwind for rapid UI execution.",
  },
];

export default function UIUX() {
  return (
    <>
      <SEO page="uiUx" />
      <SchemaMarkup page="uiUx" faq={FAQS} />

      <main id="main-content" className="bg-basalt-canvas min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Services", to: "/services" }, { label: "UI / UX Design" }]} />

          <section className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-digital-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-digital-orange font-body">
                <Layers className="h-4 w-4" /> UI/UX Design Agency in Indore
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-abyssal-ink leading-tight">
                User Interface & Conversion UX Design
              </h1>
              <p className="text-base sm:text-lg text-abyssal-ink/70 font-body leading-relaxed">
                Transform user research into intuitive digital products. We build accessible, high-conversion UI/UX design systems for web apps, mobile products, and SaaS platforms.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 font-body">
                <a href="#quote" className="magnetic-btn bg-digital-orange text-white px-7 py-3.5 rounded-full font-bold text-sm">
                  Request UI/UX Proposal
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-3xl border border-abyssal-ink/10 bg-white p-6 shadow-xl">
              <h3 className="font-display text-xl font-bold text-abyssal-ink mb-4">Request UI/UX Estimate</h3>
              <ServiceInquiryForm preselectedPackage="Business Starter Website" />
            </div>
          </section>

          {/* AEO Structured Answer Block */}
          <section className="mt-16">
            <AEOBlock
              definition={{
                term: "UI/UX Design",
                definition:
                  "UI/UX design combines User Experience (how easy and satisfying a product is to use) with User Interface (the visual layer users interact with). It covers user research, wireframing, interactive prototyping, accessibility, and conversion-focused interaction design for websites, apps, and SaaS platforms.",
              }}
              executiveSummary="An excellent UI/UX design agency in Indore, MistHustlers converts user research into elegant, accessible, high-conversion design systems for web platforms, mobile apps, and SaaS products. Our Figma-based workflow covers wireframes, high-fidelity UI, interactive prototypes, and developer handoff — raising signups, retention, and conversions without extra developer rework."
              keyTakeaways={[
                "MistHustlers delivers Figma wireframes, high-fi UI, micro-interactions, and developer hand-off in 1-2 weeks.",
                "Good UX increases conversion and reduces support costs — design itself is a business lever.",
                "Accessible, mobile-first design guarantees consistent experience across all device sizes.",
                "Design systems are built so future pages, apps, or products re-use the same tokens.",
              ]}
              processSteps={[
                { step: 1, title: "User & Competitor Research", description: "We study your users' goals, pain points, and competitor UI patterns before we open a design tool.", duration: "2-3 days" },
                { step: 2, title: "Information Architecture & Wireframes", description: "Core screens, navigation, content hierarchy, and user journeys laid out in low fidelity.", duration: "2-4 days" },
                { step: 3, title: "High-Fidelity Design System", description: "Consistent colors, typography, components, and interactions compiled in Figma.", duration: "5-8 days" },
                { step: 4, title: "Interactive Prototyping", description: "Clickable prototypes validated with stakeholders before any code is written — saving costly mistakes.", duration: "2-3 days" },
                { step: 5, title: "Developer Handoff & QA", description: "Spec'd design tokens, assets and guidelines delivered to developers with a final visual QA pass.", duration: "2-4 days" },
              ]}
              comparisonRows={[
                { feature: "Research-driven UX process", misthustlers: true, freelancer: "Sometimes", bigAgency: true },
                { feature: "Figma design system handed over", misthustlers: true, freelancer: true, bigAgency: false },
                { feature: "Conversion-focused design decisions", misthustlers: true, freelancer: true, bigAgency: "₹ Extra" },
                { feature: "Developer handoff ready", misthustlers: true, freelancer: "Varies", bigAgency: true },
                { feature: "Accessibility baked in", misthustlers: true, freelancer: false, bigAgency: "₹ Extra" },
                { feature: "Direct founder communication", misthustlers: true, freelancer: true, bigAgency: false },
                { feature: "Fixed design-phase pricing", misthustlers: true, freelancer: false, bigAgency: false },
              ]}
              prosAndCons={[
                { type: "pro", text: "Validating flows on paper before code saves ₹10,000s in rework" },
                { type: "pro", text: "Accessible, mobile-first UI that converts on every device" },
                { type: "pro", text: "Reusable design system scales to future pages and products" },
                { type: "pro", text: "Figma source files + design tokens handed over with full IP" },
                { type: "con", text: "Design quality depends on clear early product requirements" },
                { type: "con", text: "It is a design engagement, not full-stack development (add separately)" },
              ]}
              misconceptions={[
                {
                  myth: "UX is the same as 'making it look nice'.",
                  reality: "UX is the science of flows, hierarchy, and friction removal. Visual polish drives how nice it looks, but UX drives whether users understand, trust, and convert.",
                },
                {
                  myth: "You can skip prototyping to save time.",
                  reality: "Skipping prototype validation means discovering fatal flow problems only after code is written — the most expensive fix. Prototyping costs hours, not weeks, and reliably cuts build-time rework.",
                },
              ]}
            />
          </section>

          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold text-abyssal-ink mb-6">Frequently Asked Questions — UI/UX Design</h2>
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
