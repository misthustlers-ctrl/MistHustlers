export const SITE_NAME = "MistHustlers";
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://www.misthustlers.in").replace(/\/$/, "");
export const DEFAULT_OG_IMAGE = "/og-image.png";
export const TWITTER_HANDLE = "@misthustlers";
export const SITE_LOCATION = "Indore, Madhya Pradesh, India";

export interface PageMeta {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  canonical?: string;
  h1?: string;
  keywords?: string;
  /** ISO date string for article:published_time meta tag */
  publishedTime?: string;
}

export const PAGE_META: Record<string, PageMeta> = {
  home: {
    title: "MistHustlers — Global Web Development & AI Technology Partner",
    description: "MistHustlers builds custom web applications, MVPs, SaaS products, ecommerce platforms, and AI-powered automation for businesses worldwide. Fixed pricing. 48-hour quotes. Founder-led. Remote-first across US, UK, EU, APAC timezones.",
    canonical: SITE_URL,
    keywords: "web development company, web development agency, custom web development, web application development, ecommerce development, MVP development, SaaS development, AI development, AI automation, workflow automation, website redesign",
  },
  services: {
    title: "Global Web & Mobile Development & AI Automation Services — MistHustlers",
    description: "Explore fixed-price website development, custom web applications, Mobile App MVPs, Web MVP Starters, SaaS development, AI workflow automation, ecommerce development, and website redesign. Serving clients worldwide from our Indore HQ.",
    canonical: `${SITE_URL}/services`,
    keywords: "web development services, website development agency, custom web development, mobile app development, mobile app MVP, web application development, ecommerce development, MVP development, SaaS development, AI development, AI automation, workflow automation, website redesign",
  },
  webDevelopment: {
    title: "Custom Web Development Company — Global Web Development Services | MistHustlers",
    description: "Custom web development company building fast, responsive, SEO-optimized business websites worldwide. React, Next.js, Node.js, TypeScript solutions with fixed pricing, 48-hour quotes, and full source code ownership.",
    canonical: `${SITE_URL}/services/web-development`,
    keywords: "web development company, custom web development, web development services, website development company, web development agency, custom website development",
  },
  webDesign: {
    title: "Web Design Company in Indore | UI/UX & Website Designers — MistHustlers",
    description: "Stunning modern UI/UX web design company in Indore. We design user-friendly, high-converting websites, mobile landing pages, and web app interfaces.",
    canonical: `${SITE_URL}/services/web-design`,
    keywords: "web design company Indore, website designer in Indore, custom web design India, UI UX design agency Indore",
  },
  webApplicationDevelopment: {
    title: "Web Application Development Company — Global Custom Web Apps | MistHustlers",
    description: "Custom web application development company building SaaS platforms, admin dashboards, customer portals, and API-first products. Next.js, React, Node.js, TypeScript. Fixed pricing. 48-hour quotes. Global delivery.",
    canonical: `${SITE_URL}/services/web-application-development`,
    keywords: "web application development, custom web app development, web app development company, full stack web development, SaaS development, API development",
  },
  ecommerceDevelopment: {
    title: "Ecommerce Development Company — Custom Shopify, Headless, B2B | MistHustlers",
    description: "Ecommerce development company building Shopify, headless commerce, WooCommerce, and B2B wholesale portals. Fixed pricing from $99/₹9,999. 48-hour quotes. Global delivery.",
    canonical: `${SITE_URL}/services/ecommerce-development`,
    keywords: "ecommerce development, ecommerce website development, Shopify development, headless commerce, B2B ecommerce, online store development",
  },
  websiteRedesign: {
    title: "Website Redesign Company — SEO-Preserving Migration & Modernization | MistHustlers",
    description: "Website redesign company specializing in WordPress to Next.js migration, legacy modernization, Core Web Vitals optimization, and SEO-preserving redesign. Fixed pricing. 48-hour quotes.",
    canonical: `${SITE_URL}/services/website-redesign`,
    keywords: "website redesign, website redesign services, website redesign company, WordPress to Next.js migration, legacy modernization, Core Web Vitals optimization",
  },
  customWebDevelopment: {
    title: "Custom Web Development Company — Bespoke Web Solutions | MistHustlers",
    description: "Custom web development company building bespoke websites and applications with custom databases, workflows, integrations, and proprietary features. Fixed pricing. 48-hour quotes.",
    canonical: `${SITE_URL}/services/custom-web-development`,
    keywords: "custom web development, custom website development, bespoke web development, custom web application, custom web development company, custom software development",
  },
  saasDevelopment: {
    title: "SaaS Development Company — Multi-Tenant Platforms & Billing | MistHustlers",
    description: "SaaS development company building multi-tenant platforms with Stripe billing, user management, admin dashboards, and customer APIs. Fixed pricing. 48-hour quotes. Global delivery.",
    canonical: `${SITE_URL}/services/saas-development`,
    keywords: "SaaS development, SaaS development company, multi-tenant SaaS, Stripe billing integration, SaaS MVP development, B2B SaaS development",
  },
  aiDevelopment: {
    title: "AI Development Company — Custom AI Agents, RAG, LLM Integration | MistHustlers",
    description: "AI development company building custom AI agents, RAG systems, LLM chatbots, document intelligence, and custom fine-tuning. Fixed pricing from $199. 48-hour quotes. Global delivery.",
    canonical: `${SITE_URL}/services/ai-development`,
    keywords: "AI development, AI development company, AI agent development, RAG development, LLM integration, custom AI, fine-tuning, document intelligence",
  },
  automation: {
    title: "AI & Business Workflow Automation Agency — Global Automation Services | MistHustlers",
    description: "AI & workflow automation agency building custom automation, AI agents, WhatsApp automation, CRM integrations, and data pipelines. Fixed pricing from $49. 48-hour quotes. Global delivery.",
    canonical: `${SITE_URL}/services/automation`,
    keywords: "AI automation agency, workflow automation, business process automation, AI agents, WhatsApp automation, CRM automation",
  },
  crmDevelopment: {
    title: "Custom CRM & CMS Development Services — Global CRM Solutions | MistHustlers",
    description: "Build custom CRM dashboards, lead management pipelines, and client portals tailored to your business process. Fixed pricing. 48-hour quotes. Global delivery.",
    canonical: `${SITE_URL}/services/crm-development`,
    keywords: "CRM development, custom CRM, lead management portal, admin dashboard development, custom CMS",
  },
  mvpDevelopment: {
    title: "Web MVP Development Company — Global Web MVP Services | MistHustlers",
    description: "Launch your web startup idea in 3-4 weeks. Founder-focused Web MVP development company providing clickable prototypes, full-stack build, and market handover. Web MVP Starter from ₹74,999. Fixed pricing. 48-hour quotes. Global delivery.",
    canonical: `${SITE_URL}/services/mvp-development`,
    keywords: "MVP development, web MVP development, startup web MVP, SaaS prototype developer, fast MVP build, MVP development company",
  },
  uiUx: {
    title: "UI/UX Design Agency — Global Design Services | MistHustlers",
    description: "User research, wireframing, high-fidelity Figma design, and conversion rate optimization for websites and SaaS platforms. Fixed pricing. 48-hour quotes. Global delivery.",
    canonical: `${SITE_URL}/services/ui-ux`,
    keywords: "UI UX design, Figma web design agency, user interface designer, conversion UX design, UX design agency",
  },
  maintenance: {
    title: "Website Maintenance & Speed Optimization Services — Global Support | MistHustlers",
    description: "Keep your website secure, fast, and bug-free with technical monitoring, page speed optimization, security updates, and backup management. Fixed pricing. Global delivery.",
    canonical: `${SITE_URL}/services/maintenance`,
    keywords: "website maintenance, website speed optimization, Core Web Vitals fix, WordPress maintenance, website support",
  },
  appDevelopment: {
    title: "Mobile App Development Company — Global Mobile App MVP | MistHustlers",
    description: "Custom mobile app development for iOS & Android. Flutter, React Native, cross-platform MVP from ₹24,999+. Fixed pricing. 48-hour quotes. App Store/Play Store deployment. Global delivery.",
    canonical: `${SITE_URL}/services/app-development`,
    keywords: "mobile app development, app development company, mobile app MVP, Flutter development, React Native, cross-platform app development, iOS Android app",
  },

  // Industry Landing Pages
  industries: {
    title: "Industry Web Development & Automation Solutions | MistHustlers",
    description: "Tailored web design, software development, and AI automation for Restaurants, Interior Designers, Doctors, Law Firms, Real Estate & Startups.",
    canonical: `${SITE_URL}/industries`,
    keywords: "industry web development, web design for doctors, restaurant website development, real estate web design Indore",
  },
  indRestaurant: {
    title: "Web Design & Online Ordering for Restaurants in Indore | MistHustlers",
    description: "Custom restaurant websites with digital menus, table reservation, online food ordering systems, and Google My Business integration in Indore.",
    canonical: `${SITE_URL}/industries/restaurant`,
    keywords: "restaurant website developer Indore, online food order website, digital menu developer, restaurant SEO Indore",
  },
  indInterior: {
    title: "Web Development & Portfolio Websites for Interior Designers | MistHustlers",
    description: "Showcase high-resolution interior design portfolios, lead generation forms, and project galleries for interior architects in Indore.",
    canonical: `${SITE_URL}/industries/interior-designer`,
    keywords: "interior design website builder Indore, portfolio web design interior designer, lead generation interior business",
  },
  indDoctor: {
    title: "Healthcare & Doctor Website Development in Indore | MistHustlers",
    description: "Clinic & doctor website development with patient online appointment booking, doctor profiles, tele-consultation forms & local SEO in Indore.",
    canonical: `${SITE_URL}/industries/doctor`,
    keywords: "doctor website developer Indore, clinic website design, patient booking portal, medical SEO Indore",
  },
  indLawFirm: {
    title: "Law Firm & Advocate Website Development in Indore | MistHustlers",
    description: "Professional, trustworthy website development for law firms, advocates, and legal consultants with client consultation booking in Indore.",
    canonical: `${SITE_URL}/industries/law-firm`,
    keywords: "law firm web design Indore, advocate website developer, legal consultation portal, law firm SEO India",
  },
  indConstruction: {
    title: "Construction & Builder Website Development in Indore | MistHustlers",
    description: "Heavy-duty website design for construction companies, civil contractors, and infrastructure firms to display projects and win tenders.",
    canonical: `${SITE_URL}/industries/construction`,
    keywords: "construction company website developer Indore, builder web design, contractor portfolio website",
  },
  indRealEstate: {
    title: "Real Estate Website Development & Property Portals | MistHustlers",
    description: "Property listing websites, real estate agent portals, plot booking pages, and WhatsApp lead integration for real estate in Indore.",
    canonical: `${SITE_URL}/industries/real-estate`,
    keywords: "real estate website developer Indore, property portal development, builder landing page, real estate SEO",
  },
  indTravel: {
    title: "Travel Agency & Tour Booking Website Development | MistHustlers",
    description: "Travel portal development, tour itinerary booking systems, taxi booking websites, and payment gateway integration in Indore.",
    canonical: `${SITE_URL}/industries/travel`,
    keywords: "travel website developer Indore, tour booking web design, cab booking website developer",
  },
  indEducation: {
    title: "School, Coaching & School Management Websites | MistHustlers",
    description: "Coaching institute & school website design with online admission forms, course portals, student inquiries, and fee integration in Indore.",
    canonical: `${SITE_URL}/industries/education`,
    keywords: "coaching institute website design Indore, school website developer, LMS development India",
  },
  indManufacturing: {
    title: "Manufacturing & Industrial B2B Website Development | MistHustlers",
    description: "B2B product catalog websites, manufacturing plant portals, RFQ inquiry systems, and Google Search optimization for manufacturers.",
    canonical: `${SITE_URL}/industries/manufacturing`,
    keywords: "manufacturing website developer Indore, B2B industrial website design, RFQ lead portal",
  },
  indStartup: {
    title: "Startup Tech Partner & Web Development Agency | MistHustlers",
    description: "Dedicated full-stack engineering team for startups. Fast prototyping, scalable architecture, and founder support in Indore.",
    canonical: `${SITE_URL}/industries/startup`,
    keywords: "startup tech partner Indore, website developer for startups, SaaS engineering agency",
  },

  // Trust & Pricing
  pricing: {
    title: "Transparent Web & Mobile Development, Ecommerce, MVP & AI Automation Pricing | MistHustlers",
    description: "Clear fixed pricing starting at ₹14,999. No hidden costs. Website packages from ₹14,999, Mobile App MVP from ₹24,999+, Web MVP Starter from ₹74,999+, SaaS from ₹2,49,999+, AI Automation from ₹14,999+, Maintenance from ₹1,499/month.",
    canonical: `${SITE_URL}/pricing`,
    keywords: "web development pricing, mobile app development cost, MVP development fees, SaaS development pricing, AI automation cost, website maintenance pricing, transparent dev pricing",
  },
  testimonials: {
    title: "Client Reviews & Testimonials — Web Agency Indore | MistHustlers",
    description: "Read real client reviews, ratings, and founder feedback about MistHustlers' web development, MVP, and automation projects in Indore.",
    canonical: `${SITE_URL}/testimonials`,
    keywords: "MistHustlers reviews, website developer ratings Indore, web agency client feedback",
  },

  // Company & Core
  projects: {
    title: "Web Development Projects & Portfolio | MistHustlers Indore",
    description: "Browse live website demos, SaaS MVPs, client applications, and automation systems designed and engineered by MistHustlers.",
    canonical: `${SITE_URL}/projects`,
    keywords: "web development portfolio Indore, website demos, SaaS MVP examples, agency projects",
  },
  about: {
    title: "About MistHustlers — Web Development Agency in Indore",
    description: "Started in 2026 in Indore, MistHustlers is a web development and AI automation agency empowering startups and growing businesses.",
    canonical: `${SITE_URL}/about`,
    keywords: "about MistHustlers, web agency Indore, Indore software company, website development agency India",
  },
  contact: {
    title: "Contact MistHustlers — Web Development Agency in Indore",
    description: "Get a free 48-hour quote or consultation for your website, app, or AI automation project in Indore. Call +91 888 993 7648 or WhatsApp us.",
    canonical: `${SITE_URL}/contact`,
    keywords: "contact website developer Indore, get web design quote, MistHustlers address Indore, phone number",
  },
  faq: {
    title: "FAQ — Website Development & Pricing in Indore | MistHustlers",
    description: "Answers to popular questions about website delivery timelines, technology stacks, payment terms, domain hosting, and source code ownership.",
    canonical: `${SITE_URL}/faq`,
    keywords: "web development FAQ Indore, website questions, website delivery time, website cost FAQ",
  },
  notFound: {
    title: "Page Not Found — MistHustlers",
    description: "The page you are looking for does not exist. Return to MistHustlers home page.",
    canonical: SITE_URL,
  },
  privacyPolicy: {
    title: "Privacy Policy — MistHustlers",
    description: "MistHustlers privacy policy detailing data protection, analytics, contact inquiries, and privacy compliance.",
    canonical: `${SITE_URL}/privacy-policy`,
  },
  termsOfService: {
    title: "Terms of Service — MistHustlers",
    description: "MistHustlers terms of service covering web development agreements, project delivery, and payment terms.",
    canonical: `${SITE_URL}/terms-of-service`,
  },
  refundPolicy: {
    title: "Refund Policy — MistHustlers",
    description: "MistHustlers refund & satisfaction guarantee policy for web development and software services.",
    canonical: `${SITE_URL}/refund-policy`,
  },

  // City & Location Pages
  locationIndore: {
    title: "Web Development Company in Indore | Top Websites & AI Automation — MistHustlers",
    description: "Indore's leading web development company. We build fast business websites, Mobile App MVPs, Web MVP Starters, and AI automation workflows for local and national clients. Starting at ₹14,999. Call +91 888 993 7648.",
    canonical: `${SITE_URL}/web-development-company-indore`,
    keywords: "web development company Indore, website developer Indore, web design agency Indore, software company Indore, IT company Indore, MistHustlers Indore",
    ogTitle: "#1 Web Development Company in Indore — MistHustlers",
    ogDescription: "Indore's top web dev & AI automation agency. Business websites from ₹14,999. Mobile App MVPs from ₹24,999. Web MVPs from ₹74,999. 48-hour quotes. Fixed price. Call now.",
  },

  // Case Studies
  caseStudies: {
    title: "Web Development Case Studies & Client Results | MistHustlers Indore",
    description: "Read real case studies of how MistHustlers transformed businesses in Indore with custom websites, startup MVPs, and AI automation. Real results, real metrics.",
    canonical: `${SITE_URL}/case-studies`,
    keywords: "web development case studies India, website redesign results, startup MVP success story, AI automation case study Indore",
  },

  // SEO Tools
  seoAudit: {
    title: "Free SEO Audit Tool & Website SEO Checker | MistHustlers",
    description: "Run a free 14-point SEO audit for any website. Check title, meta, H1, schema, Open Graph, mobile SEO, image alt text and content depth.",
    canonical: `${SITE_URL}/seo-audit`,
    keywords: "free SEO audit tool, website SEO checker, on-page SEO checker, SEO score checker, free website audit, technical SEO audit, SEO audit report India, SEO checker Indore",
    ogTitle: "Free SEO Audit Tool — 14-point website SEO checker",
    ogDescription: "Check any website for on-page SEO issues, metadata gaps, schema, mobile viewport, social previews, image alt text, and content depth.",
    h1: "Free SEO Audit Tool",
  },
};
