import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import inquiryRoutes from "./routes/inquiry.routes.js";
import contentRoutes from "./routes/content.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import publicRoutes from "./routes/public.routes.js";
import { adminAuth } from "./middleware/admin-auth.middleware.js";
import { seed } from "./prisma/seed.js";
import { errorHandler } from "./middleware/error.middleware.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 9000;

app.set("trust proxy", 1);

const PRIMARY_PUBLIC_ORIGIN = "https://www.misthustlers.in";
const PRIMARY_PUBLIC_HOST = "www.misthustlers.in";
const REDIRECT_PUBLIC_HOSTS = new Set(["misthustlers.in", "misthustlers.up.railway.app"]);
const PUBLIC_PAGE_ROUTES = new Set([
  "/",
  "/services",
  "/services/web-development",
  "/services/automation",
  "/services/mvp-development",
  "/career",
  "/projects",
  "/about",
  "/contact",
  "/faq",
  "/privacy-policy",
  "/terms-of-service",
  "/refund-policy",
]);
const DEMO_SLUGS = new Set([
  "startup",
  "restaurant",
  "realestate",
  "salon",
  "clinic",
  "gym",
  "coaching",
  "interior",
  "manufacturer",
  "ca-lawyer",
]);

function normalizePath(path) {
  if (!path || path === "/") return "/";
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

function isDemoRoute(path) {
  const match = normalizePath(path).match(/^\/projects\/demo\/([^/]+)$/);
  return Boolean(match && DEMO_SLUGS.has(match[1]));
}

function isPublicPagePath(path) {
  const normalized = normalizePath(path);
  return PUBLIC_PAGE_ROUTES.has(normalized) || isDemoRoute(normalized);
}

function routeKeyForPath(path) {
  const normalized = normalizePath(path);
  return normalized === "/" ? "index" : normalized.slice(1).replace(/\//g, "-");
}

function isPrivatePath(path) {
  return path.startsWith("/api") || path.startsWith("/admin") || path.startsWith("/uploads");
}

function isPublicBrowserPageRequest(req) {
  if (!["GET", "HEAD"].includes(req.method)) return false;
  if (isPrivatePath(req.path)) return false;
  const accept = req.get("accept") || "";
  return accept.includes("text/html") || accept.includes("*/*");
}

const uploadsDir = join(__dirname, "uploads");
if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

const dataDir = join(__dirname, "data");
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
const runtimeFiles = ["bin-files.json", "applicants.json", "inquiries.json", "opportunities.json", "projects.json"];
for (const f of runtimeFiles) {
  const fp = join(dataDir, f);
  if (!existsSync(fp)) writeFileSync(fp, "[]", "utf-8");
}

const required = ["ADMIN_USERNAME", "ADMIN_PASSWORD", "DATABASE_URL"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`[FATAL] Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

if (!process.env.ADMIN_SESSION_SECRET) {
  console.warn("[WARN] ADMIN_SESSION_SECRET is not configured. ADMIN_PASSWORD will be used to sign admin sessions.");
}

const smtpOptional = ["SMTP_EMAIL", "SMTP_PASSWORD", "EMAIL_TO"];
const smtpMissing = smtpOptional.filter((k) => !process.env[k]);
if (smtpMissing.length) {
  console.warn(`[WARN] SMTP not configured (${smtpMissing.join(", ")}). Emails will be logged instead of sent.`);
}

if (!process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
  console.warn("[WARN] Google Sheet sync not configured. Set GOOGLE_SHEETS_WEBHOOK_URL to sync inquiries to a sheet.");
}

const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,https://www.misthustlers.in").split(",").map(s => s.trim());
app.use(cors({ origin: corsOrigins }));
app.use(morgan("short"));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      frameSrc: ["'self'", "https://www.google.com", "https://maps.google.com"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
}));

const oneYear = 365 * 24 * 60 * 60;
const oneDay = 24 * 60 * 60;

const staticOptions = {
  maxAge: oneDay * 1000,
  setHeaders(res, filePath) {
    if (filePath.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    } else if (/\.(js|css)$/i.test(filePath)) {
      res.setHeader("Cache-Control", `public, max-age=${oneYear}, immutable`);
    } else if (/\.(jpg|jpeg|png|webp|avif|gif|svg|ico)$/i.test(filePath)) {
      res.setHeader("Cache-Control", `public, max-age=${oneDay}`);
    }
  },
};

app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(join(__dirname, "uploads"), staticOptions));
app.disable("x-powered-by");

app.use((req, res, next) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/admin") || req.path.startsWith("/uploads")) {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
  }
  next();
});

app.use((req, res, next) => {
  if (!isPublicBrowserPageRequest(req)) return next();

  const host = (req.get("host") || "").split(":")[0].toLowerCase();
  const forwardedProto = (req.get("x-forwarded-proto") || req.protocol || "").split(",")[0].trim().toLowerCase();
  const shouldRedirectHost = REDIRECT_PUBLIC_HOSTS.has(host);
  const shouldRedirectProtocol = host === PRIMARY_PUBLIC_HOST && forwardedProto && forwardedProto !== "https";

  if (shouldRedirectHost || shouldRedirectProtocol) {
    return res.redirect(308, `${PRIMARY_PUBLIC_ORIGIN}${req.originalUrl}`);
  }

  next();
});

app.use((req, _, next) => {
  req.id = crypto.randomUUID();
  next();
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  skip: (req) => req.path.startsWith("/api/content") || req.path.startsWith("/api/health"),
  message: { success: false, message: "Too many requests. Try again later." },
});

const contentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: "Too many requests. Try again later." },
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests. Try again later." },
});

app.use("/api", generalLimiter);

app.use("/api/content", contentLimiter, contentRoutes);

app.use("/api/admin", adminLimiter, adminAuth);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", publicRoutes);

app.use("/api", inquiryRoutes);

const adminDist = join(__dirname, "admin-ui", "dist");

if (existsSync(adminDist)) {
  app.use("/admin", express.static(adminDist, staticOptions));
  app.get("/admin/*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(join(adminDist, "index.html"));
  });
} else {
  app.use("/admin", (_, res) => {
    res.status(503).send("Admin dashboard not built yet. Run: cd admin-ui && npm install && npm run build");
  });
}

const frontendDist = join(__dirname, "..", "dist");
if (existsSync(frontendDist)) {
  app.use(express.static(frontendDist, { ...staticOptions, index: false }));

  const prerenderedDir = join(frontendDist, "__prerendered");
  if (existsSync(prerenderedDir)) {
    app.use((req, res, next) => {
      if (isPrivatePath(req.path) || !isPublicBrowserPageRequest(req)) {
        return next();
      }
      const routeKey = routeKeyForPath(req.path);
      const filePath = join(prerenderedDir, routeKey + ".html");
      if (existsSync(filePath)) {
        return res.sendFile(filePath);
      }
      next();
    });
  }

  app.get("*", (req, res, next) => {
    if (isPrivatePath(req.path)) {
      return next();
    }

    if (extname(req.path)) {
      return res.status(404).type("text/plain").send("Not found");
    }

    const status = isPublicPagePath(req.path) ? 200 : 404;
    res.status(status).sendFile(join(frontendDist, "index.html"));
  });
}

app.use(errorHandler);

try {
  await seed();
  console.log("[BOOT] Seed completed");
} catch (e) {
  console.error("[BOOT] Seed failed:", e.message);
}

app.listen(PORT, () => {
  console.log(`[MistHustlers Backend] Running on http://localhost:${PORT}`);
  console.log(`[Admin Dashboard]    http://localhost:${PORT}/admin`);
  console.log(`[Content API]        http://localhost:${PORT}/api/content/home`);
});
