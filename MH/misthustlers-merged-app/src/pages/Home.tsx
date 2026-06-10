import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import GlobalNavbar from "@/components/GlobalNavbar";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import FAQItem from "@/components/FAQItem";
import Footer from "@/components/Footer";
import JoinEcosystemModal from "@/components/JoinEcosystemModal";
import { useContent } from "@/utils/useContent";

function Hero3DVisual() {
  return (
    <div className="perspective-3d relative w-full h-[500px] flex items-center justify-center">
      <div className="animate-float3d preserve-3d relative z-10">
        <div className="w-36 h-36 rounded-[40px] bg-ash-white border border-abyssal-ink/5 flex items-center justify-center shadow-2xl shadow-abyssal-ink/5">
          <span className="font-display text-5xl tracking-[0.02em] text-abyssal-ink leading-none">MH</span>
        </div>
        <div className="absolute -inset-4 rounded-[50px] border border-digital-orange/20 animate-pulse-glow" />
      </div>
      <div className="absolute top-8 right-12 animate-float-slow preserve-3d" style={{ animationDelay: "0.3s" }}>
        <div className="w-24 h-32 rounded-2xl bg-white/80 backdrop-blur border border-abyssal-ink/5 shadow-lg rotate-6 flex items-center justify-center">
          <span className="text-2xl">⚡</span>
        </div>
      </div>
      <div className="absolute top-20 left-8 animate-float-slow preserve-3d" style={{ animationDelay: "1s" }}>
        <div className="w-20 h-28 rounded-2xl bg-white/80 backdrop-blur border border-abyssal-ink/5 shadow-lg -rotate-3 flex items-center justify-center">
          <span className="text-xl">🛠</span>
        </div>
      </div>
      <div className="absolute bottom-16 right-20 animate-float-slow preserve-3d" style={{ animationDelay: "1.8s" }}>
        <div className="w-28 h-20 rounded-2xl bg-white/80 backdrop-blur border border-abyssal-ink/5 shadow-lg -rotate-6 flex items-center justify-center">
          <span className="text-xl">📈</span>
        </div>
      </div>
      <div className="absolute bottom-24 left-16 animate-float-slow preserve-3d" style={{ animationDelay: "2.4s" }}>
        <div className="w-20 h-20 rounded-full bg-cyber-violet/10 backdrop-blur border border-cyber-violet/20 shadow-lg flex items-center justify-center">
          <span className="text-lg">🚀</span>
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

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const c = useContent("home", { stats: [{ value: 10000, suffix: "+", label: "Students Guided" }, { value: 1200, suffix: "+", label: "Projects Built" }, { value: 5000, suffix: "+", label: "Mentorship Hours" }, { value: 80, suffix: "+", label: "Career Opportunities" }], journeySteps: [{ step: "01", title: "Learn", desc: "Master in-demand skills through our structured bootcamps, workshops, and curated learning paths designed by industry experts." }, { step: "02", title: "Build", desc: "Apply your knowledge by building real projects. From automation pipelines to full-stack apps — your portfolio grows here." }, { step: "03", title: "Earn", desc: "Monetize your skills through freelancing, internships, and career placements. We connect you directly to opportunities." }, { step: "04", title: "Grow", desc: "Scale your career with ongoing mentorship, advanced projects, leadership skills, and a network of ambitious builders." }], mentorship: { features: [{ title: "1:1 Guidance", desc: "Personalized sessions with practitioners who've been where you want to go." }, { title: "Career Roadmap", desc: "A custom growth plan designed around your goals and timeline." }, { title: "Accountability", desc: "Weekly check-ins to keep you on track and moving forward." }, { title: "Project Reviews", desc: "Get expert feedback on your code, design, and architecture decisions." }] }, faqData: [{ q: "What exactly is MistHustlers?", a: "MistHustlers is a premium ecosystem that combines learning, building, earning, and career growth into one seamless experience. We're not a course platform — we're a launchpad for ambitious builders." }, { q: "Is this only for students?", a: "No. While we welcome students, MistHustlers is for anyone ambitious — developers, career-switchers, freelancers, and future founders who want to build real skills and real income." }, { q: "How does the mentorship work?", a: "You get paired with an industry practitioner for 1:1 sessions. We cover career roadmapping, project reviews, accountability check-ins, and growth strategy — all tailored to your goals." }, { q: "What kind of projects will I build?", a: "Real-world projects: automation systems, full-stack web apps, AI integrations, portfolio sites, and client work. Everything is designed to be portfolio-worthy and career-relevant." }, { q: "How do I get career opportunities?", a: "Through our talent matching engine. Once you've built skills and projects, we connect you with internships, freelance gigs, and full-time roles from our partner network." }, { q: "Is there a fee to join?", a: "We offer different tiers based on your goals. Fill out the inquiry form and we'll match you with the right program. No hidden fees — everything is transparent." }], projects: [{ title: "Automation Dashboard", category: "Automation", visual: "⚡" }, { title: "E-Commerce Platform", category: "Development", visual: "🛒" }, { title: "AI Content Pipeline", category: "AI", visual: "🤖" }, { title: "Portfolio Builder App", category: "Tooling", visual: "🎨" }, { title: "Client CRM System", category: "Freelancing", visual: "📊" }, { title: "Career Match Engine", category: "Platform", visual: "🔗" }] });
  const stats = c.stats ?? [];
  const journeySteps = c.journeySteps ?? [];
  const faqData = c.faq?.items ?? [];
  const projectPreview = (c.projectsShowcase?.projects ?? []).slice(0, 3);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  return (
    <div className="bg-basalt-canvas min-h-screen">
      <GlobalNavbar />

      <section ref={heroRef} className="relative pt-32 pb-20 overflow-hidden">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
                  Premium Ecosystem
                </span>
                <h1 className="font-display text-[clamp(64px,8vw,120px)] leading-[0.9] tracking-[0.02em] text-abyssal-ink">
                  LEARN.<br />BUILD.<br />EARN.<br />
                  <span className="text-digital-orange">GROW.</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.33, 1, 0.68, 1] }}
                className="text-lg text-abyssal-ink/60 max-w-md leading-relaxed font-body"
              >
                A Premium Ecosystem for Ambitious Students, Developers & Future Builders.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="text-sm text-abyssal-ink/40 font-medium tracking-wider uppercase font-body"
              >
                No fluff. Real skills. Real execution.
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
                  Join MistHustlers
                </button>
                <button
                  onClick={() => navigate("/career")}
                  className="magnetic-btn bg-transparent border-2 border-abyssal-ink text-abyssal-ink px-8 py-4 rounded-[800px] text-base font-semibold cursor-pointer hover:bg-abyssal-ink hover:text-white transition-colors duration-300 font-body"
                >
                  Explore Careers
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
            >
              <Hero3DVisual />
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="py-16 border-t border-abyssal-ink/5">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="font-display text-[clamp(40px,5vw,56px)] tracking-[0.02em] text-abyssal-ink leading-none">
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
      <section className="py-24 bg-ash-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <span className="text-sm font-semibold tracking-wider uppercase text-cyber-violet font-body">Services</span>
              <h2 className="font-display text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
                Build premium products
              </h2>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                From automation to full-stack development — we ship production-grade work for startups and founders.
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
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <span className="text-sm font-semibold tracking-wider uppercase text-digital-orange font-body">The Journey</span>
              <h2 className="font-display text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
                Learn &rarr; Build &rarr; Earn &rarr; Grow
              </h2>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                A proven pathway from skill acquisition to professional success.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {journeySteps.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 0.12}>
                <div className="relative bg-ash-white rounded-[40px] p-8 border border-abyssal-ink/5 h-full group card-lift">
                  <span className="font-display text-5xl tracking-[0.02em] text-abyssal-ink/10 group-hover:text-digital-orange/20 transition-colors duration-300">
                    {step.step}
                  </span>
                  <h3 className="font-display text-2xl tracking-[0.02em] text-abyssal-ink mt-3 mb-3">{step.title}</h3>
                  <p className="text-sm text-abyssal-ink/60 leading-relaxed font-body">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CAREER TEASER */}
      <section className="py-24 bg-ash-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <span className="text-sm font-semibold tracking-wider uppercase text-cyber-violet font-body">Career</span>
              <h2 className="font-display text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
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
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <span className="text-sm font-semibold tracking-wider uppercase text-cyber-violet font-body">Mentorship</span>
              <h2 className="font-display text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05] mb-6">
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
              <div className="bg-ash-white rounded-[40px] p-10 border border-abyssal-ink/5 relative overflow-hidden">
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
      <section className="py-24 bg-ash-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="mb-12 flex flex-col gap-5 text-center md:flex-row md:items-end md:justify-between md:text-left">
              <div>
                <span className="text-sm font-semibold tracking-wider uppercase text-digital-orange font-body">Project Preview</span>
                <h2 className="font-display text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
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
                  <div className="flex h-44 items-center justify-center bg-abyssal-ink/3">
                    <span className="text-5xl opacity-30">{proj.visual}</span>
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold tracking-wider uppercase text-abyssal-ink/40 font-body">{proj.category}</span>
                    <h3 className="font-display mt-1 text-xl tracking-[0.02em] text-abyssal-ink">{proj.title}</h3>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <ScrollReveal>
              <div className="mb-12 text-center">
                <span className="text-sm font-semibold tracking-wider uppercase text-cyber-violet font-body">FAQ</span>
                <h2 className="font-display text-[clamp(36px,5vw,48px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
                  You ask.<br />We answer.
                </h2>
              </div>
            </ScrollReveal>

            <div className="bg-ash-white rounded-[40px] p-8 border border-abyssal-ink/5">
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
      <section className="py-24 bg-abyssal-ink text-white">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="font-display text-[clamp(48px,8vw,96px)] tracking-[0.02em] leading-[0.95] mb-6">
              STOP WATCHING.<br />
              <span className="text-digital-orange">START BUILDING.</span>
            </h2>
            <p className="text-white/50 text-lg mb-10 max-w-md mx-auto font-body">
              Join the premium ecosystem built for ambitious future builders.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="magnetic-btn bg-digital-orange text-white px-10 py-5 rounded-[800px] text-lg font-bold cursor-pointer font-body"
            >
              JOIN MISTHUSTLERS
            </button>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      <JoinEcosystemModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
