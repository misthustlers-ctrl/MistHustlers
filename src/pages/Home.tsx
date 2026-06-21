import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import FAQItem from "@/components/FAQItem";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import { useContent } from "@/utils/useContent";

function CustomIcon({ src, alt, className }: { src: string; alt: string; className: string }) {
  if (!src) return null;
  return <img src={src} alt={alt} className={className} />;
}

function ServiceMark({ label, sublabel, accent = "orange" }: { label: string; sublabel: string; accent?: "orange" | "violet" | "ink" }) {
  const accentClass = accent === "violet" ? "text-cyber-violet" : accent === "ink" ? "text-abyssal-ink" : "text-digital-orange";
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-center">
      <span className={`font-display text-2xl tracking-[0.06em] leading-none ${accentClass}`}>{label}</span>
      <span className="font-body text-[9px] font-bold uppercase tracking-[0.16em] text-abyssal-ink/45">{sublabel}</span>
    </div>
  );
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
          {emojiLightning ? <CustomIcon src={emojiLightning} alt="Website icon" className="w-8 h-8" /> : <ServiceMark label="WEB" sublabel="Sites" />}
        </div>
      </div>
      <div className="hidden md:block absolute top-20 left-8 animate-float-slow preserve-3d" style={{ animationDelay: "1s" }}>
        <div className="w-20 h-28 rounded-2xl bg-white/80 backdrop-blur border border-abyssal-ink/5 shadow-lg -rotate-3 flex items-center justify-center">
          {emojiTools ? <CustomIcon src={emojiTools} alt="MVP icon" className="w-7 h-7" /> : <ServiceMark label="MVP" sublabel="Launch" accent="violet" />}
        </div>
      </div>
      <div className="hidden md:block absolute bottom-16 right-20 animate-float-slow preserve-3d" style={{ animationDelay: "1.8s" }}>
        <div className="w-28 h-20 rounded-2xl bg-white/80 backdrop-blur border border-abyssal-ink/5 shadow-lg -rotate-6 flex items-center justify-center">
          {emojiGrowth ? <CustomIcon src={emojiGrowth} alt="Automation icon" className="w-7 h-7" /> : <ServiceMark label="AI" sublabel="Automation" />}
        </div>
      </div>
      <div className="hidden md:block absolute bottom-24 left-16 animate-float-slow preserve-3d" style={{ animationDelay: "2.4s" }}>
        <div className="w-20 h-20 rounded-full bg-cyber-violet/10 backdrop-blur border border-cyber-violet/20 shadow-lg flex items-center justify-center">
          {emojiRocket ? <CustomIcon src={emojiRocket} alt="Support icon" className="w-7 h-7" /> : <ServiceMark label="24" sublabel="Support" accent="ink" />}
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
type PricingTier = { id: string; name: string; price: string; description: string; features: string[]; popular?: boolean; accent?: string };
type ServiceCard = { title: string; category: string; description: string; price?: string; link?: string; enabled?: boolean };

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
    badge: "Websites • MVPs • AI Automation",
    title: ["WEB DEVELOPMENT", "AI AUTOMATION", "INDORE AGENCY."],
    highlightWord: "INDORE AGENCY.",
    description: "MistHustlers helps startups, founders and growing businesses turn ideas into production-ready websites, MVPs and automation systems through clear planning, practical execution and complete project ownership.",
    tagline: "Based in Indore. Available for remote projects across India.",
    ctaPrimary: "Start Your Project",
    ctaSecondary: "Explore Our Work",
  },
  stats: [
    { value: 10, suffix: "+", label: "Business Website Previews" },
    { value: 4, suffix: "", label: "Core Service Categories" },
    { value: 6, suffix: "", label: "Execution Stages Covered" },
    { value: 1, suffix: "", label: "Direct Founder Communication" },
  ],
  brands: ["Transparent Scope", "Clear Milestones", "Source-Code Handover", "Post-Launch Support"],
  servicesTeaser: {
    badge: "Core Services",
    title: "Websites, MVPs and automations built for real business needs",
    description: "Business websites, startup MVPs, AI workflow automation and maintenance support - planned with clear scope and built for practical execution.",
    cta: "Explore Services",
  },
  careerTeaser: {
    badge: "Builder Ecosystem",
    title: "More than an agency - a growing builder ecosystem",
    description: "Alongside client execution, MistHustlers creates opportunities for developers, students and emerging builders to learn through practical projects, collaborations and career opportunities.",
    cta: "Explore Careers",
  },
  journey: { badge: "How We Work", title: "From Idea to Launch", description: "A streamlined process from requirements to delivery. Direct communication. No middlemen." },
  journeySteps: [
    { step: "01", title: "Understand", desc: "We understand the business, target audience, requirements and expected outcome before recommending a build path." },
    { step: "02", title: "Plan", desc: "We define project scope, deliverables, technical approach, milestones and timeline before development begins." },
    { step: "03", title: "Build", desc: "We design, develop, test and share progress throughout execution so the work stays aligned with the requirement." },
    { step: "04", title: "Launch and Support", desc: "We deploy the final product, complete project handover and provide the agreed support after launch." },
  ],
  mentorship: {
    badge: "Why MistHustlers",
    title: "Business-first execution with clear ownership.",
    description: "MistHustlers is a digital product and technology execution company based in Indore, Madhya Pradesh. It builds business websites, MVPs, AI automation systems and related digital solutions for startups, founders and growing businesses.",
    cta: "Start a Project",
    features: [
      { title: "Direct Communication", desc: "Project discussion stays close to the execution team so decisions move faster." },
      { title: "Clear Scope", desc: "Deliverables, milestones and technical approach are clarified before development begins." },
      { title: "Responsive Builds", desc: "Websites and products are planned for mobile usability, performance and practical business use." },
      { title: "Project Handover", desc: "Source-code handover and post-launch support follow the agreed project scope." },
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
    items: [
      { q: "What does MistHustlers do?", a: "MistHustlers builds business websites, MVPs, AI automation systems and related digital solutions for startups, founders and growing businesses." },
      { q: "Where is MistHustlers based?", a: "MistHustlers is based in Indore, Madhya Pradesh, and provides digital execution services to businesses across India through remote collaboration." },
      { q: "What types of websites does MistHustlers build?", a: "MistHustlers builds landing pages, business websites, service websites, portfolios, custom web applications and industry-focused website solutions." },
      { q: "Does MistHustlers build MVPs?", a: "Yes. MistHustlers develops functional MVPs that help founders demonstrate, validate and launch early-stage digital product ideas." },
      { q: "Does MistHustlers provide AI automation?", a: "Yes. MistHustlers builds workflow and AI automation solutions for repetitive business operations, lead handling, notifications and tool integrations." },
      { q: "How can a business start a project?", a: "A business can submit the project inquiry form or contact MistHustlers through WhatsApp. Requirements are reviewed before scope, timeline and pricing are finalized." },
    ],
  },
  finalCta: {
    title: ["HAVE AN IDEA OR", "BUSINESS REQUIREMENT?"],
    highlightWord: "BUSINESS REQUIREMENT?",
    description: "Tell us what you are building. We will help you define the right scope, execution plan and next step.",
    cta: "START YOUR PROJECT",
  },
  faqData: [],
  projects: [],
};

const SERVICE_CARD_DEFAULTS: ServiceCard[] = [
  {
    title: "Business Websites",
    category: "Website",
    description: "Conversion-focused, responsive websites designed to explain services and generate enquiries.",
    price: "From ₹4,999",
    link: "/services/web-development",
  },
  {
    title: "MVP Development",
    category: "Product",
    description: "Functional first versions for founders who need to validate, demonstrate and launch a product idea.",
    price: "From ₹15,000",
    link: "/services/mvp-development",
  },
  {
    title: "AI & Workflow Automation",
    category: "Automation",
    description: "Practical automations that connect tools, reduce repetitive work and improve lead or operations workflows.",
    price: "From ₹5,000",
    link: "/services/automation",
  },
  {
    title: "Website Maintenance & Support",
    category: "Support",
    description: "Updates, bug fixes, hosting support, domain and SSL help, backups, uptime checks and performance assistance.",
    price: "From ₹2,999/mo",
    link: "/services",
  },
];

const SERVICES_PRICING_DEFAULTS = {
  serviceCards: SERVICE_CARD_DEFAULTS,
  pricing: {
    tiers: [
      { id: "starter", name: "STARTER", price: "₹999 – ₹4,999", description: "Essential presence for new founders", features: ["Landing Page Design", "Portfolio Website", "Basic Automation Setup", "14-Day Support"], popular: false, accent: "#070607" },
      { id: "growth", name: "GROWTH", price: "₹5,000 – ₹15,000", description: "Complete digital identity for scaling", features: ["Business Website", "Web App UI", "Automation Systems", "Basic Backend", "30-Day Support"], popular: true, accent: "#fc5000" },
      { id: "premium", name: "PREMIUM", price: "₹15,000 – ₹50,000+", description: "Full product development for serious ventures", features: ["Full Stack App", "MVP Development", "AI Automation Systems", "Scalable Platforms", "90-Day Partnership"], popular: false, accent: "#524ae9" },
    ] as PricingTier[],
  },
};

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const navigate = useNavigate();
  const logoData = useContent("logo", LOGO_DEFAULTS);
  const c = useContent("home", HOME_DEFAULTS);
  const servicesContent = useContent("services", SERVICES_PRICING_DEFAULTS);
  const stats = useMemo(() => c.stats ?? [], [c.stats]);
  const pricingTiers = useMemo(() => servicesContent.pricing?.tiers?.slice(0, 3) ?? [], [servicesContent.pricing?.tiers]);
  const serviceCards = useMemo(
    () => ((servicesContent.serviceCards?.length ? servicesContent.serviceCards : SERVICE_CARD_DEFAULTS) as ServiceCard[]).filter((item) => item.enabled !== false).slice(0, 4),
    [servicesContent.serviceCards],
  );
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
                <h1 className="font-display text-[clamp(34px,7vw,64px)] leading-[0.98] sm:leading-[0.94] tracking-[0.02em] text-abyssal-ink">
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
                  onClick={() => navigate("/contact")}
                  className="magnetic-btn bg-digital-orange text-white px-6 sm:px-8 py-4 rounded-[800px] text-base font-semibold cursor-pointer font-body text-center"
                >
                  {c.hero?.ctaPrimary || "Get a Quote"}
                </button>
                <button
                  onClick={() => navigate("/projects")}
                  className="magnetic-btn bg-transparent border-2 border-abyssal-ink text-abyssal-ink px-6 sm:px-8 py-4 rounded-[800px] text-base font-semibold cursor-pointer hover:bg-abyssal-ink hover:text-white transition-colors duration-300 font-body text-center"
                >
                  {c.hero?.ctaSecondary || "Explore Our Work"}
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
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-60">
              {(c.brands || []).map((p) => (
                <span key={p} className="font-display text-xl tracking-[0.1em] text-abyssal-ink/55">{p}</span>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.35}>
            <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Fixed scope clarity", desc: "Deliverables and timeline are discussed before execution starts." },
                { title: "Direct communication", desc: "You speak close to the people planning and building the work." },
                { title: "Source-code handover", desc: "Ownership and handover follow the agreed project scope." },
                { title: "Support after launch", desc: "Post-launch fixes and maintenance can be planned with the project." },
              ].map((item) => (
                <div key={item.title} className="rounded-[22px] border border-abyssal-ink/5 bg-ash-white p-5 text-left">
                  <div className="mb-3 h-2 w-2 rounded-full bg-digital-orange" />
                  <h3 className="font-body text-sm font-bold text-abyssal-ink">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-abyssal-ink/55 font-body">{item.desc}</p>
                </div>
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
            <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {serviceCards.map((svc, index) => (
                <button
                  key={`${svc.title}-${index}`}
                  onClick={() => navigate(svc.link || "/services")}
                  className="card-lift h-full rounded-[24px] border border-abyssal-ink/5 bg-basalt-canvas p-5 text-left transition-colors hover:border-digital-orange/25"
                >
                  <span className={`mb-5 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold font-body ${index === 1 ? "bg-cyber-violet/10 text-cyber-violet" : index === 2 ? "bg-digital-orange/10 text-digital-orange" : "bg-abyssal-ink/5 text-abyssal-ink/55"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-abyssal-ink/40 font-body">{svc.category}</span>
                  <h3 className="mt-2 font-body text-lg font-bold leading-tight text-abyssal-ink">{svc.title}</h3>
                  <p className="mt-3 min-h-20 text-sm leading-relaxed text-abyssal-ink/58 font-body">{svc.description}</p>
                  {svc.price && <p className="mt-5 text-xs font-bold text-abyssal-ink font-body">{svc.price}</p>}
                </button>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
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

      {/* PRICING PLANS */}
      {pricingTiers.length > 0 && (
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <span className="text-sm font-semibold tracking-wider uppercase text-digital-orange font-body">Execution Plans</span>
              <h2 className="font-body font-bold text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
                Choose a plan that matches the work
              </h2>
              <p className="text-abyssal-ink/50 mt-4 max-w-xl mx-auto font-body">
                These plans help clients understand budget range before discussion. Final pricing is confirmed after requirement review.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-5 md:grid-cols-3">
            {pricingTiers.map((tier, i) => (
              <ScrollReveal key={tier.id || tier.name} delay={i * 0.08}>
                <div className={`h-full rounded-[28px] border p-6 ${tier.popular ? "border-digital-orange bg-ash-white shadow-xl shadow-digital-orange/10" : "border-abyssal-ink/5 bg-ash-white"}`}>
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-abyssal-ink/45 font-body">{tier.name}</span>
                      <div className="mt-2 font-display text-3xl tracking-[0.02em] text-abyssal-ink">{tier.price}</div>
                    </div>
                    {tier.popular && <span className="rounded-full bg-digital-orange px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white font-body">Most Chosen</span>}
                  </div>
                  <p className="min-h-12 text-sm leading-relaxed text-abyssal-ink/60 font-body">{tier.description}</p>
                  <div className="mt-6 space-y-3">
                    {(tier.features || []).slice(0, 5).map((feature) => (
                      <div key={feature} className="flex items-center gap-3 text-sm text-abyssal-ink font-body">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-digital-orange/10 text-digital-orange">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <path d="M3 6.1L5 8L9 3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate("/contact")}
                    className={`mt-7 w-full rounded-[800px] px-5 py-3 text-sm font-semibold transition-colors font-body ${tier.popular ? "bg-digital-orange text-white hover:bg-digital-orange/90" : "bg-abyssal-ink text-white hover:bg-digital-orange"}`}
                  >
                    Start with {tier.name}
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      )}

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
                onClick={() => navigate("/contact")}
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

      {/* FOUNDER TRUST */}
      <section className="py-16 md:py-20 bg-ash-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <ScrollReveal>
              <div className="rounded-[28px] border border-abyssal-ink/5 bg-basalt-canvas p-6 md:p-8">
                <div className="flex items-center gap-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[28px] bg-abyssal-ink text-white">
                    <span className="font-display text-3xl tracking-[0.02em]">NS</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-digital-orange font-body">Founder-led execution</span>
                    <h2 className="mt-2 font-body text-2xl font-bold text-abyssal-ink">Naveen Salve</h2>
                    <p className="mt-1 text-sm text-abyssal-ink/55 font-body">Developer, AI generalist and automation builder based in Indore.</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {["Web Development", "AI Automation", "MVP Planning"].map((skill) => (
                    <span key={skill} className="rounded-full bg-abyssal-ink/5 px-4 py-2 text-center text-xs font-semibold text-abyssal-ink/65 font-body">{skill}</span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <div>
                <span className="text-sm font-semibold tracking-wider uppercase text-cyber-violet font-body">Real person, direct accountability</span>
                <h2 className="mt-2 font-body font-bold text-[clamp(34px,5vw,52px)] tracking-[0.02em] leading-[1.05] text-abyssal-ink">
                  Clients should know who is planning the work.
                </h2>
                <p className="mt-5 text-abyssal-ink/60 leading-relaxed font-body">
                  MistHustlers is founder-led, which means project scope, execution planning and delivery decisions stay close to the person responsible for the build. This keeps communication direct and reduces confusion during execution.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => navigate("/about")} className="rounded-[800px] border border-abyssal-ink/15 px-5 py-3 text-sm font-semibold text-abyssal-ink hover:bg-abyssal-ink hover:text-white font-body">
                    Meet MistHustlers
                  </button>
                  <button onClick={() => navigate("/contact")} className="rounded-[800px] bg-digital-orange px-5 py-3 text-sm font-semibold text-white hover:bg-digital-orange/90 font-body">
                    Discuss a Project
                  </button>
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

      {/* BUILDER ECOSYSTEM */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold tracking-wider uppercase text-cyber-violet font-body">{c.careerTeaser?.badge || "Builder Ecosystem"}</span>
              <h2 className="font-body font-bold text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
                {c.careerTeaser?.title || "More than an agency - a growing builder ecosystem"}
              </h2>
              <p className="text-abyssal-ink/50 mt-4 font-body">
                {c.careerTeaser?.description || "Alongside client execution, MistHustlers creates opportunities for developers, students and emerging builders to learn through practical projects, collaborations and career opportunities."}
              </p>
              <button
                onClick={() => navigate("/career")}
                className="magnetic-btn mt-8 bg-abyssal-ink text-white px-8 py-4 rounded-[800px] text-base font-semibold cursor-pointer hover:bg-digital-orange transition-colors duration-300 font-body"
              >
                {c.careerTeaser?.cta || "Explore Careers"} &rarr;
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

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
    </div>
  );
}
