import { Star, ShieldCheck, Clock, Award, Users, CheckCircle2, Building2 } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const TESTIMONIALS = [
  {
    name: "Vikram Sharma",
    role: "Founder, Zenith Retail Tech",
    location: "Indore, MP",
    content: "MistHustlers redesigned our business website and set up an automated WhatsApp lead pipeline. Our organic leads jumped by 35% in under 60 days. Founder Naveen was directly involved throughout.",
    rating: 5,
    tag: "Web Development & AI Automation",
  },
  {
    name: "Dr. Meenakshi Joshi",
    role: "Medical Director, CarePoint Clinics",
    location: "Indore, MP",
    content: "We needed a clean clinic website with online patient appointment booking and doctor profiles. MistHustlers delivered in 10 days flat at an unbeatable fixed cost.",
    rating: 5,
    tag: "Doctor & Clinic Website",
  },
  {
    name: "Ananya Mehta",
    role: "Co-Founder, QuickBite Solutions",
    location: "Mumbai / Indore",
    content: "Shipped our food-tech SaaS MVP in 3 weeks flat. Clean React codebase, smooth UX design, and complete source-code handover without any hidden fees.",
    rating: 5,
    tag: "MVP SaaS Development",
  },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, title: "100% Delivery Guarantee", desc: "Scope locked with zero hidden costs" },
  { icon: Clock, title: "48-Hour Quote Turnaround", desc: "Fast consultation and project proposal" },
  { icon: Award, title: "Founder-Led Engineering", desc: "Direct access to senior tech architect" },
  { icon: Building2, title: "Indore Based, Global Reach", desc: "Serving clients across US, UK, Canada, Australia, UAE, Singapore & India" },
];

export default function TrustSection() {
  return (
    <section className="relative overflow-hidden bg-basalt-canvas py-16 lg:py-24 border-y border-abyssal-ink/5">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-digital-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-digital-orange font-body mb-4">
            <ShieldCheck className="h-4 w-4" /> Trusted by Founders Across 7 Countries
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-abyssal-ink">
            Why Global Brands Choose MistHustlers
          </h2>
          <p className="mt-4 text-base sm:text-lg text-abyssal-ink/65 font-body leading-relaxed">
            We bridge high-end engineering with global business growth. No vague agency markups—just transparent execution, rapid delivery, and direct founder support.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {[
            { label: "Countries Served", suffix: "" },
            { label: "Core Services", suffix: "" },
            { label: "Tech Stacks Supported", suffix: "" },
            { label: "Delivery Models", suffix: "" },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl border border-abyssal-ink/10 bg-white/70 p-5 sm:p-6 text-center shadow-sm backdrop-blur-sm">
              <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-digital-orange">
                <span className="text-digital-orange">7</span>
                {stat.suffix}
              </div>
              <p className="mt-2 text-xs sm:text-sm font-medium text-abyssal-ink/70 font-body">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {TRUST_BADGES.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div key={index} className="flex items-start gap-4 rounded-2xl border border-abyssal-ink/8 bg-ash-white/80 p-5 font-body transition-all hover:border-digital-orange/30">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-digital-orange/12 text-digital-orange">
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-abyssal-ink">{badge.title}</h3>
                  <p className="mt-1 text-xs text-abyssal-ink/60 leading-normal">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Testimonial Cards */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-abyssal-ink">What Client Founders Say</h3>
              <p className="text-sm text-abyssal-ink/60 font-body">Verified reviews from web development & automation clients</p>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-amber-500 font-bold text-sm">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
              ))}
              <span className="ml-1 text-abyssal-ink font-body">4.9 / 5 Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testi, i) => (
              <div key={i} className="flex flex-col justify-between rounded-3xl border border-abyssal-ink/10 bg-white p-6 shadow-sm font-body transition-all hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full bg-cyber-violet/10 px-3 py-1 text-[11px] font-bold text-cyber-violet">
                      {testi.tag}
                    </span>
                    <div className="flex items-center text-amber-500">
                      {[...Array(testi.rating)].map((_, r) => (
                        <Star key={r} className="h-3.5 w-3.5 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-abyssal-ink/75 leading-relaxed italic">
                    "{testi.content}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-abyssal-ink/8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-digital-orange text-white font-bold text-sm">
                    {testi.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-abyssal-ink">{testi.name}</h4>
                    <p className="text-xs text-abyssal-ink/50">{testi.role} • {testi.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-abyssal-ink to-basalt-canvas p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-abyssal-ink/20">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-digital-orange font-body">
              <CheckCircle2 className="h-3.5 w-3.5" /> 100% Risk-Free Partnership
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold">Our 100% Code & Quality Guarantee</h3>
            <p className="text-sm text-white/80 font-body max-w-xl">
              If we don't meet agreed milestone deliverables on schedule, we fix it at zero extra cost or refund your deposit. Complete source-code rights transferred upon final handover.
            </p>
          </div>
          <a
            href="/contact"
            className="magnetic-btn bg-digital-orange text-white px-8 py-3.5 rounded-full font-bold text-sm whitespace-nowrap font-body hover:scale-105 transition-transform"
          >
            Start Your Risk-Free Project
          </a>
        </div>
      </div>
    </section>
  );
}