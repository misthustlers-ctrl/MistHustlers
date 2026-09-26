import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import AEOBlock from "@/components/AEOBlock";
import { Link } from "react-router-dom";

const AUTOMATION_AEO = {
  definition: {
    term: "AI Automation Agency",
    definition:
      "An AI automation agency builds software systems that automate repetitive business processes using artificial intelligence and workflow automation tools. This includes lead qualification, CRM data synchronization, WhatsApp/email automation, document processing, and custom AI agents that integrate with existing business tools.",
  },
  executiveSummary:
    "MistHustlers is a global AI automation partner helping businesses eliminate manual work across 7 countries. From our Indore HQ, we build custom workflow automation, AI chatbots, WhatsApp automation, CRM integrations, and AI agents for clients in the US, UK, Canada, Australia, UAE, and Singapore. Fixed pricing from ₹14,999. Founder-led delivery with direct access to Naveen Salve.",
  keyTakeaways: [
    "MistHustlers serves clients across 7 countries (US, UK, Canada, Australia, UAE, Singapore, India) from our Indore HQ.",
    "Basic Automation from ₹14,999. Business Automation from ₹29,999. AI Automation from ₹49,999. Advanced AI Agent from ₹99,999. Fixed pricing, 48-hour quotes.",
    "We build with n8n, Make.com, Zapier, custom Node.js, OpenAI API, WhatsApp Business API, and CRM APIs (HubSpot, Salesforce, Pipedrive).",
    "Direct founder communication with Naveen Salve — no account managers. Async-first across US, UK, EU, APAC timezones.",
    "100% source code ownership. You own the automation logic, credentials, and data. No vendor lock-in.",
  ],
  processSteps: [
    { step: 1, title: "Process Audit", description: "We map your current workflows, identify high-ROI automation candidates, and estimate time savings.", duration: "2–3 days" },
    { step: 2, title: "Architecture", description: "We design the automation flow, select tools (n8n/custom code), and define triggers, actions, and error handling.", duration: "2–3 days" },
    { step: 3, title: "Build & Test", description: "We build the automation, test with your real data, and iterate until it handles edge cases reliably.", duration: "1–3 weeks" },
    { step: 4, title: "Deploy & Monitor", description: "We deploy to your cloud (or ours), set up monitoring/alerting, and provide 30 days support + documentation.", duration: "Ongoing" },
  ],
  comparisonRows: [
    { feature: "Fixed Price Automation", mistHustlers: true, freelancer: false, bigAgency: false },
    { feature: "Custom Code + No-Code Hybrid", mistHustlers: true, freelancer: "Sometimes", bigAgency: false },
    { feature: "Source Code Ownership", mistHustlers: true, freelancer: "Sometimes", bigAgency: false },
    { feature: "AI Agent Development", mistHustlers: true, freelancer: false, bigAgency: true },
    { feature: "Global Timezone Support", mistHustlers: true, freelancer: false, bigAgency: true },
    { feature: "Post-Launch Monitoring", mistHustlers: true, freelancer: false, bigAgency: "Extra Cost" },
  ],
  prosAndCons: [
    { type: "pro", text: "Fixed transparent pricing — no surprise invoices" },
    { type: "pro", text: "Direct communication with senior engineer, not a sales team" },
    { type: "pro", text: "Source code and full automation logic ownership" },
    { type: "pro", text: "Hybrid approach: custom code for complexity, no-code for speed" },
    { type: "pro", text: "Global timezone coverage — US, UK, EU, APAC hours available" },
    { type: "con", text: "Not suitable for enterprise RPA requiring 50+ bot orchestration" },
    { type: "con", text: "Focused on web/SaaS automation — not legacy mainframe integration" },
  ],
  misconceptions: [
    {
      myth: "AI automation requires expensive enterprise platforms (UiPath, Automation Anywhere).",
      reality: "Modern automation stacks (n8n, custom Node.js, OpenAI API) deliver enterprise-grade results at a fraction of the cost. MistHustlers uses the right tool for each job — custom code for complex logic, no-code for speed.",
    },
    {
      myth: "You need to be technical to maintain automations.",
      reality: "MistHustlers builds with visual workflow builders (n8n) where possible, so your team can modify triggers/actions without code. We provide video walkthroughs and documentation for every automation.",
    },
  ],
};

const AUTOMATION_FAQ = [
  {
    q: "What is AI automation?",
    a: "AI automation combines workflow automation (connecting tools via triggers/actions) with artificial intelligence (LLMs for classification, summarization, generation, extraction). It handles tasks that previously required human judgment — like qualifying leads, drafting replies, or extracting data from documents.",
  },
  {
    q: "How much does AI automation cost?",
    a: "Basic Automation (1–2 tools): ₹14,999. Business Automation (3–5 workflows): ₹29,999. AI Automation (custom AI agents, RAG): ₹49,999. Advanced AI Agent (multi-agent, fine-tuning): ₹99,999+. Fixed pricing, 48-hour quotes.",
  },
  {
    q: "What tools do you use for automation?",
    a: "We use n8n (self-hosted workflow automation), custom Node.js/TypeScript for complex logic, OpenAI/Claude APIs for AI, WhatsApp Business API, and native integrations with HubSpot, Salesforce, Pipedrive, Google Sheets, Slack, Notion, and 100+ other tools.",
  },
  {
    q: "Can you automate WhatsApp for lead qualification?",
    a: "Yes. We build WhatsApp Business API integrations that auto-reply to inquiries, qualify leads via AI chatbot, sync to your CRM, and notify your team — all within seconds of the first message.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. We serve clients in the US, UK, Canada, Australia, UAE, Singapore, and India. Async-first communication via WhatsApp, email, and Google Meet. We cover US Eastern, UK, EU, and APAC business hours.",
  },
  {
    q: "Who owns the automation after delivery?",
    a: "You do. 100% source code, workflow definitions, API credentials, and documentation are handed over. You can self-host, modify, or migrate anytime. No vendor lock-in.",
  },
  {
    q: "What if the automation breaks?",
    a: "We include 30 days of monitoring and bug support post-launch. We set up error alerting (Slack/email) so issues are caught immediately. Extended support plans available.",
  },
  {
    q: "Can you integrate with our existing CRM?",
    a: "Yes. We have native integrations with HubSpot, Salesforce, Pipedrive, Close, Attio, and custom CRMs via REST/GraphQL APIs. We can sync leads, deals, contacts, and custom fields bidirectionally.",
  },
];

export default function Automation() {
  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="automation" />
      <SchemaMarkup page="automation" faq={AUTOMATION_FAQ} />
      <Breadcrumbs />
      <main>
        <section className="pt-12 sm:pt-16 pb-16 sm:pb-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
                Service
              </span>
              <h1 className="font-display text-[clamp(38px,12vw,80px)] leading-[0.92] tracking-[0.02em] text-abyssal-ink">
                AI & Automation<br />
                <span className="text-digital-orange">for Global Businesses</span>
              </h1>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                Automate workflows, integrate AI pipelines, and eliminate manual operations. Built for businesses worldwide from our Indore HQ.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { title: "Workflow Automation", desc: "Automate repetitive tasks, email sequences, data entry, and report generation using modern automation tools." },
                { title: "AI Chatbots", desc: "Custom AI assistants for customer support, lead qualification, and internal knowledge base queries." },
                { title: "Data Pipelines", desc: "Automated data collection, transformation, and reporting pipelines connected to your existing tools." },
                { title: "CRM Integration", desc: "Connect and automate your CRM workflows with custom integrations and trigger-based actions." },
                { title: "WhatsApp Automation", desc: "Automated lead qualification, appointment booking, and customer support via WhatsApp Business API." },
                { title: "AI Agents", desc: "Custom AI agents for research, content generation, data extraction, and decision support." },
              ].map((s) => (
                <div key={s.title} className="bg-ash-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 border border-abyssal-ink/5">
                  <h3 className="font-body font-bold text-xl tracking-[0.01em] text-abyssal-ink mb-3">{s.title}</h3>
                  <p className="text-sm text-abyssal-ink/60 font-body leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-16">
              <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink mb-4">Ready to Automate?</h2>
              <p className="text-abyssal-ink/50 mb-8 font-body">Tell us about your workflow. We'll build a custom automation solution.</p>
              <Link to="/contact" className="inline-flex min-h-12 items-center justify-center magnetic-btn bg-digital-orange text-white px-6 sm:px-8 py-4 rounded-[800px] text-base font-semibold font-body">
                Get a Quote
              </Link>
            </div>

            <AEOBlock {...AUTOMATION_AEO} />

            <div id="inquiry-form">
              <ServiceInquiryForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}