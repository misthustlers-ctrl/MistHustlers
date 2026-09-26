(() => {
  const base = "/demo/coaching/";
  const routes = {
    home: base,
    "zenith academy": base,
    courses: `${base}course_catalog/code.html`,
    "course catalog": `${base}course_catalog/code.html`,
    "all courses": `${base}course_catalog/code.html`,
    "explore courses": `${base}course_catalog/code.html`,
    faculty: `${base}faculty_directory/code.html`,
    "meet our faculty": `${base}faculty_directory/code.html`,
    results: `${base}hall_of_fame/code.html`,
    "hall of fame": `${base}hall_of_fame/code.html`,
    "wall of champions": `${base}hall_of_fame/code.html`,
    "success stories": `${base}hall_of_fame/code.html`,
    dashboard: `${base}student_dashboard_overview/code.html`,
    overview: `${base}student_dashboard_overview/code.html`,
    "student dashboard": `${base}student_dashboard_overview/code.html`,
    "my courses": `${base}my_courses_dashboard/code.html`,
    exams: `${base}practice_tests_mock_exams/code.html`,
    "practice tests": `${base}practice_tests_mock_exams/code.html`,
    "mock exams": `${base}practice_tests_mock_exams/code.html`,
    schedule: `${base}practice_tests_mock_exams/code.html`,
    analytics: `${base}zst_results_portal/code.html`,
    "zst results": `${base}zst_results_portal/code.html`,
    "view results": `${base}zst_results_portal/code.html`,
    "view detailed report": `${base}zst_results_portal/code.html`,
    "jee advanced": `${base}course_detail_jee_2026/code.html`,
    "jee advanced 2026": `${base}course_detail_jee_2026/code.html`,
    "view course": `${base}course_detail_jee_2026/code.html`,
  };

  const normalize = (value) => String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  const routeFor = (element) => {
    const label = normalize(element.getAttribute("aria-label") || element.textContent);
    if (routes[label]) return routes[label];
    for (const [key, route] of Object.entries(routes)) {
      if (label === key || label.startsWith(`${key} `)) return route;
    }
    return null;
  };

  document.querySelectorAll("a").forEach((link) => {
    const route = routeFor(link);
    const href = link.getAttribute("href") || "";
    if (route && (!href || href === "#" || href.startsWith("javascript:"))) {
      link.href = route;
    }
  });

  document.querySelectorAll("button").forEach((button) => {
    const route = routeFor(button);
    if (!route || button.closest("a") || button.type === "submit") return;
    button.addEventListener("click", () => window.location.assign(route));
  });

  const demoPages = [
    ["Academy Home", base],
    ["Course Catalog", `${base}course_catalog/code.html`],
    ["JEE 2026 Course", `${base}course_detail_jee_2026/code.html`],
    ["Faculty", `${base}faculty_directory/code.html`],
    ["Hall of Fame", `${base}hall_of_fame/code.html`],
    ["Student Dashboard", `${base}student_dashboard_overview/code.html`],
    ["My Courses", `${base}my_courses_dashboard/code.html`],
    ["Mock Exams", `${base}practice_tests_mock_exams/code.html`],
    ["Results Portal", `${base}zst_results_portal/code.html`],
  ];

  const style = document.createElement("style");
  style.textContent = `
    .material-symbols-outlined{display:inline-block;max-width:1.35em;overflow:hidden;white-space:nowrap;color:transparent!important}
    .zenith-icons-ready .material-symbols-outlined{color:inherit!important}
    .zenith-demo-switcher{position:fixed;left:max(12px,env(safe-area-inset-left));bottom:max(12px,env(safe-area-inset-bottom));z-index:9999;font-family:Manrope,Arial,sans-serif}
    .embedded-demo .zenith-demo-switcher{display:none}
    .zenith-demo-trigger{min-height:44px;border:1px solid rgba(255,255,255,.2);border-radius:999px;background:rgba(7,27,51,.94);color:#fff;padding:0 16px;font-size:12px;font-weight:800;box-shadow:0 12px 32px rgba(0,0,0,.24);cursor:pointer;backdrop-filter:blur(12px)}
    .zenith-demo-trigger:hover,.zenith-demo-trigger:focus-visible{border-color:#d89a2b;outline:none}
    .zenith-demo-menu{position:absolute;left:0;bottom:52px;width:min(260px,calc(100vw - 24px));max-height:min(430px,70vh);overflow:auto;border:1px solid rgba(255,255,255,.16);border-radius:8px;background:#071b33;padding:8px;box-shadow:0 20px 48px rgba(0,0,0,.35)}
    .zenith-demo-menu[hidden]{display:none}
    .zenith-demo-menu a{display:flex;min-height:42px;align-items:center;border-radius:6px;padding:8px 11px;color:rgba(255,255,255,.76);font-size:12px;font-weight:700;text-decoration:none}
    .zenith-demo-menu a:hover,.zenith-demo-menu a:focus-visible,.zenith-demo-menu a[aria-current=page]{background:rgba(216,154,43,.16);color:#f1bd5b;outline:none}
    @media(max-width:480px){.zenith-demo-trigger{padding:0 13px}.zenith-demo-menu{max-height:58vh}}
  `;
  document.head.appendChild(style);

  document.fonts.load('16px "Material Symbols Outlined"').then((fonts) => {
    if (fonts.length) document.documentElement.classList.add("zenith-icons-ready");
  }).catch(() => {});
  document.querySelectorAll('img[alt*="Logo"], img[alt*="logo"]').forEach((image) => {
    image.addEventListener("error", () => { image.style.display = "none"; });
    if (image.complete && !image.naturalWidth) image.style.display = "none";
  });

  const switcher = document.createElement("div");
  switcher.className = "zenith-demo-switcher";
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "zenith-demo-trigger";
  trigger.textContent = "Demo Pages";
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-haspopup", "menu");

  const menu = document.createElement("nav");
  menu.className = "zenith-demo-menu";
  menu.setAttribute("aria-label", "Zenith Academy demo pages");
  menu.hidden = true;
  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
  demoPages.forEach(([label, href]) => {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    if (new URL(href, window.location.origin).pathname.replace(/\/$/, "") === currentPath) {
      link.setAttribute("aria-current", "page");
    }
    menu.appendChild(link);
  });

  const setOpen = (open) => {
    menu.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
  };
  trigger.addEventListener("click", () => setOpen(menu.hidden));
  document.addEventListener("click", (event) => {
    if (!switcher.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      event.stopPropagation();
      setOpen(false);
      trigger.focus();
    }
  });
  switcher.append(trigger, menu);
  document.body.appendChild(switcher);
})();
