import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import { join, dirname } from "path";
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

const smtpOptional = ["SMTP_EMAIL", "SMTP_PASSWORD", "EMAIL_TO"];
const smtpMissing = smtpOptional.filter((k) => !process.env[k]);
if (smtpMissing.length) {
  console.warn(`[WARN] SMTP not configured (${smtpMissing.join(", ")}). Emails will be logged instead of sent.`);
}

const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",").map(s => s.trim());
app.use(cors({ origin: corsOrigins }));
app.use(morgan("short"));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
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
  app.use(express.static(frontendDist, staticOptions));

  const prerenderedDir = join(frontendDist, "__prerendered");
  if (existsSync(prerenderedDir)) {
    app.use((req, res, next) => {
      if (req.path.startsWith("/api") || req.path.startsWith("/admin") || req.path.startsWith("/uploads")) {
        return next();
      }
      const routeKey = req.path === "/" ? "index" : req.path.slice(1).replace(/\//g, "-");
      const filePath = join(prerenderedDir, routeKey + ".html");
      if (existsSync(filePath)) {
        return res.sendFile(filePath);
      }
      next();
    });
  }

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/admin") || req.path.startsWith("/uploads")) {
      return next();
    }
    res.sendFile(join(frontendDist, "index.html"));
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
