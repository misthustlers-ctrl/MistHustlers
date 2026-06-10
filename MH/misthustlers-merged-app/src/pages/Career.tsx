import { useEffect, useMemo, useState, type FormEvent } from "react";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import { useContent } from "@/utils/useContent";

type OpportunityType = "Job" | "Internship" | "Event" | "Program" | "Hackathon" | "Freelance Gig";
type FilterValue = "All" | OpportunityType;

type Opportunity = {
  id: number;
  title: string;
  type: OpportunityType;
  description: string;
  skills: string[];
  duration?: string;
  dateTime?: string;
  budget?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  mode: string;
  cta: string;
};

type FormState = {
  name: string;
  email: string;
  area: string;
  opportunity: string;
  portfolio: string;
  message: string;
};

const GOOGLE_FORM_URL = "https://forms.gle/VzBkrQFa5TnhTnrYA";
const DEFAULT_FORM_STATE: FormState = {
  name: "",
  email: "",
  area: "Builder Opportunity",
  opportunity: "General MistHustlers Opportunity",
  portfolio: "",
  message: "Hi MistHustlers team, I would love to explore a relevant opportunity and learn the next steps.",
};

function Career() {
  const c = useContent("career", {
    filters: [{ label: "All", value: "All" }, { label: "Jobs", value: "Job" }, { label: "Internships", value: "Internship" }, { label: "Events", value: "Event" }, { label: "Programs", value: "Program" }, { label: "Hackathons", value: "Hackathon" }, { label: "Freelance Gigs", value: "Freelance Gig" }],
    opportunities: [],
    hero: { badge: "", title: "", description: "", ctaPrimary: "", ctaSecondary: "" },
    steps: [{ title: "Explore Opportunities", desc: "" }, { title: "Click Apply", desc: "" }, { title: "Submit Application", desc: "" }, { title: "Get Shortlisted", desc: "" }, { title: "Start Work / Event / Program", desc: "" }],
    trustStats: [{ value: "1.2K+", label: "Active Builders" }, { value: "160+", label: "Real Projects Delivered" }, { value: "35+", label: "Growing Community Pods" }],
    ecosystemPlaceholders: ["Partner Studio", "Build Circle", "Creator Pod", "Startup Desk", "Hack Lab", "Talent Loop"],
    badgeStyles: { Job: "bg-[#070607]/6 text-[#070607] ring-1 ring-[#070607]/10", Internship: "bg-[#524ae9]/10 text-[#524ae9] ring-1 ring-[#524ae9]/15", Event: "bg-[#524ae9]/10 text-[#524ae9] ring-1 ring-[#524ae9]/15", Program: "bg-[#070607]/6 text-[#070607] ring-1 ring-[#070607]/10", Hackathon: "bg-[#fc5000]/10 text-[#fc5000] ring-1 ring-[#fc5000]/15", "Freelance Gig": "bg-[#fc5000]/10 text-[#fc5000] ring-1 ring-[#fc5000]/15" }
  });
  const filters = c.filters || [];
  const fallbackOpportunities = c.opportunities || [];
  const hero = c.hero || {};
  const steps = c.steps || [];
  const trustStats = c.trustStats || [];
  const ecosystemPlaceholders = c.ecosystemPlaceholders || [];
  const badgeStyles = c.badgeStyles || {};

  const [activeFilter, setActiveFilter] = useState<FilterValue>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dbOpportunities, setDbOpportunities] = useState<Opportunity[]>([]);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(true);
  const [opportunityLoadError, setOpportunityLoadError] = useState("");
  const [selectedOpportunity] = useState<Opportunity | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
  const opportunities = dbOpportunities.length > 0 ? dbOpportunities : fallbackOpportunities;

  useEffect(() => {
    setIsLoadingOpportunities(true);
    setOpportunityLoadError("");
    fetch("/api/opportunities")
      .then((response) => response.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setDbOpportunities(json.data);
        } else {
          setOpportunityLoadError("Live listings could not be loaded.");
        }
      })
      .catch(() => {
        setOpportunityLoadError("Live listings could not be loaded.");
      })
      .finally(() => {
        setIsLoadingOpportunities(false);
      });
  }, []);

  const filteredOpportunities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return opportunities.filter((opportunity) => {
      const matchesFilter = activeFilter === "All" || opportunity.type === activeFilter;
      const matchesSearch =
        query.length === 0 ||
        [opportunity.title, opportunity.type, opportunity.description, opportunity.mode, opportunity.level, opportunity.duration, opportunity.dateTime, opportunity.budget, ...opportunity.skills]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, opportunities, searchQuery]);

  const featuredInternship = opportunities.find((o) => o.type === "Internship") ?? opportunities[0];
  const hotEvent = opportunities.find((o) => o.title === "AI Automation Workshop") ?? opportunities[2];
  const highPayingGig = opportunities.find((o) => o.title === "Motion Graphics Explainer Project") ?? opportunities[opportunities.length - 1];
  const heroCards = [featuredInternship, hotEvent, opportunities[3]].filter((x): x is Opportunity => !!x);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const rawPortfolio = formState.portfolio.trim();
      const portfolioUrl = rawPortfolio && !/^https?:\/\//i.test(rawPortfolio)
        ? `https://${rawPortfolio}`
        : rawPortfolio;
      const response = await fetch("/api/applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: selectedOpportunity?.id ?? opportunities[0]?.id,
          name: formState.name.trim(),
          email: formState.email.trim(),
          resumeUrl: portfolioUrl || undefined,
          coverLetter: [
            `Interest area: ${formState.area}`,
            `Opportunity: ${formState.opportunity}`,
            "",
            formState.message,
          ].join("\n"),
        }),
      });

      const json = await response.json().catch(() => ({}));
      if (!response.ok || !json.success) {
        const detail = Array.isArray(json.errors) && json.errors.length > 0
          ? `: ${json.errors.map((item: { message?: string }) => item.message).filter(Boolean).join(", ")}`
          : "";
        throw new Error(`${json.message || "Application could not be submitted"}${detail}`);
      }

      setIsSubmitted(true);
      setFormState(DEFAULT_FORM_STATE);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Application could not be submitted");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCategories = new Set(opportunities.map((o) => o.type)).size;

  return (
    <div className="min-h-screen bg-[#e2e2df] text-[#070607]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-5%] h-80 w-80 rounded-full bg-[#524ae9]/12 blur-3xl" />
        <div className="absolute right-[-5%] top-[18%] h-96 w-96 rounded-full bg-[#fc5000]/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[25%] h-80 w-80 rounded-full bg-white/40 blur-3xl" />
        <div className="mist-grid absolute inset-0 opacity-50" />
      </div>

      <GlobalNavbar />

      <main id="top" className="px-4 pb-16 pt-24">
        {/* HERO */}
        <section className="mx-auto grid max-w-7xl gap-10 pb-18 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-16">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#070607]/10 bg-[#f7f6f2]/90 px-4 py-2 text-sm font-medium text-[#070607]/70 shadow-[0_10px_25px_rgba(7,6,7,0.05)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#fc5000]" />
              {hero.badge || "Live opportunity hub for ambitious builders"}
            </div>

            <div className="space-y-5">
              <p className="mh-heading max-w-4xl text-5xl leading-[0.95] sm:text-6xl lg:text-8xl">
                {hero.title || "Opportunities for Builders"}
              </p>
              <p className="max-w-2xl text-lg leading-8 text-[#070607]/70 sm:text-xl">
                {hero.description || "Explore jobs, internships, events, and programs designed for real-world growth inside the MistHustlers ecosystem."}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => scrollToSection("opportunities")}
                className="rounded-full bg-[#070607] px-7 py-4 text-base font-bold text-[#f7f6f2] transition hover:-translate-y-0.5 hover:bg-[#524ae9] cursor-pointer"
              >
                {hero.ctaPrimary || "Explore Opportunities"}
              </button>
              <a
                href={GOOGLE_FORM_URL}
                className="rounded-full border border-[#070607]/12 bg-[#f7f6f2] px-7 py-4 text-base font-bold text-[#070607] shadow-[0_12px_24px_rgba(7,6,7,0.06)] transition hover:-translate-y-0.5 hover:border-[#fc5000]/30 hover:text-[#fc5000] cursor-pointer"
              >
                {hero.ctaSecondary || "Join Now"}
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="mh-card rounded-[28px] p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-[#070607]/40">Active Listings</p>
                <p className="mt-3 text-3xl font-bold text-[#070607]">{opportunities.length}</p>
              </div>
              <div className="mh-card rounded-[28px] p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-[#070607]/40">Opportunity Types</p>
                <p className="mt-3 text-3xl font-bold text-[#070607]">{totalCategories}</p>
              </div>
              <div className="mh-card rounded-[28px] p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-[#070607]/40">Single CTA Path</p>
                <p className="mt-3 text-3xl font-bold text-[#070607]">1 form</p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[420px]">
            <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_top,_rgba(82,74,233,0.16),_transparent_40%),linear-gradient(135deg,rgba(247,246,242,0.95),rgba(247,246,242,0.72))] shadow-[0_30px_80px_rgba(7,6,7,0.08)] ring-1 ring-white/50" />
            <div className="absolute inset-6 rounded-[32px] border border-dashed border-[#070607]/10" />

            {heroCards.map((card, index) => (
              <article
                key={card.id}
                className={`floating-card absolute w-[78%] rounded-[30px] border border-white/60 bg-[#f7f6f2]/92 p-6 shadow-[0_24px_60px_rgba(7,6,7,0.10)] backdrop-blur ${
                  index === 0
                    ? "left-[4%] top-[8%] rotate-[-8deg]"
                    : index === 1
                      ? "right-[4%] top-[32%] rotate-[7deg] floating-delay-1"
                      : "left-[18%] bottom-[7%] rotate-[-3deg] floating-delay-2"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${badgeStyles[card.type]}`}>
                    {card.type}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#070607]/35">{card.mode}</span>
                </div>
                <h2 className="mt-5 text-2xl font-bold text-[#070607]">{card.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#070607]/65">{card.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {card.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-[#070607]/70 ring-1 ring-[#070607]/8">
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* FILTER BAR */}
        <section className="mx-auto max-w-7xl pb-8">
          <div className="mh-card rounded-[32px] p-4 md:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[#070607]/40">Filter Bar</p>
                <p className="mt-2 text-lg font-semibold text-[#070607]">Find curated opportunities by category and search intent.</p>
              </div>

              <label className="flex min-w-full items-center gap-3 rounded-full border border-[#070607]/10 bg-white/60 px-4 py-3 text-sm text-[#070607]/45 lg:min-w-[320px]">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search opportunities..."
                  aria-label="Search opportunities"
                  className="w-full bg-transparent text-sm text-[#070607] placeholder:text-[#070607]/40 focus:outline-none"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {filters.map((filter) => {
                const isActive = activeFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setActiveFilter(filter.value as FilterValue)}
                    className={`rounded-full px-4 py-2.5 text-sm font-bold transition cursor-pointer ${
                      isActive
                        ? "bg-[#070607] text-[#f7f6f2] shadow-[0_14px_24px_rgba(7,6,7,0.14)]"
                        : "bg-white/70 text-[#070607]/70 ring-1 ring-[#070607]/8 hover:bg-[#524ae9]/10 hover:text-[#524ae9]"
                    }`}
                    aria-pressed={isActive}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* OPPORTUNITY GRID */}
        <section id="opportunities" className="mx-auto max-w-7xl scroll-mt-28 py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-[#070607]/40">Opportunity Grid</p>
              <h2 className="mh-heading mt-3 text-4xl leading-none sm:text-5xl">Curated Live Listings</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#070607]/65 sm:text-lg">
                Every listing is designed to feel actionable, clear, and connected to the MistHustlers builder ecosystem.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 md:items-end">
              <div className="rounded-full border border-[#070607]/10 bg-[#f7f6f2]/80 px-5 py-3 text-sm font-semibold text-[#070607]/70 shadow-[0_12px_24px_rgba(7,6,7,0.05)]">
                {isLoadingOpportunities ? "Loading live listings..." : `${filteredOpportunities.length} opportunities found`}
              </div>
              {opportunityLoadError ? (
                <p className="text-sm font-medium text-[#fc5000]">{opportunityLoadError}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredOpportunities.map((opportunity) => {
              const primaryMetaLabel =
                opportunity.type === "Event" || opportunity.type === "Hackathon"
                  ? "Date & Time"
                  : opportunity.type === "Freelance Gig"
                    ? "Budget"
                    : "Duration";
              const primaryMetaValue =
                opportunity.type === "Event" || opportunity.type === "Hackathon"
                  ? opportunity.dateTime
                  : opportunity.type === "Freelance Gig"
                    ? opportunity.budget
                    : opportunity.duration;
              const displayMetaValue = primaryMetaValue || opportunity.duration || opportunity.mode || "Flexible";

              return (
                <article key={opportunity.id} className="mh-card group flex h-full flex-col rounded-[30px] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_rgba(7,6,7,0.10)]">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] ${badgeStyles[opportunity.type]}`}>
                      {opportunity.type}
                    </span>
                    <span className="rounded-full bg-white/75 px-3 py-1.5 text-xs font-medium text-[#070607]/55 ring-1 ring-[#070607]/8">
                      {opportunity.mode}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    <h3 className="text-2xl font-bold tracking-tight text-[#070607]">{opportunity.title}</h3>
                    <p className="text-sm leading-7 text-[#070607]/65">{opportunity.description}</p>
                  </div>

                  <div className="mt-6">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#070607]/40">Skills required</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {opportunity.skills.map((skill) => (
                        <span key={skill} className="rounded-full border border-[#070607]/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#070607]/65">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white/65 p-4 ring-1 ring-[#070607]/8">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#070607]/35">{primaryMetaLabel}</p>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[#070607]">{displayMetaValue}</p>
                    </div>
                    <div className="rounded-2xl bg-white/65 p-4 ring-1 ring-[#070607]/8">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#070607]/35">Level</p>
                      <p className="mt-2 text-sm font-semibold text-[#070607]">{opportunity.level}</p>
                    </div>
                    <div className="rounded-2xl bg-white/65 p-4 ring-1 ring-[#070607]/8">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#070607]/35">Path</p>
                      <p className="mt-2 text-sm font-semibold text-[#070607]">Inquiry Form</p>
                    </div>
                  </div>

                  <a
                    href={GOOGLE_FORM_URL}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-[#fc5000] px-5 py-3.5 text-sm font-bold text-white shadow-[0_16px_30px_rgba(252,80,0,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_36px_rgba(252,80,0,0.32)] cursor-pointer"
                  >
                    {opportunity.cta}
                  </a>
                </article>
              );
            })}
          </div>

          {!isLoadingOpportunities && filteredOpportunities.length === 0 ? (
            <div className="mh-card mt-6 rounded-[28px] p-8 text-center">
              <p className="text-xl font-semibold text-[#070607]">No direct matches yet.</p>
              <p className="mt-3 text-[#070607]/65">Try a broader search or switch filters to discover more roles, events, and programs.</p>
            </div>
          ) : null}
        </section>

        {/* FEATURED */}
        <section id="featured" className="mx-auto max-w-7xl scroll-mt-28 py-10">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.22em] text-[#070607]/40">Featured Section</p>
            <h2 className="mh-heading mt-3 text-4xl leading-none sm:text-5xl">Top Opportunities in Focus</h2>
            <p className="mt-4 text-base leading-7 text-[#070607]/65 sm:text-lg">A premium shortlist of high-interest openings, live sessions, and freelance work with strong momentum right now.</p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <article className="mh-card rounded-[32px] p-7 lg:col-span-1">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#524ae9]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#524ae9] ring-1 ring-[#524ae9]/15">Featured Internships</span>
                <span className="text-sm font-semibold text-[#070607]/45">Early career</span>
              </div>
              {featuredInternship ? (
                <>
                  <h3 className="mt-6 text-3xl font-bold tracking-tight text-[#070607]">{featuredInternship.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#070607]/65">{featuredInternship.description}</p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/65 p-4 ring-1 ring-[#070607]/8">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#070607]/35">Duration</p>
                      <p className="mt-2 text-sm font-semibold">{featuredInternship.duration}</p>
                    </div>
                    <div className="rounded-2xl bg-white/65 p-4 ring-1 ring-[#070607]/8">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#070607]/35">Level</p>
                      <p className="mt-2 text-sm font-semibold">{featuredInternship.level}</p>
                    </div>
                  </div>
                  <a
                    href={GOOGLE_FORM_URL}
                    className="mt-6 rounded-full bg-[#070607] px-5 py-3 text-sm font-bold text-[#f7f6f2] transition hover:bg-[#524ae9] cursor-pointer"
                  >
                    Apply Now
                  </a>
                </>
              ) : (
                <p className="mt-6 text-sm leading-7 text-[#070607]/50">No featured internships available right now.</p>
              )}
            </article>

            <article className="mh-card rounded-[32px] p-7 lg:col-span-1">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#fc5000]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#fc5000] ring-1 ring-[#fc5000]/15">Hot Events</span>
                <span className="text-sm font-semibold text-[#070607]/45">Live energy</span>
              </div>
              {hotEvent ? (
                <>
                  <h3 className="mt-6 text-3xl font-bold tracking-tight text-[#070607]">{hotEvent.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#070607]/65">{hotEvent.description}</p>
                  <div className="mt-6 rounded-[24px] bg-[linear-gradient(135deg,rgba(82,74,233,0.10),rgba(252,80,0,0.12))] p-5 ring-1 ring-white/60">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#070607]/40">Next session</p>
                    <p className="mt-2 text-lg font-bold text-[#070607]">{hotEvent.dateTime}</p>
                    <p className="mt-2 text-sm text-[#070607]/55">Guided session for builders who want practical systems, not theory slides.</p>
                  </div>
                  <a
                    href={GOOGLE_FORM_URL}
                    className="mt-6 rounded-full bg-[#fc5000] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 cursor-pointer"
                  >
                    Register
                  </a>
                </>
              ) : (
                <p className="mt-6 text-sm leading-7 text-[#070607]/50">No hot events scheduled right now.</p>
              )}
            </article>

            <article className="mh-card rounded-[32px] p-7 lg:col-span-1">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#070607]/6 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#070607] ring-1 ring-[#070607]/10">High Paying Freelance Gigs</span>
                <span className="text-sm font-semibold text-[#070607]/45">Fast turnaround</span>
              </div>
              {highPayingGig ? (
                <>
                  <h3 className="mt-6 text-3xl font-bold tracking-tight text-[#070607]">{highPayingGig.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#070607]/65">{highPayingGig.description}</p>
                  <div className="mt-6 flex items-end justify-between rounded-[24px] bg-white/65 p-5 ring-1 ring-[#070607]/8">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#070607]/35">Budget Range</p>
                      <p className="mt-2 text-2xl font-bold text-[#070607]">{highPayingGig.budget}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#070607]/50">{highPayingGig.duration}</p>
                  </div>
                  <a
                    href={GOOGLE_FORM_URL}
                    className="mt-6 rounded-full border border-[#070607]/10 bg-white/75 px-5 py-3 text-sm font-bold text-[#070607] transition hover:border-[#fc5000]/30 hover:text-[#fc5000] cursor-pointer"
                  >
                    Apply
                  </a>
                </>
              ) : (
                <p className="mt-6 text-sm leading-7 text-[#070607]/50">No freelance gigs available right now.</p>
              )}
            </article>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-28 py-10">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.22em] text-[#070607]/40">How It Works</p>
            <h2 className="mh-heading mt-3 text-4xl leading-none sm:text-5xl">Simple Path to Momentum</h2>
            <p className="mt-4 text-base leading-7 text-[#070607]/65 sm:text-lg">The experience is intentionally streamlined so builders can move from discovery to action without friction.</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {steps.map((step, index) => (
              <article key={typeof step === "string" ? step : step.title} className="mh-card rounded-[28px] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#070607] text-sm font-bold text-[#f7f6f2]">0{index + 1}</div>
                <h3 className="mt-5 text-xl font-bold text-[#070607]">{typeof step === "string" ? step : step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#070607]/60">
                  {typeof step === "string" ? "" : step.desc}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* TRUST + ECOSYSTEM */}
        <section className="mx-auto max-w-7xl py-10">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <div className="mh-card rounded-[32px] p-7 md:p-8">
              <p className="text-sm uppercase tracking-[0.22em] text-[#070607]/40">Trust Section</p>
              <h2 className="mh-heading mt-3 text-4xl leading-none sm:text-5xl">Built for Real Builder Outcomes</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#070607]/65 sm:text-lg">
                MistHustlers brings opportunities, projects, and community momentum into one premium ecosystem designed to convert interest into action.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {trustStats.map((stat) => (
                  <div key={stat.label} className="rounded-[24px] bg-white/65 p-5 ring-1 ring-[#070607]/8">
                    <p className="text-sm uppercase tracking-[0.2em] text-[#070607]/40">{stat.label}</p>
                    <p className="mt-3 text-4xl font-bold tracking-tight text-[#070607]">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mh-card rounded-[32px] p-7 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[#070607]/40">Ecosystem Signals</p>
                  <h3 className="mt-3 text-2xl font-bold text-[#070607]">Logo placeholders</h3>
                </div>
                <span className="rounded-full bg-[#524ae9]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#524ae9] ring-1 ring-[#524ae9]/15">Growing community</span>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">
                {ecosystemPlaceholders.map((name) => (
                  <div key={name} className="flex min-h-[96px] items-center justify-center rounded-[24px] border border-dashed border-[#070607]/14 bg-white/60 px-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[#070607]/45">
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* INQUIRY FORM */}
        <section id="service-inquiry" className="mx-auto max-w-7xl scroll-mt-28 py-12">
          <div className="overflow-hidden rounded-[40px] border border-white/55 bg-[linear-gradient(135deg,rgba(247,246,242,0.96),rgba(247,246,242,0.88))] shadow-[0_30px_80px_rgba(7,6,7,0.10)]">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="border-b border-[#070607]/8 p-7 md:p-10 lg:border-b-0 lg:border-r">
                <p className="text-sm uppercase tracking-[0.22em] text-[#070607]/40">Final CTA</p>
                <h2 className="mh-heading mt-3 text-4xl leading-none sm:text-5xl lg:text-6xl">Start Your Journey Today</h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-[#070607]/68 sm:text-lg">
                  One inquiry form powers every application. Submit your intent, links, and builder profile to enter the MistHustlers opportunity pipeline.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={GOOGLE_FORM_URL}
                    className="rounded-full bg-[#fc5000] px-6 py-4 text-base font-bold text-white shadow-[0_18px_34px_rgba(252,80,0,0.26)] transition hover:-translate-y-0.5 cursor-pointer"
                  >
                    Apply Now
                  </a>
                  <a
                    href={GOOGLE_FORM_URL}
                    className="rounded-full border border-[#070607]/12 bg-white/70 px-6 py-4 text-base font-bold text-[#070607] transition hover:border-[#524ae9]/25 hover:text-[#524ae9] cursor-pointer"
                  >
                    Join MistHustlers
                  </a>
                </div>

                <div className="mt-8 rounded-[28px] bg-[#070607] p-6 text-[#f7f6f2] shadow-[0_24px_48px_rgba(7,6,7,0.16)]">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/45">Selected opportunity</p>
                  <h3 className="mt-3 text-2xl font-bold">
                    {selectedOpportunity ? selectedOpportunity.title : "General MistHustlers Opportunity"}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                      {selectedOpportunity ? selectedOpportunity.type : "Open application"}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                      {selectedOpportunity ? selectedOpportunity.level : "All levels"}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                      {selectedOpportunity ? selectedOpportunity.mode : "Builder ecosystem"}
                    </span>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-white/75">
                    {selectedOpportunity
                      ? selectedOpportunity.description
                      : "Use this form to apply for jobs, internships, events, programs, hackathons, or freelance gigs inside MistHustlers."}
                  </p>
                </div>
              </div>

              <div className="p-7 md:p-10">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-[#070607]/40">Inquiry Form</p>
                    <h3 className="mt-3 text-3xl font-bold tracking-tight text-[#070607]">Apply via #service-inquiry</h3>
                  </div>
                  <span className="rounded-full bg-[#524ae9]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#524ae9] ring-1 ring-[#524ae9]/15">Curated intake</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[#070607]/70">Full Name</span>
                      <input
                        id="applicant-name"
                        value={formState.name}
                        onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                        placeholder="Your name"
                        className="w-full rounded-[20px] border border-[#070607]/10 bg-white/75 px-4 py-3.5 text-[#070607] placeholder:text-[#070607]/35 focus:border-[#524ae9]/30 focus:outline-none"
                        required
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[#070607]/70">Email</span>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
                        placeholder="you@example.com"
                        className="w-full rounded-[20px] border border-[#070607]/10 bg-white/75 px-4 py-3.5 text-[#070607] placeholder:text-[#070607]/35 focus:border-[#524ae9]/30 focus:outline-none"
                        required
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[#070607]/70">Interest Area</span>
                      <input
                        value={formState.area}
                        onChange={(event) => setFormState((current) => ({ ...current, area: event.target.value }))}
                        placeholder="Job, event, program..."
                        className="w-full rounded-[20px] border border-[#070607]/10 bg-white/75 px-4 py-3.5 text-[#070607] placeholder:text-[#070607]/35 focus:border-[#524ae9]/30 focus:outline-none"
                        required
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-[#070607]/70">Opportunity</span>
                      <input
                        value={formState.opportunity}
                        onChange={(event) => setFormState((current) => ({ ...current, opportunity: event.target.value }))}
                        placeholder="Opportunity title"
                        className="w-full rounded-[20px] border border-[#070607]/10 bg-white/75 px-4 py-3.5 text-[#070607] placeholder:text-[#070607]/35 focus:border-[#524ae9]/30 focus:outline-none"
                        required
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#070607]/70">Portfolio / LinkedIn / Relevant Link</span>
                    <input
                      value={formState.portfolio}
                      onChange={(event) => setFormState((current) => ({ ...current, portfolio: event.target.value }))}
                      placeholder="https://"
                      className="w-full rounded-[20px] border border-[#070607]/10 bg-white/75 px-4 py-3.5 text-[#070607] placeholder:text-[#070607]/35 focus:border-[#524ae9]/30 focus:outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[#070607]/70">Why are you a fit?</span>
                    <textarea
                      value={formState.message}
                      onChange={(event) => setFormState((current) => ({ ...current, message: event.target.value }))}
                      rows={6}
                      placeholder="Tell the team why this opportunity fits your goals."
                      className="w-full rounded-[24px] border border-[#070607]/10 bg-white/75 px-4 py-4 text-[#070607] placeholder:text-[#070607]/35 focus:border-[#524ae9]/30 focus:outline-none"
                      required
                    />
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-full bg-[#fc5000] px-6 py-4 text-base font-bold text-white shadow-[0_16px_30px_rgba(252,80,0,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_36px_rgba(252,80,0,0.30)] cursor-pointer"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                    <p className="text-sm leading-6 text-[#070607]/55">
                      Every application is routed through one premium intake flow for faster shortlisting.
                    </p>
                  </div>

                  {isSubmitted ? (
                    <div className="rounded-[24px] border border-[#1f9d55]/20 bg-[#1f9d55]/10 px-5 py-4 text-sm font-bold leading-7 text-[#070607]">
                      Submitted successfully. Your application has been saved and the MistHustlers team has received an email notification.
                    </div>
                  ) : null}
                  {submitError ? (
                    <div className="rounded-[24px] border border-[#fc5000]/20 bg-[#fc5000]/8 px-5 py-4 text-sm font-medium leading-7 text-[#070607]">
                      {submitError}
                    </div>
                  ) : null}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Career;
