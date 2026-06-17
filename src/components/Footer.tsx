import { Link } from "react-router-dom";
import { useContent } from "@/utils/useContent";

const LOGO_DEFAULTS = {
  logoFooter: "",
  brandPrefix: "MIST",
  brandHighlight: "HUSTLERS",
};

const FOOTER_LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Career", to: "/career" },
  { label: "Projects", to: "/projects" },
  { label: "FAQ", to: "/faq" },
];

export default function Footer() {
  const logo = useContent("logo", LOGO_DEFAULTS);
  return (
    <footer id="contact" className="py-16 border-t border-abyssal-ink/5 bg-basalt-canvas">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" className="flex items-center gap-2">
              {logo.logoFooter ? (
                <img src={logo.logoFooter} alt="MistHustlers" className="h-7 w-auto" />
              ) : (
                <span className="font-display text-xl tracking-[0.02em] text-abyssal-ink">
                  {logo.brandPrefix}<span className="text-digital-orange">{logo.brandHighlight}</span>
                </span>
              )}
            </Link>
            <p className="text-sm text-abyssal-ink/40 font-body">&copy; {new Date().getFullYear()} MistHustlers. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-abyssal-ink/50 font-body">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="hover:text-abyssal-ink transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 text-sm text-abyssal-ink/50 font-body">
            <span className="text-abyssal-ink/60">Indore, Madhya Pradesh</span>
            <a href="mailto:misthustlers@gmail.com" className="hover:text-abyssal-ink transition-colors">
              misthustlers@gmail.com
            </a>
            <a href="tel:+918889937648" className="hover:text-abyssal-ink transition-colors">
              +91 888 993 7648
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <Link to="/privacy-policy" className="hover:text-abyssal-ink/60 transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-abyssal-ink/60 transition-colors">Terms of Service</Link>
          <Link to="/refund-policy" className="hover:text-abyssal-ink/60 transition-colors">Refund Policy</Link>
        </div>
      </div>
    </footer>
  );
}
