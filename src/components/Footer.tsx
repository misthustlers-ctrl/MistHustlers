import { Link } from "react-router-dom";
import { useState } from "react";
import { useContent } from "@/utils/useContent";

const LOGO_DEFAULTS = {
  logoFooter: "",
  brandPrefix: "MIST",
  brandHighlight: "HUSTLERS",
};

const CONTACT_DEFAULTS = {
  address: "Indore, Madhya Pradesh",
  email: "misthustlers@gmail.com",
  phone: "+91 888 993 7648",
  phoneHref: "+918889937648",
};

const FOOTER_LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "Career", to: "/career" },
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

export default function Footer() {
  const [logoFailed, setLogoFailed] = useState(false);
  const logo = useContent("logo", LOGO_DEFAULTS);
  const contact = useContent("contact", CONTACT_DEFAULTS);
  const tel = (contact.phoneHref || contact.phone || "").replace(/\s/g, "");
  return (
    <footer id="contact" className="py-16 border-t border-abyssal-ink/5 bg-basalt-canvas">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" className="flex items-center gap-2">
              {logo.logoFooter && !logoFailed ? (
                <img src={logo.logoFooter} alt="MistHustlers" onError={() => setLogoFailed(true)} className="h-7 w-auto" />
              ) : (
                <span className="font-display text-xl tracking-[0.02em] text-abyssal-ink">
                  {logo.brandPrefix}<span className="text-digital-orange">{logo.brandHighlight}</span>
                </span>
              )}
            </Link>
            <p className="text-sm text-abyssal-ink/40 font-body">&copy; {new Date().getFullYear()} {logo.brandPrefix}{logo.brandHighlight}. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-sm text-abyssal-ink/50 font-body">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="footer-link rounded-full px-2 py-1 transition-colors hover:text-abyssal-ink">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 text-sm text-abyssal-ink/50 font-body">
            <span className="text-abyssal-ink/60">{contact.address}</span>
            <a href={`mailto:${contact.email}`} className="hover:text-abyssal-ink transition-colors">
              {contact.email}
            </a>
            <a href={`tel:${tel}`} className="hover:text-abyssal-ink transition-colors">
              {contact.phone}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 text-sm text-abyssal-ink/45 font-body">
          <Link to="/privacy-policy" className="hover:text-abyssal-ink/60 transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-abyssal-ink/60 transition-colors">Terms of Service</Link>
          <Link to="/refund-policy" className="hover:text-abyssal-ink/60 transition-colors">Refund Policy</Link>
        </div>
      </div>
    </footer>
  );
}
