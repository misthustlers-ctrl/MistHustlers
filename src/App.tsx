import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";

const Services = lazy(() => import("./pages/Services"));
const WebDevelopment = lazy(() => import("./pages/services/WebDevelopment"));
const CustomWebDevelopment = lazy(() => import("./pages/services/CustomWebDevelopment"));
const WebApplicationDevelopment = lazy(() => import("./pages/services/WebApplicationDevelopment"));
const EcommerceDevelopment = lazy(() => import("./pages/services/EcommerceDevelopment"));
const WebsiteRedesign = lazy(() => import("./pages/services/WebsiteRedesign"));
const MVPDevelopment = lazy(() => import("./pages/services/MVPDevelopment"));
const SaasDevelopment = lazy(() => import("./pages/services/SaasDevelopment"));
const AiDevelopment = lazy(() => import("./pages/services/AiDevelopment"));
const Automation = lazy(() => import("./pages/services/Automation"));
const CRMDevelopment = lazy(() => import("./pages/services/CRMDevelopment"));
const UIUX = lazy(() => import("./pages/services/UIUX"));
const Maintenance = lazy(() => import("./pages/services/Maintenance"));

const IndustryHub = lazy(() => import("./pages/industries/IndustryHub"));
const IndustryPage = lazy(() => import("./pages/industries/IndustryPage"));

const PricingPage = lazy(() => import("./pages/PricingPage"));
const TestimonialsPage = lazy(() => import("./pages/TestimonialsPage"));
const LocationPage = lazy(() => import("./pages/LocationPage"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const ProtectedSeoAudit = lazy(() => import("./pages/ProtectedSeoAudit"));
const AuthPage = lazy(() => import("./pages/AuthPage"));

const DemoViewer = lazy(() => import("./components/DemoViewer"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace("#", "");

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    window.setTimeout(() => {
      const target = document.getElementById(hash);
      if (!target) return;

      const navOffset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "smooth" });
    }, 80);
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ScrollManager />
      <ErrorBoundary key={location.pathname}>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-basalt-canvas"><div className="font-display text-2xl text-abyssal-ink/50">Loading MistHustlers...</div></div>}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />

              {/* Service Routes */}
              <Route path="/services" element={<Services />} />
              <Route path="/services/web-development" element={<WebDevelopment />} />
              <Route path="/services/custom-web-development" element={<CustomWebDevelopment />} />
              <Route path="/services/web-application-development" element={<WebApplicationDevelopment />} />
              <Route path="/services/ecommerce-development" element={<EcommerceDevelopment />} />
              <Route path="/services/website-redesign" element={<WebsiteRedesign />} />
              <Route path="/services/mvp-development" element={<MVPDevelopment />} />
              <Route path="/services/saas-development" element={<SaasDevelopment />} />
              <Route path="/services/ai-development" element={<AiDevelopment />} />
              <Route path="/services/automation" element={<Automation />} />
              <Route path="/services/crm-development" element={<CRMDevelopment />} />
              <Route path="/services/ui-ux" element={<UIUX />} />
              <Route path="/services/maintenance" element={<Maintenance />} />

              {/* Industry Routes */}
              <Route path="/industries" element={<IndustryHub />} />
              <Route path="/industries/:slug" element={<IndustryPage />} />

              {/* Conversion & Authority */}
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/web-development-company-indore" element={<LocationPage />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/seo-audit" element={<ProtectedSeoAudit />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signin" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />

              {/* Core Company */}
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
            </Route>
            <Route path="/projects/demo/:slug" element={<DemoViewer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
