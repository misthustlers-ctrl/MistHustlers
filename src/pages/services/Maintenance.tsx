import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import TrustSection from "@/components/TrustSection";
import AEOBlock from "@/components/AEOBlock";
import { Wrench } from "lucide-react";

const FAQS = [
  {
    question: "What is included in website maintenance?",
    answer: "Our maintenance package includes weekly security scans, automated off-site backups, speed optimization, core software updates, uptime monitoring, and priority technical support.",
  },
];

export default function Maintenance() {
  return (
    <>
      <SEO page="maintenance" />
      <SchemaMarkup page="maintenance" faq={FAQS} />

      <main id="main-content" className="bg-basalt-canvas min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Services", to: "/services" }, { label: "Website Maintenance" }]} />

          <section className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-digital-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-digital-orange font-body">
                <Wrench className="h-4 w-4" /> Website Maintenance & Speed Optimization
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-abyssal-ink leading-tight">
                24/7 Website Maintenance & Performance Support
              </h1>
              <p className="text-base sm:text-lg text-abyssal-ink/70 font-body leading-relaxed">
                Ensure maximum uptime, peak page speed, zero security vulnerabilities, and continuous Core Web Vitals compliance for your business website.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 font-body">
                <a href="#quote" className="magnetic-btn bg-digital-orange text-white px-7 py-3.5 rounded-full font-bold text-sm">
                  Get Maintenance Plan
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-3xl border border-abyssal-ink/10 bg-white p-6 shadow-xl">
              <h3 className="font-display text-xl font-bold text-abyssal-ink mb-4">Request Maintenance Support</h3>
              <ServiceInquiryForm preselectedPackage="Business Starter Website" />
            </div>
          </section>

          {/* AEO Structured Answer Block */}
          <section className="mt-16">
            <AEOBlock
              definition={{
                term: "Website Maintenance",
                definition:
                  "Website maintenance is the ongoing work that keeps a site secure, fast, and error-free after launch: security monitoring and updates, automated backups, performance and Core Web Vitals checks, uptime monitoring, bug fixes, and priority technical support.",
              }}
              executiveSummary="MistHustlers offers 24/7 website maintenance and page speed optimisation packages for Indore and India, covering security scans, automated off-site backups, uptime monitoring, and Core Web Vitals fixes. Sites under MistHustlers maintenance stay secure and fast, with priority technical support and monthly performance reports — without the big-agency retainer prices."
              keyTakeaways={[
                "Maintenance keeps websites secure, fast, and bug-free — downtime and hacks cost real revenue.",
                "Every MistHustlers package includes weekly security scans, nightly backups, uptime monitoring, and speed optimisation.",
                "A well-optimised Core Web Vitals profile (LCP < 2.5s) retains traffic and protects Google rankings.",
                "Maintenance costs far less than a crash-response: prevention beats emergency rebuilds.",
              ]}
              processSteps={[
                { step: 1, title: "Audit & Baseline", description: "We baseline your site's security posture, backups, uptime history, and Core Web Vitals scores.", duration: "Day 1" },
                { step: 2, title: "Security Hardening", description: "Core/software updates, malware scans, and firewall rules applied risk-free.", duration: "Weekly" },
                { step: 3, title: "Automated Backups & Uptime Monitoring", description: "Nightly off-site backups and 24/7 uptime alerts as best failover posture.", duration: "Continuous" },
                { step: 4, title: "Performance Optimisation", description: "Image/font/asset optimisation, caching, and Core Web Vitals tuning at regular intervals.", duration: "Monthly" },
                { step: 5, title: "Priority Support & Reports", description: "Bug fixes and a monthly performance report with what's changed and next actions.", duration: "Ongoing" },
              ]}
              comparisonRows={[
                { feature: "24/7 uptime monitoring", misthustlers: true, freelancer: false, bigAgency: "₹ Extra" },
                { feature: "Nightly off-site backups", misthustlers: true, freelancer: "Manual", bigAgency: true },
                { feature: "Weekly security scans", misthustlers: true, freelancer: false, bigAgency: true },
                { feature: "Core Web Vitals optimisation", misthustlers: true, freelancer: "Varies", bigAgency: "₹ Extra" },
                { feature: "Priority response window", misthustlers: true, freelancer: "Depends", bigAgency: false },
                { feature: "Transparent fixed monthly fee", misthustlers: true, freelancer: true, bigAgency: false },
              ]}
              prosAndCons={[
                { type: "pro", text: "Prevents revenue-thinning downtime and hack cleanups" },
                { type: "pro", text: "Keeps Google rankings by maintaining Core Web Vitals and uptime" },
                { type: "pro", text: "Nightly off-site backups mean no fear of data loss" },
                { type: "pro", text: "One transparent monthly fee, no surprise invoices" },
                { type: "con", text: "Recommended for sites that drive real business — not static one-pagers" },
                { type: "con", text: "Optional for hobby pages without customer contact" },
              ]}
              misconceptions={[
                {
                  myth: "Once you launch, your website doesn't need maintenance.",
                  reality: "Plugins and themes become attack surfaces, hosting platforms and frameworks release security patches constantly. Sites left unmaintained get slower, break, or get hacked — and cleanup costs far more than prevention.",
                },
                {
                  myth: "Maintenance is optional for search rankings.",
                  reality: "Google's Core Web Vitals directly influence rankings. Speed and uptime degrade naturally (logs, database bloat, new integrations). Continuous optimisation is what keeps a page-1 site on page 1.",
                },
              ]}
            />
          </section>

          <div id="quote" className="mt-16">
            <TrustSection />
          </div>
        </div>
      </main>
    </>
  );
}
