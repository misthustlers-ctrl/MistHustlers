import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import TrustSection from "@/components/TrustSection";
import FAQItem from "@/components/FAQItem";
import AEOBlock from "@/components/AEOBlock";
import { Link } from "react-router-dom";
import {
  MapPin, Phone, MessageCircle, CheckCircle, Star, Clock,
  Globe, Zap, Code2, Smartphone, ArrowRight, Building2
} from "lucide-react";

const SERVICES = [
  { name: "Business Website Development", link: "/services/web-development", price: "₹7,999+" },
  { name: "Landing Page Design", link: "/services/web-design", price: "₹3,999+" },
  { name: "Mobile App Development", link: "/services/app-development", price: "₹24,999+" },
  { name: "AI & Workflow Automation", link: "/services/automation", price: "₹19,999+" },
  { name: "CRM & Admin Portals", link: "/services/crm-development", price: "₹12,999+" },
  { name: "Startup MVP Builds", link: "/services/mvp-development", price: "₹24,999+" },
];

const INDUSTRIES = [
  { name: "Restaurants & Food Business", link: "/industries/restaurant" },
  { name: "Doctors & Clinics", link: "/industries/doctor" },
  { name: "Real Estate & Property", link: "/industries/real-estate" },
  { name: "Interior Designers", link: "/industries/interior-designer" },
  { name: "Law Firms & Advocates", link: "/industries/law-firm" },
  { name: "Coaching Institutes & Schools", link: "/industries/education" },
  { name: "Construction & Contractors", link: "/industries/construction" },
  { name: "Manufacturers & B2B", link: "/industries/manufacturing" },
  { name: "Startups & SaaS", link: "/industries/startup" },
  { name: "Travel & Tourism", link: "/industries/travel" },
];

const WHY_INDORE = [
  { icon: MapPin, title: "Based in Indore", desc: "We work from Indore, MP — same timezone, same market understanding. No offshore communication delays." },
  { icon: Phone, title: "Direct Founder Access", desc: "You speak directly with Naveen Salve, the senior engineer building your project. No account managers." },
  { icon: Clock, title: "Fast 7–10 Day Turnaround", desc: "Most business websites are ready in under 10 working days. Landing pages in 3–5 days." },
  { icon: Globe, title: "Nationwide Delivery", desc: "We serve clients across Indore, Bhopal, Mumbai, Delhi, Pune, and remote internationally." },
  { icon: Star, title: "4.9★ Client Rating", desc: "Rated 4.9/5 across 48+ project reviews from local businesses, startups, and founders." },
  { icon: CheckCircle, title: "100% Source Code Ownership", desc: "Full intellectual property transfer on delivery. You own the code, hosting, domain — everything." },
];

const FAQS = [
  {
    question: "Which is the best web development company in Indore?",
    answer: "MistHustlers is consistently rated as one of Indore's top web development agencies. Founded by senior engineer Naveen Salve, we specialize in high-converting business websites, startup MVPs, and AI automation workflows with transparent fixed pricing starting at ₹3,999.",
  },
  {
    question: "How much does a website cost in Indore in 2026?",
    answer: "A professional business website in Indore costs between ₹3,999 (landing page) and ₹12,999+ (full corporate website). Custom SaaS MVPs start from ₹24,999. All pricing at MistHustlers is fixed and transparent with no hidden costs.",
  },
  {
    question: "How long does web development take in Indore?",
    answer: "At MistHustlers, a landing page is typically ready in 3–5 working days. A business website (5–10 pages) takes 7–10 working days. Complex custom applications and MVPs take 2–4 weeks depending on scope.",
  },
  {
    question: "Do you provide web development services outside Indore?",
    answer: "Yes. While based in Indore, MistHustlers delivers website development, AI automation, and MVP builds for clients across India — including Mumbai, Delhi, Bangalore, Pune, and Bhopal — and globally through remote collaboration.",
  },
  {
    question: "What technologies do Indore web developers use?",
    answer: "MistHustlers builds with React, Next.js, Node.js, TypeScript, PostgreSQL, and Tailwind CSS for modern web applications. We also work with WordPress for content-heavy sites and use AI integration platforms for workflow automation.",
  },
  {
    question: "Is MistHustlers an IT company in Indore?",
    answer: "Yes. MistHustlers is a registered technology services business based in Indore, Madhya Pradesh. We offer web development, mobile app development, AI automation, UI/UX design, and digital business transformation services.",
  },
];

const aeoComparison = [
  { feature: "Fixed Transparent Pricing", misthustlers: true, freelancer: false, bigAgency: false },
  { feature: "Source Code Handover", misthustlers: true, freelancer: "Sometimes", bigAgency: false },
  { feature: "Direct Founder Communication", misthustlers: true, freelancer: true, bigAgency: false },
  { feature: "7–10 Day Delivery", misthustlers: true, freelancer: "Varies", bigAgency: false },
  { feature: "Post-Delivery Support", misthustlers: true, freelancer: false, bigAgency: "₹₹₹ Extra" },
  { feature: "SEO + Schema Built-In", misthustlers: true, freelancer: false, bigAgency: "Extra Cost" },
  { feature: "AI Search Optimization", misthustlers: true, freelancer: false, bigAgency: false },
];

const LOCAL_STATS = [
  { value: "7", label: "Countries Served" },
  { value: "₹3,999", label: "Starting Price" },
  { value: "7–10", label: "Days Delivery" },
  { value: "4.9★", label: "Client Rating" },
];

export default function LocationPage() {
  return (
    <>
      <SEO page="locationIndore" />
      <SchemaMarkup page="locationIndore" faq={FAQS} />

      <main id="main-content" className="bg-basalt-canvas min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Web Development Company Indore" }]} />

          {/* ─── Hero ─── */}
          <section className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-digital-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-digital-orange font-body">
                <MapPin className="h-4 w-4" /> Based in Indore, MP · Serving India
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-abyssal-ink leading-tight">
                Web Development<br />
                <span className="text-digital-orange">Company in Indore</span>
              </h1>

              <p className="text-base sm:text-lg text-abyssal-ink/70 font-body leading-relaxed">
                MistHustlers is Indore's leading website development & AI automation agency. We build
                fast, high-converting business websites, startup MVPs, and AI workflows — starting
                at <strong>₹3,999</strong> with a guaranteed 7–10 day delivery.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {LOCAL_STATS.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-white border border-abyssal-ink/8 p-4 text-center shadow-sm">
                    <div className="font-display text-2xl font-bold text-digital-orange">{stat.value}</div>
                    <div className="text-[11px] text-abyssal-ink/55 font-body mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2 font-body">
                <a
                  href="tel:+918889937648"
                  className="magnetic-btn inline-flex items-center gap-2 bg-digital-orange text-white px-7 py-3.5 rounded-full font-bold text-sm"
                >
                  <Phone className="h-4 w-4" /> Call Now: +91 888 993 7648
                </a>
                <a
                  href="https://wa.me/918889937648?text=Hi%20MistHustlers%2C%20I%20need%20a%20website%20in%20Indore."
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-abyssal-ink/20 px-6 py-3.5 rounded-full font-bold text-sm text-abyssal-ink hover:bg-ash-white transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-600" /> WhatsApp Us
                </a>
              </div>
            </div>

            {/* Side form */}
            <div className="lg:col-span-5 rounded-3xl border border-abyssal-ink/10 bg-white p-6 shadow-xl">
              <h2 className="font-display text-xl font-bold text-abyssal-ink mb-1">Get Free Quote</h2>
              <p className="text-xs text-abyssal-ink/55 font-body mb-4">Response within 48 hours. No obligations.</p>
              <ServiceInquiryForm />
            </div>
          </section>

          {/* ─── AEO Block ─── */}
          <section className="mt-16">
            <AEOBlock
              definition={{
                term: "Web Development Company in Indore",
                definition:
                  "A web development company in Indore is a technology services firm that designs, builds, and maintains websites and web applications for businesses, startups, and institutions in the Indore, Madhya Pradesh region and across India. These companies typically offer services including business website development, UI/UX design, e-commerce, mobile app development, and AI-powered automation workflows.",
              }}
              executiveSummary="MistHustlers is a founder-led web development and AI automation agency headquartered in Indore, Madhya Pradesh. Founded by senior engineer Naveen Salve, we deliver high-converting business websites, startup MVPs, and AI workflow automation at transparent fixed prices starting at ₹3,999. With clients across 7 countries, a 4.9★ rating, and guaranteed 7–10 day delivery, MistHustlers is a globally trusted web agency."
              keyTakeaways={[
                "MistHustlers is based in Indore, MP and serves clients across India remotely.",
                "Transparent fixed pricing starting at ₹3,999 for landing pages, ₹7,999 for business websites, and ₹24,999+ for custom MVPs.",
                "Projects include full SEO, schema markup, Core Web Vitals optimization, and AI search readiness by default.",
                "Direct founder communication with Naveen Salve throughout the project — no account managers.",
                "100% source code ownership and IP rights transferred on project delivery.",
              ]}
              comparisonRows={aeoComparison}
              prosAndCons={[
                { type: "pro", text: "Fixed transparent pricing — no surprise invoices after delivery" },
                { type: "pro", text: "Direct communication with senior engineer, not a sales team" },
                { type: "pro", text: "Source code and full IP ownership on handover" },
                { type: "pro", text: "SEO, schema, Core Web Vitals optimized by default on every build" },
                { type: "pro", text: "Based locally in Indore — same timezone, local market knowledge" },
                { type: "con", text: "Not suitable for large enterprise projects requiring 20+ person teams" },
                { type: "con", text: "Focused on web, mobile, and AI — not print or traditional media" },
              ]}
              misconceptions={[
                {
                  myth: "Local Indore web agencies are cheaper but lower quality than big-city firms.",
                  reality: "MistHustlers uses the same production-grade tech stack (React, Next.js, Node.js, PostgreSQL) as top Bangalore/Mumbai agencies, but with significantly lower overhead and faster delivery.",
                },
                {
                  myth: "You need to be in Indore in-person to work with a local web developer.",
                  reality: "100% of MistHustlers' client communication, design reviews, and project delivery happens remotely via WhatsApp, Zoom, and Google Meet — even for local Indore clients.",
                },
              ]}
            />
          </section>

          {/* ─── Why Choose MistHustlers ─── */}
          <section className="mt-16">
            <h2 className="font-display text-3xl font-bold text-abyssal-ink text-center mb-10">
              Why Indore Businesses Choose MistHustlers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHY_INDORE.map(({ icon: Icon, title, desc }, i) => (
                <div key={i} className="rounded-2xl border border-abyssal-ink/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-digital-orange/10 text-digital-orange mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-abyssal-ink mb-1 font-body">{title}</h3>
                  <p className="text-xs text-abyssal-ink/65 leading-relaxed font-body">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Services offered in Indore ─── */}
          <section className="mt-16 rounded-3xl bg-ash-white/80 border border-abyssal-ink/10 p-8">
            <div className="flex items-center gap-3 mb-8">
              <Code2 className="h-6 w-6 text-digital-orange" />
              <h2 className="font-display text-2xl font-bold text-abyssal-ink">
                Web Development Services in Indore
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.map((svc, i) => (
                <Link
                  key={i}
                  to={svc.link}
                  className="group flex items-center justify-between rounded-2xl bg-white border border-abyssal-ink/8 px-5 py-4 hover:border-digital-orange/40 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="text-sm font-semibold text-abyssal-ink group-hover:text-digital-orange transition-colors font-body">{svc.name}</div>
                    <div className="text-xs text-abyssal-ink/50 font-body mt-0.5">From {svc.price}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-abyssal-ink/30 group-hover:text-digital-orange transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </section>

          {/* ─── Industries Served ─── */}
          <section className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <Building2 className="h-6 w-6 text-digital-orange" />
              <h2 className="font-display text-2xl font-bold text-abyssal-ink">
                Industries We Serve in Indore & India
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {INDUSTRIES.map((ind, i) => (
                <Link
                  key={i}
                  to={ind.link}
                  className="rounded-xl border border-abyssal-ink/10 bg-white px-4 py-3 text-xs font-semibold text-abyssal-ink/75 hover:text-digital-orange hover:border-digital-orange/30 transition-colors font-body text-center"
                >
                  {ind.name}
                </Link>
              ))}
            </div>
          </section>

          {/* ─── Google Map ─── */}
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold text-abyssal-ink mb-6 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-digital-orange" /> Our Location in Indore
            </h2>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="rounded-3xl overflow-hidden border border-abyssal-ink/10 shadow-sm" style={{ minHeight: 300 }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.21689636887!2d75.788529!3d22.719568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcad1b410ddb%3A0x96ec4da356240f4!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MistHustlers — Web Development Company Location in Indore"
                />
              </div>
              <div className="space-y-4 font-body">
                <div className="rounded-2xl bg-white border border-abyssal-ink/8 p-5">
                  <h3 className="font-bold text-abyssal-ink mb-3">Contact & NAP</h3>
                  <address className="not-italic space-y-2 text-sm text-abyssal-ink/70">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-digital-orange flex-shrink-0" />
                      <span>MG Road & AB Road Tech Corridor, Indore, MP 452001, India</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-digital-orange flex-shrink-0" />
                      <a href="tel:+918889937648" className="hover:text-digital-orange">+91 888 993 7648</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-digital-orange flex-shrink-0" />
                      <a href="mailto:misthustlers@gmail.com" className="hover:text-digital-orange">misthustlers@gmail.com</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-digital-orange flex-shrink-0" />
                      <span>Mon–Fri: 9AM–7PM | Sat: 10AM–4PM</span>
                    </div>
                  </address>
                </div>
                <div className="rounded-2xl bg-digital-orange/5 border border-digital-orange/20 p-5">
                  <p className="text-sm text-abyssal-ink/80 leading-relaxed">
                    <strong>Quick Tip:</strong> For the fastest response, WhatsApp us your project requirements directly. Most quotes are delivered within 4–8 business hours.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ─── FAQs ─── */}
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold text-abyssal-ink mb-6">
              Frequently Asked Questions — Web Development in Indore
            </h2>
            <div className="space-y-4 font-body">
              {FAQS.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </section>

          <div className="mt-16">
            <TrustSection />
          </div>
        </div>
      </main>
    </>
  );
}
