import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import FAQItem from "@/components/FAQItem";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import { useContent } from "@/utils/useContent";

function HeroBrowserVisual() {
  return (
    <div className="hero-product-visual relative mx-auto w-full max-w-[560px]" aria-hidden="true">
      <div className="hero-product-glow" />
      <div className="hero-preview-window relative overflow-hidden rounded-[28px] border border-abyssal-ink/10 bg-ash-white shadow-2xl shadow-abyssal-ink/10">
        <div className="home-orbit-stage absolute inset-0">
          <div className="home-orbit-ring home-orbit-ring-a" />
          <div className="home-orbit-ring home-orbit-ring-b" />
          <div className="home-orbit-nodes">
            <span />
            <span />
            <span />
          </div>
          <div className="home-orbit-chip home-orbit-chip-web">WEB</div>
          <div className="home-orbit-chip home-orbit-chip-mvp">MVP</div>
          <div className="home-orbit-chip home-orbit-chip-ai">AI</div>
        </div>
        <div className="hero-preview-topbar relative z-10 flex h-10 items-center justify-between border-b border-abyssal-ink/10 bg-white/70 px-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-digital-orange" />
            <span className="h-2.5 w-2.5 rounded-full bg-abyssal-ink/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-cyber-violet/70" />
          </div>
          <span className="rounded-full bg-abyssal-ink/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-abyssal-ink/45 font-body">
            Live Preview
          </span>
        </div>
        <div className="relative z-10 grid gap-5 p-5 sm:grid-cols-[1.1fr_0.9fr] sm:p-7">
          <div className="space-y-4">
            <div className="hero-preview-badge inline-flex h-7 items-center rounded-full bg-digital-orange/12 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-digital-orange font-body">
              Project Command
            </div>
            <div className="hero-preview-headline rounded-[22px] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-abyssal-ink/45 font-body">Live Build</span>
                  <div className="mt-2 font-display text-3xl leading-none tracking-[0.03em] text-abyssal-ink">Launch Ready</div>
                </div>
                <span className="rounded-full bg-digital-orange px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white font-body">92%</span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-abyssal-ink/8">
                <div className="hero-preview-progress h-full rounded-full bg-digital-orange" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Website", "5 pages"],
                ["MVP", "Core flow"],
                ["Automation", "Leads sync"],
                ["Support", "Handover"],
              ].map(([item, meta], index) => (
                <div key={item} className="hero-preview-tile rounded-2xl border border-abyssal-ink/10 bg-basalt-canvas p-3" style={{ animationDelay: `${0.55 + index * 0.08}s` }}>
                  <div className={`mb-3 h-7 w-7 rounded-full ${index === 1 ? "bg-cyber-violet/20" : index === 2 ? "bg-digital-orange/20" : "bg-abyssal-ink/10"}`} />
                  <div className="text-xs font-bold text-abyssal-ink font-body">{item}</div>
                  <div className="mt-1 text-[10px] font-semibold text-abyssal-ink/42 font-body">{meta}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-preview-panel rounded-[24px] p-4">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-display text-3xl tracking-[0.02em] text-abyssal-ink">MH</span>
              <span className="hero-preview-pulse h-9 w-9 rounded-full bg-digital-orange" />
            </div>
            <div className="mb-4 rounded-2xl bg-ash-white/75 p-3">
              <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-abyssal-ink/45 font-body">
                <span>Today</span>
                <span>+14 leads</span>
              </div>
              <div className="hero-preview-chart flex h-16 items-end gap-2">
                {[42, 64, 48, 78, 58, 88].map((height, index) => (
                  <span key={index} style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {["Scope locked", "Build sprint", "Launch ready"].map((item, index) => (
                <div key={item} className="hero-preview-step flex items-center gap-3 rounded-2xl bg-ash-white/75 p-3" style={{ animationDelay: `${0.72 + index * 0.1}s` }}>
                  <span className={`h-2.5 w-2.5 rounded-full ${index === 1 ? "bg-cyber-violet" : "bg-digital-orange"}`} />
                  <span className="text-xs font-semibold text-abyssal-ink/72 font-body">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="hero-product-chip hero-product-chip-a">Source-code handover</div>
      <div className="hero-product-chip hero-product-chip-b">From Rs. 3,999</div>
    </div>
  );
}

function ProjectMockup({ visual, title, category }: { visual?: string; title: string; category: string }) {
  return (
    <div className="project-showcase-visual relative flex h-full w-full items-center justify-center overflow-hidden">
      <span className="project-showcase-grid absolute inset-0" />
      <span className="project-showcase-orb project-showcase-orb-a" />
      <span className="project-showcase-orb project-showcase-orb-b" />
      <span className="project-showcase-mark relative font-display text-5xl tracking-[0.08em] text-abyssal-ink/18">
        {visual || "MH"}
      </span>
      <span className="project-showcase-chip absolute bottom-4 left-4 rounded-full bg-ash-white/88 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-abyssal-ink/55 font-body">
        {category}
      </span>
      <span className="sr-only">{title}</span>
    </div>
  );
}

type HomeStat = { value: number; suffix?: string; label: string };
type HomeJourneyStep = { step: string; title: string; desc: string };
type HomeFeature = { title: string; desc: string };
type HomeFaqItem = { q: string; a: string };
type HomeProject = { title: string; category: string; visual?: string; imageUrl?: string; link?: string };
type PricingTier = { id: string; name: string; price: string; description: string; features: string[]; popular?: boolean; accent?: string; delivery?: string; bestFor?: string };
type ServiceCard = { title: string; category: string; description: string; price?: string; link?: string; features?: string[]; imageUrl?: string; accent?: string; sortOrder?: number; enabled?: boolean };

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
    badge: "WEB DEVELOPMENT · MVP · AI AUTOMATION",
    title: ["Web Development, MVP", "& AI Automation Agency in Indore"],
    highlightWord: "& AI Automation Agency in Indore",
    description: "Founder-led websites, MVPs and automation systems for businesses that need clear scope, fast execution and source-code handover.",
    tagline: "BASED IN INDORE · REMOTE PROJECTS ACROSS INDIA",
    ctaPrimary: "Start Your Project ->",
    ctaSecondary: "Explore Our Work",
  },
  stats: [
    { value: 10, suffix: "+", label: "Business Website Previews" },
    { value: 4, suffix: "", label: "Core Service Categories" },
    { value: 6, suffix: "", label: "Execution Stages Covered" },
    { value: 1, suffix: "", label: "Direct Founder Communication" },
  ],
  brands: ["STRIPE", "LINEAR", "VERCEL", "GITHUB", "NOTION"],
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
    title: "Website Development",
    category: "Website",
    description: "Landing pages and business websites with responsive layouts, lead forms, WhatsApp, Maps, SEO basics and deployment support.",
    price: "From ₹3,999",
    link: "/services/web-development",
  },
  {
    title: "MVP Development",
    category: "Product",
    description: "Clickable prototypes and launch-ready web MVPs for founders who need to validate, demonstrate and ship one core workflow.",
    price: "From ₹7,999",
    link: "/services/mvp-development",
  },
  {
    title: "AI & Workflow Automation",
    category: "Automation",
    description: "Lead capture, Google Sheets, Gmail alerts, CRM sync, follow-up automation and AI-assisted workflow processing.",
    price: "From ₹3,999",
    link: "/services/automation",
  },
  {
    title: "Website Maintenance & Support",
    category: "Support",
    description: "Monthly backup, uptime checks, SSL/domain monitoring, integration checks, content updates and performance support.",
    price: "From ₹999/mo",
    link: "/services",
  },
];

const SERVICES_PRICING_DEFAULTS = {
  serviceCards: SERVICE_CARD_DEFAULTS,
  pricing: {
    homepageFeaturedIds: ["launch-landing-page", "quick-workflow-automation", "business-starter-website"],
    tiers: [
      { id: "launch-landing-page", name: "Launch Landing Page", price: "₹3,999", description: "One-page website for freelancers, personal brands, events and single-service businesses.", features: ["One-page website with up to 5 sections", "Mobile-responsive layout", "Contact or lead form plus WhatsApp", "Basic on-page SEO", "7 days of bug support"], popular: false, accent: "#070607", delivery: "4-6 working days", bestFor: "Freelancers, events and single-service businesses" },
      { id: "quick-workflow-automation", name: "Quick Workflow Automation", price: "₹3,999", description: "One simple repetitive task automated with testing and short documentation.", features: ["One automation workflow", "Up to 2 connected tools", "Trigger and action setup", "Basic error notification", "7 days of technical support"], popular: false, accent: "#524ae9", delivery: "3-5 working days", bestFor: "One simple repetitive task" },
      { id: "business-starter-website", name: "Business Starter Website", price: "₹7,999", description: "A professional four-page website for local and growing businesses.", features: ["Home, About, Services and Contact", "Contact form, WhatsApp and Maps", "Basic SEO and Analytics setup", "15 days of bug support"], popular: true, accent: "#fc5000", delivery: "7-10 working days", bestFor: "Clinics, gyms, consultants, salons and local businesses" },
    ] as PricingTier[],
  },
};

const HOMEPAGE_PACKAGE_IDS = ["launch-landing-page", "quick-workflow-automation", "business-starter-website"];

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [marqueeVisible, setMarqueeVisible] = useState(true);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setMarqueeVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const c = useContent("home", HOME_DEFAULTS);
  const servicesContent = useContent("services", SERVICES_PRICING_DEFAULTS);
  const pricingTiers = useMemo(() => {
    const tiers = servicesContent.pricing?.tiers ?? [];
    const featuredIds = servicesContent.pricing?.homepageFeaturedIds?.length ? servicesContent.pricing.homepageFeaturedIds : HOMEPAGE_PACKAGE_IDS;
    const featured = featuredIds.map((id: string) => tiers.find((tier) => tier.id === id)).filter(Boolean) as PricingTier[];
    return (featured.length ? featured : tiers).slice(0, 3);
  }, [servicesContent.pricing?.homepageFeaturedIds, servicesContent.pricing?.tiers]);
  const serviceCards = useMemo(
    () => ((servicesContent.serviceCards?.length ? servicesContent.serviceCards : SERVICE_CARD_DEFAULTS) as ServiceCard[])
      .filter((item) => item.enabled !== false)
      .sort((a, b) => Number(a.sortOrder ?? 999) - Number(b.sortOrder ?? 999))
      .slice(0, 4),
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
      <main id="main-content">

      <section ref={heroRef} className="hero-cinematic relative overflow-hidden pb-12 pt-24 sm:pb-16 md:pt-32">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="max-w-[680px] space-y-6 sm:space-y-8 lg:max-w-none">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              >
                <span className="inline-block rounded-full bg-abyssal-ink/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-abyssal-ink/60 font-body">
                  {c.hero?.badge || HOME_DEFAULTS.hero.badge}
                </span>
                <h1 className="mt-5 max-w-[720px] font-display text-[clamp(36px,5.8vw,66px)] leading-[1.08] tracking-[0.01em] text-abyssal-ink sm:mt-6 sm:leading-[1.03]">
                  {(heroLines.length ? heroLines : HOME_DEFAULTS.hero.title).map((line, index) => (
                    <span key={`${line}-${index}`} className="hero-title-mask block">
                      <span className={`hero-title-line ${line === c.hero?.highlightWord || index === (heroLines.length ? heroLines.length : HOME_DEFAULTS.hero.title.length) - 1 ? "text-digital-orange" : ""}`}>
                        {line}
                      </span>
                      {index < (heroLines.length ? heroLines.length : HOME_DEFAULTS.hero.title.length) - 1 && <span className="sr-only"> </span>}
                    </span>
                  ))}
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.33, 1, 0.68, 1] }}
                className="max-w-xl text-base leading-relaxed text-abyssal-ink/60 md:text-lg font-body"
              >
                {c.hero?.description}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="text-xs font-bold uppercase tracking-[0.18em] text-abyssal-ink/45 font-body"
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
              className="mt-2 lg:mt-0"
            >
              <HeroBrowserVisual />
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="border-y border-abyssal-ink/5 py-8 md:py-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {(c.brands?.length ? c.brands : HOME_DEFAULTS.brands).map((item, index) => (
                <div key={item} className="card-lift rounded-2xl border border-abyssal-ink/10 bg-ash-white px-5 py-5">
                  <div className="flex items-end justify-between gap-3">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-abyssal-ink/72 font-body">{item}</p>
                    <span className="font-display text-2xl leading-none text-digital-orange/80">0{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SERVICES TEASER */}
      <section className="content-visibility-auto py-16 md:py-20 bg-ash-white">
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
                    {svc.imageUrl ? <img src={svc.imageUrl} alt="" loading="lazy" className="h-full w-full rounded-full object-cover" /> : String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-abyssal-ink/40 font-body">{svc.category}</span>
                  <h3 className="mt-2 font-body text-lg font-bold leading-tight text-abyssal-ink">{svc.title}</h3>
                  <p className="mt-3 min-h-20 text-sm leading-relaxed text-abyssal-ink/60 font-body">{svc.description}</p>
                  {!!svc.features?.length && (
                    <div className="mt-4 space-y-2">
                      {svc.features.slice(0, 2).map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-xs font-semibold text-abyssal-ink/55 font-body">
                          <span className="h-1.5 w-1.5 rounded-full bg-digital-orange" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {svc.features.length > 2 && (
                        <details className="group md:hidden">
                          <summary className="list-none text-xs font-semibold text-digital-orange cursor-pointer py-1">
                            <span className="group-open:hidden">+{svc.features.length - 2} more</span>
                            <span className="hidden group-open:inline">Show less</span>
                          </summary>
                          <div className="mt-2 space-y-2">
                            {svc.features.slice(2).map((feature) => (
                              <div key={feature} className="flex items-center gap-2 text-xs font-semibold text-abyssal-ink/55 font-body">
                                <span className="h-1.5 w-1.5 rounded-full bg-digital-orange" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  )}
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
      <section className="content-visibility-auto py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <span className="text-sm font-semibold tracking-wider uppercase text-digital-orange font-body">Execution Plans</span>
              <h2 className="font-body font-bold text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
                Start with a budget-friendly plan
              </h2>
              <p className="text-abyssal-ink/50 mt-4 max-w-xl mx-auto font-body">
                Low-entry execution plans help clients start without pressure. Larger packages are available on the full Services page.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-5 md:grid-cols-3">
            {pricingTiers.map((tier, i) => (
              <ScrollReveal key={tier.id || tier.name} delay={i * 0.08}>
                <div className={`card-lift h-full rounded-[28px] border p-6 ${tier.popular ? "border-digital-orange bg-ash-white shadow-xl shadow-digital-orange/10" : "border-abyssal-ink/5 bg-ash-white"}`}>
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-abyssal-ink/45 font-body">{tier.name}</span>
                      <div className="mt-2 font-display text-3xl tracking-[0.02em] text-abyssal-ink">{tier.price}</div>
                    </div>
                    {tier.popular && <span className="rounded-full bg-digital-orange px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white font-body">Most Chosen</span>}
                  </div>
                  <p className="min-h-12 text-sm leading-relaxed text-abyssal-ink/60 font-body">{tier.description}</p>
                  {(tier.bestFor || tier.delivery) && (
                    <div className="mt-4 space-y-1 rounded-2xl bg-abyssal-ink/[0.03] p-3 text-xs leading-relaxed text-abyssal-ink/55 font-body">
                      {tier.bestFor && <p><span className="font-bold text-abyssal-ink/70">Best for:</span> {tier.bestFor}</p>}
                      {tier.delivery && <p><span className="font-bold text-abyssal-ink/70">Delivery:</span> {tier.delivery}</p>}
                    </div>
                  )}
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
      <section className="content-visibility-auto py-16 md:py-24">
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
      <section className="content-visibility-auto py-16 md:py-24">
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
              <div className="card-lift bg-ash-white rounded-[28px] md:rounded-[40px] p-6 md:p-10 border border-abyssal-ink/5 relative overflow-hidden">
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
      <section className="content-visibility-auto py-16 md:py-20 bg-ash-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <ScrollReveal>
              <div className="founder-card card-lift relative overflow-hidden rounded-[28px] border border-abyssal-ink/5 bg-basalt-canvas p-6 md:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="founder-avatar flex h-32 w-32 shrink-0 items-center justify-center rounded-[32px] bg-abyssal-ink text-white shadow-2xl shadow-abyssal-ink/10">
                    <span className="font-display text-5xl tracking-[0.02em]">NS</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-digital-orange font-body">Founder-led execution</span>
                    <h2 className="mt-2 font-body text-2xl font-bold text-abyssal-ink">Naveen Salve</h2>
                    <p className="mt-1 text-sm leading-relaxed text-abyssal-ink/55 font-body">Developer, AI generalist and automation builder based in Indore.</p>
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
      <section className="content-visibility-auto py-16 md:py-24 bg-ash-white">
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
            <div ref={marqueeRef} className="project-marquee relative -mx-4 overflow-hidden px-4 sm:-mx-6 sm:px-6" data-visible={marqueeVisible}>
              <div className="project-marquee__track flex w-max gap-5 py-1">
                {movingProjects.map((proj, i) => (
                  <a
                    key={`${proj.title}-${i}`}
                    href={projectHref(proj.link)}
                    target={isExternalProjectLink(proj.link) ? "_blank" : undefined}
                    rel={isExternalProjectLink(proj.link) ? "noopener noreferrer" : undefined}
                    className="project-showcase-card card-lift group h-[210px] w-[min(280px,calc(100vw-48px))] flex-shrink-0 overflow-hidden rounded-[24px] border border-abyssal-ink/5 bg-basalt-canvas text-left sm:h-[220px] sm:w-[340px] sm:rounded-[28px]"
                  >
                    <div className="relative h-36 overflow-hidden bg-abyssal-ink/5">
                      {proj.imageUrl ? (
                        <img src={proj.imageUrl} alt={proj.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <ProjectMockup visual={proj.visual} title={proj.title} category={proj.category} />
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
      <section className="content-visibility-auto py-16 md:py-20">
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
      <section id="faq" className="content-visibility-auto py-16 md:py-24">
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
      <section className="content-visibility-auto py-16 md:py-20 bg-abyssal-ink text-white">
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
