import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";

export default function AuthPage() {
  return (
    <>
      <SEO
        page="home"
        robots="noindex, follow"
        overrides={{
          title: "Client Portal Access | MistHustlers",
          description: "MistHustlers client portal access is currently handled manually. Contact the team for project updates, SEO reports, invoices, and support.",
          canonical: "https://www.misthustlers.in/login",
        }}
      />

      <main id="main-content" className="min-h-screen bg-basalt-canvas pt-28 pb-16 font-body">
        <section className="mx-auto max-w-[960px] px-4 sm:px-6">
          <div className="rounded-3xl border border-abyssal-ink/10 bg-white p-6 shadow-xl sm:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-digital-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-digital-orange">
              <ShieldCheck className="h-3.5 w-3.5" /> Client Access
            </span>

            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-abyssal-ink sm:text-5xl">
              Google sign-in is not active yet
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-abyssal-ink/65 sm:text-base">
              We do not have live Google OAuth connected on this website right now. Client updates, SEO audit reports, invoices, and project files are currently shared directly through email and WhatsApp.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Project updates", "Shared directly through WhatsApp or email."],
                ["Reports", "SEO and project documents are sent manually."],
                ["Invoices", "Billing details are shared after project confirmation."],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl bg-ash-white p-4">
                  <h2 className="text-sm font-bold text-abyssal-ink">{title}</h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-abyssal-ink/55">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://wa.me/918889937648?text=Hi%20MistHustlers%2C%20I%20need%20client%20portal%20or%20project%20support."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-digital-orange px-6 py-3 text-sm font-bold text-white"
              >
                Contact on WhatsApp <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="mailto:misthustlers@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-abyssal-ink/15 px-6 py-3 text-sm font-bold text-abyssal-ink hover:bg-ash-white"
              >
                <Mail className="h-4 w-4" /> Email Support
              </a>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-abyssal-ink/15 px-6 py-3 text-sm font-bold text-abyssal-ink hover:bg-ash-white"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
