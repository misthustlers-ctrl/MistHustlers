import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export default function JoinEcosystemModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onClose]);

  const handleHire = () => {
    onClose();
    navigate("/services#service-inquiry");
  };

  const handleLearn = () => {
    onClose();
    navigate("/contact");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ecosystem-dialog-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-abyssal-ink/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="relative max-h-[calc(100dvh-24px)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-[28px] border border-abyssal-ink/5 bg-ash-white p-5 text-center shadow-2xl sm:rounded-[40px] sm:p-8 md:p-12"
          >
            <div className="sticky top-0 z-10 -mb-11 flex justify-end">
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-ash-white text-abyssal-ink/55 shadow-sm transition-colors hover:bg-abyssal-ink hover:text-white cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <line x1="2" y1="2" x2="14" y2="14" />
                  <line x1="14" y1="2" x2="2" y2="14" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <span className="font-display text-3xl sm:text-4xl tracking-[0.02em] text-abyssal-ink">
                MIST<span className="text-digital-orange">HUSTLERS</span>
              </span>
            </div>

            <h2 id="ecosystem-dialog-title" className="font-body font-bold text-2xl sm:text-3xl tracking-[0.02em] text-abyssal-ink mb-3">
              What brings you here?
            </h2>
            <p className="text-abyssal-ink/60 mb-8 font-body text-sm">
              Choose your path and we'll take you to the right place.
            </p>

            <div className="space-y-4">
              <button
                onClick={handleHire}
                className="w-full bg-digital-orange text-white px-5 sm:px-8 py-4 sm:py-5 rounded-[800px] text-base font-semibold cursor-pointer magnetic-btn font-body flex items-center justify-between gap-3 group"
              >
                <span>I want to hire you</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transition-all">
                  &rarr;
                </span>
              </button>
              <button
                onClick={handleLearn}
                className="w-full bg-abyssal-ink text-white px-5 sm:px-8 py-4 sm:py-5 rounded-[800px] text-base font-semibold cursor-pointer magnetic-btn font-body flex items-center justify-between gap-3 group"
              >
                <span>I want to work / learn</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transition-all">
                  &rarr;
                </span>
              </button>
              <button
                onClick={() => { onClose(); navigate("/login"); }}
                className="w-full border border-abyssal-ink/20 bg-white text-abyssal-ink px-5 sm:px-8 py-4 sm:py-5 rounded-[800px] text-base font-semibold cursor-pointer magnetic-btn font-body flex items-center justify-between gap-3 group hover:bg-ash-white transition-all"
              >
                <span>Client Support Access</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transition-all">
                  &rarr;
                </span>
              </button>
            </div>

            <p className="mt-6 text-xs text-abyssal-ink/40 font-body">
              Not sure? Browse our <button onClick={() => { onClose(); navigate("/"); }} className="text-digital-orange underline cursor-pointer">Home page</button> first.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
