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

const EXPLORE_LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
];

const COMPANY_LINKS = [
  { label: "Career", to: "/career" },
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Service", to: "/terms-of-service" },
  { label: "Refund Policy", to: "/refund-policy" },
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
          </div>

          <div className="hidden md:grid grid-cols-2 gap-2 text-sm text-abyssal-ink/50 font-body md:flex md:flex-wrap md:items-center md:justify-center md:gap-3 lg:gap-5">
            {[...EXPLORE_LINKS, ...COMPANY_LINKS].map((link) => (
              <Link key={link.label} to={link.to} className="footer-link rounded-full px-3 py-2 text-center transition-colors hover:text-abyssal-ink">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex flex-col items-center md:items-end gap-2 text-sm text-abyssal-ink/50 font-body">
            <span className="text-abyssal-ink/60">{contact.address}</span>
            <a href={`mailto:${contact.email}`} className="hover:text-abyssal-ink transition-colors">
              {contact.email}
            </a>
            <a href={`tel:${tel}`} className="hover:text-abyssal-ink transition-colors">
              {contact.phone}
            </a>
          </div>
        </div>

        <div className="footer-grouped md:hidden mt-8">
          <div>
            <div className="footer-section-title">Explore</div>
            <div className="footer-columns">
              {EXPLORE_LINKS.map((link) => (
                <Link key={link.label} to={link.to}>{link.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-section-title">Company</div>
            <div className="footer-columns">
              {COMPANY_LINKS.map((link) => (
                <Link key={link.label} to={link.to}>{link.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-section-title">Legal</div>
            <div className="footer-legal">
              {LEGAL_LINKS.map((link) => (
                <Link key={link.label} to={link.to}>{link.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-section-title">Contact</div>
            <div className="footer-contact">
              <span>{contact.address}</span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <a href={`tel:${tel}`}>{contact.phone}</a>
            </div>
          </div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} {logo.brandPrefix}{logo.brandHighlight}. All rights reserved.
          </div>
        </div>

        <div className="hidden md:mt-10 md:flex md:flex-wrap md:items-center md:justify-between md:gap-8 text-sm text-abyssal-ink/45 font-body">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="rounded-full bg-abyssal-ink/5 px-4 py-2 text-center transition-colors hover:bg-abyssal-ink hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
          <p className="hidden md:block text-sm text-abyssal-ink/40 font-body">&copy; {new Date().getFullYear()} {logo.brandPrefix}{logo.brandHighlight}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
