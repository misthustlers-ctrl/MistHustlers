import { useParams, Link, Navigate } from "react-router-dom";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import TrustSection from "@/components/TrustSection";
import FAQItem from "@/components/FAQItem";
import { getDemoBySlug, type DemoProject } from "@/data/demoProjects";
import { CheckCircle, ArrowRight, Zap, ExternalLink, Star } from "lucide-react";

const INDUSTRY_DEMO: Record<string, string> = {
  restaurant: "restaurant",
  "interior-designer": "interior",
  education: "coaching",
  "law-firm": "restaurant",
  construction: "interior",
  "real-estate": "coaching",
  travel: "restaurant",
  manufacturing: "interior",
  startup: "coaching",
};

const PORTFOLIO_BACKED_INDUSTRIES = new Set(Object.keys(INDUSTRY_DEMO));

function DemoCard({ demo }: { demo: DemoProject }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-bold text-abyssal-ink">Project Preview</h3>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          {demo.status}
        </span>
      </div>
      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-abyssal-ink/45">{demo.client}</p>

      <div
        className="mt-4 flex h-40 items-center justify-center overflow-hidden rounded-2xl"
        style={{ background: demo.gradient }}
      >
        {demo.previewImage ? (
          <img src={demo.previewImage} alt={demo.title} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-5xl tracking-[0.08em] text-white/90">{demo.title.charAt(0)}</span>
        )}
      </div>

      <h2 className="mt-4 font-display text-2xl font-bold text-abyssal-ink leading-tight">{demo.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-abyssal-ink/65">{demo.description}</p>

      {demo.ratingBreakdown && (
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-abyssal-ink/70">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span>
            {demo.defaultRating.toFixed(1)} <span className="font-normal text-abyssal-ink/45">/ 5 project preview rating</span>
          </span>
        </div>
      )}

      <Link
        to={`/projects/demo/${demo.slug}`}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-digital-orange px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
      >
        Open Live Demo Preview
        <ExternalLink className="h-4 w-4" />
      </Link>
      <Link
        to={`/industries`}
        className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-abyssal-ink/15 px-5 py-3 text-sm font-bold text-abyssal-ink hover:bg-ash-white"
      >
        Explore More Previews <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

interface IndustryDetail {
  slug: string;
  metaKey: string;
  title: string;
  subtitle: string;
  heroDesc: string;
  aiDefinition: string;
  benefits: string[];
  features: { title: string; desc: string }[];
  process: string[];
  techStack: string[];
  faqs: { question: string; answer: string }[];
}

const INDUSTRY_DATA: Record<string, IndustryDetail> = {
  restaurant: {
    slug: "restaurant",
    metaKey: "indRestaurant",
    title: "Web Development & Digital Menus for Restaurants in Indore",
    subtitle: "Custom Restaurant Websites, Online Food Ordering & Local Google Maps SEO",
    heroDesc: "Drive direct online orders, table reservations, and foot traffic to your cafe or restaurant in Indore without paying high aggregator commissions.",
    aiDefinition: "A restaurant website integrates digital menus, table reservation forms, location maps, and WhatsApp food ordering to increase direct customer acquisition.",
    benefits: ["Zero Commission Direct Food Orders", "Google My Business Map Pack Optimization", "Instant WhatsApp Table Reservation Bot", "Mobile-Optimized Digital Menu QR Codes"],
    features: [
      { title: "Digital QR Code Menu", desc: "Fast-loading mobile menu with dish photos, price updates, and instant filtering." },
      { title: "Direct WhatsApp Order Bot", desc: "Customers send food orders directly to your restaurant WhatsApp kitchen number." },
      { title: "Local Indore SEO", desc: "Rank #1 for terms like 'best restaurant near me' and 'top cafe in Indore'." },
    ],
    process: ["Menu & Brand Audit", "Figma Design & Menu Setup", "WhatsApp & Ordering Integration", "Go Live & Local Maps SEO"],
    techStack: ["React", "Next.js", "WhatsApp Business API", "Google Maps Embed"],
    faqs: [
      { question: "Can customers order food directly without Zomato or Swiggy?", answer: "Yes! We set up direct WhatsApp and web ordering so you keep 100% of your order profit margin." },
      { question: "How long does a restaurant website build take?", answer: "We deliver complete restaurant websites with digital menus in 5 to 7 days." },
    ],
  },
  "interior-designer": {
    slug: "interior-designer",
    metaKey: "indInterior",
    title: "Web Development for Interior Designers & Architects in Indore",
    subtitle: "High-Resolution Portfolio Websites & Lead Generation Systems",
    heroDesc: "Showcase your interior architecture projects in high definition, establish premium brand authority, and attract high-ticket residential & commercial clients.",
    aiDefinition: "An interior designer portfolio website presents past projects, 3D renders, architectural blueprints, client testimonials, and consultation booking forms.",
    benefits: ["Full-Screen High-Res Project Gallery", "High-Ticket Client Lead Forms", "Instagram & Pinterest Integration", "Founder & Studio Authority Branding"],
    features: [
      { title: "Portfolio Filter Grid", desc: "Filter by Living Room, Modular Kitchen, Commercial Office, or Villa Projects." },
      { title: "Consultation Booking Form", desc: "Qualify prospective interior clients with budget and site location fields." },
      { title: "Interactive Before/After Slider", desc: "Showcase impressive site transformations with visual image sliders." },
    ],
    process: ["Project Photography Curation", "Luxury UI/UX Wireframing", "Portfolio Web Build", "SEO & Launch"],
    techStack: ["Next.js", "Framer Motion", "Tailwind CSS", "Cloudinary"],
    faqs: [
      { question: "Can I upload new interior project photos myself?", answer: "Yes! We provide an easy-to-use CMS dashboard so you can add new projects in 2 minutes." },
    ],
  },
  doctor: {
    slug: "doctor",
    metaKey: "indDoctor",
    title: "Doctor & Healthcare Clinic Website Development in Indore",
    subtitle: "Patient Online Appointment Booking, Doctor Profiles & Local SEO",
    heroDesc: "Empower patients to book consultations 24/7, review clinic treatments, check doctor availability, and locate your clinic on Google Maps.",
    aiDefinition: "A healthcare website provides verified medical service details, doctor qualifications, online appointment booking calendars, and local map directions.",
    benefits: ["24/7 Online Patient Appointment Booking", "Google My Business & Map Pack Optimization", "Doctor Specialty & Qualification Profiles", "WhatsApp Appointment Reminders"],
    features: [
      { title: "Appointment Calendar", desc: "Patients pick available time slots for clinic visits or tele-consultations." },
      { title: "Treatment & Specialty Pages", desc: "Detailed information on treatments, procedures, and post-care FAQs." },
      { title: "Patient Review Trust Signals", desc: "Display verified patient feedback and star ratings to build immediate confidence." },
    ],
    process: ["Clinic Requirement Analysis", "HIPAA/Privacy Compliant Design", "Appointment System Setup", "Launch & Local SEO"],
    techStack: ["React", "Node.js", "Google Maps API", "Twilio / WhatsApp API"],
    faqs: [
      { question: "Is the appointment booking system easy for patients to use?", answer: "Extremely simple! Patients pick a slot, enter their name and mobile number, and receive an instant SMS/WhatsApp confirmation." },
    ],
  },
  "law-firm": {
    slug: "law-firm",
    metaKey: "indLawFirm",
    title: "Law Firm & Advocate Website Development in Indore",
    subtitle: "Professional Legal Consultation Portals & Authority Building",
    heroDesc: "Establish authoritative digital presence for legal practices, advocates, and corporate legal consultants with secure consultation scheduling.",
    aiDefinition: "A legal website outlines practice areas, attorney credentials, case outcomes, legal insights, and secure client inquiry booking.",
    benefits: ["Authority Legal Practice Pages", "Confidential Consultation Forms", "Advocate Profile & Track Record", "Legal Search Engine Visibility"],
    features: [
      { title: "Practice Area Portals", desc: "Dedicated pages for Corporate Law, Criminal Defense, Real Estate Disputes, and Family Law." },
      { title: "Confidential Inquiry Intake", desc: "Encrypted contact forms designed for sensitive legal inquiries." },
    ],
    process: ["Practice Consultation", "Corporate Legal Design", "Security Audit", "Launch"],
    techStack: ["Next.js", "Tailwind CSS", "Formspree", "SEO Schema"],
    faqs: [
      { question: "How long does a law firm website take to build?", answer: "Typically 7 to 10 business days." },
    ],
  },
  construction: {
    slug: "construction",
    metaKey: "indConstruction",
    title: "Construction Company & Builder Website Development in Indore",
    subtitle: "Heavy-Duty Project Portfolios, Tender Showcases & B2B Leads",
    heroDesc: "Showcase completed civil projects, infrastructure developments, safety certifications, and win commercial construction tenders.",
    aiDefinition: "A construction website showcases infrastructure capabilities, ongoing building sites, equipment lists, and tender bid request forms.",
    benefits: ["Commercial Tender Showcase", "Equipment & Machinery List", "Safety & ISO Certification Badges", "Government & Private B2B RFQ Forms"],
    features: [
      { title: "Project Case Studies", desc: "Highlight square footage, budget, client name, and completion timeline." },
      { title: "RFQ & Tender Portal", desc: "Allow corporate clients to upload tender documents and request bids." },
    ],
    process: ["Scope & Project Audit", "Industrial UI Build", "B2B Lead Form Setup", "Deployment"],
    techStack: ["React", "Tailwind CSS", "Cloudinary"],
    faqs: [
      { question: "Can we list ongoing and completed projects separately?", answer: "Yes! Dedicated tabs allow visitors to filter by ongoing, completed, and upcoming projects." },
    ],
  },
  "real-estate": {
    slug: "real-estate",
    metaKey: "indRealEstate",
    title: "Real Estate Website & Property Portal Development in Indore",
    subtitle: "Property Listings, Lead Capture & WhatsApp Property Bot",
    heroDesc: "Capture high-intent property buyers, showcase residential plots & commercial spaces in Indore, and route leads directly to sales agents.",
    aiDefinition: "A real estate website aggregates property listings, virtual tours, price calculators, location advantages, and site visit scheduling.",
    benefits: ["Property Search & Filter System", "Instant WhatsApp Site Visit Booking", "Location Map & Amenities Grid", "High-Converting Lead Landing Pages"],
    features: [
      { title: "Property Listing Engine", desc: "Filter by location (Vijay Nagar, Super Corridor), property type, and price range." },
      { title: "Site Visit Scheduler", desc: "Buyers pick a date and time for a guided site visit." },
    ],
    process: ["Property Catalog Scoping", "Portal Architecture", "WhatsApp Lead Sync", "Launch"],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Google Maps"],
    faqs: [
      { question: "Can we integrate property listing updates easily?", answer: "Yes, via an admin panel or custom CMS." },
    ],
  },
  travel: {
    slug: "travel",
    metaKey: "indTravel",
    title: "Travel Agency & Tour Booking Website Development in Indore",
    subtitle: "Tour Itinerary Showcases, Direct Booking & Inquiry Engines",
    heroDesc: "Attract holidaymakers, display tour packages (Ujjain, Omkareshwar, MP Tourism, International), and capture instant travel inquiries.",
    aiDefinition: "A travel website presents tour packages, day-by-day itineraries, inclusion details, customer reviews, and direct booking forms.",
    benefits: ["Interactive Tour Itineraries", "Custom Package Inquiry Builder", "Payment Gateway Integration", "Traveler Review Badges"],
    features: [
      { title: "Tour Itinerary Builder", desc: "Display day-wise plans, hotel stay details, meals, and flight inclusion." },
      { title: "Instant Quote Request", desc: "Travelers enter dates and passenger count for instant customized pricing." },
    ],
    process: ["Itinerary Mapping", "Travel UI Design", "Booking Form Integration", "Go Live"],
    techStack: ["React", "Razorpay Integration", "Tailwind CSS"],
    faqs: [
      { question: "Can we accept online payments for tour booking deposits?", answer: "Yes, via UPI, credit cards, or net banking using Razorpay/Cashfree." },
    ],
  },
  education: {
    slug: "education",
    metaKey: "indEducation",
    title: "School & Coaching Institute Website Development in Indore",
    subtitle: "Online Student Admissions, Course Catalogs & Student Inquiry Forms",
    heroDesc: "Boost student admissions for coaching classes, schools, and competitive exam institutes (JEE, NEET, UPSC) in Indore.",
    aiDefinition: "An educational website features course curriculums, faculty credentials, student results, online fee payment, and admission inquiry forms.",
    benefits: ["Online Student Admission Form", "Course & Test Series Catalog", "Student Result Hall of Fame", "Fee Inquiry & Parent Portal"],
    features: [
      { title: "Student Results Gallery", desc: "Display rankers, pass percentages, and student video testimonials." },
      { title: "Course Curriculum Details", desc: "Outline batch timings, syllabus breakdown, and fee structures." },
    ],
    process: ["Curriculum & Batch Mapping", "Edu UI Build", "Admission Form Setup", "Launch"],
    techStack: ["React", "Node.js", "Tailwind CSS"],
    faqs: [
      { question: "Can parents fill admission forms online?", answer: "Yes! Digital forms with document upload capabilities are included." },
    ],
  },
  manufacturing: {
    slug: "manufacturing",
    metaKey: "indManufacturing",
    title: "Manufacturing & Industrial B2B Website Development in Indore",
    subtitle: "B2B Product Catalogs, Global Export SEO & RFQ Lead Portals",
    heroDesc: "Position your manufacturing plant or industrial firm for B2B buyers across India and global export markets.",
    aiDefinition: "A manufacturing website presents machine specifications, ISO quality standards, factory tour media, and RFQ request forms.",
    benefits: ["B2B Industrial Product Catalog", "Request for Quotation (RFQ) System", "Export Market SEO Optimization", "Factory & Machinery Photo Gallery"],
    features: [
      { title: "Technical Spec Tables", desc: "Detail dimensions, material grades, tolerance, and minimum order quantities (MOQ)." },
      { title: "RFQ Form", desc: "B2B buyers request price quotes with CAD file attachment options." },
    ],
    process: ["Product Catalog Audit", "Industrial B2B Build", "RFQ Integration", "Global SEO Launch"],
    techStack: ["Next.js", "Tailwind CSS", "Schema Markup"],
    faqs: [
      { question: "Do you help with international export SEO for manufacturers?", answer: "Yes! We optimize product pages for global B2B search queries." },
    ],
  },
  startup: {
    slug: "startup",
    metaKey: "indStartup",
    title: "Tech Partner & MVP Web Development for Startups in Indore",
    subtitle: "Fast SaaS Prototyping, Full-Stack Engineering & Founder Support",
    heroDesc: "Ship your startup MVP in weeks, not months. Senior technical engineering partner in Indore helping founders validate ideas fast.",
    aiDefinition: "A startup MVP engineering service provides wireframing, frontend/backend development, database design, API integrations, and cloud launch.",
    benefits: ["Fixed-Price 2-4 Week Delivery", "Complete Source Code Handover", "Scalable Next.js & Node Architecture", "Direct Senior Founder Support"],
    features: [
      { title: "Core User Flow", desc: "Focus 100% on the core feature set needed to prove product-market fit." },
      { title: "Scalable Tech Stack", desc: "Built on modern, production-tested open source frameworks with zero lock-in." },
    ],
    process: ["Scope & Wireframe Sprint", "Build Sprint", "QA & Polish", "Handover & Deploy"],
    techStack: ["Next.js", "TypeScript", "Tailwind", "PostgreSQL / Firebase"],
    faqs: [
      { question: "Do we retain 100% intellectual property (IP) and code rights?", answer: "Absolutely. Full source code rights are transferred upon project completion." },
    ],
  },
};

export default function IndustryPage() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug || !PORTFOLIO_BACKED_INDUSTRIES.has(slug)) {
    return <Navigate to="/industries" replace />;
  }

  const data = slug ? INDUSTRY_DATA[slug] : null;
  const demo = slug && INDUSTRY_DEMO[slug] ? getDemoBySlug(INDUSTRY_DEMO[slug]) : undefined;

  if (!data) {
    return <Navigate to="/industries" replace />;
  }

  return (
    <>
      <SEO page={data.metaKey || "industries"} />
      <SchemaMarkup page={data.metaKey || "industries"} faq={data.faqs} />

      <main id="main-content" className="bg-basalt-canvas min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Industries", to: "/industries" }, { label: data.title.split(" in ")[0] }]} />

          {/* Hero */}
          <section className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-digital-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-digital-orange font-body">
                <Zap className="h-4 w-4" /> Industry Web Development Solution
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-abyssal-ink leading-tight">
                {data.title}
              </h1>
              <p className="text-base sm:text-lg text-abyssal-ink/70 font-body leading-relaxed">
                {data.heroDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-body text-xs font-semibold text-abyssal-ink">
                {data.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-4 font-body">
                <a href="#quote" className="magnetic-btn bg-digital-orange text-white px-7 py-3.5 rounded-full font-bold text-sm">
                  Get Free Industry Quote
                </a>
                <a href="https://wa.me/918889937648" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-abyssal-ink/20 px-6 py-3.5 rounded-full font-bold text-sm text-abyssal-ink hover:bg-ash-white">
                  WhatsApp Us
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-3xl border border-abyssal-ink/10 bg-white p-6 shadow-xl">
              {demo ? (
                <DemoCard demo={demo} />
              ) : (
                <>
                  <h3 className="font-display text-xl font-bold text-abyssal-ink mb-4">Request Consultation</h3>
                  <ServiceInquiryForm preselectedPackage="Business Growth Website" />
                </>
              )}
            </div>
          </section>

          {/* AI Search Structured Answer */}
          <section className="mt-16 rounded-3xl bg-white p-8 border border-abyssal-ink/10 shadow-sm font-body">
            <h2 className="font-display text-2xl font-bold text-abyssal-ink mb-3">Industry Insight</h2>
            <p className="text-sm text-abyssal-ink/75 leading-relaxed">
              {data.aiDefinition}
            </p>
          </section>

          {/* Features */}
          <section className="mt-16">
            <h2 className="font-display text-3xl font-bold text-abyssal-ink text-center mb-10">Tailored Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
              {data.features.map((feat, i) => (
                <div key={i} className="rounded-2xl border border-abyssal-ink/10 bg-white p-6 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-digital-orange/10 text-digital-orange flex items-center justify-center font-bold mb-4">
                    0{i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-abyssal-ink mb-2">{feat.title}</h3>
                  <p className="text-sm text-abyssal-ink/65 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tech Stack & Process */}
          <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 font-body">
            <div className="rounded-3xl bg-ash-white p-8 border border-abyssal-ink/10">
              <h3 className="font-display text-2xl font-bold text-abyssal-ink mb-4">Development Process</h3>
              <ol className="space-y-4">
                {data.process.map((step, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-abyssal-ink font-semibold">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-abyssal-ink text-white text-xs">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-3xl bg-ash-white p-8 border border-abyssal-ink/10">
              <h3 className="font-display text-2xl font-bold text-abyssal-ink mb-4">Recommended Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {data.techStack.map((tech, i) => (
                  <span key={i} className="rounded-full bg-white border border-abyssal-ink/10 px-4 py-2 text-xs font-bold text-abyssal-ink">
                    {tech}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-xs text-abyssal-ink/60 leading-relaxed">
                All solutions come with 100% mobile responsiveness, SSL security, speed optimization, and search engine friendly schema markup.
              </p>
            </div>
          </section>

          {/* FAQs */}
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold text-abyssal-ink mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4 font-body">
              {data.faqs.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </section>

          <div id="quote" className="mt-16">
            <TrustSection />
          </div>
        </div>
      </main>
    </>
  );
}
