import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import { Link } from "react-router-dom";

export default function Automation() {
  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="services" />
      <SchemaMarkup page="notFound" />
      <GlobalNavbar />
      <Breadcrumbs />
      <main>
        <section className="pt-16 pb-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
                Service
              </span>
              <h1 className="font-display text-[clamp(48px,8vw,80px)] leading-[0.9] tracking-[0.02em] text-abyssal-ink">
                AI & Automation<br />
                <span className="text-digital-orange">Systems</span>
              </h1>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                Automate workflows, integrate AI pipelines, and eliminate manual operations. Built for Indore businesses and global startups.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { title: "Workflow Automation", desc: "Automate repetitive tasks, email sequences, data entry, and report generation using modern automation tools." },
                { title: "AI Chatbots", desc: "Custom AI assistants for customer support, lead qualification, and internal knowledge base queries." },
                { title: "Data Pipelines", desc: "Automated data collection, transformation, and reporting pipelines connected to your existing tools." },
                { title: "CRM Integration", desc: "Connect and automate your CRM workflows with custom integrations and trigger-based actions." },
                { title: "Content Automation", desc: "Automated content generation, scheduling, and distribution across your marketing channels." },
                { title: "Custom Automations", desc: "Tailored automation solutions for your specific business processes and operational needs." },
              ].map((s) => (
                <div key={s.title} className="bg-ash-white rounded-[32px] p-6 border border-abyssal-ink/5">
                  <h3 className="font-display text-xl tracking-[0.01em] text-abyssal-ink mb-3">{s.title}</h3>
                  <p className="text-sm text-abyssal-ink/60 font-body leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-16">
              <h2 className="font-display text-3xl tracking-[0.02em] text-abyssal-ink mb-4">Ready to Automate?</h2>
              <p className="text-abyssal-ink/50 mb-8 font-body">Tell us about your workflow. We'll build a custom automation solution.</p>
              <Link to="/contact" className="inline-block magnetic-btn bg-digital-orange text-white px-8 py-4 rounded-[800px] text-base font-semibold font-body">
                Get a Quote
              </Link>
            </div>

            <div id="inquiry-form">
              <ServiceInquiryForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
