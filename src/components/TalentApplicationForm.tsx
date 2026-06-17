import { useState } from "react";

type Opportunity = {
  id: number;
  title: string;
  type: string;
  description: string;
  skills: string[];
  duration?: string;
  level: string;
  mode: string;
};

const DEFAULT_FORM_STATE = {
  name: "",
  email: "",
  area: "Builder Opportunity",
  opportunity: "General MistHustlers Opportunity",
  portfolio: "",
  message: "Hi MistHustlers team, I would love to explore a relevant opportunity and learn the next steps.",
};

export default function TalentApplicationForm({
  selectedOpportunity,
  opportunities,
}: {
  selectedOpportunity: Opportunity | null;
  opportunities: { id: number; title: string; type: string }[];
}) {
  const [formState, setFormState] = useState(DEFAULT_FORM_STATE);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const submitApplication = async (data: typeof DEFAULT_FORM_STATE) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const rawPortfolio = data.portfolio.trim();
      const portfolioUrl = rawPortfolio && !/^https?:\/\//i.test(rawPortfolio)
        ? `https://${rawPortfolio}`
        : rawPortfolio;

      const response = await fetch("/api/applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: selectedOpportunity?.id ?? opportunities[0]?.id,
          name: data.name.trim(),
          email: data.email.trim(),
          resumeUrl: portfolioUrl || undefined,
          coverLetter: [
            `Interest area: ${data.area}`,
            `Opportunity: ${data.opportunity}`,
            "",
            data.message,
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
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Application could not be submitted");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitApplication(formState);
  };

  const focusInquiry = () => {
    document.getElementById("service-inquiry")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleApply = (opportunity?: Opportunity) => {
    if (opportunity) {
      setFormState((current) => ({
        ...current,
        area: opportunity.type,
        opportunity: opportunity.title,
        message: current.message === DEFAULT_FORM_STATE.message
          ? `Hi MistHustlers team, I am interested in the ${opportunity.title} opportunity. Please share the next steps for applying.`
          : current.message,
      }));
    }
    setIsSubmitted(false);
    setSubmitError("");
    focusInquiry();
  };

  return (
    <div className="overflow-hidden rounded-[26px] border border-white/55 bg-[linear-gradient(135deg,rgba(var(--mh-surface-rgb),0.96),rgba(var(--mh-surface-rgb),0.88))] shadow-[0_30px_80px_rgba(var(--mh-text-rgb),0.10)] sm:rounded-[40px]">
      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border-b border-[var(--mh-text)]/8 p-5 sm:p-7 md:p-10 lg:border-b-0 lg:border-r">
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--mh-text)]/40">Final CTA</p>
          <h2 className="mh-heading mt-3 text-4xl leading-none sm:text-5xl lg:text-6xl">
            Start Your Journey Today
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-[var(--mh-text)]/68 sm:text-lg">
            One inquiry form powers every application. Submit your intent, links, and builder profile to enter the MistHustlers opportunity pipeline.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => handleApply()}
              className="rounded-full bg-[var(--mh-cta)] px-6 py-4 text-base font-bold text-white shadow-[0_18px_34px_rgba(var(--mh-cta-rgb),0.26)] transition hover:-translate-y-0.5 cursor-pointer"
            >
              Apply Now
            </button>
            <button
              type="button"
              onClick={() => handleApply()}
              className="rounded-full border border-[var(--mh-text)]/12 bg-white/70 px-6 py-4 text-base font-bold text-[var(--mh-text)] transition hover:border-[var(--mh-secondary)]/25 hover:text-[var(--mh-secondary)] cursor-pointer"
            >
              Join MistHustlers
            </button>
          </div>

          <div className="mt-8 rounded-[22px] bg-[var(--mh-text)] p-5 text-[var(--mh-surface)] shadow-[0_24px_48px_rgba(var(--mh-text-rgb),0.16)] sm:rounded-[28px] sm:p-6">
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

        <div className="p-5 sm:p-7 md:p-10">
          <div className="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-[var(--mh-text)]/40">Inquiry Form</p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-[var(--mh-text)] sm:text-3xl">Apply via #service-inquiry</h3>
            </div>
            <span className="rounded-full bg-[var(--mh-secondary)]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--mh-secondary)] ring-1 ring-[var(--mh-secondary)]/15">
              Curated intake
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[var(--mh-text)]/70">Full Name</span>
                <input
                  id="applicant-name"
                  value={formState.name}
                  onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Your name"
                  className="w-full rounded-[20px] border border-[var(--mh-text)]/10 bg-white/75 px-4 py-3.5 text-[var(--mh-text)] placeholder:text-[var(--mh-text)]/35 focus:border-[var(--mh-secondary)]/30 focus:outline-none"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[var(--mh-text)]/70">Email</span>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
                  placeholder="you@example.com"
                  className="w-full rounded-[20px] border border-[var(--mh-text)]/10 bg-white/75 px-4 py-3.5 text-[var(--mh-text)] placeholder:text-[var(--mh-text)]/35 focus:border-[var(--mh-secondary)]/30 focus:outline-none"
                  required
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[var(--mh-text)]/70">Interest Area</span>
                <input
                  value={formState.area}
                  onChange={(event) => setFormState((current) => ({ ...current, area: event.target.value }))}
                  placeholder="Job, event, program..."
                  className="w-full rounded-[20px] border border-[var(--mh-text)]/10 bg-white/75 px-4 py-3.5 text-[var(--mh-text)] placeholder:text-[var(--mh-text)]/35 focus:border-[var(--mh-secondary)]/30 focus:outline-none"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[var(--mh-text)]/70">Opportunity</span>
                <input
                  value={formState.opportunity}
                  onChange={(event) => setFormState((current) => ({ ...current, opportunity: event.target.value }))}
                  placeholder="Opportunity title"
                  className="w-full rounded-[20px] border border-[var(--mh-text)]/10 bg-white/75 px-4 py-3.5 text-[var(--mh-text)] placeholder:text-[var(--mh-text)]/35 focus:border-[var(--mh-secondary)]/30 focus:outline-none"
                  required
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[var(--mh-text)]/70">Portfolio / LinkedIn / Relevant Link</span>
              <input
                value={formState.portfolio}
                onChange={(event) => setFormState((current) => ({ ...current, portfolio: event.target.value }))}
                placeholder="https://"
                className="w-full rounded-[20px] border border-[var(--mh-text)]/10 bg-white/75 px-4 py-3.5 text-[var(--mh-text)] placeholder:text-[var(--mh-text)]/35 focus:border-[var(--mh-secondary)]/30 focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[var(--mh-text)]/70">Why are you a fit?</span>
              <textarea
                value={formState.message}
                onChange={(event) => setFormState((current) => ({ ...current, message: event.target.value }))}
                rows={6}
                placeholder="Tell the team why this opportunity fits your goals."
                className="w-full rounded-[24px] border border-[var(--mh-text)]/10 bg-white/75 px-4 py-4 text-[var(--mh-text)] placeholder:text-[var(--mh-text)]/35 focus:border-[var(--mh-secondary)]/30 focus:outline-none"
                required
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-[var(--mh-cta)] px-6 py-4 text-base font-bold text-white shadow-[0_16px_30px_rgba(var(--mh-cta-rgb),0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_36px_rgba(var(--mh-cta-rgb),0.30)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
              <p className="text-sm leading-6 text-[var(--mh-text)]/55">
                Every application is routed through one premium intake flow for faster shortlisting.
              </p>
            </div>

            {isSubmitted && !submitError ? (
              <div className="rounded-[24px] border border-[var(--mh-secondary)]/15 bg-[var(--mh-secondary)]/8 px-5 py-4 text-sm font-medium leading-7 text-[var(--mh-text)]">
                Submitted successfully. Your application has been saved and the MistHustlers team has received an email notification.
              </div>
            ) : null}

            {submitError ? (
              <div className="flex items-center gap-[12px] rounded-[24px] px-5 py-4 text-sm font-medium leading-7" style={{ backgroundColor: "color-mix(in srgb, var(--mh-cta) 10%, transparent)", color: "var(--mh-text)" }}>
                <span className="flex-1">{submitError}</span>
                <button
                  type="button"
                  onClick={() => submitApplication(formState)}
                  className="text-[13px] font-[650] px-[14px] py-[6px] rounded-[10px] cursor-pointer"
                  style={{ backgroundColor: "var(--mh-cta)", color: "white" }}
                >
                  Retry
                </button>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
