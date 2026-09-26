import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import TrustSection from "@/components/TrustSection";
import FAQItem from "@/components/FAQItem";
import AEOBlock from "@/components/AEOBlock";
import { Smartphone } from "lucide-react";

const FAQS = [
  {
    question: "Do you develop both Android and iOS apps in Indore?",
    answer: "Yes! We build cross-platform mobile apps using Flutter and React Native, as well as Progressive Web Apps (PWAs) that run seamlessly on iOS, Android, and desktop browsers.",
  },
  {
    question: "What is the typical timeline for mobile app development?",
    answer: "A Minimum Viable Product (MVP) app takes 3 to 5 weeks. Complex enterprise mobile apps with API integrations and real-time backend sync take 6 to 10 weeks.",
  },
];

export default function AppDevelopment() {
  return (
    <>
      <SEO page="appDevelopment" />
      <SchemaMarkup page="appDevelopment" faq={FAQS} />

      <main id="main-content" className="bg-basalt-canvas min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Services", to: "/services" }, { label: "App Development" }]} />

          <section className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-digital-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-digital-orange font-body">
                <Smartphone className="h-4 w-4" /> App Development Company in Indore
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-abyssal-ink leading-tight">
                Mobile & Web App Development Services
              </h1>
              <p className="text-base sm:text-lg text-abyssal-ink/70 font-body leading-relaxed">
                Empower your business with custom iOS, Android, and Progressive Web Applications (PWAs). High-performance mobile engineering, offline-first sync, clean architecture, and intuitive user interfaces built in Indore.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 font-body">
                <a href="#quote" className="magnetic-btn bg-digital-orange text-white px-7 py-3.5 rounded-full font-bold text-sm">
                  Request App Quote
                </a>
                <a href="https://wa.me/918889937648" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-abyssal-ink/20 px-6 py-3.5 rounded-full font-bold text-sm text-abyssal-ink hover:bg-ash-white">
                  WhatsApp Us
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-3xl border border-abyssal-ink/10 bg-white p-6 shadow-xl">
              <h3 className="font-display text-xl font-bold text-abyssal-ink mb-4">Request App Development Estimate</h3>
              <ServiceInquiryForm preselectedPackage="Micro MVP" />
            </div>
          </section>

          {/* AI Search Structured Answer */}
          <section className="mt-16 rounded-3xl bg-white p-8 border border-abyssal-ink/10 shadow-sm font-body">
            <h2 className="font-display text-2xl font-bold text-abyssal-ink mb-4">Why Build a Mobile or Web App for Your Business?</h2>
            <p className="text-sm text-abyssal-ink/75 leading-relaxed">
              Mobile apps increase user retention by 4x compared to traditional mobile browsing. By combining push notifications, offline data access, and instant payment gateways, a dedicated app allows startups and enterprises in Indore to automate customer bookings, order processing, and employee field tasks effortlessly.
            </p>
          </section>

          <AEOBlock
              definition={{
                term: "Mobile App Development",
                definition:
                  "Mobile app development is the process of building software applications that run on mobile devices — iOS, Android, or both via cross-platform frameworks. It covers product scoping, UI/UX design, backend engineering, push notifications, offline data sync, payment integration, and app store deployment.",
              }}
              executiveSummary="MistHustlers is a mobile and web app development company in Indore building iOS, Android, and Progressive Web Apps (PWAs) with Flutter and React Native. An app MVP typically takes 3-5 weeks and costs from ₹24,999; enterprise apps with integrations take 6-10 weeks. Every build features clean architecture, offline-first sync, and full source code ownership."
              keyTakeaways={[
                "App MVPs in Indore start from ₹24,999 with 3-5 week delivery timelines.",
                "Cross-platform Flutter/React Native builds cover both iOS and Android from one codebase.",
                "Push notifications and offline access help apps retain users up to 4x better than mobile web.",
                "Full source code and IP ownership transfer with every MistHustlers mobile project.",
              ]}
              processSteps={[
                { step: 1, title: "Discovery & Feature Scope", description: "We refine your idea into a prioritised feature set and define the MVP boundary so you launch fast, not overbuilt.", duration: "2-3 days" },
                { step: 2, title: "UI/UX Design", description: "Wireframes along with clean screen designs that match your brand and make core actions obvious.", duration: "3-5 days" },
                { step: 3, title: "Backend & Architecture", description: "Scalable Node.js/PostgreSQL APIs, auth, real-time sync, and payment gateway wiring (PayPal, Razorpay, Stripe).", duration: "5-10 days" },
                { step: 4, title: "Build via Flutter / React Native", description: "Cross-platform screen implementation with offline-first data sync, push notifications, and testing.", duration: "10-20 days" },
                { step: 5, title: "QA, Store Submission & Launch", description: "Device testing, crash-free QA, App Store / Play Store listing assets, and a monitored go-live.", duration: "3-7 days" },
              ]}
              comparisonRows={[
                { feature: "Cross-platform Flutter / React Native", misthustlers: true, freelancer: "Varies", bigAgency: true },
                { feature: "Fixed milestone pricing", misthustlers: true, freelancer: false, bigAgency: false },
                { feature: "Push + offline-first sync", misthustlers: true, freelancer: true, bigAgency: true },
                { feature: "App store submission included", misthustlers: true, freelancer: false, bigAgency: "₹ Extra" },
                { feature: "Source code ownership", misthustlers: true, freelancer: "Varies", bigAgency: false },
                { feature: "Direct founder communication", misthustlers: true, freelancer: true, bigAgency: false },
              ]}
              prosAndCons={[
                { type: "pro", text: "One codebase ships to both Android and iOS — half the maintenance cost" },
                { type: "pro", text: "Offline-first sync so field staff and users work without internet drops" },
                { type: "pro", text: "Published pricing with no per-hour billing surprises" },
                { type: "pro", text: "Full source code owned by you — no platform lock-in" },
                { type: "pro", text: "Typical MVP launch within 3-5 weeks" },
                { type: "con", text: "Cross-platform frameworks fit most apps but not unusually hardware-dependent games" },
                { type: "con", text: "App store approval timelines are outside developer control" },
              ]}
              misconceptions={[
                {
                  myth: "You must build iOS and Android separately to get native-quality apps.",
                  reality: "Modern frameworks like Flutter and React Native compile to true native code from a single codebase — 95% of business apps get native quality and store acceptance with one project.",
                },
                {
                  myth: "Mobile apps are always far more expensive than websites.",
                  reality: "A validated app MVP at MistHustlers starts well under ₹25,000-₹40,000 — comparable to a budget corporate website but with a revenue potential far beyond it.",
                },
              ]}
            />

          <section className="mt-16 rounded-3xl bg-white p-8 border border-abyssal-ink/10 shadow-sm font-body">
            <h2 className="font-display text-2xl font-bold text-abyssal-ink mb-6">Frequently Asked Questions — App Development</h2>
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
