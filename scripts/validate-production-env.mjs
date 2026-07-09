const required = ["DATABASE_URL", "ADMIN_USERNAME", "ADMIN_PASSWORD", "ADMIN_SESSION_SECRET", "VITE_SITE_URL", "CORS_ORIGIN", "PORT", "HOST", "TRUST_PROXY"];
const placeholders = [/change-me/i, /replace-with/i, /example/i, /password/i];

const missing = required.filter((name) => !String(process.env[name] || "").trim());
if (missing.length) {
  throw new Error(`Missing production variables: ${missing.join(", ")}`);
}

for (const name of ["ADMIN_PASSWORD", "ADMIN_SESSION_SECRET"]) {
  const value = String(process.env[name]);
  if (value.length < (name === "ADMIN_SESSION_SECRET" ? 32 : 12) || placeholders.some((pattern) => pattern.test(value))) {
    throw new Error(`${name} is weak or still contains a placeholder`);
  }
}

const databaseUrl = new URL(process.env.DATABASE_URL);
if (!["postgres:", "postgresql:"].includes(databaseUrl.protocol)) {
  throw new Error("DATABASE_URL must use PostgreSQL");
}
if (!databaseUrl.username || !databaseUrl.password || !databaseUrl.pathname.slice(1)) {
  throw new Error("DATABASE_URL must include username, password, and database name");
}

const siteUrl = new URL(process.env.VITE_SITE_URL);
if (siteUrl.protocol !== "https:" || siteUrl.hostname !== "www.misthustlers.in") {
  throw new Error("VITE_SITE_URL must be https://www.misthustlers.in");
}

const allowedOrigins = process.env.CORS_ORIGIN.split(",").map((value) => value.trim());
if (!allowedOrigins.includes("https://www.misthustlers.in") || allowedOrigins.includes("*")) {
  throw new Error("CORS_ORIGIN must include the production origin and must not contain *");
}

const uploadDir = process.env.UPLOAD_DIR || "uploads";
if (uploadDir.startsWith("/") || uploadDir.includes("..") || uploadDir.includes("\\")) {
  throw new Error("UPLOAD_DIR must be a safe relative directory under backend/");
}

if (process.env.PORT !== "3000" || process.env.HOST !== "127.0.0.1" || process.env.TRUST_PROXY !== "loopback") {
  throw new Error("AWS must use PORT=3000, HOST=127.0.0.1 and TRUST_PROXY=loopback behind Cloudflare Tunnel");
}

const smtpValues = [process.env.SMTP_EMAIL, process.env.SMTP_PASSWORD, process.env.EMAIL_TO].filter(Boolean);
if (smtpValues.length > 0 && smtpValues.length < 3) {
  throw new Error("SMTP_EMAIL, SMTP_PASSWORD, and EMAIL_TO must be configured together");
}

const cloudflareValues = [process.env.CLOUDFLARE_ZONE_ID, process.env.CLOUDFLARE_API_TOKEN].filter(Boolean);
if (cloudflareValues.length === 1) {
  throw new Error("CLOUDFLARE_ZONE_ID and CLOUDFLARE_API_TOKEN must be configured together");
}

console.log("Production environment validation passed.");
