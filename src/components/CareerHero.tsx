const GOOGLE_FORM_URL = "https://forms.gle/VzBkrQFa5TnhTnrYA";

type Opportunity = {
  id: number;
  title: string;
  type: string;
  description: string;
  skills: string[];
  duration?: string;
  dateTime?: string;
  budget?: string;
  level: string;
  mode: string;
  cta: string;
};

type HeroData = {
  badge?: string;
  title?: string;
  description?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
};

export default function CareerHero({
  hero,
  badgeStyles,
  opportunities,
}: {
  hero: HeroData;
  badgeStyles: Record<string, string>;
  opportunities: Opportunity[];
}) {
  const featuredInternship = opportunities.find((o) => o.type === "Internship") ?? opportunities[0];
  const heroCards = [featuredInternship, ...opportunities.filter((item) => item.id !== featuredInternship?.id)]
    .filter((x): x is Opportunity => !!x)
    .slice(0, 3);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="mx-auto grid max-w-7xl gap-10 pb-14 pt-8 sm:pb-18 sm:pt-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(390px,0.88fr)] lg:items-center lg:gap-14 lg:pt-12">
      <div className="space-y-8">
        <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--mh-text)]/10 bg-[var(--mh-surface)]/90 px-4 py-2 text-sm font-medium text-[var(--mh-text)]/70 shadow-[0_10px_25px_rgba(var(--mh-text-rgb),0.05)]">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--mh-cta)]" />
          {hero.badge || "Live opportunity hub for ambitious builders"}
        </div>

        <div className="space-y-5">
          <h1 className="mh-heading max-w-[760px] text-[clamp(36px,11vw,48px)] leading-[1.02] sm:text-6xl sm:leading-[0.98] lg:text-[clamp(60px,4.2vw,72px)] lg:leading-[0.94]">
            {hero.title || "Opportunities for Builders"}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--mh-text)]/70 sm:text-xl">
            {hero.description || "Explore jobs, internships, events, and programs designed for real-world growth inside the MistHustlers ecosystem."}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => scrollToSection("opportunities")}
            className="rounded-full bg-[var(--mh-text)] px-6 sm:px-7 py-4 text-base font-bold text-[var(--mh-surface)] transition hover:-translate-y-0.5 hover:bg-[var(--mh-secondary)] cursor-pointer"
          >
            {hero.ctaPrimary || "Explore Opportunities"}
          </button>
          <a
            href={GOOGLE_FORM_URL}
            className="rounded-full border border-[var(--mh-text)]/12 bg-[var(--mh-surface)] px-6 sm:px-7 py-4 text-center text-base font-bold text-[var(--mh-text)] shadow-[0_12px_24px_rgba(var(--mh-text-rgb),0.06)] transition hover:-translate-y-0.5 hover:border-[var(--mh-cta)]/30 hover:text-[var(--mh-cta)] cursor-pointer"
          >
            {hero.ctaSecondary || "Join Now"}
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="mh-card rounded-[28px] p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--mh-text)]/40">Active Listings</p>
            <p className="mt-3 text-3xl font-bold text-[var(--mh-text)]">{opportunities.length}</p>
          </div>
          <div className="mh-card rounded-[28px] p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--mh-text)]/40">Opportunity Types</p>
            <p className="mt-3 text-3xl font-bold text-[var(--mh-text)]">{new Set(opportunities.map((o) => o.type)).size}</p>
          </div>
          <div className="mh-card rounded-[28px] p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-[var(--mh-text)]/40">Single CTA Path</p>
            <p className="mt-3 text-3xl font-bold text-[var(--mh-text)]">1 form</p>
          </div>
        </div>
      </div>

      <div className="career-card-stage perspective-3d relative grid gap-4 lg:block lg:min-h-[520px]">
        {heroCards.map((card, index) => (
          <article
            key={card.id}
            style={{ "--career-card-index": index } as React.CSSProperties}
            className={`career-hero-card rounded-[24px] border border-white/60 bg-[var(--mh-surface)]/95 p-5 shadow-[0_24px_60px_rgba(var(--mh-text-rgb),0.12)] backdrop-blur lg:absolute lg:w-[86%] lg:rounded-[30px] lg:p-6 ${
              index === 0
                ? "career-hero-card--primary lg:left-[1%] lg:top-[4%]"
                : index === 1
                  ? "career-hero-card--secondary lg:right-[1%] lg:top-[29%]"
                  : "career-hero-card--tertiary lg:left-[10%] lg:bottom-[1%]"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${badgeStyles[card.type] || ""}`}>
                {card.type}
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--mh-text)]/35">{card.mode}</span>
            </div>
            <h2 className="mt-5 text-xl font-bold text-[var(--mh-text)] sm:text-2xl">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--mh-text)]/65">{card.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {card.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-[var(--mh-text)]/70 ring-1 ring-[var(--mh-text)]/8">
                  {skill}
                </span>
              ))}
              {card.skills.length > 3 ? (
                <span className="rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-[var(--mh-text)]/55 ring-1 ring-[var(--mh-text)]/8">
                  +{card.skills.length - 3}
                </span>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
