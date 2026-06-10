import { appendFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_DIR = join(__dirname, "..", "logs");
const LOG_FILE = join(LOG_DIR, "audit.log");

async function ensureLogDir() {
  if (!existsSync(LOG_DIR)) await mkdir(LOG_DIR, { recursive: true });
}

export async function auditLog(req, res, next) {
  res.on("finish", async () => {
    if (res.statusCode >= 400) {
      await ensureLogDir();
      const entry = JSON.stringify({
        id: req.id,
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        status: res.statusCode,
        ip: req.ip,
        userAgent: req.get("user-agent") || "",
      }) + "\n";
      try { await appendFile(LOG_FILE, entry, "utf-8"); } catch {}
    }
  });
  next();
}
