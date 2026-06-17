import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import StarRating from "@/components/StarRating";
import { DEMO_PROJECTS, CATEGORIES } from "@/data/demoProjects";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? DEMO_PROJECTS
    : DEMO_PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="projects" />
      <SchemaMarkup page="projects" />
      <main>

      <section className="pt-32 pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
              Client Demos
            </span>
            <h1 className="font-display text-[clamp(48px,8vw,80px)] leading-[0.9] tracking-[0.02em] text-abyssal-ink">
              Industry-Specific<br />
              <span className="text-digital-orange">Websites</span>
            </h1>
            <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
              Premium demo websites built for real industries. Click any project to view the live demo and rate it.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 font-body ${
                  activeCategory === cat
                    ? "bg-abyssal-ink text-ash-white"
                    : "bg-abyssal-ink/5 text-abyssal-ink/60 hover:bg-abyssal-ink/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((project, i) => (
                <ScrollReveal key={project.slug} delay={i * 0.06}>
                  <Link
                    to={`/projects/demo/${project.slug}`}
                    className="block group"
                  >
                    <div className="bg-ash-white rounded-[40px] border border-abyssal-ink/5 overflow-hidden h-full flex flex-col hover:shadow-xl hover:shadow-abyssal-ink/5 transition-all duration-500">
                      <div
                        className="relative h-48 overflow-hidden flex items-center justify-center"
                        style={{ background: project.gradient }}
                      >
                        <img
                          src={project.previewImage}
                          alt={project.title}
                          loading="lazy"
                          width="400"
                          height="192"
                          className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
                          {project.category}
                        </span>
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                          <h3 className="text-white font-body font-bold text-lg leading-tight drop-shadow-lg">
                            {project.title}
                          </h3>
                          <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white group-hover:bg-digital-orange transition-colors duration-300">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <span
                          className="text-xs font-semibold tracking-wider uppercase font-body"
                          style={{ color: project.accentColor }}
                        >
                          {project.client}
                        </span>
                        <p className="text-sm text-abyssal-ink/60 font-body leading-relaxed mt-2 flex-1">
                          {project.description}
                        </p>
                        <div className="mt-4 pt-4 border-t border-abyssal-ink/5">
                          <StarRating slug={project.slug} defaultRating={project.defaultRating} size={18} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="text-center text-abyssal-ink/40 font-body py-20">
              No projects found in this category.
            </p>
          )}
        </div>
      </section>

      <section className="py-24 bg-abyssal-ink/5">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <ScrollReveal>
            <span className="inline-block px-4 py-1.5 rounded-full bg-digital-orange/10 text-digital-orange text-xs font-semibold tracking-wider uppercase mb-6 font-body">
              Get Started
            </span>
            <h2 className="font-display text-[clamp(32px,5vw,56px)] leading-[0.95] tracking-[0.02em] text-abyssal-ink mb-4">
              Want a website like these?
            </h2>
            <p className="text-abyssal-ink/50 font-body max-w-xl mx-auto mb-8">
              Each demo is tailored to a specific industry. Let's build one that fits your business perfectly.
            </p>
            <Link
              to="/contact"
              className="magnetic-btn inline-flex items-center gap-2 bg-digital-orange text-white px-8 py-3.5 rounded-[800px] text-sm font-semibold font-body hover:bg-digital-orange/90 transition-colors"
            >
              Start Your Project
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      </main>
    </div>
  );
}
