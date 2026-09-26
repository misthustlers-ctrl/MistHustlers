import { createServer as createViteServer } from "vite";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import React from "react";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ROUTES, routeKeyForPath } from "./routes.mjs";

const DIST = resolve("dist");
const PRERENDERED_DIR = join(DIST, "__prerendered");

const local = () => ({
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
});

const globalMocks = {
  localStorage: local(),
  sessionStorage: local(),
  matchMedia: () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
  requestAnimationFrame: (cb) => setTimeout(cb, 0),
  cancelAnimationFrame: (id) => clearTimeout(id),
  scrollTo: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  getComputedStyle: () => ({}),
  customElements: { define: () => {}, get: () => undefined },
  history: { scrollRestoration: "" },
};

const PAGES = {
  "/": "src/pages/Home.tsx",
  "/services": "src/pages/Services.tsx",
  "/services/web-development": "src/pages/services/WebDevelopment.tsx",
  "/services/web-design": "src/pages/services/WebDesign.tsx",
  "/services/app-development": "src/pages/services/AppDevelopment.tsx",
  "/services/custom-web-development": "src/pages/services/CustomWebDevelopment.tsx",
  "/services/web-application-development": "src/pages/services/WebApplicationDevelopment.tsx",
  "/services/ecommerce-development": "src/pages/services/EcommerceDevelopment.tsx",
  "/services/website-redesign": "src/pages/services/WebsiteRedesign.tsx",
  "/services/mvp-development": "src/pages/services/MVPDevelopment.tsx",
  "/services/saas-development": "src/pages/services/SaasDevelopment.tsx",
  "/services/ai-development": "src/pages/services/AiDevelopment.tsx",
  "/services/automation": "src/pages/services/Automation.tsx",
  "/services/crm-development": "src/pages/services/CRMDevelopment.tsx",
  "/services/ui-ux": "src/pages/services/UIUX.tsx",
  "/services/maintenance": "src/pages/services/Maintenance.tsx",
  "/industries": "src/pages/industries/IndustryHub.tsx",
  "/industries/restaurant": "src/pages/industries/IndustryPage.tsx",
  "/industries/interior-designer": "src/pages/industries/IndustryPage.tsx",
  "/industries/education": "src/pages/industries/IndustryPage.tsx",
  "/industries/law-firm": "src/pages/industries/IndustryPage.tsx",
  "/industries/construction": "src/pages/industries/IndustryPage.tsx",
  "/industries/real-estate": "src/pages/industries/IndustryPage.tsx",
  "/industries/travel": "src/pages/industries/IndustryPage.tsx",
  "/industries/manufacturing": "src/pages/industries/IndustryPage.tsx",
  "/industries/startup": "src/pages/industries/IndustryPage.tsx",
  "/pricing": "src/pages/PricingPage.tsx",
  "/testimonials": "src/pages/TestimonialsPage.tsx",
  "/web-development-company-indore": "src/pages/LocationPage.tsx",
  "/case-studies": "src/pages/CaseStudies.tsx",
  "/seo-audit": "src/pages/ProtectedSeoAudit.tsx",
  "/projects": "src/pages/Projects.tsx",
  "/about": "src/pages/About.tsx",
  "/contact": "src/pages/Contact.tsx",
  "/faq": "src/pages/FAQ.tsx",
  "/privacy-policy": "src/pages/PrivacyPolicy.tsx",
  "/terms-of-service": "src/pages/TermsOfService.tsx",
  "/refund-policy": "src/pages/RefundPolicy.tsx",
};

const INDUSTRY_PATTERN = "/industries/:slug";

function extractHeadTags(html) {
  const titleMatch = html.match(/<title[^>]*>[\s\S]*?<\/title>/i);
  const title = titleMatch ? titleMatch[0] : "";
  const metas = (html.match(/<meta\s[^>]*\/?>/gi) || []).join("\n");
  const links = (html.match(/<link\s[^>]*\/?>/gi) || []).join("\n");
  const scripts = (html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || []).join("\n");

  const head = [title, metas, links, scripts].filter(Boolean).join("\n");
  const body = html
    .replace(/<title[^>]*>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s[^>]*\/?>/gi, "")
    .replace(/<link\s[^>]*\/?>/gi, "")
    .replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, "");

  return { head, body };
}

function installGlobals(pathname) {
  const windowMock = {
    ...globalMocks,
    location: {
      pathname,
      hash: "",
      href: `https://www.misthustlers.in${pathname}`,
      search: "",
      origin: "https://www.misthustlers.in",
    },
    innerWidth: 1280,
    innerHeight: 800,
    devicePixelRatio: 1,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
  };
  globalThis.window = windowMock;
  globalThis.document = {
    body: { classList: { add: () => {}, remove: () => {} }, style: {} },
    documentElement: { style: {} },
    getElementById: () => null,
    createElement: () => ({ classList: { add: () => {} }, style: {}, appendChild: () => {} }),
    head: { appendChild: () => {} },
    querySelector: () => null,
    querySelectorAll: () => [],
  };
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { userAgent: "MistHustlersBot", language: "en" },
  });
  globalThis.localStorage = globalMocks.localStorage;
  globalThis.sessionStorage = globalMocks.sessionStorage;
  globalThis.matchMedia = globalMocks.matchMedia;
  globalThis.requestAnimationFrame = globalMocks.requestAnimationFrame;
  globalThis.cancelAnimationFrame = globalMocks.cancelAnimationFrame;
  globalThis.scrollTo = globalMocks.scrollTo;
  globalThis.history = globalMocks.history;
}

async function prerender() {
  if (!existsSync(DIST)) {
    console.error("dist/ not found. Run the vite build first.");
    process.exit(1);
  }

  const template = readFileSync(join(DIST, "index.html"), "utf-8");

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error",
  });

  const LayoutModule = await vite.ssrLoadModule("/src/components/Layout.tsx");
  const Layout = LayoutModule.default;
  const AuthProviderModule = await vite.ssrLoadModule("/src/auth/AuthProvider.tsx");
  const AuthProvider = AuthProviderModule.AuthProvider;

  if (!existsSync(PRERENDERED_DIR)) {
    mkdirSync(PRERENDERED_DIR, { recursive: true });
  }

  let success = 0;
  let failed = 0;

  for (const route of ROUTES) {
    const file = PAGES[route];
    if (!file) {
      console.error(`[prerender] No page mapped for ${route}`);
      failed++;
      continue;
    }

    installGlobals(route);

    console.log(`[prerender] Rendering ${route}...`);

    try {
      const mod = await vite.ssrLoadModule(`/${file}`);
      const Component = mod.default || mod[Object.keys(mod)[0]];

      const pattern = route.startsWith("/industries/") && file.includes("IndustryPage") ? INDUSTRY_PATTERN : route;

      const appHtml = renderToString(
        React.createElement(
          HelmetProvider,
          null,
          React.createElement(
            AuthProvider,
            null,
            React.createElement(
              MemoryRouter,
              { initialEntries: [route], initialIndex: 0 },
              React.createElement(
                Routes,
                null,
                React.createElement(
                  Route,
                  { element: React.createElement(Layout) },
                  React.createElement(Route, { path: pattern, element: React.createElement(Component) })
                )
              )
            )
          )
        )
      );

      const { head, body } = extractHeadTags(appHtml);

      const html = template
        .replace("</head>", `${head}\n</head>`)
        .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

      const outputPath = join(PRERENDERED_DIR, routeKeyForPath(route));
      writeFileSync(outputPath, html, "utf-8");
      console.log(`[prerender] Saved ${outputPath} (${html.length} bytes)`);
      success++;
    } catch (err) {
      console.error(`[prerender] FAILED ${route}: ${err.stack || err.message}`);
      failed++;
    }
  }

  await vite.close();

  console.log(`\n[prerender] Done. ${success} succeeded, ${failed} failed.`);

  if (failed > 0) {
    process.exit(1);
  }
}

prerender();
