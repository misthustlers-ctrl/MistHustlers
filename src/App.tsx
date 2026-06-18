import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";
import Projects from "@/pages/Projects";
import DynamicTheme from "@/components/DynamicTheme";

const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const WebDevelopment = lazy(() => import("./pages/services/WebDevelopment"));
const Automation = lazy(() => import("./pages/services/Automation"));
const MVPDevelopment = lazy(() => import("./pages/services/MVPDevelopment"));
const Career = lazy(() => import("./pages/Career"));
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
      <DynamicTheme />
      <ScrollManager />
      <ErrorBoundary key={location.pathname}>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-basalt-canvas"><div className="font-display text-2xl text-abyssal-ink/50">Loading...</div></div>}>
          <Routes>
            <Route element={<Layout />}>
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
            </Route>
            <Route path="/projects/demo/:slug" element={<DemoViewer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
