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
    slug: "restaurant",
    title: "Ember & Oak",
    client: "Restaurant / Cafe",
    category: "Restaurant",
    projectType: "Project Preview",
    status: "Demo available",
    description: "Warm artisan cafe website with a complete menu, story, gallery, and reservation journey.",
    longDesc: "A cinematic multi-page cafe and restaurant experience built around slow food and warm hospitality. It includes immersive food imagery, an artisan menu, brand story, editorial gallery, and a dedicated table reservation flow.",
    purpose: "A cafe and restaurant concept designed to create appetite, communicate atmosphere and guide guests naturally from discovery to table reservation.",
    gradient: "linear-gradient(135deg, #2B1B16, #D97A3F)",
    accentColor: "#D97A3F",
    previewImage: "/demo/restaurant/preview.png",
    features: ["Multi-page experience", "Artisan menu", "Table reservations", "Editorial gallery", "Brand story"],
    techStack: ["Responsive restaurant UI", "Multi-page navigation", "Reservation journey"],
    defaultRating: 4.8,
    ratingBreakdown: { design: 4.9, responsiveness: 4.8, usability: 4.8, features: 4.7, industryRelevance: 4.8 },
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
    title: "Zenith Academy",
    client: "Coaching Institute",
    category: "Coaching",
    projectType: "Project Preview",
    status: "Demo available",
    description: "Connected academy platform with course discovery, faculty, results, mock exams, and student dashboards.",
    longDesc: "A complete coaching and learning platform experience spanning the public academy website, course catalog and detail pages, faculty directory, hall of fame, student dashboard, enrolled courses, practice tests, and results analytics.",
    purpose: "An education platform concept designed to build parent and student trust, drive course enrollment, and demonstrate a connected digital learning experience after admission.",
    gradient: "linear-gradient(135deg, #071B33, #D89A2B)",
    accentColor: "#D89A2B",
    previewImage: "/demo/coaching/preview.png",
    features: ["Course catalog", "Faculty directory", "Student dashboard", "Mock exams", "Results portal"],
    techStack: ["Responsive academy UI", "Connected multi-page journey", "Student learning dashboard"],
    defaultRating: 4.8,
    ratingBreakdown: { design: 4.8, responsiveness: 4.7, usability: 4.8, features: 4.9, industryRelevance: 4.9 },
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
    slug: "ferra-interiors",
    title: "Ferra Interiors",
    client: "Luxury Interior Design",
    category: "Interior",
    projectType: "Project Preview",
    status: "Demo available",
    description: "React-based luxury interior design studio with scroll-triggered animations, material showcase, and portfolio.",
    longDesc: "A premium React-powered interior design studio website featuring a cinematic scroll-scrub hero, curated portfolio gallery, material and finishes showcase, design philosophy storytelling, and a consultation enquiry form.",
    purpose: "A luxury interior design concept built to showcase creative direction, portfolio quality, material expertise and drive consultation inquiries.",
    gradient: "linear-gradient(135deg, #1a1a1a, #C9A84C)",
    accentColor: "#C9A84C",
    previewImage: "/demo/ferra-interiors/public/scrub/frame-wide.jpg",
    features: ["Scroll-scrub hero", "Portfolio gallery", "Material showcase", "Design philosophy", "Consultation enquiry"],
    techStack: ["React 19", "Tailwind CSS 4", "Vite 7", "Scroll-triggered animation"],
    defaultRating: 4.7,
    ratingBreakdown: { design: 4.9, responsiveness: 4.6, usability: 4.7, features: 4.6, industryRelevance: 4.7 },
  },
];

export const CATEGORIES = ["All", ...new Set(DEMO_PROJECTS.map((p) => p.category))];

export function getDemoBySlug(slug: string): DemoProject | undefined {
  return DEMO_PROJECTS.find((p) => p.slug === slug);
}
