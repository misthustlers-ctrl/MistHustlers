import { Router } from "express";
import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

const PAGES = ["home", "services", "career", "projects"];

router.get("/:page", async (req, res) => {
  const { page } = req.params;

  if (page === "contact") {
    try {
      const data = JSON.parse(
        await readFile(join(__dirname, "..", "data", "contact.json"), "utf-8")
      );
      return res.json({ success: true, data });
    } catch {
      return res.status(500).json({ success: false, message: "Failed to read contact data" });
    }
  }

  if (!PAGES.includes(page)) {
    return res.status(404).json({ success: false, message: "Page not found" });
  }

  try {
    const data = JSON.parse(
      await readFile(join(__dirname, "..", "data", `content-${page}.json`), "utf-8")
    );
    res.json({ success: true, data });
  } catch (err) {
    console.error(`[CONTENT API] Error reading ${page}:`, err.message);
    res.status(500).json({ success: false, message: "Failed to read content" });
  }
});

export default router;
