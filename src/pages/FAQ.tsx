import { useState } from "react";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import FAQItem from "@/components/FAQItem";

const FAQ_DATA = [
  { q: "What services does MistHustlers offer?", a: "We offer web development, MVP development, automation systems, full-stack application development, and UI/UX design services. From simple landing pages to complex AI-powered platforms — we build production-grade work for startups and founders based in Indore and across India." },
  { q: "Where is MistHustlers based?", a: "We are based in Indore, Madhya Pradesh. We serve clients across India and globally. All communication is async-first — email, WhatsApp, and scheduled calls as needed." },
  { q: "How much does it cost to build a website?", a: "Our pricing starts at Rs 999 for basic landing pages and scales up to Rs 50,000+ for full-stack applications and AI automation systems. Every project gets a fixed-price quote after a requirements review. No hidden costs." },
  { q: "What is included in the price?", a: "Every project includes complete source code, documentation, deployment support, and post-delivery support (14-90 days depending on plan). We also include a 30-minute handover call." },
  { q: "How long does it take to build a project?", a: "A landing page can be delivered in 3-5 days. A multi-page business website takes 1-2 weeks. A full-stack MVP typically takes 2-4 weeks. Complex AI/automation systems may take 4-8 weeks. We provide exact timelines in our proposal." },
  { q: "How does the process work?", a: "1) You share your requirements via our inquiry form. 2) We review and send a fixed-price proposal within 48 hours. 3) You approve, we start building with daily updates. 4) We deliver with full documentation and support." },
  { q: "Do I need to have technical knowledge?", a: "Not at all. We handle everything from architecture to deployment. You just need to know what problem you want to solve. We guide you through the rest." },
  { q: "What if I need changes after delivery?", a: "We include a revision period (7-14 days depending on plan) where we make reasonable adjustments. For ongoing work, we offer maintenance retainers and feature addition packages." },
  { q: "Do you offer refunds?", a: "Yes, we have a clear refund policy. If we cannot deliver as agreed, we provide a full or partial refund as per the terms outlined in our refund policy." },
  { q: "What makes MistHustlers different from other agencies?", a: "Three things: 1) Fixed pricing — no hourly billing. 2) Direct access to developers — no account managers. 3) Source code included — you own everything. Plus, we respond within 48 hours and have zero bureaucracy." },
  { q: "Do you work with clients outside India?", a: "Yes, we work with clients globally. We operate async-first and accommodate all timezones. Communication is via email, WhatsApp, and scheduled calls." },
  { q: "What technologies do you use?", a: "We work with modern tech: React, Next.js, Node.js, TypeScript, Python, PostgreSQL, MongoDB, Tailwind CSS, Prisma, and OpenAI APIs. We choose the best stack for your project." },
  { q: "Do you build AI-powered applications?", a: "Yes. We build AI automation pipelines, chatbots, content generation systems, and custom AI integrations using OpenAI, LangChain, and other AI/ML frameworks." },
  { q: "Can you help me with an existing project?", a: "Yes, we take on existing projects for feature development, bug fixes, performance optimization, and codebase maintenance." },
  { q: "How do I get started?", a: "Fill out the inquiry form on our Contact page or Services page. Tell us about your project. We'll respond within 48 hours with a fixed-price proposal." },
];

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (i: number) => setOpenFAQ(openFAQ === i ? null : i);

  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="faq" />
      <SchemaMarkup page="faq" faq={FAQ_DATA} />
      <main>
        <section className="pt-28 sm:pt-32 pb-16 sm:pb-20">
          <div className="max-w-[800px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
                FAQ
              </span>
              <h1 className="font-display text-[clamp(38px,12vw,80px)] leading-[0.92] tracking-[0.02em] text-abyssal-ink">
                Frequently Asked<br />
                <span className="text-digital-orange">Questions</span>
              </h1>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                Everything you need to know about our web development services in Indore.
              </p>
            </div>

            <div className="bg-ash-white rounded-[28px] sm:rounded-[40px] p-5 sm:p-8 border border-abyssal-ink/5">
              {FAQ_DATA.map((faq, i) => (
                <FAQItem
                  key={i}
                  q={faq.q}
                  a={faq.a}
                  isOpen={openFAQ === i}
                  onClick={() => toggleFAQ(i)}
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-abyssal-ink/50 mb-4 font-body">Still have questions?</p>
              <a
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center magnetic-btn bg-digital-orange text-white px-6 sm:px-8 py-4 rounded-[800px] text-base font-semibold font-body"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
