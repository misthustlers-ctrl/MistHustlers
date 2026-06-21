import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import StarRating from "@/components/StarRating";
import { DEMO_PROJECTS, CATEGORIES } from "@/data/demoProjects";

const PROJECT_FAQS = [
  {
    q: "Are all MistHustlers projects paid client projects?",
    a: "No. The portfolio may contain client projects, internal products and business project previews. Every project is labelled clearly so visitors can understand its context.",
  },
  {
    q: "What is the MistHustlers Quality Score?",
    a: "The MistHustlers Quality Score is an internal project assessment based on design, mobile responsiveness, usability, feature completeness and relevance to the target industry. It is not a customer-review rating.",
  },
  {
    q: "Why does MistHustlers create industry demos?",
    a: "Industry demos help businesses understand how a website or digital product could look and function for their industry before starting a custom project.",
  },
  {
    q: "Can MistHustlers build a similar website for my business?",
    a: "Yes. MistHustlers can adapt a demo's layout, functionality, content structure and visual direction according to the business's branding and requirements.",
  },
];

function trackEvent(name: string, payload: Record<string, string> = {}) {
  window.dispatchEvent(new CustomEvent("mh:analytics", { detail: { name, ...payload } }));
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? DEMO_PROJECTS
    : DEMO_PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="projects" />
      <SchemaMarkup page="projects" faq={PROJECT_FAQS} />
      <main>

      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
            className="text-center mb-12"
          >
            <span className="inline-block max-w-full px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
              Selected Work & Project Previews
            </span>
            <h1 className="font-display text-[clamp(38px,12vw,80px)] leading-[0.92] tracking-[0.02em] text-abyssal-ink">
              Digital Experiences Built for<br />
              <span className="text-digital-orange">Real-World Business Needs</span>
            </h1>
            <p className="text-abyssal-ink/50 mt-4 max-w-lg mx-auto font-body">
              Explore business website previews, internal products and selected work created by MistHustlers. These projects demonstrate modern design, responsive development and practical digital execution.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/contact" className="magnetic-btn inline-flex min-h-12 items-center justify-center rounded-[800px] bg-digital-orange px-6 py-3 text-sm font-semibold text-white font-body" onClick={() => trackEvent("build_similar_project_click", { source: "projects_hero" })}>
                Start a Similar Project
              </Link>
              <Link to="/contact" className="magnetic-btn inline-flex min-h-12 items-center justify-center rounded-[800px] border-2 border-abyssal-ink px-6 py-3 text-sm font-semibold text-abyssal-ink transition-colors hover:bg-abyssal-ink hover:text-white font-body">
                Discuss Your Idea
              </Link>
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); trackEvent("project_filter_click", { category: cat }); }}
                aria-pressed={activeCategory === cat}
                className={`min-h-10 px-3 sm:px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 font-body ${
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
                  <article className="bg-ash-white rounded-[28px] sm:rounded-[40px] border border-abyssal-ink/5 overflow-hidden h-full flex flex-col hover:shadow-xl hover:shadow-abyssal-ink/5 transition-all duration-500">
                    <Link to={`/projects/demo/${project.slug}`} className="block group" onClick={() => trackEvent("project_demo_click", { project: project.slug })}>
                      <div
                        className="relative h-48 overflow-hidden flex items-center justify-center"
                        style={{ background: project.gradient }}
                      >
                        <img
                          src={project.previewImage}
                          alt={project.title}
                          onError={(event) => { event.currentTarget.style.display = "none"; }}
                          loading="lazy"
                          width="400"
                          height="192"
                          className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
                          {project.category}
                        </span>
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                          <h3 className="text-white font-body font-bold text-base sm:text-lg leading-tight drop-shadow-lg">
                            {project.title}
                          </h3>
                          <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white group-hover:bg-digital-orange transition-colors duration-300">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                      <div className="p-5 sm:p-6 flex flex-col flex-1">
                        <span
                          className="text-xs font-semibold tracking-wider uppercase font-body"
                          style={{ color: project.accentColor }}
                        >
                          {project.client} • {project.category}
                        </span>
                        <p className="text-sm text-abyssal-ink/60 font-body leading-relaxed mt-2 flex-1">
                          {project.purpose || project.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.features.slice(0, 3).map((feature) => (
                            <span key={feature} className="rounded-full bg-abyssal-ink/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-abyssal-ink/55 font-body">{feature}</span>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-abyssal-ink/5">
                          <StarRating slug={project.slug} defaultRating={project.defaultRating} size={18} />
                        </div>
                        <p className="mt-3 text-xs text-abyssal-ink/45 font-body">
                          Preview project created to show MistHustlers' design and development capability. Quality score is internal, not a customer review.
                        </p>
                        <div className="mt-5 grid gap-2 sm:grid-cols-2">
                          <Link to={`/projects/demo/${project.slug}`} className="min-h-10 rounded-full bg-abyssal-ink px-4 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-digital-orange font-body" onClick={() => trackEvent("project_detail_click", { project: project.slug })}>
                            View Demo
                          </Link>
                          <Link to="/contact" className="min-h-10 rounded-full border border-abyssal-ink/15 px-4 py-2 text-center text-xs font-semibold text-abyssal-ink transition-colors hover:bg-abyssal-ink hover:text-white font-body" onClick={() => trackEvent("build_similar_project_click", { project: project.slug })}>
                            Build Similar
                          </Link>
                        </div>
                      </div>
                  </article>
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

      <section className="py-16 sm:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <ScrollReveal>
              <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-5 font-body">
                Rating Methodology
              </span>
              <h2 className="font-display text-[clamp(32px,5vw,56px)] leading-[0.95] tracking-[0.02em] text-abyssal-ink mb-5">
                How We Evaluate Our Demo Projects
              </h2>
              <p className="text-abyssal-ink/55 leading-relaxed font-body">
                Each concept demo is reviewed internally by MistHustlers to assess design quality, responsiveness, usability, feature completeness and relevance to the target industry. These ratings represent an internal quality assessment and are not presented as customer reviews.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Visual design", "25%"],
                  ["Mobile responsiveness", "20%"],
                  ["Usability and navigation", "20%"],
                  ["Feature completeness", "20%"],
                  ["Industry relevance", "15%"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[24px] bg-ash-white p-5 border border-abyssal-ink/5">
                    <div className="font-display text-3xl text-digital-orange">{value}</div>
                    <div className="mt-2 text-sm font-semibold text-abyssal-ink font-body">{label}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-ash-white">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="font-display text-[clamp(32px,5vw,56px)] leading-[0.95] tracking-[0.02em] text-abyssal-ink mb-8 text-center">
              Projects FAQ
            </h2>
          </ScrollReveal>
          <div className="space-y-4">
            {PROJECT_FAQS.map((faq) => (
              <article key={faq.q} className="rounded-[24px] bg-basalt-canvas p-5 border border-abyssal-ink/5">
                <h3 className="font-body font-bold text-lg text-abyssal-ink">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-abyssal-ink/60 font-body">{faq.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-abyssal-ink/5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
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
              className="magnetic-btn inline-flex min-h-12 items-center justify-center gap-2 bg-digital-orange text-white px-6 sm:px-8 py-3.5 rounded-[800px] text-sm font-semibold font-body hover:bg-digital-orange/90 transition-colors"
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
