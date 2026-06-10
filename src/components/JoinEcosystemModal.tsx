import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function JoinEcosystemModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();

  const handleHire = () => {
    onClose();
    navigate("/services#service-inquiry");
  };

  const handleLearn = () => {
    onClose();
    navigate("/career");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
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
            className="relative bg-ash-white rounded-[40px] p-8 md:p-12 max-w-lg w-full border border-abyssal-ink/5 shadow-2xl text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-abyssal-ink/40 hover:text-abyssal-ink hover:bg-abyssal-ink/5 transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="2" y1="2" x2="14" y2="14" />
                <line x1="14" y1="2" x2="2" y2="14" />
              </svg>
            </button>

            <div className="mb-6">
              <span className="font-display text-4xl tracking-[0.02em] text-abyssal-ink">
                MIST<span className="text-digital-orange">HUSTLERS</span>
              </span>
            </div>

            <h2 className="font-display text-3xl tracking-[0.02em] text-abyssal-ink mb-3">
              What brings you here?
            </h2>
            <p className="text-abyssal-ink/60 mb-8 font-body text-sm">
              Choose your path and we'll take you to the right place.
            </p>

            <div className="space-y-4">
              <button
                onClick={handleHire}
                className="w-full bg-digital-orange text-white px-8 py-5 rounded-[800px] text-base font-semibold cursor-pointer magnetic-btn font-body flex items-center justify-between group"
              >
                <span>I want to hire you</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transition-all">
                  &rarr;
                </span>
              </button>
              <button
                onClick={handleLearn}
                className="w-full bg-abyssal-ink text-white px-8 py-5 rounded-[800px] text-base font-semibold cursor-pointer magnetic-btn font-body flex items-center justify-between group"
              >
                <span>I want to work / learn</span>
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
