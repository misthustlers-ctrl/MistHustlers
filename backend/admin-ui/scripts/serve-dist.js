import { createServer } from "http";
import { createReadStream, existsSync } from "fs";
import { extname, join, normalize } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");
const port = Number(process.env.ADMIN_PREVIEW_PORT || 5173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function sendFile(res, filePath) {
  res.setHeader("Content-Type", types[extname(filePath).toLowerCase()] || "application/octet-stream");
  createReadStream(filePath).pipe(res);
}

createServer((req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${port}`);
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/uploads/")) {
    res.writeHead(503, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, message: "Backend is not running in local preview mode" }));
    return;
  }

  const pathname = url.pathname === "/admin" ? "/admin/" : url.pathname;
  const relative = pathname.startsWith("/admin/") ? pathname.slice("/admin/".length) : pathname.slice(1);
  const requested = normalize(join(distDir, relative || "index.html"));
  const filePath = requested.startsWith(distDir) && existsSync(requested) ? requested : join(distDir, "index.html");
  sendFile(res, filePath);
}).listen(port, "127.0.0.1", () => {
  console.log(`Admin preview running at http://localhost:${port}/admin/`);
});
