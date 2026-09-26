export default function StarRating({
  defaultRating = 0,
  size = 24,
  label = "MistHustlers Quality Score",
}: {
  slug: string;
  defaultRating?: number;
  size?: number;
  label?: string;
}) {
  const display = Math.max(0, Math.min(5, defaultRating));

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-0.5" role="img" aria-label={`${label}: ${display}/5. This is an internal project assessment, not a customer review.`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const fillPercent = Math.min(1, Math.max(0, display - (star - 1)));
          return (
            <span key={star} className="relative inline-block" style={{ width: size, height: size }} aria-hidden="true">
            <svg width={size} height={size} viewBox="0 0 24 24" className="absolute inset-0">
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill="none"
                stroke="rgba(7,6,7,0.2)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              className="absolute inset-0"
              style={{ clipPath: fillPercent > 0 ? `inset(0 ${(1 - fillPercent) * 100}% 0 0)` : "inset(0 100% 0 0)" }}
            >
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill="#fc5000"
                stroke="#fc5000"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          );
        })}
      </div>
      <span className="text-sm text-abyssal-ink/55 font-body">{display}/5</span>
      <details className="group relative">
        <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-full border border-abyssal-ink/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-abyssal-ink/55 outline-none transition-colors hover:bg-abyssal-ink hover:text-white focus-visible:ring-2 focus-visible:ring-digital-orange font-body">
          {label}
        </summary>
        <div className="absolute bottom-full left-0 z-20 mb-2 w-64 rounded-2xl bg-abyssal-ink p-3 text-xs leading-relaxed text-white shadow-xl font-body">
          Internally assessed based on design, responsiveness, usability, feature completeness and industry relevance. This is not a customer-review rating.
        </div>
      </details>
    </div>
  );
}
