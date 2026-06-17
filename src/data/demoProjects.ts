export type DemoProject = {
  slug: string;
  title: string;
  client: string;
  category: string;
  description: string;
  longDesc: string;
  gradient: string;
  accentColor: string;
  previewImage: string;
  features: string[];
  defaultRating: number;
};

export const DEMO_PROJECTS: DemoProject[] = [
  {
    slug: "startup",
    title: "FlowSync",
    client: "SaaS Startup",
    category: "Startup",
    description: "High-converting MVP landing page with waitlist, pricing, and feature showcase.",
    longDesc: "A premium SaaS MVP landing page designed for early-stage startups. Includes waitlist capture, problem/solution framing, feature highlights, pricing tiers, and social proof.",
    gradient: "linear-gradient(135deg, #7C3AED, #A78BFA)",
    accentColor: "#7C3AED",
    previewImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80",
    features: ["Waitlist capture", "Pricing tiers", "Feature showcase", "Social proof", "Analytics ready"],
    defaultRating: 4.5,
  },
  {
    slug: "restaurant",
    title: "The Copper Spoon",
    client: "Restaurant / Cafe",
    category: "Restaurant",
    description: "Elegant restaurant website with menu, reservations, gallery, and online ordering.",
    longDesc: "A mouth-watering restaurant landing page with chef specials, full menu accordion, reservation form, gallery, location map, and online ordering links.",
    gradient: "linear-gradient(135deg, #F5A623, #FBC668)",
    accentColor: "#F5A623",
    previewImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    features: ["Menu showcase", "Table reservations", "Photo gallery", "Location & timing", "Online ordering"],
    defaultRating: 4.8,
  },
  {
    slug: "realestate",
    title: "Skyline Heights",
    client: "Real Estate",
    category: "Real Estate",
    description: "Luxury property listing with floor plans, amenities, location advantages, and site visit booking.",
    longDesc: "A premium real estate property landing page showcasing luxury apartments. Features floor plan tabs, amenity grid, nearby locations, trust badges, and site visit lead capture.",
    gradient: "linear-gradient(135deg, #B87333, #D4915A)",
    accentColor: "#B87333",
    previewImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    features: ["Property listings", "Floor plans", "Amenities showcase", "Location map", "Site visit booking"],
    defaultRating: 4.6,
  },
  {
    slug: "salon",
    title: "Luxe & Lather",
    client: "Salon / Spa",
    category: "Salon",
    description: "Luxury salon booking site with service menu, pricing, and appointment scheduling.",
    longDesc: "A sophisticated salon and spa website with categorized service menu, pricing, stylist profiles, special offers gallery, and easy appointment booking.",
    gradient: "linear-gradient(135deg, #C2677B, #D98A9B)",
    accentColor: "#C2677B",
    previewImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    features: ["Service menu", "Pricing list", "Stylist profiles", "Appointment booking", "Offer gallery"],
    defaultRating: 4.3,
  },
  {
    slug: "clinic",
    title: "SmileCare Dental",
    client: "Clinic / Dental",
    category: "Clinic",
    description: "Professional clinic website with doctor profile, services, and appointment booking.",
    longDesc: "A clean and trustworthy clinic website featuring doctor profiles, detailed service cards, patient stats, insurance info, appointment booking, and Google Maps integration.",
    gradient: "linear-gradient(135deg, #00897B, #4DB6AC)",
    accentColor: "#00897B",
    previewImage: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
    features: ["Doctor profile", "Service cards", "Patient stats", "Appointment booking", "Insurance info"],
    defaultRating: 4.7,
  },
  {
    slug: "gym",
    title: "Iron Forge Gym",
    client: "Gym / Fitness",
    category: "Gym",
    description: "High-energy fitness site with membership plans, trainer profiles, and trial booking.",
    longDesc: "A high-energy gym landing page with bold typography, membership plan cards, trainer profiles, class schedule, transformation gallery, and free trial booking.",
    gradient: "linear-gradient(135deg, #FF5722, #E64A19)",
    accentColor: "#FF5722",
    previewImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
    features: ["Membership plans", "Trainer profiles", "Class schedule", "Transformation gallery", "Trial booking"],
    defaultRating: 4.4,
  },
  {
    slug: "coaching",
    title: "Excel Academy",
    client: "Coaching Institute",
    category: "Coaching",
    description: "Admission-driven coaching site with results, batches, and student lead capture.",
    longDesc: "A result-focused coaching institute landing page with course features, teacher profiles, past results/rankers, batch enrollment, and admission lead capture.",
    gradient: "linear-gradient(135deg, #F5A623, #0D1B4B)",
    accentColor: "#F5A623",
    previewImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    features: ["Course features", "Teacher profiles", "Results showcase", "Batch enrollment", "Admission form"],
    defaultRating: 4.2,
  },
  {
    slug: "interior",
    title: "Artisan Spaces",
    client: "Interior Design",
    category: "Interior",
    description: "Design portfolio with gallery, before/after projects, and consultation booking.",
    longDesc: "An elegant interior design portfolio with masonry gallery, project categories, before/after transformations, service offerings, client testimonials, and consultation booking.",
    gradient: "linear-gradient(135deg, #C9A84C, #E0C878)",
    accentColor: "#C9A84C",
    previewImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    features: ["Masonry gallery", "Before/after", "Project categories", "Client testimonials", "Consultation booking"],
    defaultRating: 4.9,
  },
  {
    slug: "manufacturer",
    title: "Premier Traders",
    client: "B2B Manufacturer",
    category: "Manufacturer",
    description: "Industrial B2B catalogue with product filters, specs, and RFQ form.",
    longDesc: "A robust B2B manufacturer website with product categories, spec tables, catalogue downloads, certification badges, stats, and RFQ enquiry form.",
    gradient: "linear-gradient(135deg, #E65100, #FF7043)",
    accentColor: "#E65100",
    previewImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    features: ["Product catalogue", "Spec tables", "Certification badges", "Catalogue download", "RFQ form"],
    defaultRating: 4.1,
  },
  {
    slug: "ca-lawyer",
    title: "Lex & Ledger",
    client: "CA / Law Firm",
    category: "CA / Law",
    description: "Professional consultant website with services, credentials, and consultation booking.",
    longDesc: "A trusted CA and law firm website with professional service cards, credentials, stats, client logos, team profiles, and consultation booking with document upload.",
    gradient: "linear-gradient(135deg, #4A90D9, #6BA5E7)",
    accentColor: "#4A90D9",
    previewImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    features: ["Service offerings", "Credentials & stats", "Team profiles", "Client logos", "Consultation booking"],
    defaultRating: 4.5,
  },
];

export const CATEGORIES = ["All", ...new Set(DEMO_PROJECTS.map((p) => p.category))];

export function getDemoBySlug(slug: string): DemoProject | undefined {
  return DEMO_PROJECTS.find((p) => p.slug === slug);
}
