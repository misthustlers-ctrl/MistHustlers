import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "@/utils/useContent";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "Career", to: "/career" },
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy", to: "/privacy-policy" },
  { label: "Terms", to: "/terms-of-service" },
  { label: "Refund", to: "/refund-policy" },
];

const LOGO_DEFAULTS = {
  logoMain: "",
  brandPrefix: "MIST",
  brandHighlight: "HUSTLERS",
};

export default function GlobalNavbar({ alwaysSolid = false }: { alwaysSolid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const logo = useContent("logo", LOGO_DEFAULTS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  const handleNavClick = (to: string) => {
    const [path, hash] = to.split("#");

    if (!hash && location.pathname === path) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      return;
    }

    if (hash && location.pathname === path && location.hash === `#${hash}`) {
      window.setTimeout(() => {
        const target = document.getElementById(hash);
        if (!target) return;

        const navOffset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
        window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "smooth" });
      }, 40);
    }
  };

  const isActiveLink = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[80] -translate-y-24 rounded-full bg-abyssal-ink px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0 font-body"
      >
        Skip to content
      </a>
      <nav
        className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-300 ${
          scrolled || alwaysSolid
            ? "nav-blur bg-basalt-canvas/90 border-b border-abyssal-ink/5 py-2 lg:py-3"
            : "bg-transparent py-3 lg:py-5"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
          <Link to="/" className="flex min-w-0 items-center gap-2 group">
            {logo.logoMain && !logoFailed ? (
              <img src={logo.logoMain} alt="MistHustlers" onError={() => setLogoFailed(true)} className="h-7 sm:h-8 w-auto max-w-[180px] object-contain" />
            ) : (
              <span className="truncate font-display text-xl sm:text-2xl tracking-[0.02em] text-abyssal-ink">
                {logo.brandPrefix}<span className="text-digital-orange">{logo.brandHighlight}</span>
              </span>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => handleNavClick(link.to)}
                aria-current={isActiveLink(link.to) ? "page" : undefined}
                className={`nav-link relative text-sm font-medium transition-colors duration-200 font-body min-h-[44px] flex items-center ${
                  isActiveLink(link.to) ? "text-abyssal-ink" : "text-abyssal-ink/70 hover:text-abyssal-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="magnetic-btn bg-digital-orange text-white px-6 py-2.5 rounded-[800px] text-sm font-semibold cursor-pointer font-body"
            >
              Start Project
            </Link>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="lg:hidden flex h-11 w-11 flex-shrink-0 flex-col items-center justify-center gap-1.5 rounded-full p-2 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className={`block w-6 h-0.5 bg-abyssal-ink transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
            <span className={`block w-6 h-0.5 bg-abyssal-ink transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-abyssal-ink transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.button
                type="button"
                aria-label="Close navigation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-[55] bg-abyssal-ink/45 backdrop-blur-[2px] lg:hidden"
              />
              <motion.aside
                id="mobile-navigation"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
                style={{ width: "min(100vw, 420px)", maxWidth: "100vw" }}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                className="fixed inset-y-0 right-0 z-[60] flex h-[100dvh] flex-col overflow-hidden border-l border-abyssal-ink/10 bg-ash-white shadow-2xl lg:hidden"
              >
                <div className="flex min-h-16 items-center justify-between border-b border-abyssal-ink/8 px-4 sm:px-6">
                  <span className="font-display text-xl tracking-[0.02em] text-abyssal-ink">Navigation</span>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-abyssal-ink/5 text-2xl leading-none text-abyssal-ink transition-colors hover:bg-abyssal-ink hover:text-white"
                  >
                    &times;
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
                  <div className="grid grid-cols-2 gap-2">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={() => { handleNavClick(link.to); setMobileOpen(false); }}
                      aria-current={isActiveLink(link.to) ? "page" : undefined}
                      className={`min-h-11 rounded-xl px-3 text-sm font-medium transition-colors py-2 font-body flex items-center ${
                        isActiveLink(link.to) ? "bg-abyssal-ink text-white" : "text-abyssal-ink/70 hover:text-abyssal-ink hover:bg-abyssal-ink/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="magnetic-btn mt-4 flex min-h-12 items-center justify-center bg-digital-orange text-white px-6 py-3 rounded-[800px] text-sm font-semibold text-center cursor-pointer font-body"
                >
                  Start Project
                </Link>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-abyssal-ink/5 pt-4">
                  {LEGAL_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="flex min-h-11 items-center rounded-full bg-abyssal-ink/5 px-4 py-2 text-xs font-semibold text-abyssal-ink/60 transition-colors hover:bg-abyssal-ink hover:text-white font-body"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
