import { useParams, Link } from "react-router-dom";
import { useContent } from "@/utils/useContent";
import SEO from "@/components/SEO";
import StarRating from "@/components/StarRating";
import { getDemoBySlug } from "@/data/demoProjects";

const CONTACT_DEFAULTS = { phone: "888 993 7648", phoneHref: "+918889937648", whatsappText: "Hi MistHustlers, I saw the demo and want to discuss a similar project" };

export default function DemoViewer() {
  const { slug } = useParams<{ slug: string }>();
  const project = getDemoBySlug(slug || "");
  const contact = useContent("contact", CONTACT_DEFAULTS);
  const phone = (contact.phoneHref || contact.phone || "").replace(/\D/g, "");
  const waText = encodeURIComponent(contact.whatsappText || "Hi, I saw your demo and want to discuss a similar project");
  const waHref = `https://wa.me/${phone}?text=${waText}`;
  const telHref = `tel:${phone}`;

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
    <div className="demo-viewer-page bg-basalt-canvas min-h-[100dvh] flex flex-col">
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
        <div className="mx-auto flex min-h-16 max-w-[1400px] items-center justify-between gap-3 px-3 py-2 sm:px-6 sm:py-3">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to="/projects"
              className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
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
              <p className="text-[11px] text-white/45 font-body">{project.category} preview &bull; {project.client}</p>
            </div>
          </div>

          <div className="hidden items-center gap-4 shrink-0 sm:flex">
            <Link to="/" className="text-xs text-white/60 hover:text-white transition-colors font-body">Home</Link>
            <Link to="/contact" className="text-xs text-white/60 hover:text-white transition-colors font-body">Contact</Link>
            <StarRating slug={project.slug} defaultRating={project.defaultRating} size={20} />
          </div>
        </div>
      </div>

      <main className="flex min-h-0 flex-1 flex-col">
        <section className="hidden bg-basalt-canvas border-b border-abyssal-ink/5 md:block">
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
          className="demo-preview-frame w-full border-none"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          onLoad={(event) => event.currentTarget.contentDocument?.documentElement.classList.add("embedded-demo")}
        />
      </main>

      <div className="demo-cta-bar sticky bottom-0 z-50">
        <span className="demo-cta-label">Build yours?</span>
        <a href={telHref} className="demo-cta-call" aria-label="Call MistHustlers">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
          </svg>
        </a>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="demo-cta-whatsapp"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>
      </div>
    </div>
  );
}
