import { readFileSync, writeFileSync, copyFileSync, existsSync } from "fs";
import { join, resolve } from "path";
import { ROUTES, routeKeyForPath } from "./routes.mjs";

const DIST = resolve("dist");
const PRERENDERED_DIR = join(DIST, "__prerendered");

function writeRedirects() {
  const prerenderedIndex = join(PRERENDERED_DIR, "index.html");

  if (!existsSync(prerenderedIndex)) {
    console.error("[netlify] __prerendered/index.html missing. Run 'npm run prerender' first.");
    process.exit(1);
  }

  const rootIndex = join(DIST, "index.html");
  copyFileSync(prerenderedIndex, rootIndex);
  const replaced = readFileSync(rootIndex, "utf-8");
  console.log(`[netlify] dist/index.html replaced with prerendered HTML (${replaced.length} bytes)`);

  const lines = [
    `/api/fetch-audit-html   /.netlify/functions/fetch-audit-html  200`,
    `/api/run-seo-audit      /.netlify/functions/run-seo-audit  200`,
    `/api/find-leads         /.netlify/functions/find-leads  200`,
    `/api/import-leads       /.netlify/functions/import-leads  200`,
    `/api/verify-unlock      /.netlify/functions/verify-unlock  200`,
  ];
  for (const route of ROUTES) {
    lines.push(`${route.padEnd(52)}  /__prerendered/${routeKeyForPath(route)}  200`);
  }
  lines.push(`/*   /__prerendered/index.html  200`);

  writeFileSync(join(DIST, "_redirects"), lines.join("\n") + "\n");
  console.log(`[netlify] _redirects written: ${ROUTES.length} prerendered routes + SPA fallback`);
}

writeRedirects();
