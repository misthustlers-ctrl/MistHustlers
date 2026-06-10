import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

const PAGES = ["home", "services", "career", "projects", "seo"];

router.get("/:page", async (req, res, next) => {
  const { page } = req.params;

  const allowed = page === "contact" || PAGES.includes(page);
  if (!allowed) {
    return res.status(404).json({ success: false, message: "Page not found" });
  }

  try {
    const entry = await prisma.content.findUnique({ where: { page } });
    if (!entry) {
      return res.status(404).json({ success: false, message: "Content not found" });
    }
    res.json({ success: true, data: entry.data });
  } catch (err) {
    next(err);
  }
});

export default router;
