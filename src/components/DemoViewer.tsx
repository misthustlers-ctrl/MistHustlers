import { useParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import StarRating from "@/components/StarRating";
import { getDemoBySlug } from "@/data/demoProjects";

export default function DemoViewer() {
  const { slug } = useParams<{ slug: string }>();
  const project = getDemoBySlug(slug || "");

  if (!project) {
    return (
      <div className="bg-basalt-canvas min-h-screen flex items-center justify-center">
        <SEO page="notFound" robots="noindex, follow" />
        <main className="text-center">
          <h1 className="font-display text-4xl text-abyssal-ink mb-4">Demo not found</h1>
          <Link to="/projects" className="text-digital-orange underline font-body">Back to Projects</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-basalt-canvas min-h-screen flex flex-col">
      <SEO
        page="projects"
        robots="noindex, follow"
        overrides={{
          title: `${project.title} Demo | MistHustlers`,
          description: project.description,
          canonical: `https://www.misthustlers.in/projects/demo/${project.slug}`,
          ogTitle: `${project.title} Project Preview | MistHustlers`,
          ogDescription: project.purpose,
        }}
      />
      <div className="sticky top-0 z-50 bg-abyssal-ink/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to="/projects"
              className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Back to projects"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="min-w-0">
              <h1 className="text-white font-body font-bold text-sm sm:text-base truncate leading-tight">
                {project.title}
              </h1>
              <p className="text-[11px] text-white/45 font-body">{project.category} preview • {project.client}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Link to="/" className="text-xs text-white/60 hover:text-white transition-colors font-body">Home</Link>
            <Link to="/contact" className="text-xs text-white/60 hover:text-white transition-colors font-body">Contact</Link>
            <StarRating slug={project.slug} defaultRating={project.defaultRating} size={20} />
          </div>
        </div>
      </div>

      <main className="flex-1">
        <section className="bg-basalt-canvas border-b border-abyssal-ink/5">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="inline-block rounded-full bg-digital-orange/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-digital-orange font-body">
                {project.category} Preview
              </span>
              <p className="mt-3 text-sm leading-relaxed text-abyssal-ink/60 font-body">
                {project.purpose}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-abyssal-ink/45 font-body">
                This preview was created by MistHustlers to demonstrate website design and development capabilities for businesses in this category.
              </p>
            </div>
            <div className="rounded-[24px] bg-ash-white p-4 border border-abyssal-ink/5">
              <StarRating slug={project.slug} defaultRating={project.defaultRating} size={18} />
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-abyssal-ink/55 font-body">
                <span>Design: {project.ratingBreakdown.design}/5</span>
                <span>Mobile: {project.ratingBreakdown.responsiveness}/5</span>
                <span>Usability: {project.ratingBreakdown.usability}/5</span>
                <span>Features: {project.ratingBreakdown.features}/5</span>
              </div>
            </div>
          </div>
        </section>
        <iframe
          src={`/demo/${project.slug}/index.html`}
          title={`${project.title} Demo`}
          className="w-full border-none"
          style={{ height: "calc(100dvh - 116px)" }}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </main>
    </div>
  );
}
