import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, ClipboardList, Code2, MessageCircle, Rocket, Send, ShieldCheck, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import FAQItem from "@/components/FAQItem";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import { useContent } from "@/utils/useContent";

function HeroBrowserVisual({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [activeTile, setActiveTile] = useState(0);
  const previewOptions = [
    {
      title: "Website Development",
      desc: "Landing pages, business & growth websites, SEO, lead forms",
      price: "From ₹14,999",
      route: "/services/web-development",
    },
    {
      title: "Web MVP Starter",
      desc: "Clickable prototypes & launch-ready web MVPs for founders",
      price: "From ₹74,999",
      route: "/services/mvp-development",
    },
    {
      title: "AI Automation",
      desc: "Lead capture, CRM sync, AI agents & workflow processing",
      price: "From ₹14,999",
      route: "/services/automation",
    },
    {
      title: "Maintenance & Support",
      desc: "Backups, SSL/domain monitoring, content updates, performance",
      price: "From ₹1,499/mo",
      route: "/contact",
    },
  ];
  const activePreview = previewOptions[activeTile];
  const serviceTiles = [
    {
      icon: Rocket,
      title: "Web MVP Starter",
      desc: "Clickable prototypes & launch-ready web MVPs",
      price: "From ₹74,999",
      route: "/services/mvp-development",
      tone: "text-[#635bff] border-[#635bff]/35 bg-[#635bff]/7",
      pill: "border-[#635bff]/35 text-[#635bff] bg-[#635bff]/6",
    },
    {
      icon: Sparkles,
      title: "AI & Workflow Automation",
      desc: "Lead capture, CRM sync, AI agents & workflows",
      price: "From ₹14,999",
      route: "/services/automation",
      tone: "text-digital-orange border-digital-orange/30 bg-digital-orange/7",
      pill: "border-digital-orange/30 text-digital-orange bg-digital-orange/6",
    },
    {
      icon: ShieldCheck,
      title: "Website Maintenance & Support",
      desc: "Backups, SSL/domain monitoring, content updates",
      price: "From ₹1,499/mo",
      route: "/contact",
      tone: "text-[#168a3a] border-[#168a3a]/35 bg-[#168a3a]/7",
      pill: "border-[#168a3a]/35 text-[#168a3a] bg-[#168a3a]/6",
    },
  ];
  const processSteps = [
    { icon: MessageCircle, title: "Understand", desc: "Your goals & requirements" },
    { icon: ClipboardList, title: "Plan", desc: "Scope, timeline & roadmap" },
    { icon: Code2, title: "Build", desc: "Develop, test & refine" },
    { icon: Send, title: "Launch & Support", desc: "Go live, monitor & support" },
  ];
  const applyPlan = (event: React.MouseEvent, path = "/services#service-inquiry") => {
    event.stopPropagation();
    onNavigate(path);
  };

  return (
    <div
      className="hero-product-visual relative mx-auto w-full max-w-[815px] lg:-ml-1 lg:mt-0 lg:w-full"
    >
      <div className="absolute inset-8 -z-10 rounded-[32px] bg-digital-orange/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-[24px] border border-abyssal-ink/10 bg-[#fffdf8]/90 shadow-[0_38px_110px_rgba(7,6,7,0.16)] transition-transform duration-300">
        <div className="flex h-14 items-center justify-between border-b border-abyssal-ink/10 px-5">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-digital-orange" />
            <span className="h-3 w-3 rounded-full bg-[#f7b84b]" />
            <span className="h-3 w-3 rounded-full bg-[#8d85e8]" />
          </div>
          <div className="flex min-w-[190px] items-center justify-center gap-2 rounded-full border border-abyssal-ink/8 bg-abyssal-ink/4 px-4 py-2 text-sm font-bold text-abyssal-ink/80">
            <span className="text-abyssal-ink/40">●</span>
            misthustlers.in
          </div>
          <button
            type="button"
            onClick={() => onNavigate(activePreview.route)}
            className="cursor-pointer rounded-full bg-abyssal-ink/5 px-4 py-2 text-sm font-bold text-abyssal-ink/80 transition-colors hover:bg-digital-orange hover:text-white"
          >
            Live Preview
          </button>
        </div>

        <div className="p-4">
          <div
            role="button"
            tabIndex={0}
            onClick={() => onNavigate(activePreview.route)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") onNavigate(activePreview.route);
            }}
            className="group relative block min-h-[264px] w-full cursor-pointer overflow-hidden rounded-[18px] border border-abyssal-ink/8 bg-[#fffaf2]/74 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(7,6,7,0.12)]"
          >
            <img
              src="/mist-hero-full-preview.png"
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[72%_52%] transition-transform duration-700 group-hover:scale-[1.018]"
              loading="eager"
              decoding="async"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[58%] bg-gradient-to-r from-[#fffaf2] via-[#fffaf2]/96 to-transparent" />
            <div className="relative z-10 flex min-h-[264px] max-w-[43%] flex-col justify-center p-6">
              <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-[12px] border border-digital-orange/25 bg-digital-orange/8 text-digital-orange shadow-sm">
                <Code2 className="h-5 w-5" />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-digital-orange">Live Service Preview</div>
              <h3 className="mt-3 font-display text-[28px] leading-[1.04] text-abyssal-ink">{activePreview.title}</h3>
              <p className="mt-3 max-w-[300px] text-[13.5px] leading-relaxed text-abyssal-ink/66">{activePreview.desc}</p>
              <button
                type="button"
                onClick={(event) => applyPlan(event)}
                className="mt-5 w-fit cursor-pointer rounded-full border border-digital-orange/30 bg-white/84 px-5 py-2 text-sm font-bold text-digital-orange shadow-sm backdrop-blur-md transition-colors hover:border-digital-orange hover:bg-digital-orange hover:text-white"
              >
                {activePreview.price}
              </button>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/55" />
          </div>

          <div className="mt-3 grid grid-cols-[repeat(3,1fr)_0.82fr] gap-3">
            {serviceTiles.map((tile, index) => {
              const Icon = tile.icon;
              const isActive = activeTile === index + 1;
              return (
                <div
                  key={tile.title}
                  onClick={() => setActiveTile(index + 1)}
                  onDoubleClick={() => onNavigate(tile.route)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") setActiveTile(index + 1);
                  }}
                  className={`min-h-[152px] cursor-pointer rounded-[16px] border bg-white/72 p-4 text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(7,6,7,0.10)] ${isActive ? "border-digital-orange/35 shadow-[0_18px_36px_rgba(252,80,0,0.12)]" : "border-abyssal-ink/10"}`}
                >
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-[11px] border ${tile.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-display text-[17px] leading-[1.08] text-abyssal-ink">{tile.title}</h4>
                  <p className="mt-2 min-h-[40px] text-[11px] leading-relaxed text-abyssal-ink/62">{tile.desc}</p>
                  <button
                    type="button"
                    onClick={(event) => applyPlan(event)}
                    className={`mt-3 w-fit cursor-pointer rounded-full border px-4 py-1.5 text-xs font-bold transition-colors hover:border-digital-orange hover:bg-digital-orange hover:text-white ${tile.pill}`}
                  >
                    {tile.price}
                  </button>
                </div>
              );
            })}
            <div className="min-h-[152px] rounded-[16px] border border-abyssal-ink/10 bg-white/72 p-4">
              <h4 className="font-display text-[17px] leading-tight text-abyssal-ink">Why clients choose us</h4>
              {["Founder-led", "Clear scope", "Code handover", "Fast execution", "Remote India"].map((item) => (
                <div key={item} className="mt-2.5 flex items-center gap-2 text-[11px] font-medium text-abyssal-ink/72">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 fill-digital-orange text-white" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3 rounded-[15px] border border-abyssal-ink/10 bg-white/72 px-4 py-2.5">
            <div className="font-display text-sm leading-tight text-abyssal-ink">Our Proven<br />Process</div>
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-digital-orange/10 text-digital-orange">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-abyssal-ink">{step.title}</div>
                    <div className="text-[10px] leading-tight text-abyssal-ink/58">{step.desc}</div>
                  </div>
                  {index < processSteps.length - 1 && <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-abyssal-ink/35" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
type HomeStat = { value: number; suffix?: string; label: string };
type HomeJourneyStep = { step: string; title: string; desc: string };
type HomeFeature = { title: string; desc: string };
type HomeFaqItem = { q: string; a: string };
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
};

const HOME_DEFAULTS: HomeContent = {
  hero: {
    badge: "WEB DEVELOPMENT · MVP · AI AUTOMATION",
    title: ["Web Development, MVP", "& AI Automation Agency"],
    highlightWord: "& AI Automation Agency",
    description: "Founder-led websites, MVPs and automation systems for businesses that need clear scope, fast execution and source-code handover.",
    tagline: "BASED IN INDORE · REMOTE PROJECTS WORLDWIDE",
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
    badge: "Free SEO Audit",
    title: "Check what is blocking your website before spending on marketing",
    description: "Run a practical SEO audit for title, meta, headings, schema, Open Graph, mobile viewport and basic content signals. Use it before a redesign or growth campaign.",
    cta: "Run SEO Audit",
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
};

const SERVICE_CARD_DEFAULTS: ServiceCard[] = [
  {
    title: "Website Development",
    category: "Website",
    description: "Landing pages, business & growth websites with responsive layouts, lead forms, WhatsApp, Maps, SEO foundations and deployment support.",
    price: "From ₹14,999",
    link: "/services/web-development",
  },
  {
    title: "Web MVP Starter",
    category: "Product",
    description: "Clickable prototypes and launch-ready web MVPs for founders who need to validate, demonstrate and ship one core workflow.",
    price: "From ₹74,999",
    link: "/services/mvp-development",
  },
  {
    title: "AI Automation",
    category: "Automation",
    description: "Lead capture, Google Sheets, Gmail alerts, CRM sync, follow-up automation and AI-assisted workflow processing.",
    price: "From ₹14,999",
    link: "/services/automation",
  },
  {
    title: "CRM & Dashboard",
    category: "Operations",
    description: "Custom CRM dashboards, lead pipelines, internal portals, admin panels and reporting views for business operations.",
    price: "Custom scope",
    link: "/services/crm-development",
  },
];

const SERVICES_PRICING_DEFAULTS = {
  serviceCards: SERVICE_CARD_DEFAULTS,
  pricing: {
    homepageFeaturedIds: ["landing-page", "business-website", "business-growth-website"],
    tiers: [
      { id: "landing-page", name: "Landing Page", price: "₹14,999", description: "High-conversion landing page for campaigns & launches.", features: ["1 High-Converting Responsive Page", "Figma UI Design + Clean React Code", "Contact Form & WhatsApp Integration", "SEO Meta Tags & Speed Optimization", "Source Code Handover", "Delivery in 5–7 Days"], popular: false, accent: "#070607", delivery: "5–7 Days", bestFor: "Campaigns, product launches, individuals" },
      { id: "business-website", name: "Business Website", price: "₹29,999", description: "Professional website for companies needing strong online presence.", features: ["Up to 7 Custom Pages", "SEO Titles, Descriptions & Schema", "Google Maps & Local Business NAP", "Mobile-First Responsive Layout", "CMS for Content Updates", "1 Year Technical Support", "Delivery in 10–14 Days"], popular: true, accent: "#fc5000", delivery: "10–14 Days", bestFor: "Local businesses, service providers, SMEs" },
      { id: "business-growth-website", name: "Business Growth Website", price: "₹49,999", description: "Advanced website with richer pages, conversion architecture & integrations.", features: ["Up to 15 Custom Pages + CMS Blog", "Interactive UI Micro-Animations", "Lead Capture & CRM Sync", "Core Web Vitals Guarantee (LCP < 2s)", "AEO & AI Search Readiness", "Custom API Integrations (up to 3)", "Delivery in 3–4 Weeks"], popular: false, accent: "#524ae9", delivery: "3–4 Weeks", bestFor: "Growing companies, marketing teams" },
    ] as PricingTier[],
  },
};

const HOMEPAGE_PACKAGE_IDS = ["landing-page", "business-website", "business-growth-website"];

export default function Home() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const navigate = useNavigate();

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
  const heroLines = Array.isArray(c.hero?.title) ? c.hero.title : String(c.hero?.title || "").split("\n").filter(Boolean);
  const faqTitleLines = Array.isArray(c.faq?.title) ? c.faq.title : String(c.faq?.title || "").split("\n").filter(Boolean);
  const finalCtaLines = Array.isArray(c.finalCta?.title) ? c.finalCta.title : String(c.finalCta?.title || "").split("\n").filter(Boolean);
  const brandItems = c.brands?.length ? c.brands : HOME_DEFAULTS.brands;
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="home" />
      <SchemaMarkup page="home" faq={faqData} />
      <main id="main-content">

      <section ref={heroRef} className="hero-cinematic relative overflow-hidden pb-8 pt-24 sm:pb-10 sm:pt-20 md:pt-28 lg:pt-28 [@media(max-height:900px)]:min-h-screen [@media(max-height:900px)]:pb-0 [@media(max-height:900px)]:pt-24">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-[1480px] mx-auto px-4 sm:px-6 [@media(max-height:900px)]:origin-top [@media(max-height:900px)]:scale-[0.79]">
          <div className="grid gap-6 sm:gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:items-start xl:gap-12 [@media(max-height:900px)]:grid-cols-[0.98fr_1.02fr] [@media(max-height:900px)]:gap-10">
            <div className="hero-content-col max-w-[660px] space-y-4 sm:space-y-8 lg:max-w-none [@media(max-height:900px)]:origin-top-left [@media(max-height:900px)]:scale-[1.04] [@media(max-height:900px)]:space-y-7">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              >
                <span className="inline-block rounded-full bg-abyssal-ink/5 px-3 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] sm:tracking-[0.18em] text-abyssal-ink/60 font-body max-w-full">
                  {c.hero?.badge || HOME_DEFAULTS.hero.badge}
                </span>
                <h1 className="hero-h1-mobile mt-5 sm:mt-7 max-w-[720px] font-display text-[clamp(26px,7.5vw,74px)] sm:text-[clamp(36px,6.1vw,74px)] leading-[1.12] sm:leading-[1.08] tracking-[0.01em] text-abyssal-ink sm:mt-8 sm:leading-[1.03]">
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
                className="max-w-xl text-base sm:text-lg leading-relaxed text-abyssal-ink/60 md:text-xl font-body"
              >
                {c.hero?.description}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="text-xs sm:text-sm font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-abyssal-ink/45 font-body"
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
                  className="magnetic-btn bg-digital-orange text-white px-6 sm:px-9 py-3 sm:py-4 rounded-[800px] text-[15px] sm:text-lg font-semibold cursor-pointer font-body text-center whitespace-nowrap"
                >
                  {c.hero?.ctaPrimary || "Get a Quote"}
                </button>
                <button
                  onClick={() => navigate("/projects")}
                  className="magnetic-btn bg-transparent border-2 border-abyssal-ink text-abyssal-ink px-6 sm:px-9 py-3 sm:py-4 rounded-[800px] text-[15px] sm:text-lg font-semibold cursor-pointer hover:bg-abyssal-ink hover:text-white transition-colors duration-300 font-body text-center whitespace-nowrap"
                >
                  {c.hero?.ctaSecondary || "Explore Our Work"}
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
              className="mt-2 hidden sm:block lg:mt-0"
            >
              <HeroBrowserVisual onNavigate={navigate} />
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="border-y border-abyssal-ink/5 py-5 sm:py-8 md:py-10">
        <div className="mobile-brand-marquee overflow-hidden sm:hidden" aria-label="Technology brands">
          <div className="mobile-brand-marquee__track">
            {[false, true].map((duplicate) => (
              <div key={duplicate ? "brands-copy" : "brands-primary"} className="mobile-brand-marquee__group" aria-hidden={duplicate || undefined}>
                {brandItems.map((item, index) => (
                  <div key={`${item}-${index}`} className="mobile-brand-marquee__item">
                    <span>{item}</span>
                    <strong>0{index + 1}</strong>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <ScrollReveal className="hidden sm:block">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {brandItems.map((item, index) => (
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

      {/* SEO AUDIT FEATURE */}
      <section className="content-visibility-auto py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold tracking-wider uppercase text-cyber-violet font-body">{c.careerTeaser?.badge || "Free SEO Audit"}</span>
              <h2 className="font-body font-bold text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mt-2 leading-[1.05]">
                {c.careerTeaser?.title || "Check what is blocking your website before spending on marketing"}
              </h2>
              <p className="text-abyssal-ink/50 mt-4 font-body">
                {c.careerTeaser?.description || "Run a practical SEO audit for title, meta, headings, schema, Open Graph, mobile viewport and basic content signals."}
              </p>
              <button
                onClick={() => navigate("/seo-audit")}
                className="magnetic-btn mt-8 bg-abyssal-ink text-white px-8 py-4 rounded-[800px] text-base font-semibold cursor-pointer hover:bg-digital-orange transition-colors duration-300 font-body"
              >
                {c.careerTeaser?.cta || "Run SEO Audit"} &rarr;
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
