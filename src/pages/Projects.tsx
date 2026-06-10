import { motion } from "framer-motion";
import GlobalNavbar from "@/components/GlobalNavbar";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";
import { useContent } from "@/utils/useContent";

type ProjectCard = {
  id?: number;
  title: string;
  category: string;
  visual?: string;
  imageUrl?: string;
  desc: string;
};

const DEFAULT_PROJECTS: ProjectCard[] = [
  { title: "Automation Dashboard", category: "Automation", visual: "⚡", desc: "Real-time workflow monitoring and automation control panel for enterprise operations." },
  { title: "E-Commerce Platform", category: "Development", visual: "🛒", desc: "Full-stack online marketplace with payment integration, inventory management, and analytics." },
  { title: "AI Content Pipeline", category: "AI", visual: "🤖", desc: "Automated content generation system leveraging LLMs for marketing and documentation." },
  { title: "Portfolio Builder App", category: "Tooling", visual: "🎨", desc: "Drag-and-drop portfolio builder with custom themes, SEO optimization, and hosting." },
  { title: "Client CRM System", category: "Freelancing", visual: "📊", desc: "Client management platform with invoicing, project tracking, and communication tools." },
  { title: "Career Match Engine", category: "Platform", visual: "🔗", desc: "AI-powered talent matching platform connecting builders with relevant opportunities." },
];

const FALLBACK_EMOJIS = ["⚡", "🛒", "🤖", "🎨", "📊", "🔗"];

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
      <GlobalNavbar />

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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj: ProjectCard, i: number) => (
              <ScrollReveal key={proj.title} delay={i * 0.08}>
                <div className="card-lift bg-ash-white rounded-[40px] border border-abyssal-ink/5 overflow-hidden group h-full flex flex-col">
                  <div className="bg-abyssal-ink/3 flex items-center justify-center h-48 overflow-hidden">
                    {proj.imageUrl ? (
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-6xl opacity-40 group-hover:opacity-60 transition-opacity duration-300">
                        {FALLBACK_EMOJIS[i % FALLBACK_EMOJIS.length]}
                      </span>
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

      <Footer />
    </div>
  );
}
