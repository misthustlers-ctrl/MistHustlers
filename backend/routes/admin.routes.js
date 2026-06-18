import { Router } from "express";
import prisma from "../prisma/client.js";
import { readFile, writeFile, readdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { upload, uploadImage, deleteImage } from "../controllers/upload.controller.js";
import { auditLog } from "../middleware/audit.middleware.js";
import { allowRoles, createSessionToken, hashPassword, requireAdmin } from "../middleware/admin-auth.middleware.js";

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

const CONTENT_PAGES = ["home", "services", "career", "projects", "contact", "logo", "seo"];
const ACCOUNT_ROLES = ["agent", "partner"];
const INQUIRY_STATUSES = ["new", "contacted", "archived"];
const EMAIL_STATUSES = ["pending", "sent", "failed"];
const OPPORTUNITY_STATUSES = ["open", "paused", "closed", "archived"];
const APPLICANT_STATUSES = ["new", "reviewed", "shortlisted", "accepted", "rejected"];
const PROJECT_STATUSES = ["planning", "in-progress", "review", "completed"];
const WORK_STATUSES = ["lead", "quoted", "assigned", "in-progress", "review", "completed", "paid", "lost"];

function toId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function text(value, max = 5000) {
  if (value === undefined) return undefined;
  const normalized = String(value || "").trim();
  return normalized.slice(0, max);
}

function nullableText(value, max = 5000) {
  const normalized = text(value, max);
  return normalized ? normalized : null;
}

function requireText(value, label, max = 5000) {
  const normalized = text(value, max);
  if (!normalized) {
    const err = new Error(`${label} is required`);
    err.status = 400;
    throw err;
  }
  return normalized;
}

function pickStatus(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function money(value) {
  const amount = Number(value || 0);
  return Number.isFinite(amount) && amount >= 0 ? Math.round(amount) : 0;
}

const workInclude = {
  agent: { select: { id: true, username: true, displayName: true, role: true, status: true } },
  partner: { select: { id: true, username: true, displayName: true, role: true, status: true } },
};

function validateContentPayload(page, data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return `${page} content must be an object`;
  }
  const size = Buffer.byteLength(JSON.stringify(data), "utf-8");
  if (size > 750_000) return `${page} content is too large`;
  return null;
}

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

async function logActivity(req, action, target, detail = "") {
  await prisma.activityLog.create({
    data: {
      actor: req.admin?.username || "unknown",
      role: req.admin?.role || "unknown",
      action,
      target,
      detail: text(detail, 1000) || null,
    },
  }).catch(() => {});
}

router.get("/bin", requireAdmin, async (_, res, next) => {
  try {
    res.json(await readJSON("bin-files.json").catch(() => []));
  } catch (err) { next(err); }
});

router.get("/deploy-status", requireAdmin, async (_, res) => {
  res.json({
    service: process.env.RAILWAY_SERVICE_NAME || process.env.RAILWAY_SERVICE_ID || "local",
    environment: process.env.RAILWAY_ENVIRONMENT_NAME || process.env.NODE_ENV || "development",
    gitCommit: process.env.RAILWAY_GIT_COMMIT_SHA || process.env.GIT_COMMIT || "unknown",
    deployId: process.env.RAILWAY_DEPLOYMENT_ID || "unknown",
    checkedAt: new Date().toISOString(),
  });
});

router.get("/activity", requireAdmin, async (_, res, next) => {
  try {
    const items = await prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 80 });
    res.json(items);
  } catch (err) { next(err); }
});

router.delete("/bin", requireAdmin, async (req, res, next) => {
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

router.get("/session", (req, res) => {
  res.json({ success: true, user: req.admin, token: createSessionToken(req.admin) });
});

router.get("/accounts", requireAdmin, async (_, res, next) => {
  try {
    const accounts = await prisma.adminUser.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, username: true, displayName: true, role: true, status: true, createdAt: true, updatedAt: true },
    });
    res.json(accounts);
  } catch (err) { next(err); }
});

router.post("/accounts", requireAdmin, async (req, res, next) => {
  try {
    const { username, password, displayName, role } = req.body;
    const safeUsername = text(username, 80)?.toLowerCase();
    if (!username || !password || !ACCOUNT_ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: "Username, password, and a valid account type are required" });
    }
    if (!/^[a-z0-9._-]{3,80}$/.test(safeUsername)) {
      return res.status(400).json({ success: false, message: "Username can use letters, numbers, dots, dashes, and underscores only" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }
    const { salt, passwordHash } = hashPassword(password);
    const account = await prisma.adminUser.create({
      data: { username: safeUsername, displayName: nullableText(displayName, 120), role, salt, passwordHash },
      select: { id: true, username: true, displayName: true, role: true, status: true, createdAt: true, updatedAt: true },
    });
    await logActivity(req, "create-account", `account:${account.id}`, `${account.role}:${account.username}`);
    res.status(201).json(account);
  } catch (err) {
    if (err.code === "P2002") return res.status(409).json({ success: false, message: "Username already exists" });
    next(err);
  }
});

router.put("/accounts", requireAdmin, async (req, res, next) => {
  try {
    const { id, password, role, ...updates } = req.body;
    const accountId = toId(id);
    if (!accountId) return res.status(400).json({ success: false, message: "Valid account id is required" });
    const data = {
      displayName: nullableText(updates.displayName, 120),
      status: updates.status === "disabled" ? "disabled" : "active",
    };
    if (ACCOUNT_ROLES.includes(role)) data.role = role;
    if (password) {
      if (password.length < 8) return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
      Object.assign(data, hashPassword(password));
    }
    const account = await prisma.adminUser.update({
      where: { id: accountId },
      data,
      select: { id: true, username: true, displayName: true, role: true, status: true, createdAt: true, updatedAt: true },
    });
    await logActivity(req, "update-account", `account:${account.id}`, account.username);
    res.json(account);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ success: false, message: "Account not found" });
    next(err);
  }
});

router.delete("/accounts", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.body;
    const accountId = toId(id);
    if (!accountId) return res.status(400).json({ success: false, message: "Valid account id is required" });
    await prisma.adminUser.delete({ where: { id: accountId } });
    await logActivity(req, "delete-account", `account:${accountId}`);
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ success: false, message: "Account not found" });
    next(err);
  }
});

router.get("/work-orders", allowRoles("admin", "agent", "partner"), async (req, res, next) => {
  try {
    const where = req.admin.role === "agent"
      ? { agentId: Number(req.admin.id) }
      : req.admin.role === "partner"
        ? { partnerId: Number(req.admin.id) }
        : {};
    const items = await prisma.clientWork.findMany({
      where,
      include: workInclude,
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  } catch (err) { next(err); }
});

router.post("/work-orders", allowRoles("admin", "agent"), async (req, res, next) => {
  try {
    const isAdmin = req.admin.role === "admin";
    const agentId = isAdmin ? toId(req.body.agentId) : Number(req.admin.id);
    const partnerId = isAdmin ? toId(req.body.partnerId) : null;
    const item = await prisma.clientWork.create({
      data: {
        clientName: requireText(req.body.clientName, "Client name", 180),
        clientPhone: nullableText(req.body.clientPhone, 60),
        service: requireText(req.body.service || "Website", "Service", 160),
        price: isAdmin ? money(req.body.price) : 0,
        status: isAdmin ? pickStatus(req.body.status, WORK_STATUSES, "lead") : "lead",
        notes: nullableText(req.body.notes, 5000),
        agentId,
        partnerId,
        agentCommission: isAdmin ? money(req.body.agentCommission) : 0,
        agentPaid: isAdmin ? money(req.body.agentPaid) : 0,
        partnerPayout: isAdmin ? money(req.body.partnerPayout) : 0,
        partnerPaid: isAdmin ? money(req.body.partnerPaid) : 0,
      },
      include: workInclude,
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.put("/work-orders", allowRoles("admin", "agent", "partner"), async (req, res, next) => {
  try {
    const id = toId(req.body.id);
    if (!id) return res.status(400).json({ success: false, message: "Valid work id is required" });
    const existing = await prisma.clientWork.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: "Work item not found" });
    if (req.admin.role === "agent" && existing.agentId !== Number(req.admin.id)) {
      return res.status(403).json({ success: false, message: "You can only update your own clients" });
    }
    if (req.admin.role === "partner" && existing.partnerId !== Number(req.admin.id)) {
      return res.status(403).json({ success: false, message: "You can only update assigned work" });
    }

    const data = {};
    if (req.admin.role === "admin") {
      if (req.body.clientName !== undefined) data.clientName = requireText(req.body.clientName, "Client name", 180);
      if (req.body.clientPhone !== undefined) data.clientPhone = nullableText(req.body.clientPhone, 60);
      if (req.body.service !== undefined) data.service = requireText(req.body.service, "Service", 160);
      if (req.body.price !== undefined) data.price = money(req.body.price);
      if (req.body.agentId !== undefined) data.agentId = toId(req.body.agentId);
      if (req.body.partnerId !== undefined) data.partnerId = toId(req.body.partnerId);
      if (req.body.agentCommission !== undefined) data.agentCommission = money(req.body.agentCommission);
      if (req.body.agentPaid !== undefined) data.agentPaid = money(req.body.agentPaid);
      if (req.body.partnerPayout !== undefined) data.partnerPayout = money(req.body.partnerPayout);
      if (req.body.partnerPaid !== undefined) data.partnerPaid = money(req.body.partnerPaid);
    }
    if (req.body.notes !== undefined) data.notes = nullableText(req.body.notes, 5000);
    if (req.body.status !== undefined) data.status = pickStatus(req.body.status, WORK_STATUSES, existing.status);

    const item = await prisma.clientWork.update({ where: { id }, data, include: workInclude });
    res.json(item);
  } catch (err) { next(err); }
});

router.delete("/work-orders", requireAdmin, async (req, res, next) => {
  try {
    const id = toId(req.body.id);
    if (!id) return res.status(400).json({ success: false, message: "Valid work id is required" });
    const item = await prisma.clientWork.delete({ where: { id }, include: workInclude });
    await moveToBin("client-work", item);
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ success: false, message: "Work item not found" });
    next(err);
  }
});

router.get("/inquiries", allowRoles("admin", "agent"), async (_, res, next) => {
  try {
    const items = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) { next(err); }
});

router.put("/inquiries", allowRoles("admin", "agent"), async (req, res, next) => {
  try {
    const id = toId(req.body.id);
    if (!id) return res.status(400).json({ success: false, message: "Valid inquiry id is required" });
    const data = {};
    if (req.body.status !== undefined) data.status = pickStatus(req.body.status, INQUIRY_STATUSES, "new");
    if (req.body.notes !== undefined) data.notes = nullableText(req.body.notes, 3000);
    if (req.admin.role === "admin" && req.body.emailStatus !== undefined) data.emailStatus = pickStatus(req.body.emailStatus, EMAIL_STATUSES, "pending");
    const item = await prisma.inquiry.update({ where: { id }, data });
    res.json(item);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Not found" });
    next(err);
  }
});

router.delete("/inquiries", requireAdmin, async (req, res, next) => {
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

router.get("/opportunities", allowRoles("admin", "agent"), async (_, res, next) => {
  try {
    const items = await prisma.opportunity.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) { next(err); }
});

router.post("/opportunities", requireAdmin, async (req, res, next) => {
  try {
    const item = await prisma.opportunity.create({
      data: {
        title: requireText(req.body.title, "Opportunity title", 180),
        description: text(req.body.description, 5000) || "",
        department: requireText(req.body.department || "General", "Department", 120),
        type: text(req.body.type || "full-time", 80),
        location: nullableText(req.body.location, 160),
        status: pickStatus(req.body.status, OPPORTUNITY_STATUSES, "open"),
        applicants: 0,
      },
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.put("/opportunities", allowRoles("admin", "agent"), async (req, res, next) => {
  try {
    const id = toId(req.body.id);
    if (!id) return res.status(400).json({ success: false, message: "Valid opportunity id is required" });
    const data = {};
    if (req.admin.role === "admin") {
      if (req.body.title !== undefined) data.title = requireText(req.body.title, "Opportunity title", 180);
      if (req.body.description !== undefined) data.description = text(req.body.description, 5000) || "";
      if (req.body.department !== undefined) data.department = requireText(req.body.department, "Department", 120);
      if (req.body.type !== undefined) data.type = text(req.body.type, 80);
      if (req.body.location !== undefined) data.location = nullableText(req.body.location, 160);
    }
    if (req.body.status !== undefined) data.status = pickStatus(req.body.status, OPPORTUNITY_STATUSES, "open");
    const item = await prisma.opportunity.update({ where: { id }, data });
    res.json(item);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Not found" });
    next(err);
  }
});

router.delete("/opportunities", requireAdmin, async (req, res, next) => {
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

router.get("/applicants", allowRoles("admin", "agent"), async (_, res, next) => {
  try {
    const items = await prisma.applicant.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) { next(err); }
});

router.post("/applicants", requireAdmin, async (req, res, next) => {
  try {
    const opportunityId = toId(req.body.opportunityId);
    if (!opportunityId) return res.status(400).json({ success: false, message: "Valid opportunity is required" });
    const item = await prisma.applicant.create({
      data: {
        opportunityId,
        name: requireText(req.body.name, "Applicant name", 180),
        email: requireText(req.body.email, "Applicant email", 200),
        phone: nullableText(req.body.phone, 50),
        resumeUrl: nullableText(req.body.resumeUrl, 500),
        coverLetter: nullableText(req.body.coverLetter, 5000),
        status: pickStatus(req.body.status, APPLICANT_STATUSES, "new"),
      },
    });
    await prisma.opportunity.update({
      where: { id: item.opportunityId },
      data: { applicants: { increment: 1 } },
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.put("/applicants", allowRoles("admin", "agent"), async (req, res, next) => {
  try {
    const id = toId(req.body.id);
    if (!id) return res.status(400).json({ success: false, message: "Valid applicant id is required" });
    const data = {};
    if (req.admin.role === "admin") {
      if (req.body.name !== undefined) data.name = requireText(req.body.name, "Applicant name", 180);
      if (req.body.email !== undefined) data.email = requireText(req.body.email, "Applicant email", 200);
      if (req.body.phone !== undefined) data.phone = nullableText(req.body.phone, 50);
      if (req.body.resumeUrl !== undefined) data.resumeUrl = nullableText(req.body.resumeUrl, 500);
      if (req.body.coverLetter !== undefined) data.coverLetter = nullableText(req.body.coverLetter, 5000);
    }
    if (req.body.status !== undefined) data.status = pickStatus(req.body.status, APPLICANT_STATUSES, "new");
    const item = await prisma.applicant.update({ where: { id }, data });
    res.json(item);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Not found" });
    next(err);
  }
});

router.delete("/applicants", requireAdmin, async (req, res, next) => {
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

router.get("/projects", allowRoles("admin", "partner"), async (_, res, next) => {
  try {
    const items = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch (err) { next(err); }
});

router.post("/projects", requireAdmin, async (req, res, next) => {
  try {
    const item = await prisma.project.create({
      data: {
        name: requireText(req.body.name, "Project name", 180),
        clientName: nullableText(req.body.clientName, 180),
        description: nullableText(req.body.description, 5000),
        status: pickStatus(req.body.status, PROJECT_STATUSES, "planning"),
      },
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.put("/projects", allowRoles("admin", "partner"), async (req, res, next) => {
  try {
    const id = toId(req.body.id);
    if (!id) return res.status(400).json({ success: false, message: "Valid project id is required" });
    const data = {};
    if (req.admin.role === "admin") {
      if (req.body.name !== undefined) data.name = requireText(req.body.name, "Project name", 180);
      if (req.body.clientName !== undefined) data.clientName = nullableText(req.body.clientName, 180);
      if (req.body.description !== undefined) data.description = nullableText(req.body.description, 5000);
    }
    if (req.body.status !== undefined) data.status = pickStatus(req.body.status, PROJECT_STATUSES, "planning");
    const item = await prisma.project.update({ where: { id }, data });
    res.json(item);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Not found" });
    next(err);
  }
});

router.delete("/projects", requireAdmin, async (req, res, next) => {
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

router.post("/upload", requireAdmin, upload.single("image"), uploadImage);
router.delete("/upload/:filename", requireAdmin, deleteImage);

router.get("/media", requireAdmin, async (_, res, next) => {
  try {
    const uploadsDir = join(__dirname, "..", process.env.UPLOAD_DIR || "uploads");
    const files = await readdir(uploadsDir).catch(() => []);
    const urls = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f)).map(f => ({ url: `/uploads/${f}`, filename: f }));
    const existing = await prisma.mediaAsset.findMany();
    const byUrl = new Map(existing.map((item) => [item.url, item]));
    const assets = [];
    for (const file of urls) {
      if (byUrl.has(file.url)) {
        assets.push(byUrl.get(file.url));
      } else {
        const created = await prisma.mediaAsset.create({ data: { url: file.url, filename: file.filename } }).catch(() => null);
        if (created) assets.push(created);
      }
    }
    res.json(assets);
  } catch (err) { next(err); }
});

router.put("/media", requireAdmin, async (req, res, next) => {
  try {
    const { url, label, category, altText } = req.body;
    if (!url) return res.status(400).json({ success: false, message: "Media url is required" });
    const item = await prisma.mediaAsset.upsert({
      where: { url },
      update: { label: nullableText(label, 120), category: nullableText(category, 80), altText: nullableText(altText, 200) },
      create: { url, filename: String(url).split("/").pop() || "upload", label: nullableText(label, 120), category: nullableText(category, 80), altText: nullableText(altText, 200) },
    });
    await logActivity(req, "update-media", url, label || "");
    res.json(item);
  } catch (err) { next(err); }
});

router.get("/content-export", requireAdmin, async (_, res, next) => {
  try {
    const entries = await prisma.content.findMany();
    const drafts = await prisma.contentDraft.findMany();
    res.json({
      exportedAt: new Date().toISOString(),
      content: Object.fromEntries(entries.map((entry) => [entry.page, entry.data])),
      drafts: Object.fromEntries(drafts.map((entry) => [entry.page, entry.data])),
    });
  } catch (err) { next(err); }
});

router.post("/content-import", requireAdmin, async (req, res, next) => {
  try {
    const payload = req.body?.content && typeof req.body.content === "object" ? req.body.content : req.body;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return res.status(400).json({ success: false, message: "Import payload must be an object" });
    }
    const pages = Object.keys(payload).filter((page) => CONTENT_PAGES.includes(page));
    for (const page of pages) {
      const validationError = validateContentPayload(page, payload[page]);
      if (validationError) return res.status(400).json({ success: false, message: validationError });
      await prisma.content.upsert({
        where: { page },
        update: { data: payload[page] },
        create: { page, data: payload[page] },
      });
      await prisma.contentRevision.create({ data: { page, data: payload[page], action: "import", createdBy: req.admin.username } });
    }
    await logActivity(req, "import-content", "content", `${pages.length} pages`);
    res.json({ success: true, pages });
  } catch (err) { next(err); }
});

router.get("/content/:page/draft", requireAdmin, async (req, res, next) => {
  const page = req.params.page;
  if (!CONTENT_PAGES.includes(page)) return res.status(404).json({ error: "Page not found" });
  try {
    res.setHeader("Cache-Control", "no-store");
    const draft = await prisma.contentDraft.findUnique({ where: { page } });
    if (draft) return res.json({ success: true, data: draft.data, updatedAt: draft.updatedAt });
    const published = await prisma.content.findUnique({ where: { page } });
    res.json({ success: true, data: published?.data || {}, updatedAt: published?.updatedAt || null });
  } catch (err) { next(err); }
});

router.get("/content/:page/versions", requireAdmin, async (req, res, next) => {
  const page = req.params.page;
  if (!CONTENT_PAGES.includes(page)) return res.status(404).json({ error: "Page not found" });
  try {
    const items = await prisma.contentRevision.findMany({
      where: { page },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { id: true, page: true, action: true, createdBy: true, createdAt: true },
    });
    res.json(items);
  } catch (err) { next(err); }
});

router.post("/content/:page/restore", requireAdmin, async (req, res, next) => {
  const page = req.params.page;
  if (!CONTENT_PAGES.includes(page)) return res.status(404).json({ error: "Page not found" });
  try {
    const id = toId(req.body.id);
    if (!id) return res.status(400).json({ success: false, message: "Valid version id is required" });
    const revision = await prisma.contentRevision.findFirst({ where: { id, page } });
    if (!revision) return res.status(404).json({ success: false, message: "Version not found" });
    await prisma.contentDraft.upsert({
      where: { page },
      update: { data: revision.data },
      create: { page, data: revision.data },
    });
    await logActivity(req, "restore-draft", `content:${page}`, `version:${id}`);
    res.json({ success: true, data: revision.data });
  } catch (err) { next(err); }
});

router.post("/content/:page/publish", requireAdmin, async (req, res, next) => {
  const page = req.params.page;
  if (!CONTENT_PAGES.includes(page)) return res.status(404).json({ error: "Page not found" });
  const data = req.body && Object.keys(req.body).length ? req.body : (await prisma.contentDraft.findUnique({ where: { page } }).catch(() => null))?.data;
  const validationError = validateContentPayload(page, data);
  if (validationError) return res.status(400).json({ success: false, message: validationError });
  try {
    const previous = await prisma.content.findUnique({ where: { page } });
    if (previous) {
      await prisma.contentRevision.create({ data: { page, data: previous.data, action: "backup", createdBy: req.admin.username } });
    }
    const entry = await prisma.content.upsert({
      where: { page },
      update: { data },
      create: { page, data },
    });
    await prisma.contentDraft.upsert({ where: { page }, update: { data }, create: { page, data } });
    await prisma.contentRevision.create({ data: { page, data, action: "publish", createdBy: req.admin.username } });
    await logActivity(req, "publish-content", `content:${page}`);
    res.json({ success: true, data: entry.data });
  } catch (err) { next(err); }
});

router.get("/content/:page", requireAdmin, async (req, res, next) => {
  const page = req.params.page;
  if (!CONTENT_PAGES.includes(page)) return res.status(404).json({ error: "Page not found" });
  try {
    res.setHeader("Cache-Control", "no-store");
    const entry = await prisma.content.findUnique({ where: { page } });
    if (!entry) return res.json({ success: true, data: {} });
    res.json({ success: true, data: entry.data });
  } catch (err) { next(err); }
});

router.put("/content/:page", requireAdmin, async (req, res, next) => {
  const page = req.params.page;
  if (!CONTENT_PAGES.includes(page)) return res.status(404).json({ error: "Page not found" });
  const validationError = validateContentPayload(page, req.body);
  if (validationError) return res.status(400).json({ success: false, message: validationError });
  try {
    const entry = await prisma.contentDraft.upsert({
      where: { page },
      update: { data: req.body },
      create: { page, data: req.body },
    });
    await logActivity(req, "save-draft", `content:${page}`);
    res.json({ success: true, data: entry.data });
  } catch (err) { next(err); }
});

export default router;
