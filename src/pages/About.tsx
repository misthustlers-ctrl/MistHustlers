import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import ScrollReveal from "@/components/ScrollReveal";
import TrustSection from "@/components/TrustSection";
import { Link } from "react-router-dom";
import {
  Code2, Shield, Users, Heart, TrendingUp,
  MapPin, CheckCircle2,
  ArrowRight, Globe
} from "lucide-react";

const TIMELINE = [
  { year: "2026", title: "MistHustlers Started", desc: "MistHustlers started in Indore with a clear focus: practical websites, startup MVPs, and automation systems for growing businesses." },
  { year: "2026", title: "Web Development Services", desc: "Launched fixed-scope website development services with transparent pricing, responsive design, SEO-ready structure, and full source-code handover." },
  { year: "2026", title: "AI Automation & CRM Systems", desc: "Expanded into workflow automation, WhatsApp lead routing, CRM dashboards, and AI-assisted business systems for service teams." },
  { year: "2026", title: "Free SEO Audit Studio", desc: "Released a free website SEO checker to help businesses review on-page SEO, schema, metadata, mobile readiness, and content quality." },
];

const CORE_VALUES = [
  { icon: Shield, title: "Radical Transparency", desc: "Fixed pricing, no hidden fees. You know the exact cost, timeline, and deliverables before we write a single line of code." },
  { icon: Code2, title: "Engineering Excellence", desc: "We use production-grade tech (React, Next.js, Node.js, PostgreSQL) regardless of project budget. No shortcuts." },
  { icon: Users, title: "Direct Communication", desc: "You speak with the engineer building your product — not an account manager or salesperson." },
  { icon: Heart, title: "Founder Empathy", desc: "Having built our own products from scratch, we understand the pressure of launch timelines, investor demos, and tight budgets." },
  { icon: TrendingUp, title: "Results Over Process", desc: "We measure success by your business outcomes — more leads, more bookings, faster conversions — not just project completion." },
  { icon: Globe, title: "Long-Term Partnership", desc: "We don't disappear after delivery. Post-launch support, iterations, and growth guidance are part of every engagement." },
];

const TECH_STACK = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "Prisma", "Redis"] },
  { category: "AI & Automation", items: ["OpenAI API", "WhatsApp Business API", "Make.com", "Zapier", "n8n"] },
  { category: "Infrastructure", items: ["Vercel", "Netlify", "GitHub Actions"] },
];

export default function About() {
  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="about" />
      <SchemaMarkup page="about" />
      <main>
        {/* ─── Hero ─── */}
        <section className="pt-28 sm:pt-32 pb-12 sm:pb-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-digital-orange/10 text-digital-orange text-xs font-bold tracking-wider uppercase mb-6 font-body">
                About MistHustlers
              </span>
              <h1 className="font-display text-[clamp(38px,10vw,72px)] leading-[0.92] tracking-[0.02em] text-abyssal-ink">
                Premium Web Agency<br />
                <span className="text-digital-orange">Based in Indore</span>
              </h1>
              <p className="text-abyssal-ink/60 mt-5 max-w-xl mx-auto font-body text-base leading-relaxed">
                MistHustlers is a founder-led web development and AI automation agency headquartered in Indore, Madhya Pradesh. We build high-converting websites, startup MVPs, and intelligent workflows for ambitious businesses across India.
              </p>

              {/* Quick Stats */}
              <div className="mt-10 flex flex-wrap justify-center gap-6">
                {[
                  { value: "7", label: "Countries Served" },
                  { value: "4.9★", label: "Client Rating" },
                  { value: "2026", label: "Founded" },
                  { value: "₹14,999", label: "Starting Price" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="font-display text-3xl font-bold text-digital-orange">{stat.value}</div>
                    <div className="text-xs text-abyssal-ink/55 font-body mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Mission Section ─── */}
        <section className="pb-16 sm:pb-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
            <ScrollReveal>
              <div className="mx-auto max-w-4xl space-y-8">
                <div className="grid gap-8 lg:grid-cols-2">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-abyssal-ink mb-3">Our Mission</h3>
                    <p className="text-abyssal-ink/70 font-body leading-relaxed">
                      To make premium web development, startup engineering, and AI automation accessible to every business in India — not just enterprises with ₹10 lakh+ budgets. Every project we deliver should measurably grow your business.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-abyssal-ink mb-3">The MistHustlers Difference</h3>
                    <ul className="space-y-3">
                      {[
                        "You communicate directly with the engineer — no account manager buffer",
                        "Fixed pricing with zero surprise charges after delivery",
                        "100% source code and IP ownership transferred to you",
                        "SEO, schema, Core Web Vitals, and AI search readiness on every build",
                        "Post-delivery support included — we don't vanish after launch",
                      ].map((point, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-abyssal-ink/75 font-body">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link to="/case-studies" className="inline-flex items-center gap-1.5 rounded-full bg-digital-orange text-white px-5 py-2.5 text-xs font-bold hover:bg-digital-orange/90 transition-colors">
                      View Case Studies <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link to="/contact" className="inline-flex items-center gap-1.5 rounded-full border border-abyssal-ink/20 text-abyssal-ink px-5 py-2.5 text-xs font-bold hover:bg-ash-white transition-colors">
                      Work With Us
                    </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── Company Timeline ─── */}
        <section className="py-16 sm:py-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-abyssal-ink">Our Journey</h2>
                <p className="text-abyssal-ink/55 font-body mt-3">From a solo developer to Indore's leading web agency</p>
              </div>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-abyssal-ink/10 hidden sm:block" />
                <div className="space-y-8">
                  {TIMELINE.map((item, i) => (
                    <motion.div
                      key={item.year}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="sm:pl-20 relative"
                    >
                      {/* Year badge */}
                      <div className="hidden sm:flex absolute left-0 top-0 h-16 w-16 items-center justify-center rounded-full bg-digital-orange text-white font-display font-bold text-sm shadow-lg z-10">
                        {item.year}
                      </div>
                      <div className="rounded-2xl bg-white border border-abyssal-ink/8 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="sm:hidden rounded-full bg-digital-orange/10 text-digital-orange px-3 py-0.5 text-xs font-bold font-body">{item.year}</span>
                          <h3 className="font-bold text-abyssal-ink font-body">{item.title}</h3>
                        </div>
                        <p className="text-sm text-abyssal-ink/65 font-body leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── Core Values ─── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-abyssal-ink">Our Core Values</h2>
                <p className="text-abyssal-ink/55 font-body mt-3">The principles that guide every project we take on</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {CORE_VALUES.map(({ icon: Icon, title, desc }, i) => (
                  <div key={i} className="rounded-2xl border border-abyssal-ink/8 bg-ash-white p-6 hover:shadow-md transition-shadow">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-digital-orange/10 text-digital-orange mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-abyssal-ink mb-2 font-body">{title}</h3>
                    <p className="text-sm text-abyssal-ink/65 font-body leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── Tech Stack ─── */}
        <section className="py-16 sm:py-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <ScrollReveal>
              <div className="text-center mb-10">
                <h2 className="font-display text-3xl font-bold text-abyssal-ink">Our Technology Stack</h2>
                <p className="text-abyssal-ink/55 font-body mt-3">Production-grade technologies we use to ship world-class products</p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {TECH_STACK.map((group) => (
                  <div key={group.category} className="rounded-2xl bg-white border border-abyssal-ink/8 p-5 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-digital-orange mb-3 font-body">{group.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((tech) => (
                        <span key={tech} className="rounded-full bg-ash-white border border-abyssal-ink/10 px-3 py-1 text-xs font-medium text-abyssal-ink/70 font-body">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── Map ─── */}
        <section className="py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-display text-3xl font-bold text-abyssal-ink mb-4">Find Us in Indore</h2>
                <address className="not-italic space-y-2 text-sm text-abyssal-ink/70 font-body mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-digital-orange" />
                    MG Road & AB Road Tech Corridor, Indore, MP 452001, India
                  </div>
                </address>
                <p className="text-sm text-abyssal-ink/65 font-body leading-relaxed mb-6">
                  We collaborate primarily online — via WhatsApp, Google Meet, and Zoom. However, we are based in Indore and available for in-person meetings with local clients upon request.
                </p>
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-digital-orange text-white px-6 py-3 text-sm font-bold hover:bg-digital-orange/90 transition-colors">
                  Schedule a Meeting <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="rounded-3xl overflow-hidden border border-abyssal-ink/10 shadow-sm" style={{ minHeight: 280 }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.21689636887!2d75.788529!3d22.719568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcad1b410ddb%3A0x96ec4da356240f4!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MistHustlers Office Location — Indore, Madhya Pradesh"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-8">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <TrustSection />
          </div>
        </section>
      </main>
    </div>
  );
}
