import { useState, useEffect } from "react";
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

const LOGO_DEFAULTS = {
  logoMain: "",
  brandPrefix: "MIST",
  brandHighlight: "HUSTLERS",
};

export default function GlobalNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "nav-blur bg-basalt-canvas/80 border-b border-abyssal-ink/5 py-3"
            : "bg-transparent py-5"
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
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-ash-white border-b border-abyssal-ink/5 overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-5 flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => handleNavClick(link.to)}
                    aria-current={isActiveLink(link.to) ? "page" : undefined}
                    className={`min-h-11 rounded-2xl px-3 text-sm font-medium transition-colors py-2 font-body flex items-center ${
                      isActiveLink(link.to) ? "bg-abyssal-ink text-white" : "text-abyssal-ink/70 hover:text-abyssal-ink hover:bg-abyssal-ink/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="magnetic-btn bg-digital-orange text-white px-6 py-3 rounded-[800px] text-sm font-semibold text-center cursor-pointer font-body"
                >
                  Start Project
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
