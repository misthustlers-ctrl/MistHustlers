import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Career", to: "/career" },
  { label: "Projects", to: "/projects" },
  { label: "FAQ", to: "/#faq" },
];

export default function Footer() {
  return (
    <footer id="contact" className="py-16 border-t border-abyssal-ink/5 bg-basalt-canvas">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl tracking-[0.02em] text-abyssal-ink">
              MIST<span className="text-digital-orange">HUSTLERS</span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-6 text-sm text-abyssal-ink/50 font-body">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="hover:text-abyssal-ink transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          <p className="text-sm text-abyssal-ink/30 font-body">
            &copy; {new Date().getFullYear()} MistHustlers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
