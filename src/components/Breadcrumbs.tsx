import { Link, useLocation } from "react-router-dom";

const LABEL_MAP: Record<string, string> = {
  "": "Home",
  services: "Services",
  career: "Career",
  projects: "Projects",
  contact: "Contact",
  about: "About",
  faq: "FAQ",
  "privacy-policy": "Privacy Policy",
  "terms-of-service": "Terms of Service",
  "refund-policy": "Refund Policy",
};

export default function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-24">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-abyssal-ink/50 font-body">
        <li>
          <Link to="/" className="hover:text-digital-orange transition-colors">Home</Link>
        </li>
        {segments.map((seg, i) => {
          const path = "/" + segments.slice(0, i + 1).join("/");
          const label = LABEL_MAP[seg] || seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          const isLast = i === segments.length - 1;
          return (
            <li key={path} className="flex items-center gap-2">
              <span className="text-abyssal-ink/20">/</span>
              {isLast ? (
                <span className="text-abyssal-ink font-medium">{label}</span>
              ) : (
                <Link to={path} className="hover:text-digital-orange transition-colors">{label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
