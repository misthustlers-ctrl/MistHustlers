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
    <footer id="contact" className="border-t border-abyssal-ink/5 bg-basalt-canvas">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:py-12">
        <div className="hidden lg:grid lg:grid-cols-[1.15fr_0.7fr_0.85fr_1.15fr] lg:items-start lg:gap-10 xl:gap-14">
          <div>
            <Link to="/" className="flex items-center gap-2">
              {logo.logoFooter && !logoFailed ? (
                <img src={logo.logoFooter} alt="MistHustlers" onError={() => setLogoFailed(true)} className="h-7 w-auto" />
              ) : (
                <span className="font-display text-xl tracking-[0.02em] text-abyssal-ink">
                  {logo.brandPrefix}<span className="text-digital-orange">{logo.brandHighlight}</span>
                </span>
              )}
            </Link>
            <p className="mt-4 max-w-[230px] text-sm leading-6 text-abyssal-ink/45 font-body">
              Digital products and automation built in Indore.
            </p>
          </div>

          <FooterLinkGroup title="Explore" links={EXPLORE_LINKS} />
          <FooterLinkGroup title="Company" links={COMPANY_LINKS} />

          <div className="flex flex-col items-start gap-2 font-body">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-abyssal-ink/40">Contact</p>
            <span className="mt-1 text-[15px] text-abyssal-ink/60">{contact.address}</span>
            <a href={`mailto:${contact.email}`} className="text-[15px] text-abyssal-ink/55 transition-colors hover:text-abyssal-ink">
              {contact.email}
            </a>
            <a href={`tel:${tel}`} className="text-[15px] text-abyssal-ink/55 transition-colors hover:text-abyssal-ink">
              {contact.phone}
            </a>
          </div>
        </div>

        <div className="lg:hidden">
          <div className="flex items-center justify-between border-b border-abyssal-ink/8 pb-6">
            <Link to="/" className="flex items-center gap-2">
              {logo.logoFooter && !logoFailed ? (
                <img src={logo.logoFooter} alt="MistHustlers" onError={() => setLogoFailed(true)} className="h-7 w-auto" />
              ) : (
                <span className="font-display text-xl tracking-[0.02em] text-abyssal-ink">
                  {logo.brandPrefix}<span className="text-digital-orange">{logo.brandHighlight}</span>
                </span>
              )}
            </Link>
            <Link to="/contact" className="rounded-full bg-abyssal-ink px-4 py-2.5 text-xs font-semibold text-white font-body">
              Start Project
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-8 py-6 font-body">
            <FooterLinkGroup title="Explore" links={EXPLORE_LINKS} />
            <FooterLinkGroup title="Company" links={COMPANY_LINKS} />
          </div>

          <div className="border-t border-abyssal-ink/8 py-5 font-body">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-abyssal-ink/40">Contact</p>
            <div className="mt-2 grid gap-1 text-sm text-abyssal-ink/55 sm:grid-cols-3 sm:items-center sm:gap-4">
              <span>{contact.address}</span>
              <a href={`mailto:${contact.email}`} className="flex min-h-9 items-center break-all sm:min-h-0">{contact.email}</a>
              <a href={`tel:${tel}`} className="flex min-h-9 items-center sm:min-h-0">{contact.phone}</a>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-abyssal-ink/8 pt-5 font-body">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="flex min-h-9 flex-1 items-center justify-center whitespace-nowrap rounded-full bg-abyssal-ink/5 px-3 py-2 text-center text-[11px] font-medium text-abyssal-ink/55">
                {link.label}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-abyssal-ink/35 font-body">&copy; {new Date().getFullYear()} {logo.brandPrefix}{logo.brandHighlight}. All rights reserved.</p>
        </div>

        <div className="mt-12 hidden items-center justify-between border-t border-abyssal-ink/8 pt-6 text-sm text-abyssal-ink/45 font-body lg:flex">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="rounded-full bg-abyssal-ink/5 px-4 py-2 text-center transition-colors hover:bg-abyssal-ink hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
          <p>&copy; {new Date().getFullYear()} {logo.brandPrefix}{logo.brandHighlight}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({ title, links }: { title: string; links: Array<{ label: string; to: string }> }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-abyssal-ink/40 lg:text-[11px]">{title}</p>
      <nav aria-label={`${title} footer links`} className="mt-2 grid gap-0.5 lg:mt-3">
        {links.map((link) => (
          <Link key={link.label} to={link.to} className="footer-link flex min-h-9 items-center text-sm text-abyssal-ink/60 transition-colors hover:text-abyssal-ink lg:min-h-10 lg:text-[15px]">
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
