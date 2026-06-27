import { useEffect, useMemo, useState } from "react";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import CareerHero from "@/components/CareerHero";
import TalentApplicationForm from "@/components/TalentApplicationForm";
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

const GOOGLE_FORM_URL = "https://forms.gle/VzBkrQFa5TnhTnrYA";

function Career() {
  const c = useContent("career", {
    filters: [{ label: "All", value: "All" }, { label: "Jobs", value: "Job" }, { label: "Internships", value: "Internship" }, { label: "Events", value: "Event" }, { label: "Programs", value: "Program" }, { label: "Hackathons", value: "Hackathon" }, { label: "Freelance Gigs", value: "Freelance Gig" }],
    opportunities: [],
    hero: { badge: "", title: "", description: "", ctaPrimary: "", ctaSecondary: "" },
    steps: [{ title: "Explore Opportunities", desc: "" }, { title: "Click Apply", desc: "" }, { title: "Submit Application", desc: "" }, { title: "Get Shortlisted", desc: "" }, { title: "Start Work / Event / Program", desc: "" }],
    trustStats: [{ value: "1.2K+", label: "Active Builders" }, { value: "160+", label: "Real Projects Delivered" }, { value: "35+", label: "Growing Community Pods" }],
    ecosystemPlaceholders: ["Partner Studio", "Build Circle", "Creator Pod", "Startup Desk", "Hack Lab", "Talent Loop"],
    badgeStyles: { Job: "bg-[var(--mh-text)]/6 text-[var(--mh-text)] ring-1 ring-[var(--mh-text)]/10", Internship: "bg-[var(--mh-secondary)]/10 text-[var(--mh-secondary)] ring-1 ring-[var(--mh-secondary)]/15", Event: "bg-[var(--mh-secondary)]/10 text-[var(--mh-secondary)] ring-1 ring-[var(--mh-secondary)]/15", Program: "bg-[var(--mh-text)]/6 text-[var(--mh-text)] ring-1 ring-[var(--mh-text)]/10", Hackathon: "bg-[var(--mh-cta)]/10 text-[var(--mh-cta)] ring-1 ring-[var(--mh-cta)]/15", "Freelance Gig": "bg-[var(--mh-cta)]/10 text-[var(--mh-cta)] ring-1 ring-[var(--mh-cta)]/15" }
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

  return (
    <div className="min-h-screen bg-[#e2e2df] text-[var(--mh-text)]">
      <div className="career-atmosphere pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-5%] h-80 w-80 rounded-full bg-[var(--mh-secondary)]/12 blur-3xl" />
        <div className="absolute right-[-5%] top-[18%] h-96 w-96 rounded-full bg-[var(--mh-cta)]/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[25%] h-80 w-80 rounded-full bg-white/40 blur-3xl" />
        <div className="mist-grid absolute inset-0 opacity-50" />
      </div>

      <SEO page="career" />
      <SchemaMarkup page="career" />

      <main id="top" className="px-4 pb-16 pt-24">
        <CareerHero hero={hero} badgeStyles={badgeStyles} opportunities={opportunities} />

        {/* FILTER BAR */}
        <section className="mx-auto max-w-7xl pb-8">
          <div className="mh-card rounded-[24px] sm:rounded-[32px] p-4 md:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[var(--mh-text)]/40">Filter Bar</p>
                <p className="mt-2 text-lg font-semibold text-[var(--mh-text)]">Find curated opportunities by category and search intent.</p>
              </div>

              <label className="flex min-w-full items-center gap-3 rounded-[18px] border border-[var(--mh-text)]/10 bg-white/60 px-4 py-3 text-sm text-[var(--mh-text)]/45 sm:rounded-full lg:min-w-[320px]">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search opportunities..."
                  aria-label="Search opportunities"
                  className="w-full bg-transparent text-sm text-[var(--mh-text)] placeholder:text-[var(--mh-text)]/40 focus:outline-none"
                />
              </label>
            </div>

            <div className="mobile-tab-shell mt-5">
              <div className="mobile-tab-row flex gap-2.5 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
              {filters.map((filter) => {
                const isActive = activeFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={(event) => {
                      setActiveFilter(filter.value as FilterValue);
                      event.currentTarget.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                    }}
                    className={`min-h-11 shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold transition cursor-pointer ${
                      isActive
                        ? "bg-[var(--mh-text)] text-[var(--mh-surface)] shadow-[0_14px_24px_rgba(var(--mh-text-rgb),0.14)]"
                        : "bg-white/70 text-[var(--mh-text)]/70 ring-1 ring-[var(--mh-text)]/8 hover:bg-[var(--mh-secondary)]/10 hover:text-[var(--mh-secondary)]"
                    }`}
                    aria-pressed={isActive}
                  >
                    {filter.label}
                  </button>
                );
              })}
              </div>
            </div>
          </div>
        </section>

        {/* OPPORTUNITY GRID */}
        <section id="opportunities" className="mx-auto max-w-7xl scroll-mt-28 py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--mh-text)]/40">Opportunity Grid</p>
              <h2 className="mh-heading mt-3 text-4xl leading-none sm:text-5xl">Curated Live Listings</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--mh-text)]/65 sm:text-lg">
                Every listing is designed to feel actionable, clear, and connected to the MistHustlers builder ecosystem.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 md:items-end">
              <div className="rounded-full border border-[var(--mh-text)]/10 bg-[var(--mh-surface)]/80 px-5 py-3 text-sm font-semibold text-[var(--mh-text)]/70 shadow-[0_12px_24px_rgba(var(--mh-text-rgb),0.05)]">
                {isLoadingOpportunities ? "Loading live listings..." : `${filteredOpportunities.length} opportunities found`}
              </div>
              {opportunityLoadError ? (
                <p className="text-sm font-medium text-[var(--mh-cta)]">{opportunityLoadError}</p>
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
                <article key={opportunity.id} className="mh-card group flex h-full flex-col rounded-[24px] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_rgba(var(--mh-text-rgb),0.10)] sm:rounded-[30px] sm:p-6">
                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
                    <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] ${badgeStyles[opportunity.type]}`}>
                      {opportunity.type}
                    </span>
                    <span className="rounded-full bg-white/75 px-3 py-1.5 text-xs font-medium text-[var(--mh-text)]/55 ring-1 ring-[var(--mh-text)]/8">
                      {opportunity.mode}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    <h3 className="text-xl font-bold tracking-tight text-[var(--mh-text)] sm:text-2xl">{opportunity.title}</h3>
                    <p className="text-sm leading-7 text-[var(--mh-text)]/65">{opportunity.description}</p>
                  </div>

                  <div className="mt-6 md:hidden">
                    <details className="group">
                      <summary className="list-none flex items-center justify-between py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--mh-text)]/40 cursor-pointer">
                        <span>Skills &amp; details</span>
                        <svg className="w-4 h-4 transition-transform group-open:rotate-180" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M3 5l3 3 3-3" />
                        </svg>
                      </summary>
                      <div className="mt-3 space-y-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--mh-text)]/40 mb-3">Skills required</p>
                          <div className="flex flex-wrap gap-2">
                            {opportunity.skills.map((skill) => (
                              <span key={skill} className="rounded-full border border-[var(--mh-text)]/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[var(--mh-text)]/65">{skill}</span>
                            ))}
                          </div>
                        </div>
                        <div className="grid gap-3 min-[420px]:grid-cols-3">
                          <div className="rounded-2xl bg-white/65 p-4 ring-1 ring-[var(--mh-text)]/8">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--mh-text)]/35">{primaryMetaLabel}</p>
                            <p className="mt-2 text-sm font-semibold leading-6 text-[var(--mh-text)]">{displayMetaValue}</p>
                          </div>
                          <div className="rounded-2xl bg-white/65 p-4 ring-1 ring-[var(--mh-text)]/8">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--mh-text)]/35">Level</p>
                            <p className="mt-2 text-sm font-semibold text-[var(--mh-text)]">{opportunity.level}</p>
                          </div>
                          <div className="rounded-2xl bg-white/65 p-4 ring-1 ring-[var(--mh-text)]/8">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--mh-text)]/35">Path</p>
                            <p className="mt-2 text-sm font-semibold text-[var(--mh-text)]">Inquiry Form</p>
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>

                  <div className="hidden md:block mt-6">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--mh-text)]/40">Skills required</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {opportunity.skills.map((skill) => (
                        <span key={skill} className="rounded-full border border-[var(--mh-text)]/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[var(--mh-text)]/65">{skill}</span>
                      ))}
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-white/65 p-4 ring-1 ring-[var(--mh-text)]/8">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--mh-text)]/35">{primaryMetaLabel}</p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-[var(--mh-text)]">{displayMetaValue}</p>
                      </div>
                      <div className="rounded-2xl bg-white/65 p-4 ring-1 ring-[var(--mh-text)]/8">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--mh-text)]/35">Level</p>
                        <p className="mt-2 text-sm font-semibold text-[var(--mh-text)]">{opportunity.level}</p>
                      </div>
                      <div className="rounded-2xl bg-white/65 p-4 ring-1 ring-[var(--mh-text)]/8">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--mh-text)]/35">Path</p>
                        <p className="mt-2 text-sm font-semibold text-[var(--mh-text)]">Inquiry Form</p>
                      </div>
                    </div>
                  </div>

                  <a
                    href={GOOGLE_FORM_URL}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--mh-cta)] px-5 py-3.5 text-sm font-bold text-white shadow-[0_16px_30px_rgba(var(--mh-cta-rgb),0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_36px_rgba(var(--mh-cta-rgb),0.32)] cursor-pointer"
                  >
                    {opportunity.cta}
                  </a>
                </article>
              );
            })}
          </div>

          {!isLoadingOpportunities && filteredOpportunities.length === 0 ? (
            <div className="mh-card mt-6 rounded-[28px] p-8 text-center">
              <p className="text-xl font-semibold text-[var(--mh-text)]">No direct matches yet.</p>
              <p className="mt-3 text-[var(--mh-text)]/65">Try a broader search or switch filters to discover more roles, events, and programs.</p>
            </div>
          ) : null}
        </section>

        {/* FEATURED */}
        <section id="featured" className="mx-auto max-w-7xl scroll-mt-28 py-10">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--mh-text)]/40">Featured Section</p>
            <h2 className="mh-heading mt-3 text-4xl leading-none sm:text-5xl">Top Opportunities in Focus</h2>
            <p className="mt-4 text-base leading-7 text-[var(--mh-text)]/65 sm:text-lg">A premium shortlist of high-interest openings, live sessions, and freelance work with strong momentum right now.</p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <article className="mh-card rounded-[24px] p-5 sm:rounded-[32px] sm:p-7 lg:col-span-1">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="rounded-full bg-[var(--mh-secondary)]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--mh-secondary)] ring-1 ring-[var(--mh-secondary)]/15">Featured Internships</span>
                <span className="text-sm font-semibold text-[var(--mh-text)]/45">Early career</span>
              </div>
              {featuredInternship ? (
                <>
                  <h3 className="mt-6 text-2xl font-bold tracking-tight text-[var(--mh-text)] sm:text-3xl">{featuredInternship.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--mh-text)]/65">{featuredInternship.description}</p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/65 p-4 ring-1 ring-[var(--mh-text)]/8">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--mh-text)]/35">Duration</p>
                      <p className="mt-2 text-sm font-semibold">{featuredInternship.duration}</p>
                    </div>
                    <div className="rounded-2xl bg-white/65 p-4 ring-1 ring-[var(--mh-text)]/8">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--mh-text)]/35">Level</p>
                      <p className="mt-2 text-sm font-semibold">{featuredInternship.level}</p>
                    </div>
                  </div>
                  <a
                    href={GOOGLE_FORM_URL}
                    className="mt-6 rounded-full bg-[var(--mh-text)] px-5 py-3 text-sm font-bold text-[var(--mh-surface)] transition hover:bg-[var(--mh-secondary)] cursor-pointer"
                  >
                    Apply Now
                  </a>
                </>
              ) : (
                <p className="mt-6 text-sm leading-7 text-[var(--mh-text)]/50">No featured internships available right now.</p>
              )}
            </article>

            <article className="mh-card rounded-[24px] p-5 sm:rounded-[32px] sm:p-7 lg:col-span-1">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="rounded-full bg-[var(--mh-cta)]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--mh-cta)] ring-1 ring-[var(--mh-cta)]/15">Hot Events</span>
                <span className="text-sm font-semibold text-[var(--mh-text)]/45">Live energy</span>
              </div>
              {hotEvent ? (
                <>
                  <h3 className="mt-6 text-2xl font-bold tracking-tight text-[var(--mh-text)] sm:text-3xl">{hotEvent.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--mh-text)]/65">{hotEvent.description}</p>
                  <div className="mt-6 rounded-[24px] bg-[linear-gradient(135deg,rgba(var(--mh-secondary-rgb),0.10),rgba(var(--mh-cta-rgb),0.12))] p-5 ring-1 ring-white/60">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--mh-text)]/40">Next session</p>
                    <p className="mt-2 text-lg font-bold text-[var(--mh-text)]">{hotEvent.dateTime}</p>
                    <p className="mt-2 text-sm text-[var(--mh-text)]/55">Guided session for builders who want practical systems, not theory slides.</p>
                  </div>
                  <a
                    href={GOOGLE_FORM_URL}
                    className="mt-6 rounded-full bg-[var(--mh-cta)] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 cursor-pointer"
                  >
                    Register
                  </a>
                </>
              ) : (
                <p className="mt-6 text-sm leading-7 text-[var(--mh-text)]/50">No hot events scheduled right now.</p>
              )}
            </article>

            <article className="mh-card rounded-[24px] p-5 sm:rounded-[32px] sm:p-7 lg:col-span-1">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="rounded-full bg-[var(--mh-text)]/6 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--mh-text)] ring-1 ring-[var(--mh-text)]/10">High Paying Freelance Gigs</span>
                <span className="text-sm font-semibold text-[var(--mh-text)]/45">Fast turnaround</span>
              </div>
              {highPayingGig ? (
                <>
                  <h3 className="mt-6 text-2xl font-bold tracking-tight text-[var(--mh-text)] sm:text-3xl">{highPayingGig.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--mh-text)]/65">{highPayingGig.description}</p>
                  <div className="mt-6 flex flex-col gap-3 rounded-[24px] bg-white/65 p-5 ring-1 ring-[var(--mh-text)]/8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--mh-text)]/35">Budget Range</p>
                      <p className="mt-2 text-2xl font-bold text-[var(--mh-text)]">{highPayingGig.budget}</p>
                    </div>
                    <p className="text-sm font-semibold text-[var(--mh-text)]/50">{highPayingGig.duration}</p>
                  </div>
                  <a
                    href={GOOGLE_FORM_URL}
                    className="mt-6 rounded-full border border-[var(--mh-text)]/10 bg-white/75 px-5 py-3 text-sm font-bold text-[var(--mh-text)] transition hover:border-[var(--mh-cta)]/30 hover:text-[var(--mh-cta)] cursor-pointer"
                  >
                    Apply
                  </a>
                </>
              ) : (
                <p className="mt-6 text-sm leading-7 text-[var(--mh-text)]/50">No freelance gigs available right now.</p>
              )}
            </article>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-28 py-10">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--mh-text)]/40">How It Works</p>
            <h2 className="mh-heading mt-3 text-4xl leading-none sm:text-5xl">Simple Path to Momentum</h2>
            <p className="mt-4 text-base leading-7 text-[var(--mh-text)]/65 sm:text-lg">The experience is intentionally streamlined so builders can move from discovery to action without friction.</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {steps.map((step, index) => (
              <article key={typeof step === "string" ? step : step.title} className="mh-card rounded-[28px] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--mh-text)] text-sm font-bold text-[var(--mh-surface)]">0{index + 1}</div>
                <h3 className="mt-5 text-xl font-bold text-[var(--mh-text)]">{typeof step === "string" ? step : step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--mh-text)]/60">
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
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--mh-text)]/40">Trust Section</p>
              <h2 className="mh-heading mt-3 text-4xl leading-none sm:text-5xl">Built for Real Builder Outcomes</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--mh-text)]/65 sm:text-lg">
                MistHustlers brings opportunities, projects, and community momentum into one premium ecosystem designed to convert interest into action.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {trustStats.map((stat) => (
                  <div key={stat.label} className="rounded-[24px] bg-white/65 p-5 ring-1 ring-[var(--mh-text)]/8">
                    <p className="text-sm uppercase tracking-[0.2em] text-[var(--mh-text)]/40">{stat.label}</p>
                    <p className="mt-3 text-4xl font-bold tracking-tight text-[var(--mh-text)]">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mh-card rounded-[32px] p-7 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[var(--mh-text)]/40">Ecosystem Signals</p>
                  <h3 className="mt-3 text-2xl font-bold text-[var(--mh-text)]">Logo placeholders</h3>
                </div>
                <span className="rounded-full bg-[var(--mh-secondary)]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--mh-secondary)] ring-1 ring-[var(--mh-secondary)]/15">Growing community</span>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">
                {ecosystemPlaceholders.map((name) => (
                  <div key={name} className="flex min-h-[96px] items-center justify-center rounded-[24px] border border-dashed border-[var(--mh-text)]/14 bg-white/60 px-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-[var(--mh-text)]/45">
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="service-inquiry" className="mx-auto max-w-7xl scroll-mt-28 py-12">
          <TalentApplicationForm selectedOpportunity={null} opportunities={opportunities} />
        </section>
      </main>
    </div>
  );
}

export default Career;
