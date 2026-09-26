import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import AEOBlock from "@/components/AEOBlock";
import { Link } from "react-router-dom";

const AI_AEO = {
  definition: {
    term: "AI Development Company",
    definition:
      "An AI development company builds software systems that incorporate artificial intelligence and machine learning capabilities. This includes: LLM integration (GPT, Claude, Llama), custom AI agents, RAG (Retrieval-Augmented Generation) systems, chatbots, document processing, computer vision, predictive analytics, and custom model fine-tuning.",
  },
  executiveSummary:
    "MistHustlers is a global AI development partner building intelligent software systems for businesses worldwide. From our Indore HQ, we ship production-grade AI applications for clients across 7 countries. We build: custom AI agents, RAG systems, LLM-powered chatbots, document intelligence, semantic search, and custom model fine-tuning. Fixed pricing from $199/£159/€180/₹19,999. Full source code ownership. Founder-led delivery.",
  keyTakeaways: [
    "MistHustlers serves clients across 7 countries (US, UK, Canada, Australia, UAE, Singapore, India) from our Indore HQ.",
    "AI prototypes from $199/£159/€180/₹19,999. Production AI systems from $999/£799/€900/₹99,999. Fixed pricing, 48-hour quotes.",
    "Tech stack: OpenAI/Claude/Llama APIs, LangChain, LangGraph, Pinecone/Weaviate, PostgreSQL, Next.js, Python.",
    "Direct founder communication with Naveen Salve throughout — no account managers.",
    "100% source code ownership, full IP rights, complete documentation handed over at launch.",
  ],
  processSteps: [
    { step: 1, title: "AI Strategy & Use Case Definition", description: "We identify high-ROI AI use cases, define success metrics, and choose the right model/approach (API vs fine-tuning vs RAG).", duration: "1 week" },
    { step: 2, title: "Data Preparation & RAG Setup", description: "We prepare your data, build vector indexes, design retrieval pipelines, and implement evaluation frameworks.", duration: "1–2 weeks" },
    { step: 3, title: "AI System Development", description: "We build agents, chains, prompts, evaluation loops, guardrails, and integrate with your existing systems.", duration: "3–8 weeks" },
    { step: 4, title: "Evaluation & Launch", description: "We run automated evals, human review, A/B testing, set up monitoring, and deploy with guardrails.", duration: "1–2 weeks" },
  ],
  comparisonRows: [
    { feature: "Fixed Price AI", mistHustlers: true, freelancer: false, bigAgency: false },
    { feature: "Source Code Ownership", mistHustlers: true, freelancer: "Sometimes", bigAgency: false },
    { feature: "RAG + Agent Expertise", mistHustlers: true, freelancer: "Sometimes", bigAgency: true },
    { feature: "Evaluation/Guardrails", mistHustlers: true, freelancer: false, bigAgency: true },
    { feature: "Global Timezone Coverage", mistHustlers: true, freelancer: false, bigAgency: true },
    { feature: "Post-Launch Monitoring", mistHustlers: true, freelancer: false, bigAgency: "Extra Cost" },
  ],
  prosAndCons: [
    { type: "pro", text: "Fixed transparent pricing — no surprise invoices" },
    { type: "pro", text: "Direct communication with senior engineer, not a sales team" },
    { type: "pro", text: "Source code and full IP ownership on handover" },
    { type: "pro", text: "RAG, Agents, Evals, Guardrails — production-grade AI engineering" },
    { type: "pro", text: "Global timezone coverage — US, UK, EU, APAC hours available" },
    { type: "con", text: "Not suitable for custom model training requiring GPU clusters" },
    { type: "con", text: "Focused on applied AI — not fundamental ML research" },
  ],
  misconceptions: [
    {
      myth: "AI development requires training custom models from scratch.",
      reality: "90% of business AI use cases are solved with RAG, prompt engineering, and API-based LLMs. Custom training is only needed for highly specialized domains with proprietary data.",
    },
    {
      myth: "AI agents are just chatbots with better prompts.",
      reality: "Production AI agents require: planning, tool use, memory, evaluation loops, guardrails, human-in-the-loop, and observability. MistHustlers builds agent systems with LangGraph, not just prompt chains.",
    },
  ],
};

const AI_FAQ = [
  {
    q: "What AI services do you provide?",
    a: "We build: custom AI agents (LangGraph), RAG systems (document Q&A, knowledge bases), LLM-powered chatbots, document intelligence (extraction, classification, summarization), semantic search, custom fine-tuning, and AI workflow automation.",
  },
  {
    q: "How much does AI development cost?",
    a: "AI prototype (RAG demo, chatbot): $199/£159/€180/₹19,999. Production AI system (agents, evals, guardrails): $999/£799/€900/₹99,999. Custom fine-tuning: $2,999+/₹2,99,999+. Fixed pricing, 48-hour quotes.",
  },
  {
    q: "What AI models do you work with?",
    a: "OpenAI (GPT-4o, GPT-4o-mini), Anthropic (Claude 3.5 Sonnet, Haiku), Google (Gemini), open-source (Llama 3, Mistral, Mixtral). We choose the right model for your use case — API-based for speed, self-hosted for privacy/compliance.",
  },
  {
    q: "Do you fine-tune models?",
    a: "Yes. We fine-tune open-source models (Llama, Mistral) for: domain-specific tasks, style/format adherence, structured output, and cost reduction. We use LoRA/QLoRA on A100/H100 GPUs. Fine-tuning starts at $2,999/₹2,99,999.",
  },
  {
    q: "What is RAG and do you build it?",
    a: "RAG (Retrieval-Augmented Generation) connects LLMs to your private data. We build: document ingestion, chunking, embedding, vector search (Pinecone/Weaviate/PgVector), hybrid search, reranking, citation tracking, and evaluation loops.",
  },
  {
    q: "Do you build AI agents?",
    a: "Yes. We build agents with LangGraph: planning, tool use, memory, evaluation loops, guardrails, human-in-the-loop, and observability. Use cases: research agents, coding agents, customer support agents, data analysis agents.",
  },
  {
    q: "How do you ensure AI accuracy and safety?",
    a: "We implement: automated evals (correctness, hallucination, tone), guardrails (PII, toxicity, off-topic), human-in-the-loop for critical actions, A/B testing, and continuous monitoring with alerting.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. We serve clients in the US, UK, Canada, Australia, UAE, Singapore, and India. Data residency compliance (GDPR, CCPA), async-first communication across all timezones. 48-hour fixed-price quotes.",
  },
];

export default function AiDevelopment() {
  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="aiDevelopment" />
      <SchemaMarkup page="aiDevelopment" faq={AI_FAQ} />
      <Breadcrumbs />
      <main>
        <section className="pt-12 sm:pt-16 pb-16 sm:pb-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
                Service
              </span>
              <h1 className="font-display text-[clamp(38px,12vw,80px)] leading-[0.92] tracking-[0.02em] text-abyssal-ink">
                AI Development<br />
                <span className="text-digital-orange">for Global Innovation</span>
              </h1>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                Custom AI agents, RAG systems, LLM-powered chatbots, document intelligence, and custom fine-tuning. Production-grade AI engineering shipped worldwide.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { title: "Custom AI Agents", desc: "LangGraph agents with planning, tool use, memory, evaluation loops, and guardrails for complex workflows." },
                { title: "RAG Systems", desc: "Document ingestion, vector search, hybrid retrieval, reranking, citation tracking, and evaluation loops." },
                { title: "LLM Chatbots", desc: "Customer support, lead qualification, internal knowledge base, and multi-lingual conversational AI." },
                { title: "Document Intelligence", desc: "Extraction, classification, summarization, entity recognition, and structured output from unstructured documents." },
                { title: "Semantic Search", desc: "Vector + keyword hybrid search, reranking, personalization, and natural language querying over your data." },
                { title: "Custom Fine-Tuning", desc: "LoRA/QLoRA fine-tuning of Llama/Mistral for domain tasks, structured output, and cost reduction." },
              ].map((s) => (
                <div key={s.title} className="bg-ash-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 border border-abyssal-ink/5">
                  <h3 className="font-body font-bold text-xl tracking-[0.01em] text-abyssal-ink mb-3">{s.title}</h3>
                  <p className="text-sm text-abyssal-ink/60 font-body leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-16">
              <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink mb-4">Pricing</h2>
              <p className="text-abyssal-ink/50 mb-8 font-body">AI prototypes from $199/£159/€180/₹19,999. Production AI systems from $999/£799/€900/₹99,999.</p>
              <Link to="/contact" className="inline-flex min-h-12 items-center justify-center magnetic-btn bg-digital-orange text-white px-6 sm:px-8 py-4 rounded-[800px] text-base font-semibold font-body">
                Get a Quote
              </Link>
            </div>

            <AEOBlock {...AI_AEO} />

            <div id="inquiry-form">
              <ServiceInquiryForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}