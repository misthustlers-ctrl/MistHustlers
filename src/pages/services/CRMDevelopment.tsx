import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import TrustSection from "@/components/TrustSection";
import AEOBlock from "@/components/AEOBlock";
import { Database } from "lucide-react";

const FAQS = [
  {
    question: "Why choose custom CRM development over off-the-shelf software like Salesforce or HubSpot?",
    answer: "Off-the-shelf CRMs charge expensive monthly per-user licenses and force you to adapt your business processes to their rigid system. A custom CRM built by MistHustlers is tailored 100% to your workflow with zero monthly license fees per user.",
  },
];

export default function CRMDevelopment() {
  return (
    <>
      <SEO page="crmDevelopment" />
      <SchemaMarkup page="crmDevelopment" faq={FAQS} />

      <main id="main-content" className="bg-basalt-canvas min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Services", to: "/services" }, { label: "CRM & CMS Development" }]} />

          <section className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-digital-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-digital-orange font-body">
                <Database className="h-4 w-4" /> Custom CRM & Dashboard Agency Indore
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-abyssal-ink leading-tight">
                Custom CRM & Internal Portal Development
              </h1>
              <p className="text-base sm:text-lg text-abyssal-ink/70 font-body leading-relaxed">
                Streamline customer management, lead pipelines, staff tasks, and business reporting with custom-engineered CRM systems, CMS admin panels, and operational dashboards.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 font-body">
                <a href="#quote" className="magnetic-btn bg-digital-orange text-white px-7 py-3.5 rounded-full font-bold text-sm">
                  Request CRM Consultation
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-3xl border border-abyssal-ink/10 bg-white p-6 shadow-xl">
              <h3 className="font-display text-xl font-bold text-abyssal-ink mb-4">Request CRM Estimate</h3>
              <ServiceInquiryForm preselectedPackage="Business Growth Website" />
            </div>
          </section>

          {/* AEO Structured Answer Block */}
          <section className="mt-16">
            <AEOBlock
              definition={{
                term: "CRM Development",
                definition:
                  "CRM (Customer Relationship Management) development is the design and build of custom software that centralises customer data, lead pipelines, staff tasks, and reporting for a business. Unlike off-the-shelf CRMs, a custom CRM is tailored 100% to existing workflows with no per-user licence models.",
              }}
              executiveSummary="MistHustlers builds custom CRM systems, CMS admin panels, and internal dashboards in Indore — tailored to your business process with no per-user licence fees. A custom CRM (₹29,999+) replaces generic SaaS tools like Salesforce or HubSpot with your exact workflows, automated lead routing, and reporting, with full source code ownership."
              keyTakeaways={[
                "Custom CRMs start at ₹29,999+ with no recurring per-user licence fees.",
                "Tailored to your workflow — not your business adapting to a rigid SaaS tool.",
                "Integrates with WhatsApp, Gmail, website forms, and payment gateways.",
                "Full source code and data ownership — no vendor lock-in.",
              ]}
              processSteps={[
                { step: 1, title: "Process Audit", description: "We map how leads, customers, and tasks actually flow through your business today.", duration: "2-3 days" },
                { step: 2, title: "Schema & Data Model", description: "Define the databases, entities, roles, and permissions for your exact operational model.", duration: "2-4 days" },
                { step: 3, title: "Build Core Modules", description: "Lead pipelines, customer profiles, task boards, and automated notifications.", duration: "7-14 days" },
                { step: 4, title: "Integrations", description: "WhatsApp API, email, payment gateways, and website form sync wired in.", duration: "3-7 days" },
                { step: 5, title: "Dashboard, QA & Launch", description: "Role-based dashboards, analytics, and team calendar go live together.", duration: "3-7 days" },
              ]}
              comparisonRows={[
                { feature: "Priced for your workflow, not per seat", misthustlers: true, freelancer: "Varies", bigAgency: false },
                { feature: "No monthly SaaS licence fees", misthustlers: true, freelancer: true, bigAgency: false },
                { feature: "WhatsApp & web form integration", misthustlers: true, freelancer: true, bigAgency: true },
                { feature: "Custom reporting built for you", misthustlers: true, freelancer: false, bigAgency: "₹ Extra" },
                { feature: "Source code ownership", misthustlers: true, freelancer: "Varies", bigAgency: false },
                { feature: "Ongoing support", misthustlers: true, freelancer: false, bigAgency: "₹₹₹ Extra" },
              ]}
              prosAndCons={[
                { type: "pro", text: "Software shaped around your team instead of training them around a tool" },
                { type: "pro", text: "Zero recurring per-user licence cost — one fixed build fee" },
                { type: "pro", text: "Your data lives in a database you own" },
                { type: "pro", text: "WhatsApp-native lead capture keeps sales moving instantly" },
                { type: "con", text: "Custom builds need clear requirements; expect a discovery phase" },
                { type: "con", text: "Ongoing feature changes are scoped separately" },
              ]}
              misconceptions={[
                {
                  myth: "Custom CRM software is affordable only for big enterprises.",
                  reality: "MistHustlers builds business-grade CRMs from ₹29,999+, and because you own the code there are no monthly 'per user' licence costs multiplying across your team.",
                },
                {
                  myth: "Off-the-shelf CRMs like Salesforce are cheaper in the long run.",
                  reality: "A 10-user HubSpot/Salesforce licence easily exceeds ₹2-4 lakh a year. A custom CRM typically pays back in under 12 months — and adapts to your growth, not the other way around.",
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
