import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const STORAGE_KEY = "mh-demo-ratings";

type RatingData = Record<string, number>;

function loadRatings(): RatingData {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveRatings(ratings: RatingData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
}

export default function StarRating({
  slug,
  defaultRating = 0,
  size = 24,
}: {
  slug: string;
  defaultRating?: number;
  size?: number;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ratings = loadRatings();
    if (ratings[slug] !== undefined) {
      setRating(ratings[slug]);
    } else {
      setRating(defaultRating);
    }
    setLoaded(true);
  }, [slug, defaultRating]);

  const handleClick = (value: number) => {
    const ratings = loadRatings();
    const newRating = rating === value ? 0 : value;
    ratings[slug] = newRating;
    saveRatings(ratings);
    setRating(newRating);
  };

  if (!loaded) return null;

  const display = hovered || rating;

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercent = Math.min(1, Math.max(0, display - (star - 1)));

        return (
          <motion.button
            key={star}
            type="button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => handleClick(star)}
            onMouseEnter={() => setHovered(star)}
            className="cursor-pointer relative"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            style={{ width: size, height: size }}
          >
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
          </motion.button>
        );
      })}
      {display > 0 && (
        <span className="ml-2 text-sm text-abyssal-ink/50 font-body">
          {display}/5
        </span>
      )}
    </div>
  );
}
