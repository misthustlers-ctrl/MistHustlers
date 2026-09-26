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

export default function DemoViewer() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = getDemoBySlug(slug || "");
  const demoPages = useMemo(() => {
    if (slug === "coaching") return COACHING_DEMO_PAGES;
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
