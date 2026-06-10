import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import JoinEcosystemModal from "./JoinEcosystemModal";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function GlobalNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();

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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "nav-blur bg-basalt-canvas/80 border-b border-abyssal-ink/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-2xl tracking-[0.02em] text-abyssal-ink">
              MIST<span className="text-digital-orange">HUSTLERS</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => handleNavClick(link.to)}
                className="text-sm font-medium text-abyssal-ink/70 hover:text-abyssal-ink transition-colors duration-200 font-body"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => setModalOpen(true)}
              className="magnetic-btn bg-digital-orange text-white px-6 py-2.5 rounded-[800px] text-sm font-semibold cursor-pointer font-body"
            >
              Join Ecosystem
            </button>
          </div>

          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
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
              <div className="px-6 py-6 flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => handleNavClick(link.to)}
                    className="text-sm font-medium text-abyssal-ink/70 hover:text-abyssal-ink transition-colors py-2 font-body"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => { setMobileOpen(false); setModalOpen(true); }}
                  className="magnetic-btn bg-digital-orange text-white px-6 py-3 rounded-[800px] text-sm font-semibold text-center cursor-pointer font-body"
                >
                  Join Ecosystem
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <JoinEcosystemModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
