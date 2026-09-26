import { Helmet } from "react-helmet-async";
import { PAGE_META, SITE_URL, SITE_NAME } from "@/utils/metadata";
import { useContent } from "@/utils/useContent";
import { DEMO_PROJECTS } from "@/data/demoProjects";

interface FAQItem {
  question?: string;
  answer?: string;
  q?: string;
  a?: string;
}

interface ArticleMetadata {
  headline: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
  description?: string;
  wordCount?: number;
}

interface HowToStep {
  name: string;
  text: string;
}

interface VideoMetadata {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
}

interface SchemaProps {
  page: string;
  faq?: FAQItem[];
  article?: ArticleMetadata;
  howToSteps?: HowToStep[];
  howToName?: string;
  video?: VideoMetadata;
}

const LOGO_DEFAULTS = { logoSchema: "" };

const SITE_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "MG Road & AB Road Tech Corridor",
  addressLocality: "Indore",
  addressRegion: "Madhya Pradesh",
  postalCode: "452001",
  addressCountry: "IN",
};

const organizationId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;
const localBusinessId = `${SITE_URL}/#localbusiness`;
const personFounderId = `${SITE_URL}/#founder`;

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

const pageTypes: Record<string, string> = {
  about: "AboutPage",
  contact: "ContactPage",
  faq: "FAQPage",
  projects: "CollectionPage",
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
  inLanguage: "en-IN",
  publisher: { "@id": organizationId },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/services?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
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
    speakable: {
      "@type": "SpeakableSpecification",
      xpath: ["/html/head/title", "/html/head/meta[@name='description']/@content"],
    },
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
      name: item.question || item.q || "",
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer || item.a || "",
      },
    })),
  };
}

function breadcrumbSchema(page: string) {
  const path = pagePaths[page] || "/";
  const parts = path.split("/").filter(Boolean);
  const items = [{ name: "Home", url: SITE_URL }];

  let currentPath = "";
  parts.forEach((part) => {
    currentPath += `/${part}`;
    const name = part.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    items.push({ name, url: `${SITE_URL}${currentPath}` });
  });

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
    name: "MistHustlers Projects & Live Previews",
    itemListElement: DEMO_PROJECTS.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/projects/demo/${project.slug}`,
      name: project.title,
      description: project.purpose || project.description,
    })),
  };
}

function articleSchema(art: ArticleMetadata, page: string) {
  const url = pageUrl(page);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    headline: art.headline,
    description: art.description || art.headline,
    datePublished: art.datePublished,
    dateModified: art.dateModified || art.datePublished,
    inLanguage: "en-IN",
    wordCount: art.wordCount || 1500,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@id": personFounderId },
    publisher: { "@id": organizationId },
    image: {
      "@type": "ImageObject",
      url: art.image ? `${SITE_URL}${art.image}` : `${SITE_URL}/og-image.png`,
      width: 1200,
      height: 630,
    },
    isAccessibleForFree: true,
  };
}

function howToSchema(name: string, steps: HowToStep[], page: string) {
  const url = pageUrl(page);
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name,
    url,
    author: { "@id": personFounderId },
    publisher: { "@id": organizationId },
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

function portfolioImageListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "MistHustlers Web Development Portfolio",
    description: "Screenshots and live previews of websites and apps built by MistHustlers.",
    author: { "@id": organizationId },
    url: `${SITE_URL}/projects`,
  };
}

function videoSchema(video: VideoMetadata) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: `${SITE_URL}${video.thumbnailUrl}`,
    uploadDate: video.uploadDate,
    contentUrl: video.contentUrl || SITE_URL,
    embedUrl: video.contentUrl || SITE_URL,
    publisher: { "@id": organizationId },
  };
}

function seoAuditSoftwareSchema(siteName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/seo-audit#software`,
    name: "Free SEO Audit Tool by MistHustlers",
    alternateName: "Website SEO Checker",
    url: `${SITE_URL}/seo-audit`,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "SEO audit tool",
    operatingSystem: "Web browser",
    inLanguage: "en-IN",
    isAccessibleForFree: true,
    description: "A free 14-point website SEO checker for title tags, meta descriptions, H1 headings, schema markup, Open Graph previews, mobile viewport, image alt text, and content depth.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "Free website SEO audit",
      "On-page SEO checker",
      "SEO score report",
      "Title and meta description checks",
      "Schema markup checks",
      "Open Graph and Twitter card checks",
      "Mobile viewport check",
      "Image alt text check",
      "PDF, CSV, and JSON report exports",
    ],
    provider: { "@id": organizationId },
    publisher: { "@id": organizationId },
    creator: { "@id": organizationId },
    brand: {
      "@type": "Brand",
      name: siteName,
    },
  };
}

// Global entity schemas (defined once, referenced by @id)
const founderPersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": personFounderId,
  name: "Naveen Salve",
  jobTitle: "Founder & Lead Engineer",
  worksFor: { "@id": organizationId },
  url: `${SITE_URL}/about`,
  sameAs: [
    "https://github.com/NaveenSalve",
    "https://linkedin.com/in/naveensalve",
  ],
  alumniOf: "Rajiv Gandhi Proudyogiki Vishwavidyalaya",
  knowsAbout: [
    "Web Development",
    "AI Automation",
    "Software Architecture",
    "Next.js",
    "React",
    "Node.js",
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": organizationId,
  name: "MistHustlers",
  legalName: "MistHustlers Digital Solutions",
  url: SITE_URL,
  logo: `${SITE_URL}/Favicon.png`,
  email: "misthustlers@gmail.com",
  telephone: "+91 888 993 7648",
  description: "Global web development and AI technology partner. We build custom web applications, MVPs, SaaS products, ecommerce platforms, and AI-powered automation for businesses worldwide.",
  founder: { "@id": personFounderId },
  address: SITE_ADDRESS,
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-888-993-7648",
      contactType: "customer service",
      areaServed: ["US", "GB", "CA", "AU", "AE", "SG", "IN"],
      availableLanguage: ["English", "Hindi"],
    },
  ],
  sameAs: [
    "https://github.com/NaveenSalve",
    SITE_URL,
  ],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": localBusinessId,
  name: "MistHustlers",
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
  parentOrganization: { "@id": organizationId },
  priceRange: "₹3999-₹50000",
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "16:00" },
  ],
  areaServed: [
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Country", name: "Canada" },
    { "@type": "Country", name: "Australia" },
    { "@type": "Country", name: "United Arab Emirates" },
    { "@type": "Country", name: "Singapore" },
    { "@type": "Country", name: "India" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "MistHustlers Web Development & Automation Packages",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Launch Landing Page" }, price: "3999", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Business Starter Website" }, price: "7999", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Business Growth Website" }, price: "12999", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "MVP Prototype" }, price: "7999", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Micro MVP SaaS" }, price: "24999", priceCurrency: "INR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI Automation Starter" }, price: "19999", priceCurrency: "INR" },
    ],
  },
};

export default function SchemaMarkup({ page, faq, article, howToSteps, howToName, video }: SchemaProps) {
  const logo = useContent("logo", LOGO_DEFAULTS);
  const seo = useContent("seo", { siteName: SITE_NAME });
  const siteName = seo.siteName || SITE_NAME;

  // Page-specific schemas
  const pageSpecificSchemas: (object | undefined)[] = [
    webPageSchema(page),
    breadcrumbSchema(page),
    page === "projects" ? projectsItemListSchema() : undefined,
    page === "projects" ? portfolioImageListSchema() : undefined,
    page === "seoAudit" ? seoAuditSoftwareSchema(siteName) : undefined,
  ];

  if (article) {
    pageSpecificSchemas.push(articleSchema(article, page));
  }

  if (howToSteps && howToSteps.length > 0 && howToName) {
    pageSpecificSchemas.push(howToSchema(howToName, howToSteps, page));
  }

  if (video) {
    pageSpecificSchemas.push(videoSchema(video));
  }

  if (faq && faq.length > 0) {
    pageSpecificSchemas.push(faqSchema(faq, page));
  }

  // Global entity schemas (included on every page via @id references)
  const globalSchemas = [
    founderPersonSchema,
    organizationSchema,
    localBusinessSchema,
    websiteSchema(siteName),
  ];

  const allSchemas = [...globalSchemas, ...pageSpecificSchemas].filter(Boolean);

  return (
    <Helmet>
      {allSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}