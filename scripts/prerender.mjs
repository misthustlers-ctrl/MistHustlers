import { createServer } from "http";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join, extname, resolve } from "path";
import { chromium } from "playwright";

const DIST = resolve("dist");
const PRERENDERED_DIR = join(DIST, "__prerendered");

const ROUTES = [
  "/",
  "/services",
  "/services/web-development",
  "/services/automation",
  "/services/mvp-development",
  "/projects",
  "/about",
  "/contact",
  "/faq",
  "/privacy-policy",
  "/terms-of-service",
  "/refund-policy",
];

const PORT = 6789;

function startServer() {
  return createServer((req, res) => {
    let filePath = join(DIST, req.url === "/" ? "index.html" : req.url);

    if (!existsSync(filePath) || extname(req.url || "") === "" || req.url === "/") {
      filePath = join(DIST, "index.html");
    }

    try {
      const content = readFileSync(filePath);
      const ext = extname(filePath);
      const mime = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".ico": "image/x-icon",
        ".woff2": "font/woff2",
      };
      res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });
}

async function prerender() {
  if (!existsSync(DIST)) {
    console.error("dist/ not found. Run 'npm run build' first.");
    process.exit(1);
  }

  const server = startServer();
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[prerender] Server running on http://localhost:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    viewport: { width: 1280, height: 800 },
  });

  if (!existsSync(PRERENDERED_DIR)) {
    mkdirSync(PRERENDERED_DIR, { recursive: true });
  }

  let success = 0;
  let failed = 0;

  for (const route of ROUTES) {
    const url = `http://localhost:${PORT}${route}`;
    console.log(`[prerender] Rendering ${route}...`);

    try {
      const page = await context.newPage();
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

      await page.waitForSelector("#root > *", { timeout: 15000 }).catch(() => {});

      await page.waitForTimeout(1000);

      const html = await page.content();
      const fileName = route === "/" ? "index.html" : `${route.slice(1).replace(/\//g, "-")}.html`;
      const outputPath = join(PRERENDERED_DIR, fileName);

      const dir = join(PRERENDERED_DIR, ...(route === "/" ? [] : [route.slice(1).split("/")[0]]));
      if (route !== "/" && route.split("/").length > 2) {
        const subDir = join(PRERENDERED_DIR, ...route.slice(1).split("/").slice(0, -1));
        if (!existsSync(subDir)) mkdirSync(subDir, { recursive: true });
      }

      writeFileSync(outputPath, html, "utf-8");
      console.log(`[prerender] Saved ${outputPath} (${html.length} bytes)`);
      success++;
      await page.close();
    } catch (err) {
      console.error(`[prerender] FAILED ${route}: ${err.message}`);
      failed++;
    }
  }

  await browser.close();
  server.close();

  console.log(`\n[prerender] Done. ${success} succeeded, ${failed} failed.`);

  if (failed > 0) {
    process.exit(1);
  }
}

prerender();
