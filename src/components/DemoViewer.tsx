import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SEO from "@/components/SEO";
import { getDemoBySlug } from "@/data/demoProjects";

const COACHING_DEMO_PAGES = [
  { label: "Academy Home", path: "index.html" },
  { label: "Course Catalog", path: "course_catalog/code.html" },
  { label: "JEE 2026 Course", path: "course_detail_jee_2026/code.html" },
  { label: "Faculty Directory", path: "faculty_directory/code.html" },
  { label: "Hall of Fame", path: "hall_of_fame/code.html" },
  { label: "Student Dashboard", path: "student_dashboard_overview/code.html" },
  { label: "My Courses", path: "my_courses_dashboard/code.html" },
  { label: "Mock Exams", path: "practice_tests_mock_exams/code.html" },
  { label: "Results Portal", path: "zst_results_portal/code.html" },
];

const SALON_DEMO_PAGES = [
  { label: "Aurelle Home", path: "index.html#home" },
  { label: "Treatments", path: "index.html#treatments" },
  { label: "Gallery", path: "index.html#gallery" },
  { label: "The Studio", path: "index.html#about" },
  { label: "Book Appointment", path: "index.html#book" },
];

export default function DemoViewer() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = getDemoBySlug(slug || "");
  const demoPages = useMemo(() => {
    if (slug === "coaching") return COACHING_DEMO_PAGES;
    if (slug === "salon") return SALON_DEMO_PAGES;
    return [];
  }, [slug]);
  const [activeDemoPath, setActiveDemoPath] = useState("index.html");

  useEffect(() => setActiveDemoPath("index.html"), [slug]);

  useEffect(() => {
    document.body.classList.add("demo-viewer-active");
    const exitOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") navigate("/projects");
    };
    window.addEventListener("keydown", exitOnEscape);
    return () => {
      document.body.classList.remove("demo-viewer-active");
      window.removeEventListener("keydown", exitOnEscape);
    };
  }, [navigate]);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-basalt-canvas">
        <SEO page="notFound" robots="noindex, follow" />
        <main className="text-center">
          <h1 className="mb-4 font-display text-4xl text-abyssal-ink">Demo not found</h1>
          <Link to="/projects" className="font-body text-digital-orange underline">Back to Projects</Link>
        </main>
      </div>
    );
  }

  return (
    <main id="main-content" className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[#09090b]">
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

      <header className="demo-control-bar z-[100] flex min-h-14 shrink-0 items-center gap-2 border-b border-white/10 bg-[#171717] px-3 text-white shadow-lg sm:gap-4 sm:px-5">
        <div className="hidden min-w-0 flex-1 sm:block">
          <p className="truncate text-xs font-bold sm:text-sm">{project.title}</p>
          <p className="hidden truncate text-[10px] text-white/45 sm:block">Interactive project preview</p>
        </div>

        {demoPages.length > 0 && (
          <div className="relative min-w-0 flex-1 sm:max-w-[260px]">
            <label htmlFor="demo-page-select" className="sr-only">Open demo page</label>
            <select
              id="demo-page-select"
              value={activeDemoPath}
              onChange={(event) => setActiveDemoPath(event.target.value)}
              className="h-10 w-full cursor-pointer rounded-md border border-white/15 bg-white/8 px-3 text-xs font-semibold text-white outline-none transition-colors hover:border-white/30 focus:border-digital-orange sm:text-sm"
            >
              {demoPages.map((page) => <option key={page.path} value={page.path} className="bg-[#171717] text-white">{page.label}</option>)}
            </select>
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate("/projects")}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md border border-white/15 bg-white/8 px-3 text-xs font-semibold text-white transition-colors duration-200 hover:border-digital-orange hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-digital-orange sm:px-4 sm:text-sm"
          aria-label={`Exit ${project.title} demo and return to projects`}
          title="Exit demo (Esc)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
          <span className="hidden sm:inline">Exit Demo</span>
          <span className="sm:hidden">Exit</span>
        </button>
      </header>

      <iframe
        key={activeDemoPath}
        src={`/demo/${project.slug}/${activeDemoPath}`}
        title={`${project.title} - ${demoPages.find((page) => page.path === activeDemoPath)?.label || "Demo"}`}
        className="min-h-0 w-full flex-1 border-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onLoad={(event) => event.currentTarget.contentDocument?.documentElement.classList.add("embedded-demo")}
      />
    </main>
  );
}
