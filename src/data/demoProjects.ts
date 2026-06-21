export type DemoProject = {
  slug: string;
  title: string;
  client: string;
  category: string;
  projectType: string;
  status: string;
  description: string;
  longDesc: string;
  purpose: string;
  gradient: string;
  accentColor: string;
  previewImage: string;
  features: string[];
  techStack: string[];
  defaultRating: number;
  ratingBreakdown: {
    design: number;
    responsiveness: number;
    usability: number;
    features: number;
    industryRelevance: number;
  };
};

export const DEMO_PROJECTS: DemoProject[] = [
  {
    slug: "startup",
    title: "FlowSync",
    client: "SaaS Startup",
    category: "Startup",
    projectType: "Project Preview",
    status: "Demo available",
    description: "High-converting MVP landing page with waitlist, pricing, and feature showcase.",
    longDesc: "A premium SaaS MVP landing page designed for early-stage startups. Includes waitlist capture, problem/solution framing, feature highlights, pricing tiers, and social proof.",
    purpose: "A SaaS concept designed to help founders explain their product, collect early interest and validate positioning before a full build.",
    gradient: "linear-gradient(135deg, #7C3AED, #A78BFA)",
    accentColor: "#7C3AED",
    previewImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80",
    features: ["Waitlist capture", "Pricing tiers", "Feature showcase", "Social proof", "Analytics ready"],
    techStack: ["Responsive React UI", "Lead capture flow", "Analytics-ready structure"],
    defaultRating: 4.5,
    ratingBreakdown: { design: 4.6, responsiveness: 4.5, usability: 4.4, features: 4.5, industryRelevance: 4.5 },
  },
  {
    slug: "restaurant",
    title: "The Copper Spoon",
    client: "Restaurant / Cafe",
    category: "Restaurant",
    projectType: "Project Preview",
    status: "Demo available",
    description: "Elegant restaurant website with menu, reservations, gallery, and online ordering.",
    longDesc: "A mouth-watering restaurant landing page with chef specials, full menu accordion, reservation form, gallery, location map, and online ordering links.",
    purpose: "A restaurant website concept built to present food, location, timing and reservation actions clearly on mobile and desktop.",
    gradient: "linear-gradient(135deg, #F5A623, #FBC668)",
    accentColor: "#F5A623",
    previewImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    features: ["Menu showcase", "Table reservations", "Photo gallery", "Location & timing", "Online ordering"],
    techStack: ["Responsive website UI", "Reservation form concept", "Menu and gallery sections"],
    defaultRating: 4.8,
    ratingBreakdown: { design: 4.9, responsiveness: 4.8, usability: 4.8, features: 4.7, industryRelevance: 4.8 },
  },
  {
    slug: "realestate",
    title: "Skyline Heights",
    client: "Real Estate",
    category: "Real Estate",
    projectType: "Project Preview",
    status: "Demo available",
    description: "Luxury property listing with floor plans, amenities, location advantages, and site visit booking.",
    longDesc: "A premium real estate property landing page showcasing luxury apartments. Features floor plan tabs, amenity grid, nearby locations, trust badges, and site visit lead capture.",
    purpose: "A property website concept designed to help buyers explore floor plans, amenities and site-visit inquiries.",
    gradient: "linear-gradient(135deg, #B87333, #D4915A)",
    accentColor: "#B87333",
    previewImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    features: ["Property listings", "Floor plans", "Amenities showcase", "Location map", "Site visit booking"],
    techStack: ["Responsive landing page", "Inquiry form flow", "Property content structure"],
    defaultRating: 4.6,
    ratingBreakdown: { design: 4.7, responsiveness: 4.6, usability: 4.5, features: 4.6, industryRelevance: 4.6 },
  },
  {
    slug: "salon",
    title: "Luxe & Lather",
    client: "Salon / Spa",
    category: "Salon",
    projectType: "Project Preview",
    status: "Demo available",
    description: "Luxury salon booking site with service menu, pricing, and appointment scheduling.",
    longDesc: "A sophisticated salon and spa website with categorized service menu, pricing, stylist profiles, special offers gallery, and easy appointment booking.",
    purpose: "A salon and spa concept focused on service discovery, pricing clarity and appointment inquiries.",
    gradient: "linear-gradient(135deg, #C2677B, #D98A9B)",
    accentColor: "#C2677B",
    previewImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    features: ["Service menu", "Pricing list", "Stylist profiles", "Appointment booking", "Offer gallery"],
    techStack: ["Responsive website UI", "Booking flow concept", "Service category layout"],
    defaultRating: 4.3,
    ratingBreakdown: { design: 4.4, responsiveness: 4.3, usability: 4.3, features: 4.2, industryRelevance: 4.3 },
  },
  {
    slug: "clinic",
    title: "SmileCare Dental",
    client: "Clinic / Dental",
    category: "Clinic",
    projectType: "Project Preview",
    status: "Demo available",
    description: "Professional clinic website with doctor profile, services, and appointment booking.",
    longDesc: "A clean and trustworthy clinic website featuring doctor profiles, detailed service cards, patient stats, insurance info, appointment booking, and Google Maps integration.",
    purpose: "A clinic website concept designed to help patients understand services, doctor information and appointment options.",
    gradient: "linear-gradient(135deg, #00897B, #4DB6AC)",
    accentColor: "#00897B",
    previewImage: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
    features: ["Doctor profile", "Service cards", "Patient stats", "Appointment booking", "Insurance info"],
    techStack: ["Responsive website UI", "Appointment inquiry flow", "Local business content structure"],
    defaultRating: 4.7,
    ratingBreakdown: { design: 4.7, responsiveness: 4.8, usability: 4.6, features: 4.7, industryRelevance: 4.7 },
  },
  {
    slug: "gym",
    title: "Iron Forge Gym",
    client: "Gym / Fitness",
    category: "Gym",
    projectType: "Project Preview",
    status: "Demo available",
    description: "High-energy fitness site with membership plans, trainer profiles, and trial booking.",
    longDesc: "A high-energy gym landing page with bold typography, membership plan cards, trainer profiles, class schedule, transformation gallery, and free trial booking.",
    purpose: "A fitness website concept built to present memberships, trainers, schedules and trial booking actions.",
    gradient: "linear-gradient(135deg, #FF5722, #E64A19)",
    accentColor: "#FF5722",
    previewImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    features: ["Membership plans", "Trainer profiles", "Class schedule", "Transformation gallery", "Trial booking"],
    techStack: ["Responsive website UI", "Trial booking flow", "Program and trainer sections"],
    defaultRating: 4.4,
    ratingBreakdown: { design: 4.5, responsiveness: 4.4, usability: 4.3, features: 4.4, industryRelevance: 4.4 },
  },
  {
    slug: "coaching",
    title: "Excel Academy",
    client: "Coaching Institute",
    category: "Coaching",
    projectType: "Project Preview",
    status: "Demo available",
    description: "Admission-driven coaching site with results, batches, and student lead capture.",
    longDesc: "A result-focused coaching institute landing page with course features, teacher profiles, past results/rankers, batch enrollment, and admission lead capture.",
    purpose: "An education website concept designed to communicate batches, faculty, course value and admission inquiries.",
    gradient: "linear-gradient(135deg, #F5A623, #0D1B4B)",
    accentColor: "#F5A623",
    previewImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    features: ["Course features", "Teacher profiles", "Results showcase", "Batch enrollment", "Admission form"],
    techStack: ["Responsive website UI", "Admission inquiry flow", "Course content structure"],
    defaultRating: 4.2,
    ratingBreakdown: { design: 4.2, responsiveness: 4.3, usability: 4.2, features: 4.1, industryRelevance: 4.2 },
  },
  {
    slug: "interior",
    title: "Artisan Spaces",
    client: "Interior Design",
    category: "Interior",
    projectType: "Project Preview",
    status: "Demo available",
    description: "Design portfolio with gallery, before/after projects, and consultation booking.",
    longDesc: "An elegant interior design portfolio with masonry gallery, project categories, before/after transformations, service offerings, client testimonials, and consultation booking.",
    purpose: "An interior design concept built to showcase visual work, services and consultation inquiries.",
    gradient: "linear-gradient(135deg, #C9A84C, #E0C878)",
    accentColor: "#C9A84C",
    previewImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    features: ["Masonry gallery", "Before/after", "Project categories", "Client testimonials", "Consultation booking"],
    techStack: ["Responsive portfolio UI", "Consultation CTA flow", "Project gallery structure"],
    defaultRating: 4.9,
    ratingBreakdown: { design: 5.0, responsiveness: 4.9, usability: 4.8, features: 4.9, industryRelevance: 4.9 },
  },
  {
    slug: "manufacturer",
    title: "Premier Traders",
    client: "B2B Manufacturer",
    category: "Manufacturer",
    projectType: "Project Preview",
    status: "Demo available",
    description: "Industrial B2B catalogue with product filters, specs, and RFQ form.",
    longDesc: "A robust B2B manufacturer website with product categories, spec tables, catalogue downloads, certification badges, stats, and RFQ enquiry form.",
    purpose: "A B2B website concept designed to present product categories, specifications and RFQ inquiries clearly.",
    gradient: "linear-gradient(135deg, #E65100, #FF7043)",
    accentColor: "#E65100",
    previewImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    features: ["Product catalogue", "Spec tables", "Certification badges", "Catalogue download", "RFQ form"],
    techStack: ["Responsive catalogue UI", "RFQ inquiry flow", "Product information architecture"],
    defaultRating: 4.1,
    ratingBreakdown: { design: 4.1, responsiveness: 4.2, usability: 4.1, features: 4.0, industryRelevance: 4.1 },
  },
  {
    slug: "ca-lawyer",
    title: "Lex & Ledger",
    client: "CA / Law Firm",
    category: "CA / Law",
    projectType: "Project Preview",
    status: "Demo available",
    description: "Professional consultant website with services, credentials, and consultation booking.",
    longDesc: "A trusted CA and law firm website with professional service cards, credentials, stats, client logos, team profiles, and consultation booking with document upload.",
    purpose: "A professional services concept designed to explain expertise, services and consultation steps for clients.",
    gradient: "linear-gradient(135deg, #4A90D9, #6BA5E7)",
    accentColor: "#4A90D9",
    previewImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    features: ["Service offerings", "Credentials & stats", "Team profiles", "Client logos", "Consultation booking"],
    techStack: ["Responsive website UI", "Consultation inquiry flow", "Professional service content structure"],
    defaultRating: 4.5,
    ratingBreakdown: { design: 4.6, responsiveness: 4.5, usability: 4.5, features: 4.4, industryRelevance: 4.5 },
  },
];

export const CATEGORIES = ["All", ...new Set(DEMO_PROJECTS.map((p) => p.category))];

export function getDemoBySlug(slug: string): DemoProject | undefined {
  return DEMO_PROJECTS.find((p) => p.slug === slug);
}
