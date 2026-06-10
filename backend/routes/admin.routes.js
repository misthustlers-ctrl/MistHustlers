import { Router } from "express";
import prisma from "../prisma/client.js";
import { readFile, writeFile, readdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { upload, uploadImage, deleteImage } from "../controllers/upload.controller.js";
import { auditLog } from "../middleware/audit.middleware.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");
const router = Router();

router.use(auditLog);

async function readJSON(file) {
  return JSON.parse(await readFile(join(DATA_DIR, file), "utf-8"));
}

async function writeJSON(file, data) {
  await writeFile(join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

const CONTENT_PAGES = ["home", "services", "career", "projects", "contact"];

async function moveToBin(type, data) {
  const current = await readJSON("bin-files.json").catch(() => []);
  const item = {
    id: `${type}-${data.id}-${Date.now()}`,
    type,
    deletedAt: new Date().toISOString(),
    data,
  };
  current.unshift(item);
  await writeJSON("bin-files.json", current);
  return item;
}

router.get("/bin", async (_, res, next) => {
  try {
    res.json(await readJSON("bin-files.json").catch(() => []));
  } catch (err) { next(err); }
});

router.delete("/bin", async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      await writeJSON("bin-files.json", []);
      return res.json({ ok: true });
    }
    const current = await readJSON("bin-files.json").catch(() => []);
    await writeJSON("bin-files.json", current.filter((item) => item.id !== id));
    res.json({ ok: true });
  } catch (err) { next(err); }
});

router.get("/inquiries", async (_, res, next) => {
  try {
    const items = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) { next(err); }
});

router.put("/inquiries", async (req, res, next) => {
  try {
    const { id, ...updates } = req.body;
    const item = await prisma.inquiry.update({ where: { id }, data: updates });
    res.json(item);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Not found" });
    next(err);
  }
});

router.delete("/inquiries", async (req, res, next) => {
  try {
    const { id } = req.body;
    const item = await prisma.inquiry.delete({ where: { id } });
    await moveToBin("lead", item);
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Not found" });
    next(err);
  }
});

router.get("/opportunities", async (_, res, next) => {
  try {
    const items = await prisma.opportunity.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) { next(err); }
});

router.post("/opportunities", async (req, res, next) => {
  try {
    const item = await prisma.opportunity.create({ data: req.body });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.put("/opportunities", async (req, res, next) => {
  try {
    const { id, ...updates } = req.body;
    const item = await prisma.opportunity.update({ where: { id }, data: updates });
    res.json(item);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Not found" });
    next(err);
  }
});

router.delete("/opportunities", async (req, res, next) => {
  try {
    const { id } = req.body;
    const item = await prisma.opportunity.delete({
      where: { id },
      include: { applicantsRel: true },
    });
    await moveToBin("opportunity", item);
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Not found" });
    next(err);
  }
});

router.get("/applicants", async (_, res, next) => {
  try {
    const items = await prisma.applicant.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) { next(err); }
});

router.post("/applicants", async (req, res, next) => {
  try {
    const item = await prisma.applicant.create({ data: req.body });
    await prisma.opportunity.update({
      where: { id: item.opportunityId },
      data: { applicants: { increment: 1 } },
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.put("/applicants", async (req, res, next) => {
  try {
    const { id, ...updates } = req.body;
    const item = await prisma.applicant.update({ where: { id }, data: updates });
    res.json(item);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Not found" });
    next(err);
  }
});

router.delete("/applicants", async (req, res, next) => {
  try {
    const { id } = req.body;
    const item = await prisma.applicant.delete({ where: { id } });
    await moveToBin("applicant", item);
    await prisma.opportunity.update({
      where: { id: item.opportunityId },
      data: { applicants: { decrement: 1 } },
    }).catch(() => {});
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Not found" });
    next(err);
  }
});

router.get("/projects", async (_, res, next) => {
  try {
    const items = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) { next(err); }
});

router.post("/projects", async (req, res, next) => {
  try {
    const item = await prisma.project.create({ data: req.body });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.put("/projects", async (req, res, next) => {
  try {
    const { id, ...updates } = req.body;
    const item = await prisma.project.update({ where: { id }, data: updates });
    res.json(item);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Not found" });
    next(err);
  }
});

router.delete("/projects", async (req, res, next) => {
  try {
    const { id } = req.body;
    const item = await prisma.project.delete({ where: { id } });
    await moveToBin("project", item);
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Not found" });
    next(err);
  }
});

router.post("/upload", upload.single("image"), uploadImage);
router.delete("/upload/:filename", deleteImage);

router.get("/media", async (_, res, next) => {
  try {
    const uploadsDir = join(__dirname, "..", process.env.UPLOAD_DIR || "uploads");
    const files = await readdir(uploadsDir).catch(() => []);
    const urls = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f)).map(f => `/uploads/${f}`);
    res.json(urls);
  } catch (err) { next(err); }
});

router.get("/content/:page", async (req, res, next) => {
  const page = req.params.page;
  if (!CONTENT_PAGES.includes(page)) return res.status(404).json({ error: "Page not found" });
  try {
    const entry = await prisma.content.findUnique({ where: { page } });
    if (!entry) return res.status(404).json({ error: "Content not found" });
    res.json({ success: true, data: entry.data });
  } catch (err) { next(err); }
});

router.put("/content/:page", async (req, res, next) => {
  const page = req.params.page;
  if (!CONTENT_PAGES.includes(page)) return res.status(404).json({ error: "Page not found" });
  try {
    const entry = await prisma.content.upsert({
      where: { page },
      update: { data: req.body },
      create: { page, data: req.body },
    });
    res.json({ success: true, data: entry.data });
  } catch (err) { next(err); }
});

export default router;
