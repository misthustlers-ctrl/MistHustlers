import { Router } from "express";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import prisma from "../prisma/client.js";

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = join(__dirname, "..", process.env.UPLOAD_DIR || "uploads");

const PAGES = ["home", "services", "career", "projects", "logo", "seo"];

function removeMissingUploadUrls(value) {
  if (Array.isArray(value)) return value.map(removeMissingUploadUrls);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, removeMissingUploadUrls(item)]));
  }
  if (typeof value === "string" && value.startsWith("/uploads/")) {
    const filename = value.split("/").pop();
    return filename && existsSync(join(UPLOAD_DIR, filename)) ? value : "";
  }
  return value;
}

router.get("/:page", async (req, res, next) => {
  const { page } = req.params;

  const allowed = page === "contact" || PAGES.includes(page);
  if (!allowed) {
    return res.status(404).json({ success: false, message: "Page not found" });
  }

  try {
    res.setHeader("Cache-Control", "no-store");
    const entry = await prisma.content.findUnique({ where: { page } });
    if (!entry) {
      return res.status(404).json({ success: false, message: "Content not found" });
    }
    res.json({ success: true, data: removeMissingUploadUrls(entry.data) });
  } catch (err) {
    next(err);
  }
});

export default router;
