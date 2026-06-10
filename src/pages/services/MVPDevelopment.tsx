import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import { Link } from "react-router-dom";

export default function MVPDevelopment() {
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
                MVP Development<br />
                <span className="text-digital-orange">for Startups</span>
              </h1>
              <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
                From idea to working product in 2-4 weeks. Fixed pricing, full source code, and zero bureaucracy.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { title: "Full-Stack MVPs", desc: "Complete web applications with auth, database, API, and deployment. Built in 2-4 weeks." },
                { title: "SaaS Minimum Viable Products", desc: "Subscription-ready MVPs with payment integration, user management, and dashboard." },
                { title: "Marketplace MVPs", desc: "Multi-vendor platforms with listing management, search, and transaction handling." },
                { title: "Dashboard & Admin Panels", desc: "Data visualization dashboards with analytics, user management, and export capabilities." },
                { title: "API-First Products", desc: "Backend-first MVPs with documented APIs, ready for mobile or frontend consumption." },
                { title: "AI-Integrated MVPs", desc: "MVPs with AI features: chatbots, content generation, recommendation engines, and more." },
              ].map((s) => (
                <div key={s.title} className="bg-ash-white rounded-[32px] p-6 border border-abyssal-ink/5">
                  <h3 className="font-body font-bold text-xl tracking-[0.01em] text-abyssal-ink mb-3">{s.title}</h3>
                  <p className="text-sm text-abyssal-ink/60 font-body leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-16">
              <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink mb-4">MVP Process</h2>
              <div className="grid md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
                {[
                  { step: "01", title: "Requirements", desc: "You share your idea. We clarify scope." },
                  { step: "02", title: "Proposal", desc: "Fixed-price quote within 48 hours." },
                  { step: "03", title: "Build", desc: "Daily updates. No surprises." },
                  { step: "04", title: "Ship", desc: "Deployed with full source + docs." },
                ].map((s) => (
                  <div key={s.step} className="bg-ash-white rounded-[24px] p-5 border border-abyssal-ink/5 text-center">
                    <span className="text-2xl font-display text-digital-orange">{s.step}</span>
                    <h3 className="font-semibold text-abyssal-ink mt-2 font-body">{s.title}</h3>
                    <p className="text-xs text-abyssal-ink/60 mt-1 font-body">{s.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-abyssal-ink/50 mb-8 font-body">Pricing: Rs 15,000 to Rs 50,000+ depending on scope.</p>
              <Link to="/contact" className="inline-block magnetic-btn bg-digital-orange text-white px-8 py-4 rounded-[800px] text-base font-semibold font-body">
                Start Your MVP
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
