import { motion } from "framer-motion";
import GlobalNavbar from "@/components/GlobalNavbar";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import { useContent } from "@/utils/useContent";

type ProjectCard = {
  id?: number;
  title: string;
  category: string;
  imageUrl?: string;
  desc: string;
};

const GRADIENTS = [
  "linear-gradient(135deg, #fc5000, #ff7a33)",
  "linear-gradient(135deg, #524ae9, #7b75f0)",
  "linear-gradient(135deg, #070607, #333333)",
  "linear-gradient(135deg, #1f9d55, #3bca6e)",
  "linear-gradient(135deg, #e74c3c, #f0746a)",
  "linear-gradient(135deg, #3498db, #6ab0e6)",
];

const ICONS = [
  "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  "M3 3h18v18H3V3zm2 2v14h14V5H5zm3 3h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z",
  "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm1-13h-2v6l5.25 3.15L17 14.3l-4-2.4V7z",
  "M21 16v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2m4-4l4 4 4-4m-4-4v8",
];

const DEFAULT_PROJECTS: ProjectCard[] = [
  { title: "Automation Dashboard", category: "Automation", desc: "Real-time workflow monitoring and automation control panel for enterprise operations." },
  { title: "E-Commerce Platform", category: "Development", desc: "Full-stack online marketplace with payment integration, inventory management, and analytics." },
  { title: "AI Content Pipeline", category: "AI", desc: "Automated content generation system leveraging LLMs for marketing and documentation." },
  { title: "Portfolio Builder App", category: "Tooling", desc: "Drag-and-drop portfolio builder with custom themes, SEO optimization, and hosting." },
  { title: "Client CRM System", category: "Freelancing", desc: "Client management platform with invoicing, project tracking, and communication tools." },
  { title: "Career Match Engine", category: "Platform", desc: "AI-powered talent matching platform connecting builders with relevant opportunities." },
];

export default function Projects() {
  const c = useContent("projects", {
    badge: "Project Showcase",
    title: "Built by the community",
    highlightWord: "community",
    subtitle: "Real projects shipped by MistHustlers builders and partners.",
    projects: DEFAULT_PROJECTS,
  });
  const projects = c.projects ?? DEFAULT_PROJECTS;

  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="projects" />
      <SchemaMarkup page="projects" />
      <GlobalNavbar />
      <main>

      <section className="pt-32 pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
              {c.badge}
            </span>
            <h1 className="font-display text-[clamp(48px,8vw,80px)] leading-[0.9] tracking-[0.02em] text-abyssal-ink">
              Built by the<br />
              <span className="text-digital-orange">{c.highlightWord}</span>
            </h1>
            <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
              {c.subtitle}
            </p>
          </motion.div>

          <h2 className="font-display text-3xl tracking-[0.02em] text-abyssal-ink mb-8 text-center">Featured Projects</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj: ProjectCard, i: number) => (
              <ScrollReveal key={proj.title} delay={i * 0.08}>
                <div className="card-lift bg-ash-white rounded-[40px] border border-abyssal-ink/5 overflow-hidden group h-full flex flex-col">
                  <div className="flex items-center justify-center h-48 overflow-hidden" style={{ background: GRADIENTS[i % GRADIENTS.length] }}>
                    {proj.imageUrl ? (
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        loading="lazy"
                        width="400"
                        height="192"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                        <path d={ICONS[i % ICONS.length]} />
                      </svg>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-xs font-semibold tracking-wider uppercase text-abyssal-ink/40 font-body">{proj.category}</span>
                    <h3 className="font-display text-2xl tracking-[0.02em] text-abyssal-ink mt-1 mb-3">{proj.title}</h3>
                    <p className="text-sm text-abyssal-ink/60 font-body leading-relaxed flex-1">{proj.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}
