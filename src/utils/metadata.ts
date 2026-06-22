export const SITE_NAME = "MistHustlers";
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://www.misthustlers.in").replace(/\/$/, "");
export const DEFAULT_OG_IMAGE = "/og-image.svg";
export const TWITTER_HANDLE = "@misthustlers";
export const SITE_LOCATION = "Indore, Madhya Pradesh";

export interface PageMeta {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  canonical?: string;
  h1?: string;
  keywords?: string;
}

export const PAGE_META: Record<string, PageMeta> = {
  home: {
    title: "MistHustlers | Website, MVP & AI Automation Company",
    description: "MistHustlers builds business websites, MVPs, AI automation, CMS and CRM workflow systems for startups, founders and growing businesses in Indore and across India.",
    canonical: SITE_URL,
    keywords: "web development agency in Indore, AI automation agency Indore, MVP development India, CMS dashboard, CRM workflow, AEO, GEO, SEO",
  },
  services: {
    title: "Web Development Services in Indore — MistHustlers",
    description: "Website packages, MVP development, AI workflow automation, CMS, CRM and maintenance services by MistHustlers in Indore with transparent launch pricing.",
    canonical: `${SITE_URL}/services`,
    keywords: "website development packages Indore, MVP development pricing, AI automation packages, CMS development, CRM dashboard, AEO optimization, GEO optimization",
  },
  webDevelopment: {
    title: "Web Development Company in Indore | MistHustlers",
    description: "Custom websites and web applications for startups and growing businesses. Explore web development services by MistHustlers in Indore.",
    canonical: `${SITE_URL}/services/web-development`,
  },
  automation: {
    title: "AI & Business Automation Services | MistHustlers",
    description: "Automate repetitive business workflows, lead management and internal operations with practical AI and business automation solutions.",
    canonical: `${SITE_URL}/services/automation`,
  },
  mvpDevelopment: {
    title: "MVP Development for Startups | MistHustlers",
    description: "Plan, design and build a focused MVP for your startup with clear scope, practical technology and scalable development support.",
    canonical: `${SITE_URL}/services/mvp-development`,
  },
  career: {
    title: "Career & Opportunities — MistHustlers",
    description: "Explore jobs, internships, events, and programs designed for real-world growth. Join 1.2K+ active builders in the MistHustlers ecosystem in Indore.",
    canonical: `${SITE_URL}/career`,
  },
  projects: {
    title: "Projects, Website Demos & Digital Products | MistHustlers",
    description: "Explore business website previews, MVP concepts and internal products designed and developed by MistHustlers.",
    canonical: `${SITE_URL}/projects`,
  },
  notFound: {
    title: "Page Not Found — MistHustlers",
    description: "The page you are looking for does not exist. Return to MistHustlers home page.",
    canonical: SITE_URL,
  },
  about: {
    title: "About MistHustlers — Web Development Agency in Indore",
    description: "Learn about MistHustlers — a web development and automation agency based in Indore. Founded by Naveen Salve. We help startups ship products fast.",
    canonical: `${SITE_URL}/about`,
  },
  contact: {
    title: "Contact Us — Web Development Agency in Indore | MistHustlers",
    description: "Get in touch with MistHustlers in Indore. WhatsApp, call, or email us for a free quote on your web development or automation project.",
    canonical: `${SITE_URL}/contact`,
  },
  faq: {
    title: "FAQ — Web Development Services in Indore | MistHustlers",
    description: "Frequently asked questions about web development, pricing, process, and delivery from MistHustlers in Indore. Get answers in 48h.",
    canonical: `${SITE_URL}/faq`,
  },
  privacyPolicy: {
    title: "Privacy Policy — MistHustlers",
    description: "MistHustlers privacy policy. Learn how we collect, use, and protect your personal information.",
    canonical: `${SITE_URL}/privacy-policy`,
  },
  termsOfService: {
    title: "Terms of Service — MistHustlers",
    description: "MistHustlers terms of service. Understand the terms and conditions for using our web development services.",
    canonical: `${SITE_URL}/terms-of-service`,
  },
  refundPolicy: {
    title: "Refund Policy — MistHustlers",
    description: "MistHustlers refund and cancellation policy for web development and automation services.",
    canonical: `${SITE_URL}/refund-policy`,
  },
};
