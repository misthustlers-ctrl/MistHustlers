import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SITE_URL } from "@/utils/metadata";

type BreadcrumbItem = {
  label: string;
  to?: string;
};

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

const pagePaths: Record<string, string> = {
  home: "/",
  services: "/services",
  webDevelopment: "/services/web-development",
  webDesign: "/services/web-design",
  appDevelopment: "/services/app-development",
  automation: "/services/automation",
  crmDevelopment: "/services/crm-development",
  mvpDevelopment: "/services/mvp-development",
  uiUx: "/services/ui-ux",
  maintenance: "/services/maintenance",
  industries: "/industries",
  indRestaurant: "/industries/restaurant",
  indInterior: "/industries/interior-designer",
  indDoctor: "/industries/doctor",
  indLawFirm: "/industries/law-firm",
  indConstruction: "/industries/construction",
  indRealEstate: "/industries/real-estate",
  indTravel: "/industries/travel",
  indEducation: "/industries/education",
  indManufacturing: "/industries/manufacturing",
  indStartup: "/industries/startup",
  pricing: "/pricing",
  testimonials: "/testimonials",
  projects: "/projects",
  about: "/about",
  contact: "/contact",
  faq: "/faq",
  privacyPolicy: "/privacy-policy",
  termsOfService: "/terms-of-service",
  refundPolicy: "/refund-policy",
  locationIndore: "/web-development-company-indore",
  caseStudies: "/case-studies",
  seoAudit: "/seo-audit",
};

function getBreadcrumbItems(page: string): BreadcrumbItem[] {
  const path = pagePaths[page] || "/";
  const parts = path.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [{ label: "Home", to: SITE_URL }];

  let currentPath = "";
  parts.forEach((part) => {
    currentPath += `/${part}`;
    const name = part.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    items.push({ label: name, to: `${SITE_URL}${currentPath}` });
  });

  return items;
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Get current page from URL or use provided items
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;
    const pageKey = Object.keys(pagePaths).find(
      (key) => pagePaths[key] === currentPath || currentPath.startsWith(pagePaths[key] + "/")
    );
    if (pageKey) {
      const breadcrumbItems = getBreadcrumbItems(pageKey);
      return (
        <nav aria-label="Breadcrumb" className="mb-6 text-sm">
          <ol className="flex flex-wrap items-center gap-2 text-abyssal-ink/50 font-body">
            {breadcrumbItems.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <svg className="h-4 w-4 text-abyssal-ink/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
                {item.to && index < breadcrumbItems.length - 1 ? (
                  <Link to={item.to} className="hover:text-digital-orange transition-colors" aria-current={index === breadcrumbItems.length - 1 ? "page" : undefined}>
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={index === breadcrumbItems.length - 1 ? "page" : undefined}>{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      );
    }
  }

  // Fallback to provided items
  const breadcrumbItems = items && items.length > 0 ? items : [{ label: "Home" }];
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-abyssal-ink/50 font-body">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && (
              <svg className="h-4 w-4 text-abyssal-ink/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
            {item.to && index < breadcrumbItems.length - 1 ? (
              <Link to={item.to} className="hover:text-digital-orange transition-colors" aria-current={index === breadcrumbItems.length - 1 ? "page" : undefined}>
                {item.label}
              </Link>
            ) : (
              <span aria-current={index === breadcrumbItems.length - 1 ? "page" : undefined}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}