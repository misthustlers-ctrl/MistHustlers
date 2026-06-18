INSERT INTO "content" ("id", "page", "data", "created_at", "updated_at")
VALUES (
  ('00000000-0000-4000-8000-' || substr(md5(random()::text || clock_timestamp()::text), 1, 12))::uuid,
  'about',
  $${
    "badge": "About Us",
    "title": ["Premium Ecosystem", "Based in Indore"],
    "highlightWord": "Based in Indore",
    "description": "MistHustlers helps ambitious students, developers, founders, agents, and partners learn, build, earn, and grow through real execution.",
    "membersTitle": "Core Team",
    "members": [{ "name": "Naveen Salve", "role": "Founder, MistHustlers", "initials": "NS", "bio": "Naveen is a developer and entrepreneur based in Indore. He founded MistHustlers to bridge the gap between ambitious builders and real-world execution." }],
    "whatTitle": "What We Do",
    "whatWeDo": ["MistHustlers is a premium ecosystem for learning, building, earning, and career growth.", "We build websites, MVPs, full-stack applications, and AI automation systems for startups and founders.", "We also manage client work through agents and partners with transparent tracking for delivery and payments."],
    "whyTitle": "Why Choose MistHustlers",
    "reasons": [{ "title": "Real Execution", "desc": "Work is tied to real projects, client delivery, and measurable outcomes." }, { "title": "Direct Access", "desc": "Clients and builders get direct communication with the people doing the work." }, { "title": "Transparent System", "desc": "Admin, agent, and partner dashboards keep work, leads, and payments visible." }, { "title": "Post-Delivery Support", "desc": "Projects include support and handoff so delivery does not stop at launch." }],
    "stackTitle": "Our Tech Stack",
    "stackDescription": "Technologies we use to ship production-ready projects",
    "techStack": ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS", "Railway", "OpenAI", "Automation"],
    "mapTitle": "MistHustlers Location - Indore",
    "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.21689636887!2d75.788529!3d22.719568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcad1b410ddb%3A0x96ec4da356240f4!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1"
  }$$::jsonb,
  now(),
  now()
)
ON CONFLICT ("page") DO NOTHING;

INSERT INTO "content" ("id", "page", "data", "created_at", "updated_at")
VALUES (
  ('00000000-0000-4000-8000-' || substr(md5(random()::text || clock_timestamp()::text), 1, 12))::uuid,
  'contact',
  $${
    "badge": "Get in Touch",
    "title": "Contact Us",
    "description": "Based in Indore, serving clients worldwide. Get a quote within 48 hours.",
    "address": "Indore, Madhya Pradesh 452001, India",
    "email": "misthustlers@gmail.com",
    "phone": "888 993 7648",
    "phoneHref": "+918889937648",
    "businessHours": "Mon-Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 2:00 PM",
    "infoTitle": "Contact Information",
    "addressLabel": "Address",
    "emailLabel": "Email",
    "phoneLabel": "Phone / WhatsApp",
    "hoursLabel": "Business Hours",
    "whatsappLabel": "Chat on WhatsApp",
    "whatsappText": "Hi MistHustlers, I want to discuss a project",
    "mapEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.21689636887!2d75.788529!3d22.719568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcad1b410ddb%3A0x96ec4da356240f4!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1",
    "mapTitle": "MistHustlers Location - Indore"
  }$$::jsonb,
  now(),
  now()
)
ON CONFLICT ("page") DO NOTHING;

UPDATE "content"
SET "data" = jsonb_set(
  "data"::jsonb,
  '{projectsShowcase}',
  $${
    "badge": "Project Showcase",
    "title": "Client-ready work we ship",
    "projects": [
      { "title": "Business Website Launch", "category": "Website", "visual": "WEB" },
      { "title": "Startup MVP Build", "category": "Full-stack", "visual": "MVP" },
      { "title": "Lead & Sheet Automation", "category": "Automation", "visual": "AI" },
      { "title": "Admin Dashboard Setup", "category": "CMS", "visual": "CMS" },
      { "title": "Client Work Management", "category": "Operations", "visual": "CRM" },
      { "title": "SEO & Performance Upgrade", "category": "Growth", "visual": "SEO" }
    ]
  }$$::jsonb,
  true
),
"updated_at" = now()
WHERE "page" = 'home'
  AND ("data"::jsonb #>> '{projectsShowcase,title}' IS NULL OR "data"::jsonb #>> '{projectsShowcase,title}' IN ('Built by the community', 'Recent community builds'));

UPDATE "content_drafts"
SET "data" = jsonb_set(
  "data"::jsonb,
  '{projectsShowcase}',
  $${
    "badge": "Project Showcase",
    "title": "Client-ready work we ship",
    "projects": [
      { "title": "Business Website Launch", "category": "Website", "visual": "WEB" },
      { "title": "Startup MVP Build", "category": "Full-stack", "visual": "MVP" },
      { "title": "Lead & Sheet Automation", "category": "Automation", "visual": "AI" },
      { "title": "Admin Dashboard Setup", "category": "CMS", "visual": "CMS" },
      { "title": "Client Work Management", "category": "Operations", "visual": "CRM" },
      { "title": "SEO & Performance Upgrade", "category": "Growth", "visual": "SEO" }
    ]
  }$$::jsonb,
  true
),
"updated_at" = now()
WHERE "page" = 'home'
  AND ("data"::jsonb #>> '{projectsShowcase,title}' IS NULL OR "data"::jsonb #>> '{projectsShowcase,title}' IN ('Built by the community', 'Recent community builds'));

UPDATE "content"
SET "data" = $${
  "badge": "Project Showcase",
  "title": "Client-ready work we ship",
  "highlightWord": "ship",
  "subtitle": "Examples of the website, MVP, automation, CMS, and growth systems MistHustlers can deliver for clients.",
  "projects": [
    { "title": "Business Website Launch", "category": "Website", "imageUrl": "", "desc": "A fast, mobile-ready business website with service pages, inquiry forms, SEO basics, and analytics-ready structure." },
    { "title": "Startup MVP Build", "category": "Full-stack", "imageUrl": "", "desc": "A production-ready MVP with frontend, backend, database, authentication, admin workflows, and deployment setup." },
    { "title": "Lead & Sheet Automation", "category": "Automation", "imageUrl": "", "desc": "A lead capture flow connected with Gmail and Google Sheets so every form submission is tracked and followed up." },
    { "title": "Admin Dashboard Setup", "category": "CMS", "imageUrl": "", "desc": "A restricted admin panel to manage content, leads, projects, media, accounts, and operational overview." },
    { "title": "Client Work Management", "category": "Operations", "imageUrl": "", "desc": "Agent and partner dashboards for client work, assignment, delivery status, payout tracking, and payment history." },
    { "title": "SEO & Performance Upgrade", "category": "Growth", "imageUrl": "", "desc": "A technical cleanup for speed, metadata, page content, schema, mobile UX, and deployment readiness." }
  ]
}$$::jsonb,
"updated_at" = now()
WHERE "page" = 'projects'
  AND ("data"::jsonb -> 'projects' @> '[{"title":"Automation Dashboard"}]'::jsonb OR "data"::jsonb #>> '{title}' = 'Built by the community');

UPDATE "content_drafts"
SET "data" = $${
  "badge": "Project Showcase",
  "title": "Client-ready work we ship",
  "highlightWord": "ship",
  "subtitle": "Examples of the website, MVP, automation, CMS, and growth systems MistHustlers can deliver for clients.",
  "projects": [
    { "title": "Business Website Launch", "category": "Website", "imageUrl": "", "desc": "A fast, mobile-ready business website with service pages, inquiry forms, SEO basics, and analytics-ready structure." },
    { "title": "Startup MVP Build", "category": "Full-stack", "imageUrl": "", "desc": "A production-ready MVP with frontend, backend, database, authentication, admin workflows, and deployment setup." },
    { "title": "Lead & Sheet Automation", "category": "Automation", "imageUrl": "", "desc": "A lead capture flow connected with Gmail and Google Sheets so every form submission is tracked and followed up." },
    { "title": "Admin Dashboard Setup", "category": "CMS", "imageUrl": "", "desc": "A restricted admin panel to manage content, leads, projects, media, accounts, and operational overview." },
    { "title": "Client Work Management", "category": "Operations", "imageUrl": "", "desc": "Agent and partner dashboards for client work, assignment, delivery status, payout tracking, and payment history." },
    { "title": "SEO & Performance Upgrade", "category": "Growth", "imageUrl": "", "desc": "A technical cleanup for speed, metadata, page content, schema, mobile UX, and deployment readiness." }
  ]
}$$::jsonb,
"updated_at" = now()
WHERE "page" = 'projects'
  AND ("data"::jsonb -> 'projects' @> '[{"title":"Automation Dashboard"}]'::jsonb OR "data"::jsonb #>> '{title}' = 'Built by the community');
