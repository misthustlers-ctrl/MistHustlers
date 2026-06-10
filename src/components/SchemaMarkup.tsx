import { Helmet } from "react-helmet-async";
import { SITE_URL, SITE_NAME } from "@/utils/metadata";

interface FAQItem {
  question: string;
  answer: string;
}

interface SchemaProps {
  page: "home" | "services" | "career" | "projects" | "notFound";
  faq?: FAQItem[];
}

const SITE_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Indore, Madhya Pradesh",
  addressLocality: "Indore",
  addressRegion: "Madhya Pradesh",
  postalCode: "452001",
  addressCountry: "IN",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/Favicon.png`,
  email: "misthustlers@gmail.com",
  telephone: "+91 888 993 7648",
  description: "Premium web development and automation services for startups and founders in Indore. We build websites, MVPs, and AI automation pipelines.",
  address: SITE_ADDRESS,
  sameAs: [
    "https://github.com/NaveenSalve",
    "https://misthustlers.up.railway.app",
  ],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  image: `${SITE_URL}/Favicon.png`,
  email: "misthustlers@gmail.com",
  telephone: "+918889937648",
  address: SITE_ADDRESS,
  geo: {
    "@type": "GeoCoordinates",
    latitude: 22.7196,
    longitude: 75.8577,
  },
  url: SITE_URL,
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

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE_URL,
  name: SITE_NAME,
};

function faqSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "MistHustlers Services",
  provider: { "@type": "Organization", name: SITE_NAME },
  description: "Build with clarity. Ship with precision. Transparent pricing for real execution — STARTER, GROWTH & PREMIUM tiers for ambitious builders and startups.",
  areaServed: "IN",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Execution Plans",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "STARTER" }, price: "₹999", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "GROWTH" }, price: "₹5,000", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "PREMIUM" }, price: "₹15,000", priceCurrency: "INR" },
    ],
  },
};

const breadcrumbSchemas: Record<string, object> = {
  home: {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    ],
  },
  services: {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
    ],
  },
  career: {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Career", item: `${SITE_URL}/career` },
    ],
  },
  projects: {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/projects` },
    ],
  },
};

export default function SchemaMarkup({ page, faq }: SchemaProps) {
  const schemas: object[] = [organizationSchema, localBusinessSchema, websiteSchema, breadcrumbSchemas[page]];

  if (page === "services") {
    schemas.push(serviceSchema);
  }

  if (page === "home" && faq && faq.length > 0) {
    schemas.push(faqSchema(faq));
  }

  return (
    <Helmet>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
