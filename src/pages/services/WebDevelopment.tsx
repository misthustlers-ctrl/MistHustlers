import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import { Link } from "react-router-dom";

export default function WebDevelopment() {
  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="webDevelopment" />
      <SchemaMarkup page="webDevelopment" />
      <Breadcrumbs />
      <main>
        <section className="pt-16 pb-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
                Service
              </span>
              <h1 className="font-display text-[clamp(48px,8vw,80px)] leading-[0.9] tracking-[0.02em] text-abyssal-ink">
                Web Development<br />
                <span className="text-digital-orange">in Indore</span>
              </h1>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                Custom business websites, landing pages, and full-stack web applications. Built with modern tech, deployed in days not months.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { title: "Business Websites", desc: "Multi-page websites with CMS, contact forms, SEO optimization, and analytics integration." },
                { title: "Landing Pages", desc: "High-converting single-page sites with custom design, A/B testing ready, starting at Rs 999." },
                { title: "Full-Stack Apps", desc: "Complete web applications with database, authentication, API integration, and cloud deployment." },
                { title: "E-Commerce", desc: "Online stores with payment gateway integration, inventory management, and order tracking." },
                { title: "Portfolio Sites", desc: "Showcase your work with custom galleries, case studies, and client testimonial sections." },
                { title: "Corporate Sites", desc: "Professional company websites with team pages, service listings, and blog integration." },
              ].map((s) => (
                <div key={s.title} className="bg-ash-white rounded-[32px] p-6 border border-abyssal-ink/5">
                  <h3 className="font-body font-bold text-xl tracking-[0.01em] text-abyssal-ink mb-3">{s.title}</h3>
                  <p className="text-sm text-abyssal-ink/60 font-body leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-16">
              <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink mb-4">Pricing</h2>
              <p className="text-abyssal-ink/50 mb-8 font-body">Starting from Rs 999 for landing pages, custom quotes for larger projects.</p>
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
    </div>
  );
}
