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

export default function TalentApplicationForm({
  selectedOpportunity,
  opportunities,
}: {
  selectedOpportunity: Opportunity | null;
  opportunities: { id: number; title: string; type: string }[];
}) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    area: "Builder Opportunity",
    opportunity: "General MistHustlers Opportunity",
    portfolio: "",
    message: "Hi MistHustlers team, I would love to explore a relevant opportunity and learn the next steps.",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);
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
        message: current.message === "Hi MistHustlers team, I would love to explore a relevant opportunity and learn the next steps."
          ? `Hi MistHustlers team, I am interested in the ${opportunity.title} opportunity. Please share the next steps for applying.`
          : current.message,
      }));
    }
    setIsSubmitted(false);
    focusInquiry();
  };

  return (
    <div className="overflow-hidden rounded-[40px] border border-white/55 bg-[linear-gradient(135deg,rgba(247,246,242,0.96),rgba(247,246,242,0.88))] shadow-[0_30px_80px_rgba(7,6,7,0.10)]">
      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border-b border-[#070607]/8 p-7 md:p-10 lg:border-b-0 lg:border-r">
          <p className="text-sm uppercase tracking-[0.22em] text-[#070607]/40">Final CTA</p>
          <h2 className="mh-heading mt-3 text-4xl leading-none sm:text-5xl lg:text-6xl">
            Start Your Journey Today
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#070607]/68 sm:text-lg">
            One inquiry form powers every application. Submit your intent, links, and builder profile to enter the MistHustlers opportunity pipeline.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => handleApply()}
              className="rounded-full bg-[#fc5000] px-6 py-4 text-base font-bold text-white shadow-[0_18px_34px_rgba(252,80,0,0.26)] transition hover:-translate-y-0.5 cursor-pointer"
            >
              Apply Now
            </button>
            <button
              type="button"
              onClick={() => handleApply()}
              className="rounded-full border border-[#070607]/12 bg-white/70 px-6 py-4 text-base font-bold text-[#070607] transition hover:border-[#524ae9]/25 hover:text-[#524ae9] cursor-pointer"
            >
              Join MistHustlers
            </button>
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
            <span className="rounded-full bg-[#524ae9]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#524ae9] ring-1 ring-[#524ae9]/15">
              Curated intake
            </span>
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
                className="rounded-full bg-[#fc5000] px-6 py-4 text-base font-bold text-white shadow-[0_16px_30px_rgba(252,80,0,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_36px_rgba(252,80,0,0.30)] cursor-pointer"
              >
                Submit Application
              </button>
              <p className="text-sm leading-6 text-[#070607]/55">
                Every application is routed through one premium intake flow for faster shortlisting.
              </p>
            </div>

            {isSubmitted ? (
              <div className="rounded-[24px] border border-[#524ae9]/15 bg-[#524ae9]/8 px-5 py-4 text-sm font-medium leading-7 text-[#070607]">
                Thanks &mdash; your inquiry has been staged for review. The MistHustlers team can now shortlist you for the selected opportunity.
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
