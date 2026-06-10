import { AnimatePresence, motion } from "framer-motion";

export default function FAQItem({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-abyssal-ink/10 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left group cursor-pointer"
      >
        <span className="text-lg font-semibold text-abyssal-ink pr-8 font-body">{q}</span>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            isOpen ? "border-digital-orange bg-digital-orange text-white rotate-45" : "border-abyssal-ink/20 text-abyssal-ink group-hover:border-abyssal-ink/40"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="7" y1="0" x2="7" y2="14" />
            <line x1="0" y1="7" x2="14" y2="7" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-abyssal-ink/70 leading-relaxed font-body">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
