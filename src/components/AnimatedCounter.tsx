import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

export default function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const seconds = Math.max(0.1, duration);
    const step = Math.max(1, Math.ceil(value / (seconds * 60)));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="counter-digit">
      {count.toLocaleString(undefined, { maximumFractionDigits: 1 })}
    </span>
  );
}
