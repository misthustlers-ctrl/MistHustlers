import { Helmet } from "react-helmet-async";
import { PAGE_META, SITE_URL, SITE_NAME } from "@/utils/metadata";
import { useContent } from "@/utils/useContent";
import { DEMO_PROJECTS } from "@/data/demoProjects";

const SEO_DEFAULTS = { siteName: SITE_NAME, ogImage: "" };

interface FAQItem {
  question?: string;
  answer?: string;
  q?: string;
  a?: string;
}

interface SchemaProps {
  page: string;
  faq?: FAQItem[];
}

const LOGO_DEFAULTS = {
  logoSchema: "",
};

const SITE_ADDRESS = {
  "@type": "PostalAddress",
  addressLocality: "Indore",
  addressRegion: "Madhya Pradesh",
  addressCountry: "IN",
};

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;
const localBusinessId = `${SITE_URL}/#localbusiness`;

const pagePaths: Record<string, string> = {
  home: "/",
  services: "/services",
  webDevelopment: "/services/web-development",
  automation: "/services/automation",
  mvpDevelopment: "/services/mvp-development",
  career: "/career",
  projects: "/projects",
  about: "/about",
  contact: "/contact",
  faq: "/faq",
  privacyPolicy: "/privacy-policy",
  termsOfService: "/terms-of-service",
  refundPolicy: "/refund-policy",
};

const pageTypes: Record<string, string> = {
  about: "AboutPage",
  contact: "ContactPage",
  faq: "FAQPage",
  projects: "CollectionPage",
};

const serviceDetails: Record<string, { name: string; description: string; url: string }> = {
  services: {
    name: "Web Development and Automation Services",
    description: PAGE_META.services.description,
    url: `${SITE_URL}/services`,
  },
  webDevelopment: {
    name: "Web Development",
    description: PAGE_META.webDevelopment.description,
    url: `${SITE_URL}/services/web-development`,
  },
  automation: {
    name: "AI and Business Automation",
    description: PAGE_META.automation.description,
    url: `${SITE_URL}/services/automation`,
  },
  mvpDevelopment: {
    name: "MVP Development",
    description: PAGE_META.mvpDevelopment.description,
    url: `${SITE_URL}/services/mvp-development`,
  },
};

function pageUrl(page: string) {
  const path = pagePaths[page] || "/";
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

const websiteSchema = (name: string) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": websiteId,
  name,
  url: SITE_URL,
  publisher: { "@id": organizationId },
});

function webPageSchema(page: string) {
  const meta = PAGE_META[page] || PAGE_META.home;
  const url = pageUrl(page);
  return {
    "@context": "https://schema.org",
    "@type": pageTypes[page] || "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: meta.title,
    description: meta.description,
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
  };
}

function faqSchema(items: FAQItem[], page: string) {
  const url = pageUrl(page);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question || item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer || item.a,
      },
    })),
  };
}

const serviceSchema = (page: string) => {
  const service = serviceDetails[page];
  if (!service) return undefined;
  return {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${service.url}#service`,
  name: service.name,
  url: service.url,
  provider: { "@id": organizationId },
  description: service.description,
  areaServed: "IN",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "MistHustlers Service Packages",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Launch Landing Page" }, price: "3999", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Business Starter Website" }, price: "7999", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Business Growth Website" }, price: "12999", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "MVP Idea Prototype" }, price: "7999", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Micro MVP" }, price: "24999", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Business Workflow Package" }, price: "9999", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Automation Starter" }, price: "19999", priceCurrency: "INR" },
    ],
  },
};
};

const breadcrumbItems: Record<string, { name: string; url: string }[]> = {
  home: [
    { name: "Home", url: SITE_URL },
  ],
  services: [
    { name: "Home", url: SITE_URL },
    { name: "Services", url: `${SITE_URL}/services` },
  ],
  webDevelopment: [
    { name: "Home", url: SITE_URL },
    { name: "Services", url: `${SITE_URL}/services` },
    { name: "Web Development", url: `${SITE_URL}/services/web-development` },
  ],
  automation: [
    { name: "Home", url: SITE_URL },
    { name: "Services", url: `${SITE_URL}/services` },
    { name: "Automation", url: `${SITE_URL}/services/automation` },
  ],
  mvpDevelopment: [
    { name: "Home", url: SITE_URL },
    { name: "Services", url: `${SITE_URL}/services` },
    { name: "MVP Development", url: `${SITE_URL}/services/mvp-development` },
  ],
  career: [
    { name: "Home", url: SITE_URL },
    { name: "Career", url: `${SITE_URL}/career` },
  ],
  projects: [
    { name: "Home", url: SITE_URL },
    { name: "Projects", url: `${SITE_URL}/projects` },
  ],
  about: [
    { name: "Home", url: SITE_URL },
    { name: "About", url: `${SITE_URL}/about` },
  ],
  contact: [
    { name: "Home", url: SITE_URL },
    { name: "Contact", url: `${SITE_URL}/contact` },
  ],
  faq: [
    { name: "Home", url: SITE_URL },
    { name: "FAQ", url: `${SITE_URL}/faq` },
  ],
  privacyPolicy: [
    { name: "Home", url: SITE_URL },
    { name: "Privacy Policy", url: `${SITE_URL}/privacy-policy` },
  ],
  termsOfService: [
    { name: "Home", url: SITE_URL },
    { name: "Terms of Service", url: `${SITE_URL}/terms-of-service` },
  ],
  refundPolicy: [
    { name: "Home", url: SITE_URL },
    { name: "Refund Policy", url: `${SITE_URL}/refund-policy` },
  ],
};

function breadcrumbSchema(page: string) {
  const items = breadcrumbItems[page];
  if (!items) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function projectsItemListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MistHustlers Projects and Business Previews",
    itemListElement: DEMO_PROJECTS.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/projects/demo/${project.slug}`,
      name: project.title,
      description: project.purpose || project.description,
    })),
  };
}

export default function SchemaMarkup({ page, faq }: SchemaProps) {
  const logo = useContent("logo", LOGO_DEFAULTS);
  const seo = useContent("seo", SEO_DEFAULTS);
  const siteName = seo.siteName || SITE_NAME;
  const logoUrl = logo.logoSchema || `${SITE_URL}/Favicon.png`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: siteName,
    url: SITE_URL,
    logo: logoUrl,
    email: "misthustlers@gmail.com",
    telephone: "+91 888 993 7648",
    description: "Premium web development and automation services for startups and founders in Indore. We build websites, MVPs, and AI automation pipelines.",
    founder: {
      "@type": "Person",
      name: "Naveen Salve",
      jobTitle: "Founder",
    },
    address: SITE_ADDRESS,
    sameAs: [
      "https://github.com/NaveenSalve",
      SITE_URL,
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": localBusinessId,
    name: siteName,
    image: logoUrl,
    email: "misthustlers@gmail.com",
    telephone: "+918889937648",
    address: SITE_ADDRESS,
    geo: {
      "@type": "GeoCoordinates",
      latitude: 22.7196,
      longitude: 75.8577,
    },
    url: SITE_URL,
    parentOrganization: { "@id": organizationId },
    priceRange: "₹999-₹50000+",
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Monday", opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Tuesday", opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "14:00" },
    ],
    areaServed: [
      { "@type": "City", name: "Indore" },
      { "@type": "State", name: "Madhya Pradesh" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web Development Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Development" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "MVP Development" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Automation Systems" } },
      ],
  },
};

  const allSchemas: (object | undefined)[] = [
    organizationSchema,
    localBusinessSchema,
    websiteSchema(siteName),
    webPageSchema(page),
    breadcrumbSchema(page),
    serviceSchema(page),
    page === "projects" ? projectsItemListSchema() : undefined,
  ];

  if ((page === "home" || page === "faq" || page === "projects") && faq && faq.length > 0) {
    allSchemas.push(faqSchema(faq, page));
  }

  return (
    <Helmet>
      {allSchemas.filter(Boolean).map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
