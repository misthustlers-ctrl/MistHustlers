import { useEffect } from "react";
import { useContent } from "@/utils/useContent";

const DEFAULT_THEME = {
  theme: {
    canvas: "#e2e2df",
    surface: "#f7f6f2",
    text: "#070607",
    cta: "#fc5000",
    secondary: "#524ae9",
    bodyFont: '"Libre Baskerville", "DM Sans", serif',
    headingFont: '"Libre Baskerville", "PP Neue Corp Compact Ultrabold", serif',
  },
};

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "").trim();
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return null;
  const value = Number.parseInt(normalized, 16);
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

export default function DynamicTheme() {
  const logo = useContent("logo", DEFAULT_THEME);

  useEffect(() => {
    const theme = { ...DEFAULT_THEME.theme, ...(logo.theme || {}) };
    const root = document.documentElement;
    const colors = {
      "--color-basalt-canvas": theme.canvas,
      "--color-ash-white": theme.surface,
      "--color-abyssal-ink": theme.text,
      "--color-digital-orange": theme.cta,
      "--color-cyber-violet": theme.secondary,
      "--mh-bg": theme.canvas,
      "--mh-canvas": theme.canvas,
      "--mh-surface": theme.surface,
      "--mh-text": theme.text,
      "--mh-cta": theme.cta,
      "--mh-accent": theme.secondary,
      "--mh-secondary": theme.secondary,
    };

    Object.entries(colors).forEach(([key, value]) => root.style.setProperty(key, value));
    root.style.setProperty("--font-body", theme.bodyFont);
    root.style.setProperty("--font-heading", theme.headingFont);
    document.body.style.backgroundColor = theme.canvas;
    document.body.style.color = theme.text;

    const rgbVars = {
      "--mh-text-rgb": hexToRgb(theme.text),
      "--mh-cta-rgb": hexToRgb(theme.cta),
      "--mh-secondary-rgb": hexToRgb(theme.secondary),
      "--mh-surface-rgb": hexToRgb(theme.surface),
    };
    Object.entries(rgbVars).forEach(([key, value]) => {
      if (value) root.style.setProperty(key, value);
    });
  }, [logo]);

  return null;
}
