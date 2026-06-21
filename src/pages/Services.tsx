import { useRef } from "react";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import ScrollReveal from "@/components/ScrollReveal";
import { useContent } from "@/utils/useContent";

type ServiceStat = { value: string; label: string; desc?: string };
type PricingTier = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
  accent: string;
  imageUrl?: string;
};
type ProcessStep = { step: string; title: string; desc: string; active?: boolean };
type ServiceCard = {
  title: string;
  category: string;
  description: string;
  price?: string;
  link?: string;
  enabled?: boolean;
};
type ServicesContent = {
  hero: {
    badge: string;
    title: string[];
    subtitle: string;
    description?: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: ServiceStat[];
  };
  pricing: { tiers: PricingTier[] };
  serviceCards?: ServiceCard[];
  process: { steps: ProcessStep[] };
  trust: { stats: ServiceStat[]; brands: string[] };
};

const SERVICE_CARD_DEFAULTS: ServiceCard[] = [
  {
    title: "Business Websites",
    category: "Website",
    description: "Conversion-focused, responsive websites designed to improve credibility, explain services and generate inquiries.",
    price: "From ₹4,999",
    link: "/services/web-development",
    enabled: true,
  },
  {
    title: "MVP Development",
    category: "Product",
    description: "Functional first versions for founders who need to validate, demonstrate and launch a product idea.",
    price: "From ₹15,000",
    link: "/services/mvp-development",
    enabled: true,
  },
  {
    title: "AI & Workflow Automation",
    category: "Automation",
    description: "Practical automation systems that connect tools, reduce repetitive work and improve lead or operations workflows.",
    price: "From ₹5,000",
    link: "/services/automation",
    enabled: true,
  },
  {
    title: "Website Maintenance & Support",
    category: "Support",
    description: "Updates, bug fixes, hosting support, domain and SSL help, backups, uptime checks and performance assistance.",
    price: "From ₹2,999/mo",
    link: "/contact",
    enabled: true,
  },
];

const SERVICES_DEFAULTS: ServicesContent = {
  hero: {
    badge: "Transparent Pricing for Real Execution",
    title: ["Build with clarity.", "Ship with precision."],
    subtitle: "Premium development services for startups, founders, and businesses.",
    ctaPrimary: "Get a Quote",
    ctaSecondary: "Start a Project",
    stats: [],
  },
  pricing: { tiers: [] },
  process: { steps: [] },
  trust: { stats: [], brands: [] },
};

export default function Services() {
  const inquiryRef = useRef<HTMLDivElement>(null);
  const c = useContent("services", SERVICES_DEFAULTS);
  const pricingTiers = c.pricing?.tiers || [];
  const serviceCards = (c.serviceCards?.length ? c.serviceCards : SERVICE_CARD_DEFAULTS).filter((item) => item.enabled !== false);
  const processSteps = (c.process?.steps || []).map((s, i) => ({ ...s, active: i < 2 }));
  const trustStats = c.trust?.stats || [];
  const brands = c.trust?.brands || [];

  const scrollToInquiry = () => {
    inquiryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--mh-canvas)", color: "var(--mh-text)" }}>
      <SEO page="services" />
      <SchemaMarkup page="services" />
      <main>

      {/* HERO */}
      <section className="services-cinematic-hero relative overflow-hidden pt-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8 pt-[88px] md:pt-[128px] pb-[64px] md:pb-[104px]">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-[64px] lg:gap-[96px] items-center">
            <div className="services-cinematic-copy">
              <div className="services-cinematic-badge inline-flex max-w-full items-center gap-[10px] px-[14px] min-h-[36px] rounded-[14px] mb-[28px] border" style={{ backgroundColor: "var(--mh-surface)", borderColor: "rgba(var(--mh-text-rgb), 0.06)" }}>
                <div className="h-[7px] w-[7px] rounded-full animate-pulse" style={{ backgroundColor: "var(--mh-cta)" }}></div>
                <span className="text-[12.5px] font-[600] tracking-[-0.01em] uppercase" style={{ color: "var(--mh-text)", letterSpacing: "0.04em" }}>
                  {c.hero?.badge || "Services"}
                </span>
              </div>

              <h1 className="font-display text-[42px] sm:text-[52px] md:text-[68px] leading-[0.94] md:leading-[0.92] tracking-[-0.035em] md:tracking-[-0.04em] mb-[24px]" style={{ color: "var(--mh-text)" }}>
                {(Array.isArray(c.hero?.title) ? c.hero.title : [c.hero?.title || "Services"]).map((line: string, index: number) => (
                  <span key={`${line}-${index}`} className={`services-title-mask ${index === 1 ? "services-title-mask-delay" : ""}`}>
                    <span className="services-title-line" style={index > 0 ? { color: "rgba(var(--mh-text-rgb), 0.35)" } : undefined}>
                      {line}
                    </span>
                    {index < (Array.isArray(c.hero?.title) ? c.hero.title.length : 1) - 1 && <br />}
                  </span>
                ))}
              </h1>

              <p className="services-cinematic-subcopy text-[18px] leading-[1.65] max-w-[540px] mb-[40px] font-[450]" style={{ color: "rgba(var(--mh-text-rgb), 0.72)" }}>
                {c.hero?.subtitle || c.hero?.description}
              </p>

              <div className="services-cinematic-actions relative flex flex-col sm:flex-row gap-[14px]">
                <button
                  onClick={scrollToInquiry}
                  className="services-primary-cta h-[52px] px-[28px] rounded-[16px] text-[15.5px] font-[650] flex items-center justify-center gap-[10px] transition-all hover:translate-y-[-1px] active:translate-y-[0px] cursor-pointer"
                  style={{ backgroundColor: "var(--mh-cta)", color: "white", boxShadow: "0 12px 28px -8px rgba(var(--mh-cta-rgb), 0.35)" }}
                >
                  {c.hero?.ctaPrimary || "Get a Quote"}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                  </svg>
                </button>
                <button
                  onClick={scrollToInquiry}
                  className="services-secondary-cta h-[52px] px-[28px] rounded-[16px] text-[15.5px] font-[600] border transition-all hover:translate-y-[-1px] active:translate-y-[0px] flex items-center justify-center gap-[10px] cursor-pointer"
                  style={{ backgroundColor: "var(--mh-surface)", borderColor: "rgba(var(--mh-text-rgb), 0.12)", color: "var(--mh-text)" }}
                >
                  {c.hero?.ctaSecondary || "Start a Project"}
                  <span style={{ color: "rgba(var(--mh-text-rgb), 0.35)" }}>&rarr;</span>
                </button>
                <span className="services-simulated-cursor" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M4 3L17 12.2L11.1 13.3L8.3 19L4 3Z" fill="white" stroke="rgba(7,6,7,0.75)" strokeWidth="1.25" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-[28px] mt-[34px] sm:mt-[44px] text-[13px] font-[500]" style={{ color: "rgba(var(--mh-text-rgb), 0.55)" }}>
                <div className="flex items-center gap-[8px]">
                  <div className="flex -space-x-[8px]">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-[26px] w-[26px] rounded-full border-[2.5px] flex items-center justify-center text-[10px] font-[700]" style={{ backgroundColor: "var(--mh-surface)", borderColor: "var(--mh-canvas)", color: "var(--mh-text)" }}>
                        {['A', 'S', 'K'][i]}
                      </div>
                    ))}
                  </div>
                  <span>{c.hero?.stats?.[0]?.value || "0"} {c.hero?.stats?.[0]?.label || "projects shipped"}</span>
                </div>
                <div className="hidden sm:block h-[16px] w-[1px]" style={{ backgroundColor: "rgba(var(--mh-text-rgb), 0.12)" }}></div>
                <div className="flex items-center gap-[6px]">
                  <div className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: "var(--mh-secondary)" }}></div>
                  <span>{c.hero?.stats?.[1]?.value || "48h"} {c.hero?.stats?.[1]?.label || "avg response"}</span>
                </div>
              </div>
            </div>

            {/* Abstract 3D Visual */}
            <div className="services-cinematic-visual relative hidden lg:block">
              <div className="relative aspect-[4/3.5] w-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="service-orbit-core h-[320px] w-[320px] rounded-full relative" style={{
                      background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(247,246,242,0.6) 40%, rgba(226,226,223,0.3))",
                      border: "1px solid rgba(var(--mh-text-rgb), 0.06)",
                      boxShadow: "inset 0 0 80px rgba(255,255,255,0.8), 0 32px 64px -16px rgba(var(--mh-text-rgb), 0.15)"
                    }}>
                      <div className="service-orbit-sheen absolute inset-0 rounded-full"></div>
                      <div className="absolute inset-0 rounded-full overflow-hidden">
                        <div className="service-orbit-ring absolute inset-[28%] rounded-full border" style={{ borderColor: "rgba(var(--mh-text-rgb), 0.08)", borderStyle: "dashed" }}></div>
                        <div className="service-orbit-ring service-orbit-ring-reverse absolute inset-[18%] rounded-full border" style={{ borderColor: "rgba(var(--mh-text-rgb), 0.05)" }}></div>
                        <div className="service-connector-line service-connector-horizontal absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2" style={{ background: "linear-gradient(90deg, transparent, rgba(var(--mh-text-rgb),0.08), transparent)" }}></div>
                        <div className="service-connector-line service-connector-vertical absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2" style={{ background: "linear-gradient(180deg, transparent, rgba(var(--mh-text-rgb),0.08), transparent)" }}></div>
                      </div>
                      <div className="service-orbit-label service-orbit-label-price">
                        <div className="service-orbit-label-card h-[64px] w-[84px] rounded-[16px] backdrop-blur-[12px] flex flex-col items-center justify-center" style={{ backgroundColor: "rgba(var(--mh-surface-rgb), 0.85)", border: "1px solid rgba(var(--mh-text-rgb), 0.06)", boxShadow: "0 8px 24px -4px rgba(var(--mh-text-rgb), 0.12)" }}>
                          <div className="text-[10px] font-[700] tracking-wider" style={{ color: "rgba(var(--mh-text-rgb), 0.35)" }}>PRICE</div>
                          <div className="text-[15px] font-[700]" style={{ color: "var(--mh-text)" }}>&#x20B9;5K</div>
                        </div>
                      </div>
                      <div className="service-orbit-label service-orbit-label-rate">
                        <div className="service-orbit-label-card h-[56px] w-[76px] rounded-[15px] backdrop-blur-[12px] flex flex-col items-center justify-center" style={{ backgroundColor: "rgba(var(--mh-cta-rgb), 0.92)", border: "1px solid rgba(var(--mh-cta-rgb), 0.2)", boxShadow: "0 10px 28px -6px rgba(var(--mh-cta-rgb), 0.4)" }}>
                          <div className="text-[10px] font-[700] text-white/80 tracking-wider">RATE</div>
                          <div className="text-[14px] font-[700] text-white">PRO</div>
                        </div>
                      </div>
                      <div className="service-orbit-label service-orbit-label-mvp">
                        <div className="service-orbit-label-card h-[48px] w-[68px] rounded-[14px] backdrop-blur-[12px] flex items-center justify-center" style={{ backgroundColor: "rgba(var(--mh-secondary-rgb), 0.92)", border: "1px solid rgba(var(--mh-secondary-rgb), 0.3)", boxShadow: "0 8px 20px -4px rgba(var(--mh-secondary-rgb), 0.35)" }}>
                          <span className="text-[11px] font-[700] text-white tracking-wider">MVP</span>
                        </div>
                      </div>
                    </div>
                    <div className="service-orbit-label service-orbit-label-fixed">
                      <div className="service-orbit-label-card service-orbit-pill px-[13px] h-[40px] rounded-[13px] flex items-center gap-[8px] text-[12.5px] font-[600] backdrop-blur-[16px]" style={{ backgroundColor: "rgba(var(--mh-surface-rgb), 0.9)", border: "1px solid rgba(var(--mh-text-rgb), 0.06)", color: "var(--mh-text)", boxShadow: "0 12px 28px -8px rgba(var(--mh-text-rgb), 0.1)" }}>
                        <div className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: "var(--mh-secondary)" }}></div>
                        Fixed pricing
                      </div>
                    </div>
                    <div className="service-orbit-label service-orbit-label-surprise">
                      <div className="service-orbit-label-card service-orbit-pill px-[13px] h-[40px] rounded-[13px] flex items-center gap-[8px] text-[12.5px] font-[600] backdrop-blur-[16px]" style={{ backgroundColor: "rgba(var(--mh-text-rgb), 0.92)", border: "1px solid rgba(var(--mh-text-rgb), 0.08)", color: "var(--mh-surface)", boxShadow: "0 12px 32px -8px rgba(var(--mh-text-rgb), 0.25)" }}>
                        <div className="h-[5px] w-[5px] rounded-full bg-[var(--mh-cta)]"></div>
                        No surprises
                      </div>
                    </div>
                    <div className="service-orbit-ring absolute -inset-[24px] rounded-full border" style={{ borderColor: "rgba(var(--mh-cta-rgb), 0.15)", borderWidth: "1.5px", borderStyle: "dashed" }}></div>
                    <div className="service-orbit-ring service-orbit-ring-reverse absolute -inset-[48px] rounded-full border opacity-[0.4]" style={{ borderColor: "rgba(var(--mh-secondary-rgb), 0.2)", borderWidth: "1px" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[1px] mx-auto max-w-[1200px] px-6 md:px-8" style={{ background: "linear-gradient(90deg, transparent, rgba(var(--mh-text-rgb), 0.08), transparent)" }}></div>
      </section>

      {/* SERVICE CATEGORIES */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8 py-[72px] md:py-[120px]">
        <div className="max-w-[720px] mb-[64px] md:mb-[84px]">
          <div className="inline-flex items-center gap-[8px] mb-[24px]">
            <div className="h-[4px] w-[4px] rounded-full" style={{ backgroundColor: "var(--mh-cta)" }}></div>
            <span className="text-[12px] font-[700] uppercase tracking-[0.14em]" style={{ color: "rgba(var(--mh-text-rgb), 0.55)" }}>Our Services</span>
          </div>
          <h2 className="font-body font-bold text-[40px] md:text-[52px] leading-[1.05] tracking-[-0.03em] mb-[20px]" style={{ color: "var(--mh-text)" }}>
            What we build
          </h2>
          <p className="text-[17px] leading-[1.6] font-[450]" style={{ color: "rgba(var(--mh-text-rgb), 0.68)" }}>
            Web development, AI automation, and MVP development for founders and startups.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-[20px] lg:gap-[24px]">
          {serviceCards.map((svc, index) => {
            const accent = index % 3 === 1 ? "var(--mh-secondary)" : index % 3 === 2 ? "var(--mh-cta)" : "var(--mh-text)";
            const href = svc.link?.trim() || "/contact";
            return (
            <a
              key={svc.title}
              href={href}
              className="group rounded-[28px] p-[28px] border transition-all hover:-translate-y-1"
              style={{ backgroundColor: "var(--mh-surface)", borderColor: "rgba(var(--mh-text-rgb), 0.08)" }}
            >
              <div className="h-[48px] w-[48px] rounded-[18px] flex items-center justify-center mb-[24px]" style={{ backgroundColor: `color-mix(in srgb, ${accent} 8%, transparent)` }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 3L18 8L18 14L11 19L4 14L4 8L11 3Z" stroke={accent} strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M4 8L11 13L18 8" stroke={accent} strokeWidth="1.5"/>
                  <path d="M11 13L11 19" stroke={accent} strokeWidth="1.5"/>
                </svg>
              </div>
              <span className="text-[11px] font-[700] uppercase tracking-[0.14em]" style={{ color: "rgba(var(--mh-text-rgb), 0.45)" }}>{svc.category}</span>
              <h3 className="text-[22px] font-[700] tracking-[-0.02em] mb-[12px]" style={{ color: "var(--mh-text)" }}>{svc.title}</h3>
              <p className="text-[14.5px] leading-[1.55] font-[450] mb-[20px]" style={{ color: "rgba(var(--mh-text-rgb), 0.68)" }}>{svc.description}</p>
              {svc.price && <div className="mb-[18px] text-[13px] font-[700]" style={{ color: "var(--mh-text)" }}>{svc.price}</div>}
              <span className="text-[13.5px] font-[600] inline-flex items-center gap-[6px] group-hover:gap-[10px] transition-all" style={{ color: accent }}>
                Learn more
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
            </a>
            );
          })}
        </div>
      </section>

      {/* PRICING TIERS */}
      <section id="tiers" className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8 py-[72px] md:py-[120px]">
        <div className="max-w-[720px] mb-[64px] md:mb-[84px]">
          <div className="inline-flex items-center gap-[8px] mb-[24px]">
            <div className="h-[4px] w-[4px] rounded-full" style={{ backgroundColor: "var(--mh-cta)" }}></div>
            <span className="text-[12px] font-[700] uppercase tracking-[0.14em]" style={{ color: "rgba(var(--mh-text-rgb), 0.55)" }}>Service Pricing</span>
          </div>
          <h2 className="font-body font-bold text-[40px] md:text-[52px] leading-[1.05] tracking-[-0.03em] mb-[20px]" style={{ color: "var(--mh-text)" }}>
            Pick your execution level
          </h2>
          <p className="text-[17px] leading-[1.6] font-[450]" style={{ color: "rgba(var(--mh-text-rgb), 0.68)" }}>
            Final pricing depends on project complexity. All projects include source code, documentation, and direct communication.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-[20px] lg:gap-[24px]">
          {pricingTiers.map((tier) => (
            <div key={tier.id} className="relative group">
              <div className="h-full rounded-[28px] p-[1px] transition-all duration-300"
                style={{
                  background: tier.popular
                    ? "linear-gradient(180deg, var(--mh-cta), rgba(var(--mh-cta-rgb), 0.3))"
                    : "rgba(var(--mh-text-rgb), 0.08)"
                }}
              >
                <div className="h-full rounded-[27px] p-[28px] flex flex-col" style={{ backgroundColor: "var(--mh-surface)" }}>
                  {tier.popular && (
                    <div className="absolute -top-[11px] left-1/2 -translate-x-1/2">
                      <div className="px-[14px] h-[22px] rounded-[12px] flex items-center text-[11px] font-[700] tracking-[0.02em]" style={{ backgroundColor: "var(--mh-cta)", color: "white" }}>
                        MOST CHOSEN
                      </div>
                    </div>
                  )}

                  <div className="mb-[24px]">
                    <div className="flex items-start justify-between mb-[16px]">
                      <div>
                        <h3 className="text-[11.5px] font-[700] tracking-[0.14em] mb-[10px]" style={{ color: "rgba(var(--mh-text-rgb), 0.45)" }}>{tier.name}</h3>
                        <div className="text-[28px] font-[700] tracking-[-0.02em] leading-none" style={{ color: "var(--mh-text)" }}>{tier.price}</div>
                      </div>
                      <div className="h-[36px] w-[36px] rounded-[14px] flex items-center justify-center" style={{ backgroundColor: `color-mix(in srgb, ${tier.accent} 8%, transparent)`, color: tier.accent }}>
                        {tier.imageUrl ? (
                          <img src={tier.imageUrl} alt={tier.name} onError={(event) => { event.currentTarget.style.display = "none"; }} loading="lazy" width="36" height="36" className="w-full h-full rounded-[13px] object-cover" />
                        ) : (
                          <div className="h-[8px] w-[8px] rounded-[3px]" style={{ backgroundColor: tier.accent }}></div>
                        )}
                      </div>
                    </div>
                    <p className="text-[14px] leading-[1.55] font-[450]" style={{ color: "rgba(var(--mh-text-rgb), 0.68)" }}>{tier.description}</p>
                  </div>

                  {tier.imageUrl && (
                    <div className="mb-4 rounded-[16px] overflow-hidden border" style={{ borderColor: "rgba(var(--mh-text-rgb), 0.08)" }}>
                      <img src={tier.imageUrl} alt={tier.name} onError={(event) => { event.currentTarget.parentElement?.remove(); }} loading="lazy" width="400" height="128" className="w-full h-32 object-cover" />
                    </div>
                  )}

                  <div className="space-y-[13px] mb-[32px] flex-1">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-[12px] text-[14.5px]">
                        <div className="h-[18px] w-[18px] rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `color-mix(in srgb, ${tier.accent} 8%, transparent)` }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2.5 5L4 6.5L7.5 3" stroke={tier.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="font-[500]" style={{ color: "var(--mh-text)" }}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={scrollToInquiry}
                    className="w-full h-[48px] rounded-[16px] text-[15px] font-[600] flex items-center justify-center gap-[8px] transition-all hover:translate-y-[-1px] active:translate-y-[0px] group/btn cursor-pointer"
                    style={{
                      backgroundColor: tier.popular ? "var(--mh-cta)" : "var(--mh-text)",
                      color: "var(--mh-surface)",
                      boxShadow: tier.popular ? "0 10px 24px -6px rgba(var(--mh-cta-rgb), 0.35)" : "none"
                    }}
                  >
                    Apply Now
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform group-hover/btn:translate-x-[1px]">
                      <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[28px] text-center">
          <p className="text-[13.5px] font-[500] inline-flex items-center gap-[8px] px-[16px] h-[36px] rounded-[14px] border" style={{ backgroundColor: "rgba(var(--mh-surface-rgb), 0.7)", borderColor: "rgba(var(--mh-text-rgb), 0.06)", color: "rgba(var(--mh-text-rgb), 0.7)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.25"/>
              <path d="M7 4.2V7.7M7 9.8H7.007" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>
            Final pricing confirmed after requirement review. No hidden costs.
          </p>
        </div>
      </section>

      {/* ═══ FREE ECOSYSTEM REMOVED ═══ */}

      {/* HOW IT WORKS */}
      <section id="process" className="mx-auto max-w-[1200px] px-6 md:px-8 py-[88px] md:py-[112px]">
        <div className="max-w-[720px] mb-[72px]">
          <h2 className="font-body font-bold text-[40px] md:text-[48px] leading-[1.06] tracking-[-0.03em] mb-[18px]" style={{ color: "var(--mh-text)" }}>
            How execution happens
          </h2>
          <p className="text-[17px] leading-[1.6] font-[450]" style={{ color: "rgba(var(--mh-text-rgb), 0.68)" }}>
            Five steps from inquiry to delivery. No middlemen. Direct communication throughout.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-[42px] left-[64px] right-[64px] h-[2px]" style={{ background: "linear-gradient(90deg, var(--mh-cta) 0%, var(--mh-cta) 20%, rgba(var(--mh-text-rgb), 0.08) 20%, rgba(var(--mh-text-rgb), 0.08) 100%)" }}></div>

          <div className="grid md:grid-cols-5 gap-[28px] md:gap-[18px] relative">
            {processSteps.map((item, idx) => (
              <div key={item.step} className="relative">
                <div className="flex md:flex-col gap-[18px] md:gap-0">
                  <div className="relative flex-shrink-0">
                    <div className={`h-[72px] w-[72px] rounded-[22px] flex flex-col items-center justify-center border-2 transition-all ${item.active ? "shadow-[0_12px_32px_-8px_rgba(var(--mh-cta-rgb),0.35)]" : ""}`} style={{
                      backgroundColor: item.active ? "var(--mh-cta)" : "var(--mh-surface)",
                      borderColor: item.active ? "var(--mh-cta)" : "rgba(var(--mh-text-rgb), 0.1)",
                      color: item.active ? "white" : "var(--mh-text)"
                    }}>
                      <div className="text-[11px] font-[700] tracking-[0.02em] opacity-[0.75]">STEP</div>
                      <div className="text-[19px] font-[700] leading-none">{item.step}</div>
                    </div>
                    {idx < 4 && (
                      <div className="md:hidden absolute left-1/2 top-full w-[2px] h-[28px] -translate-x-1/2" style={{ backgroundColor: "rgba(var(--mh-text-rgb), 0.08)" }}></div>
                    )}
                  </div>

                  <div className="pt-[4px] md:pt-[22px] md:text-center flex-1">
                    <h3 className="text-[16px] font-[650] leading-[1.35] mb-[8px]" style={{ color: "var(--mh-text)" }}>{item.title}</h3>
                    <p className="text-[13.5px] leading-[1.55] font-[450]" style={{ color: "rgba(var(--mh-text-rgb), 0.65)" }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[64px] grid md:grid-cols-3 gap-[18px] max-w-[960px] mx-auto">
          {[
            { metric: "48h", label: "Avg response time" },
            { metric: "100%", label: "Fixed price guarantee" },
            { metric: "0%", label: "Bureaucracy overhead" },
          ].map((item) => (
            <div key={item.label} className="text-center py-[20px] px-[18px] rounded-[20px] border" style={{ backgroundColor: "rgba(var(--mh-surface-rgb), 0.6)", borderColor: "rgba(var(--mh-text-rgb), 0.06)" }}>
              <div className="text-[26px] font-[700] tracking-[-0.02em] mb-[4px]" style={{ color: "var(--mh-text)" }}>{item.metric}</div>
              <div className="text-[13px] font-[500]" style={{ color: "rgba(var(--mh-text-rgb), 0.65)" }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-[1200px] px-6 md:px-8 py-[64px] md:py-[84px]">
        <ScrollReveal>
          <div className="text-center mb-[56px] max-w-[640px] mx-auto">
            <h2 className="font-body font-bold text-[32px] md:text-[40px] leading-[1.1] tracking-[-0.03em] mb-[14px]" style={{ color: "var(--mh-text)" }}>
              Built for builders, by builders
            </h2>
            <p className="text-[16px] leading-[1.6] font-[450]" style={{ color: "rgba(var(--mh-text-rgb), 0.68)" }}>
              Projects shipped, people grown, startups launched
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-[18px] mb-[64px]">
          {trustStats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.08}>
              <div className="rounded-[26px] p-[28px] border text-center" style={{ backgroundColor: "var(--mh-surface)", borderColor: "rgba(var(--mh-text-rgb), 0.06)" }}>
                <div className="text-[42px] font-[700] tracking-[-0.03em] leading-none mb-[10px]" style={{ color: "var(--mh-text)" }}>{stat.value}</div>
                <div className="text-[15px] font-[650] mb-[6px]" style={{ color: "var(--mh-text)" }}>{stat.label}</div>
                <div className="text-[13.5px] leading-[1.5] font-[450]" style={{ color: "rgba(var(--mh-text-rgb), 0.65)" }}>{stat.desc}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.1}>
          <div className="pt-[48px] border-t" style={{ borderColor: "rgba(var(--mh-text-rgb), 0.08)" }}>
            <div className="text-[11px] font-[700] tracking-[0.12em] uppercase text-center mb-[32px]" style={{ color: "rgba(var(--mh-text-rgb), 0.45)" }}>
              Trusted by founders across
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-[16px]">
              {brands.map((brand) => (
                <div key={brand} className="h-[56px] rounded-[18px] flex items-center justify-center border transition-all hover:border-opacity-[0.16]" style={{ backgroundColor: "rgba(var(--mh-surface-rgb), 0.65)", borderColor: "rgba(var(--mh-text-rgb), 0.08)" }}>
                  <span className="text-[13px] font-[600] tracking-[-0.01em]" style={{ color: "rgba(var(--mh-text-rgb), 0.75)" }}>{brand}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* INQUIRY FORM */}
      <section
        id="service-inquiry"
        ref={inquiryRef}
        className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8 py-[72px] md:py-[120px] scroll-mt-24"
      >
        <ServiceInquiryForm />
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-8 pb-[80px] md:pb-[140px]">
        <div className="rounded-[36px] overflow-hidden relative" style={{ backgroundColor: "var(--mh-text)" }}>
          <div className="absolute inset-0 opacity-[0.035]" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 32px, white 32px, white 33px), repeating-linear-gradient(90deg, transparent, transparent 32px, white 32px, white 33px)`
          }}></div>

          <div className="relative px-5 sm:px-[36px] md:px-[72px] py-[52px] md:py-[88px] text-center">
            <h2 className="font-body font-bold text-[34px] sm:text-[40px] md:text-[56px] leading-[1.08] md:leading-[1.04] tracking-[-0.03em] md:tracking-[-0.035em] mb-[22px] text-white max-w-[720px] mx-auto">
              Ready to start your project?
            </h2>
            <p className="text-[17px] md:text-[18px] leading-[1.6] mb-[40px] max-w-[560px] mx-auto font-[450]" style={{ color: "rgba(var(--mh-surface-rgb), 0.78)" }}>
              Tell us what you&rsquo;re building. Get a fixed-price proposal in 48 hours. No calls, no pressure.
            </p>

            <div className="flex flex-col sm:flex-row gap-[14px] justify-center">
              <button
                onClick={scrollToInquiry}
                className="h-[54px] px-[32px] rounded-[18px] text-[16px] font-[650] flex items-center justify-center gap-[10px] transition-all hover:scale-[1.02] active:scale-[0.99] cursor-pointer"
                style={{ backgroundColor: "var(--mh-cta)", color: "white", boxShadow: "0 16px 40px -12px rgba(var(--mh-cta-rgb), 0.55)" }}
              >
                Apply Now
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <button
                onClick={scrollToInquiry}
                className="h-[54px] px-[32px] rounded-[18px] text-[16px] font-[600] border-2 flex items-center justify-center gap-[10px] transition-all hover:bg-white hover:text-[var(--mh-text)] cursor-pointer"
                style={{ borderColor: "rgba(var(--mh-surface-rgb), 0.25)", color: "var(--mh-surface)", backgroundColor: "transparent" }}
              >
                Join MistHustlers
                <span>&rarr;</span>
              </button>
            </div>

            <div className="mt-[44px] flex flex-wrap items-center justify-center gap-[28px] text-[13px] font-[500]" style={{ color: "rgba(var(--mh-surface-rgb), 0.6)" }}>
              <span className="flex items-center gap-[8px]">
                <div className="h-[5px] w-[5px] rounded-full bg-[var(--mh-cta)]"></div>
                Fixed pricing
              </span>
              <span className="flex items-center gap-[8px]">
                <div className="h-[5px] w-[5px] rounded-full bg-[var(--mh-secondary)]"></div>
                48h response
              </span>
              <span className="flex items-center gap-[8px]">
                <div className="h-[5px] w-[5px] rounded-full bg-white/70"></div>
                Zero bureaucracy
              </span>
            </div>
          </div>
        </div>
      </section>

      </main>
    </div>
  );
}
