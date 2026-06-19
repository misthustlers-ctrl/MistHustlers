import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
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

type HomeStat = { value: number; suffix?: string; label: string };
type HomeJourneyStep = { step: string; title: string; desc: string };
type HomeFeature = { title: string; desc: string };
type HomeFaqItem = { q: string; a: string };
type HomeProject = { title: string; category: string; visual?: string; imageUrl?: string; link?: string };

type HomeContent = {
  hero: {
    badge: string;
    title: string[];
    highlightWord: string;
    description: string;
    tagline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  stats: HomeStat[];
  brands: string[];
  servicesTeaser: { badge: string; title: string; description: string; cta: string };
  careerTeaser: { badge: string; title: string; description: string; cta: string };
  journey: { badge: string; title: string; description: string };
  journeySteps: HomeJourneyStep[];
  mentorship: {
    badge: string;
    title: string;
    description: string;
    cta: string;
    features: HomeFeature[];
  };
  projectsShowcase: {
    enabled: boolean;
    badge: string;
    title: string;
    projects: HomeProject[];
  };
  faq: {
    badge: string;
    title: string[];
    items: HomeFaqItem[];
  };
  finalCta: {
    title: string[];
    highlightWord: string;
    description: string;
    cta: string;
  };
  faqData: HomeFaqItem[];
  projects: HomeProject[];
};

const HOME_DEFAULTS: HomeContent = {
  hero: {
    badge: "Premium Ecosystem",
    title: ["LEARN.", "BUILD.", "EARN.", "GROW."],
    highlightWord: "GROW.",
    description: "A Premium Ecosystem for Ambitious Students, Developers & Future Builders.",
    tagline: "No fluff. Real skills. Real execution.",
    ctaPrimary: "Join MistHustlers",
    ctaSecondary: "Explore Careers",
  },
  stats: [
    { value: 10000, suffix: "+", label: "Students Guided" },
    { value: 1200, suffix: "+", label: "Projects Built" },
    { value: 5000, suffix: "+", label: "Mentorship Hours" },
    { value: 80, suffix: "+", label: "Career Opportunities" },
  ],
  brands: ["STRIPE", "LINEAR", "VERCEL", "GITHUB", "NOTION"],
  servicesTeaser: {
    badge: "Services",
    title: "Build premium products",
    description: "From automation to full-stack development - we ship production-grade work for startups and founders.",
    cta: "Explore Services",
  },
  careerTeaser: {
    badge: "Career",
    title: "Your career, accelerated",
    description: "Jobs, internships, events, programs, and mentorship - all in one place.",
    cta: "Explore Career",
  },
  journey: { badge: "How We Work", title: "From Idea to Launch", description: "A streamlined process from requirements to delivery. Direct communication. No middlemen." },
  journeySteps: [
    { step: "01", title: "Learn", desc: "Master in-demand skills through our structured bootcamps, workshops, and curated learning paths designed by industry experts." },
    { step: "02", title: "Build", desc: "Apply your knowledge by building real projects. From automation pipelines to full-stack apps - your portfolio grows here." },
    { step: "03", title: "Earn", desc: "Monetize your skills through freelancing, internships, and career placements. We connect you directly to opportunities." },
    { step: "04", title: "Grow", desc: "Scale your career with ongoing mentorship, advanced projects, leadership skills, and a network of ambitious builders." },
  ],
  mentorship: {
    badge: "Mentorship",
    title: "Guided by those who've done it.",
    description: "Our mentors are active practitioners who share real, actionable guidance. No theory. Just practice.",
    cta: "Find a Mentor",
    features: [
      { title: "1:1 Guidance", desc: "Personalized sessions with practitioners who've been where you want to go." },
      { title: "Career Roadmap", desc: "A custom growth plan designed around your goals and timeline." },
      { title: "Accountability", desc: "Weekly check-ins to keep you on track and moving forward." },
      { title: "Project Reviews", desc: "Get expert feedback on your code, design, and architecture decisions." },
    ],
  },
  projectsShowcase: {
    enabled: true,
    badge: "Project Showcase",
    title: "Client-ready work we ship",
    projects: [
      { title: "Business Website Launch", category: "Website", visual: "WEB", imageUrl: "", link: "/projects" },
      { title: "Startup MVP Build", category: "Full-stack", visual: "MVP", imageUrl: "", link: "/projects" },
      { title: "Lead & Sheet Automation", category: "Automation", visual: "AI", imageUrl: "", link: "/projects" },
      { title: "Admin Dashboard Setup", category: "CMS", visual: "CMS", imageUrl: "", link: "/projects" },
      { title: "Client Work Management", category: "Operations", visual: "CRM", imageUrl: "", link: "/projects" },
      { title: "SEO & Performance Upgrade", category: "Growth", visual: "SEO", imageUrl: "", link: "/projects" },
    ],
  },
  faq: {
    badge: "FAQ",
    title: ["You ask.", "We answer."],
    items: [],
  },
  finalCta: {
    title: ["STOP WATCHING.", "START BUILDING."],
    highlightWord: "START BUILDING.",
    description: "Join the premium ecosystem built for ambitious future builders.",
    cta: "JOIN MISTHUSTLERS",
  },
  faqData: [],
  projects: [],
};

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const logoData = useContent("logo", LOGO_DEFAULTS);
  const c = useContent("home", HOME_DEFAULTS);
  const stats = useMemo(() => c.stats ?? [], [c.stats]);
  const journeySteps = useMemo(() => c.journeySteps ?? [], [c.journeySteps]);
  const faqData = useMemo(() => c.faq?.items ?? c.faqData ?? [], [c.faq, c.faqData]);
  const projectPreview = useMemo(() => c.projectsShowcase?.projects ?? c.projects ?? [], [c.projectsShowcase, c.projects]);
  const movingProjects = useMemo(() => {
    const items = projectPreview.length ? projectPreview : HOME_DEFAULTS.projectsShowcase.projects;
    return [...items, ...items];
  }, [projectPreview]);
  const heroLines = Array.isArray(c.hero?.title) ? c.hero.title : String(c.hero?.title || "").split("\n").filter(Boolean);
  const faqTitleLines = Array.isArray(c.faq?.title) ? c.faq.title : String(c.faq?.title || "").split("\n").filter(Boolean);
  const finalCtaLines = Array.isArray(c.finalCta?.title) ? c.finalCta.title : String(c.finalCta?.title || "").split("\n").filter(Boolean);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);
  const projectHref = (link?: string) => link?.trim() || "/projects";
  const isExternalProjectLink = (link?: string) => /^https?:\/\//i.test(link || "");

  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="home" />
      <SchemaMarkup page="home" faq={faqData} />
      <main>

      <section ref={heroRef} className="relative pt-20 md:pt-32 pb-16 sm:pb-20 overflow-hidden">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
                  {c.hero?.badge || HOME_DEFAULTS.hero.badge}
                </span>
                <h1 className="font-display text-[clamp(34px,12vw,110px)] leading-[0.92] sm:leading-[0.9] tracking-[0.02em] text-abyssal-ink">
                  {(heroLines.length ? heroLines : HOME_DEFAULTS.hero.title).map((line, index) => (
                    <span key={`${line}-${index}`} className={index === heroLines.length - 1 ? "text-digital-orange" : ""}>
                      {line}{index < heroLines.length - 1 && <br />}
                    </span>
                  ))}
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.33, 1, 0.68, 1] }}
                className="text-base md:text-lg text-abyssal-ink/60 max-w-md leading-relaxed font-body"
              >
                {c.hero?.description}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="text-sm text-abyssal-ink/40 font-medium tracking-wider uppercase font-body"
              >
                {c.hero?.tagline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4"
              >
                <button
                  onClick={() => setModalOpen(true)}
                  className="magnetic-btn bg-digital-orange text-white px-6 sm:px-8 py-4 rounded-[800px] text-base font-semibold cursor-pointer font-body text-center"
                >
                  {c.hero?.ctaPrimary || "Get a Quote"}
                </button>
                <button
                  onClick={() => navigate("/services")}
                  className="magnetic-btn bg-transparent border-2 border-abyssal-ink text-abyssal-ink px-6 sm:px-8 py-4 rounded-[800px] text-base font-semibold cursor-pointer hover:bg-abyssal-ink hover:text-white transition-colors duration-300 font-body text-center"
                >
                  {c.hero?.ctaSecondary || "View Services"}
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
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="font-display text-[clamp(32px,5vw,56px)] tracking-[0.02em] text-abyssal-ink leading-none">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix || ""} />
                  </div>
                  <p className="text-sm text-abyssal-ink/50 mt-2 font-medium font-body">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-30">
              {(c.brands || []).map((p) => (
                <span key={p} className="font-display text-xl tracking-[0.1em] text-abyssal-ink/40">{p}</span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SERVICES TEASER */}
      <section className="py-16 md:py-20 bg-ash-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <span className="text-sm font-semibold tracking-wider uppercase text-cyber-violet font-body">{c.servicesTeaser?.badge || "Services"}</span>
              <h2 className="font-body font-bold text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
                {c.servicesTeaser?.title || "Websites, MVPs & Automation"}
              </h2>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                {c.servicesTeaser?.description || "From landing pages to full-stack platforms and AI automation pipelines - we ship production-grade work for startups and founders."}
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="text-center">
              <button
                onClick={() => navigate("/services")}
                className="magnetic-btn bg-digital-orange text-white px-8 py-4 rounded-[800px] text-base font-semibold cursor-pointer font-body"
              >
                {c.servicesTeaser?.cta || "Explore Services"} &rarr;
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <span className="text-sm font-semibold tracking-wider uppercase text-digital-orange font-body">{c.journey?.badge || "How We Work"}</span>
              <h2 className="font-body font-bold text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
                {c.journey?.title || "From Idea to Launch"}
              </h2>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                {c.journey?.description || "A streamlined process from requirements to delivery. Direct communication. No middlemen."}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {journeySteps.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 0.12}>
                <div className="relative bg-ash-white rounded-[28px] md:rounded-[40px] p-5 md:p-10 border border-abyssal-ink/5 h-full group card-lift">
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
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <span className="text-sm font-semibold tracking-wider uppercase text-cyber-violet font-body">{c.careerTeaser?.badge || "Career"}</span>
              <h2 className="font-body font-bold text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
                {c.careerTeaser?.title || "Your career, accelerated"}
              </h2>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                {c.careerTeaser?.description || "Jobs, internships, events, programs, and mentorship - all in one place."}
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="text-center">
              <button
                onClick={() => navigate("/career")}
                className="magnetic-btn bg-digital-orange text-white px-8 py-4 rounded-[800px] text-base font-semibold cursor-pointer font-body"
              >
                {c.careerTeaser?.cta || "Explore Career"} &rarr;
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* MENTORSHIP TEASER */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <ScrollReveal>
              <span className="text-sm font-semibold tracking-wider uppercase text-cyber-violet font-body">{c.mentorship?.badge || "Mentorship"}</span>
              <h2 className="font-body font-bold text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05] mb-6">
                {c.mentorship?.title || "Guided by those who've done it."}
              </h2>
              <p className="text-abyssal-ink/60 mb-8 leading-relaxed font-body">
                {c.mentorship?.description || "Our mentors are active practitioners who share real, actionable guidance. No theory. Just practice."}
              </p>
              <button
                onClick={() => navigate("/career")}
                className="magnetic-btn bg-abyssal-ink text-white px-8 py-4 rounded-[800px] text-base font-semibold cursor-pointer hover:bg-digital-orange transition-colors duration-300 font-body"
              >
                {c.mentorship?.cta || "Find a Mentor"} &rarr;
              </button>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="bg-ash-white rounded-[28px] md:rounded-[40px] p-6 md:p-10 border border-abyssal-ink/5 relative overflow-hidden">
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
      {c.projectsShowcase?.enabled !== false && movingProjects.length > 0 && (
      <section className="py-16 md:py-24 bg-ash-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-12 flex flex-col gap-5 text-center md:flex-row md:items-end md:justify-between md:text-left">
              <div>
                <span className="text-sm font-semibold tracking-wider uppercase text-digital-orange font-body">{c.projectsShowcase?.badge || HOME_DEFAULTS.projectsShowcase.badge}</span>
                <h2 className="font-body font-bold text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
                  {c.projectsShowcase?.title || HOME_DEFAULTS.projectsShowcase.title}
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

          <ScrollReveal delay={0.08}>
            <div className="project-marquee relative overflow-hidden">
              <div className="project-marquee__track flex w-max gap-5">
                {movingProjects.map((proj, i) => (
                  <a
                    key={`${proj.title}-${i}`}
                    href={projectHref(proj.link)}
                    target={isExternalProjectLink(proj.link) ? "_blank" : undefined}
                    rel={isExternalProjectLink(proj.link) ? "noopener noreferrer" : undefined}
                    className="card-lift group h-[220px] w-[280px] flex-shrink-0 overflow-hidden rounded-[28px] border border-abyssal-ink/5 bg-basalt-canvas text-left sm:w-[340px]"
                  >
                    <div className="relative flex h-28 items-center justify-center overflow-hidden bg-abyssal-ink/3">
                      {proj.imageUrl ? (
                        <img src={proj.imageUrl} alt={proj.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <>
                          <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(252,80,0,0.12),transparent_38%),radial-gradient(circle_at_70%_45%,rgba(82,74,233,0.12),transparent_34%)] opacity-80 transition-transform duration-500 group-hover:scale-110" />
                          <span className="relative font-display text-5xl tracking-[0.08em] text-abyssal-ink/18">{proj.visual || "MH"}</span>
                        </>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-semibold tracking-wider uppercase text-digital-orange font-body">{proj.category}</span>
                      <h3 className="font-body font-bold mt-2 text-xl tracking-[0.02em] text-abyssal-ink">{proj.title}</h3>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
      )}

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <ScrollReveal>
              <div className="mb-12 text-center">
                <span className="text-sm font-semibold tracking-wider uppercase text-cyber-violet font-body">{c.faq?.badge || "FAQ"}</span>
                <h2 className="font-body font-bold text-[clamp(36px,5vw,48px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
                  {(faqTitleLines.length ? faqTitleLines : ["You ask.", "We answer."]).map((line, index) => (
                    <span key={`${line}-${index}`}>
                      {line}{index < (faqTitleLines.length ? faqTitleLines.length : 2) - 1 && <br />}
                    </span>
                  ))}
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
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <h2 className="font-body font-bold text-[clamp(32px,6vw,80px)] tracking-[0.02em] leading-[0.95] mb-6">
              {(finalCtaLines.length ? finalCtaLines : ["STOP WATCHING.", "START BUILDING."]).map((line, index) => (
                <span key={`${line}-${index}`} className={line === c.finalCta?.highlightWord || index === finalCtaLines.length - 1 ? "text-digital-orange" : ""}>
                  {line}{index < (finalCtaLines.length ? finalCtaLines.length : 2) - 1 && <br />}
                </span>
              ))}
            </h2>
            <p className="text-white/50 text-base md:text-lg mb-10 max-w-md mx-auto font-body">
              {c.finalCta?.description || "Join the premium ecosystem built for ambitious future builders."}
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="magnetic-btn bg-digital-orange text-white px-6 py-4 md:px-10 md:py-5 rounded-[800px] text-base md:text-lg font-bold cursor-pointer font-body"
            >
              {c.finalCta?.cta || "JOIN MISTHUSTLERS"}
            </button>
          </ScrollReveal>
        </div>
      </section>

      </main>

      <JoinEcosystemModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
