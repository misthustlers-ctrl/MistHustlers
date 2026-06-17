import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import FAQItem from "@/components/FAQItem";
import JoinEcosystemModal from "@/components/JoinEcosystemModal";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import { useContent } from "@/utils/useContent";

function EmojiIcon({ src, alt, className }: { src: string; alt: string; className: string }) {
  if (!src) return null;
  return <img src={src} alt={alt} className={className} />;
}

function Hero3DVisual({ emojiLightning, emojiTools, emojiGrowth, emojiRocket }: { emojiLightning?: string; emojiTools?: string; emojiGrowth?: string; emojiRocket?: string }) {
  return (
    <div className="perspective-3d relative w-full h-[300px] md:h-[500px] flex items-center justify-center">
      <div className="animate-float3d preserve-3d relative z-10">
        <div className="w-36 h-36 rounded-[40px] bg-ash-white border border-abyssal-ink/5 flex items-center justify-center shadow-2xl shadow-abyssal-ink/5">
          <span className="font-display text-5xl tracking-[0.02em] text-abyssal-ink leading-none">MH</span>
        </div>
        <div className="absolute -inset-4 rounded-[50px] border border-digital-orange/20 animate-pulse-glow" />
      </div>
      <div className="hidden md:block absolute top-8 right-12 animate-float-slow preserve-3d" style={{ animationDelay: "0.3s" }}>
        <div className="w-24 h-32 rounded-2xl bg-white/80 backdrop-blur border border-abyssal-ink/5 shadow-lg rotate-6 flex items-center justify-center">
          {emojiLightning ? <EmojiIcon src={emojiLightning} alt="Lightning" className="w-8 h-8" /> : <span className="text-2xl">⚡</span>}
        </div>
      </div>
      <div className="hidden md:block absolute top-20 left-8 animate-float-slow preserve-3d" style={{ animationDelay: "1s" }}>
        <div className="w-20 h-28 rounded-2xl bg-white/80 backdrop-blur border border-abyssal-ink/5 shadow-lg -rotate-3 flex items-center justify-center">
          {emojiTools ? <EmojiIcon src={emojiTools} alt="Tools" className="w-7 h-7" /> : <span className="text-xl">🛠</span>}
        </div>
      </div>
      <div className="hidden md:block absolute bottom-16 right-20 animate-float-slow preserve-3d" style={{ animationDelay: "1.8s" }}>
        <div className="w-28 h-20 rounded-2xl bg-white/80 backdrop-blur border border-abyssal-ink/5 shadow-lg -rotate-6 flex items-center justify-center">
          {emojiGrowth ? <EmojiIcon src={emojiGrowth} alt="Growth" className="w-7 h-7" /> : <span className="text-xl">📈</span>}
        </div>
      </div>
      <div className="hidden md:block absolute bottom-24 left-16 animate-float-slow preserve-3d" style={{ animationDelay: "2.4s" }}>
        <div className="w-20 h-20 rounded-full bg-cyber-violet/10 backdrop-blur border border-cyber-violet/20 shadow-lg flex items-center justify-center">
          {emojiRocket ? <EmojiIcon src={emojiRocket} alt="Rocket" className="w-7 h-7" /> : <span className="text-lg">🚀</span>}
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-40 rounded-3xl glass-card -rotate-2 opacity-60" />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #070607 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
    </div>
  );
}

const LOGO_DEFAULTS = {
  emojiLightning: "",
  emojiTools: "",
  emojiGrowth: "",
  emojiRocket: "",
};

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const logoData = useContent("logo", LOGO_DEFAULTS);
  const c = useContent("home", { stats: [{ value: 127, suffix: "+", label: "Projects Delivered" }, { value: 43, suffix: "+", label: "Happy Clients" }, { value: 18, suffix: "+", label: "Startups Launched" }, { value: 48, suffix: "h", label: "Avg Response Time" }], journeySteps: [{ step: "01", title: "Requirements", desc: "Share your project idea, timeline, and budget. We analyze scope and feasibility within 24 hours." }, { step: "02", title: "Proposal", desc: "Receive a fixed-price proposal with clear deliverables, milestones, and exact timeline. No hidden costs." }, { step: "03", title: "Execution", desc: "We build your project with daily updates and direct communication. Zero bureaucracy. Full transparency." }, { step: "04", title: "Delivery", desc: "Handover with complete source code, documentation, and ongoing support. Your project, fully shipped." }], mentorship: { features: [{ title: "Fixed Pricing", desc: "Know exactly what you pay upfront. No hourly billing, no scope creep, no surprises." }, { title: "Direct Access", desc: "Communicate directly with the developers building your project. No account managers." }, { title: "48h Response", desc: "We respond to every inquiry within 48 hours. Async-first, all timezones." }, { title: "Source Code Included", desc: "You own everything we build. Full source code, documentation, and rights." }] }, faqData: [{ q: "What services does MistHustlers offer?", a: "We offer web development, MVP development, automation systems, full-stack application development, and UI/UX design services in Indore. From landing pages to complex platforms." }, { q: "How much does it cost to build a website?", a: "Our pricing starts at Rs 999 for basic landing pages and goes up to Rs 50,000+ for full-stack applications. We provide a fixed-price quote after reviewing your requirements." }, { q: "Where is MistHustlers based?", a: "We are based in Indore, Madhya Pradesh, and serve clients across India and globally. We work async-first via email, WhatsApp, and calls." }, { q: "How long does it take to build a project?", a: "A landing page can be delivered in 3-5 days. A full-stack MVP typically takes 2-4 weeks. We provide exact timelines in our proposal." }, { q: "Do you offer support after delivery?", a: "Yes. Every project includes post-delivery support from 14 to 90 days depending on plan. We also offer ongoing maintenance and feature additions." }], projects: [] });
  const stats = useMemo(() => c.stats ?? [], [c.stats]);
  const journeySteps = useMemo(() => c.journeySteps ?? [], [c.journeySteps]);
  const faqData = useMemo(() => c.faqData ?? [], [c.faqData]);
  const projectPreview = useMemo(() => (c.projects ?? []).slice(0, 3), [c.projects]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="home" />
      <SchemaMarkup page="home" faq={faqData} />
      <main>

      <section ref={heroRef} className="relative pt-20 md:pt-32 pb-20 overflow-hidden">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
                  Web Development Agency — Indore
                </span>
                <h1 className="font-display text-[clamp(36px,6vw,110px)] leading-[0.9] tracking-[0.02em] text-abyssal-ink">
                  Web Development &amp;<br />Automation Services<br />
                  <span className="text-digital-orange">in Indore</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.33, 1, 0.68, 1] }}
                className="text-base md:text-lg text-abyssal-ink/60 max-w-md leading-relaxed font-body"
              >
                We build websites, MVPs, and automation systems for startups and founders in Indore. Fixed pricing. 48h response. No bureaucracy.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="text-sm text-abyssal-ink/40 font-medium tracking-wider uppercase font-body"
              >
                From landing pages to full-stack platforms. Starting at ₹999.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={() => setModalOpen(true)}
                  className="magnetic-btn bg-digital-orange text-white px-8 py-4 rounded-[800px] text-base font-semibold cursor-pointer font-body"
                >
                  Get a Quote
                </button>
                <button
                  onClick={() => navigate("/services")}
                  className="magnetic-btn bg-transparent border-2 border-abyssal-ink text-abyssal-ink px-8 py-4 rounded-[800px] text-base font-semibold cursor-pointer hover:bg-abyssal-ink hover:text-white transition-colors duration-300 font-body"
                >
                  View Services
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
            >
              <Hero3DVisual
                emojiLightning={logoData.emojiLightning}
                emojiTools={logoData.emojiTools}
                emojiGrowth={logoData.emojiGrowth}
                emojiRocket={logoData.emojiRocket}
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="py-12 md:py-16 border-t border-abyssal-ink/5">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="font-display text-[clamp(32px,5vw,56px)] tracking-[0.02em] text-abyssal-ink leading-none">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm text-abyssal-ink/50 mt-2 font-medium font-body">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-30">
              {["STRIPE", "LINEAR", "VERCEL", "GITHUB", "NOTION"].map((p) => (
                <span key={p} className="font-display text-xl tracking-[0.1em] text-abyssal-ink/40">{p}</span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SERVICES TEASER */}
      <section className="py-16 md:py-20 bg-ash-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <span className="text-sm font-semibold tracking-wider uppercase text-cyber-violet font-body">Services in Indore</span>
              <h2 className="font-body font-bold text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
                Websites, MVPs &amp; Automation
              </h2>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                From landing pages to full-stack platforms and AI automation pipelines — we ship production-grade work for startups and founders in Indore.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="text-center">
              <button
                onClick={() => navigate("/services")}
                className="magnetic-btn bg-digital-orange text-white px-8 py-4 rounded-[800px] text-base font-semibold cursor-pointer font-body"
              >
                Explore Services &rarr;
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <span className="text-sm font-semibold tracking-wider uppercase text-digital-orange font-body">How We Work</span>
              <h2 className="font-body font-bold text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
                From Idea to Launch
              </h2>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                A streamlined process from requirements to delivery. Direct communication. No middlemen.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {journeySteps.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 0.12}>
                <div className="relative bg-ash-white rounded-[40px] p-5 md:p-10 border border-abyssal-ink/5 h-full group card-lift">
                  <span className="font-display text-4xl md:text-5xl tracking-[0.02em] text-abyssal-ink/10 group-hover:text-digital-orange/20 transition-colors duration-300">
                    {step.step}
                  </span>
                  <h3 className="font-body font-bold text-xl md:text-2xl tracking-[0.02em] text-abyssal-ink mt-3 mb-3">{step.title}</h3>
                  <p className="text-sm text-abyssal-ink/60 leading-relaxed font-body">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CAREER TEASER */}
      <section className="py-16 md:py-20 bg-ash-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <span className="text-sm font-semibold tracking-wider uppercase text-cyber-violet font-body">Career</span>
              <h2 className="font-body font-bold text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
                Your career, accelerated
              </h2>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                Jobs, internships, events, programs, and mentorship — all in one place.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="text-center">
              <button
                onClick={() => navigate("/career")}
                className="magnetic-btn bg-digital-orange text-white px-8 py-4 rounded-[800px] text-base font-semibold cursor-pointer font-body"
              >
                Explore Career &rarr;
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* MENTORSHIP TEASER */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <ScrollReveal>
              <span className="text-sm font-semibold tracking-wider uppercase text-cyber-violet font-body">Mentorship</span>
              <h2 className="font-body font-bold text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05] mb-6">
                Guided by those<br />who've done it.
              </h2>
              <p className="text-abyssal-ink/60 mb-8 leading-relaxed font-body">
                Our mentors are active practitioners who share real, actionable guidance. No theory. Just practice.
              </p>
              <button
                onClick={() => navigate("/career")}
                className="magnetic-btn bg-abyssal-ink text-white px-8 py-4 rounded-[800px] text-base font-semibold cursor-pointer hover:bg-digital-orange transition-colors duration-300 font-body"
              >
                Find a Mentor &rarr;
              </button>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="bg-ash-white rounded-[40px] p-6 md:p-10 border border-abyssal-ink/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-violet/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative space-y-6">
                  {(c.mentorship?.features ?? []).map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="w-2 h-2 rounded-full bg-digital-orange mt-2 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-abyssal-ink font-body">{item.title}</h4>
                        <p className="text-sm text-abyssal-ink/60 font-body">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* PROJECT PREVIEW */}
      <section className="py-16 md:py-24 bg-ash-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="mb-12 flex flex-col gap-5 text-center md:flex-row md:items-end md:justify-between md:text-left">
              <div>
                <span className="text-sm font-semibold tracking-wider uppercase text-digital-orange font-body">Project Preview</span>
                <h2 className="font-body font-bold text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
                  Recent community builds
                </h2>
              </div>
              <button
                onClick={() => navigate("/projects")}
                className="magnetic-btn rounded-[800px] bg-abyssal-ink px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-digital-orange font-body"
              >
                View all projects &rarr;
              </button>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5">
            {projectPreview.map((proj, i) => (
              <ScrollReveal key={proj.title} delay={i * 0.08}>
                <div className="card-lift h-full overflow-hidden rounded-[32px] border border-abyssal-ink/5 bg-basalt-canvas">
                  <div className="flex h-32 md:h-44 items-center justify-center bg-abyssal-ink/3">
                    <span className="text-5xl opacity-30">{proj.visual}</span>
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold tracking-wider uppercase text-abyssal-ink/40 font-body">{proj.category}</span>
                    <h3 className="font-body font-bold mt-1 text-xl tracking-[0.02em] text-abyssal-ink">{proj.title}</h3>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <ScrollReveal>
              <div className="mb-12 text-center">
                <span className="text-sm font-semibold tracking-wider uppercase text-cyber-violet font-body">FAQ</span>
                <h2 className="font-body font-bold text-[clamp(36px,5vw,48px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
                  You ask.<br />We answer.
                </h2>
              </div>
            </ScrollReveal>

            <div className="bg-ash-white rounded-[24px] md:rounded-[40px] p-5 md:p-8 border border-abyssal-ink/5">
              {faqData.map((faq, i) => (
                <FAQItem
                  key={i}
                  q={faq.q}
                  a={faq.a}
                  isOpen={openFAQ === i}
                  onClick={() => toggleFAQ(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-20 bg-abyssal-ink text-white">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-body font-bold text-[clamp(32px,6vw,80px)] tracking-[0.02em] leading-[0.95] mb-6">
              READY TO SHIP<br />
              <span className="text-digital-orange">YOUR PROJECT?</span>
            </h2>
            <p className="text-white/50 text-base md:text-lg mb-10 max-w-md mx-auto font-body">
              Get a fixed-price proposal in 48 hours. No calls. No pressure. Real execution.
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="magnetic-btn bg-digital-orange text-white px-6 py-4 md:px-10 md:py-5 rounded-[800px] text-base md:text-lg font-bold cursor-pointer font-body"
            >
              GET A QUOTE
            </button>
          </ScrollReveal>
        </div>
      </section>

      </main>

      <JoinEcosystemModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
