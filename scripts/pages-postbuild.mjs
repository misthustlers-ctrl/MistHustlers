import { readFileSync, copyFileSync, mkdirSync, rmSync, existsSync } from "fs";
import { join, dirname, resolve } from "path";
import { ROUTES } from "./routes.mjs";

const DIST = resolve("dist");
const PRERENDERED_DIR = join(DIST, "__prerendered");

const prerenderedIndex = join(PRERENDERED_DIR, "index.html");

if (!existsSync(prerenderedIndex)) {
  console.error("[pages] __prerendered/index.html missing. Run 'npm run prerender' first.");
  process.exit(1);
}

const rootIndex = join(DIST, "index.html");
copyFileSync(prerenderedIndex, rootIndex);
console.log(`[pages] dist/index.html replaced with prerendered HTML (${readFileSync(rootIndex, "utf-8").length} bytes)`);

let routes = 0;
for (const route of ROUTES) {
  if (route === "/") continue;
  const segments = route.slice(1).split("/");
  const fileName = `${segments.pop()}.html`;
  const source = join(PRERENDERED_DIR, `${segments.join("-")}${segments.length ? "-" : ""}${fileName}`);
  if (!existsSync(source)) {
    console.error(`[pages] missing prerendered file: ${source}`);
    process.exit(1);
  }
  const targetDir = join(DIST, ...segments);
  mkdirSync(targetDir, { recursive: true });
  copyFileSync(source, join(targetDir, fileName));
  routes++;
}

rmSync(PRERENDERED_DIR, { recursive: true, force: true });
console.log(`[pages] ${routes} prerendered routes placed as flat .html files (no trailing slash, no redirects)`);