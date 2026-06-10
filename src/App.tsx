import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import WhatsAppButton from "@/components/WhatsAppButton";

const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const WebDevelopment = lazy(() => import("./pages/services/WebDevelopment"));
const Automation = lazy(() => import("./pages/services/Automation"));
const MVPDevelopment = lazy(() => import("./pages/services/MVPDevelopment"));
const Career = lazy(() => import("./pages/Career"));
const Projects = lazy(() => import("./pages/Projects"));
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
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-basalt-canvas"><div className="font-display text-2xl text-abyssal-ink/50">Loading...</div></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/web-development" element={<WebDevelopment />} />
          <Route path="/services/automation" element={<Automation />} />
          <Route path="/services/mvp-development" element={<MVPDevelopment />} />
          <Route path="/career" element={<Career />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <WhatsAppButton />
    </>
  );
}
