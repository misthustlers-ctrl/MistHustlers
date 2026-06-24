import { Router } from "express";
import prisma from "../prisma/client.js";
import { readFile, writeFile, readdir } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { upload, uploadImage, deleteImage } from "../controllers/upload.controller.js";
import { auditLog } from "../middleware/audit.middleware.js";
import { allowRoles, createSessionToken, hashPassword, requireAdmin } from "../middleware/admin-auth.middleware.js";
import { getMailIntegrationStatus } from "../services/mail.service.js";
import { getSheetIntegrationStatus } from "../services/sheet.service.js";
import { ACCOUNT_ROLES, ROLES } from "../config/roles.js";
import {
  adminId,
  applicantWhereFor,
  canAccessApplicant,
  canAccessInquiry,
  canAccessProject,
  canAccessWork,
  canEditInquiry,
  currentRole,
  inquiryWhereFor,
  isAdmin,
  isDeliveryPartner,
  projectWhereFor,
  sanitizeInquiryForRole,
  sanitizeWorkForRole,
  workWhereFor,
} from "../config/permissions.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");
const UPLOAD_DIR = join(__dirname, "..", process.env.UPLOAD_DIR || "uploads");
const router = Router();

router.use(auditLog);

async function readJSON(file) {
  return JSON.parse(await readFile(join(DATA_DIR, file), "utf-8"));
}

async function writeJSON(file, data) {
  await writeFile(join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

const CONTENT_PAGES = ["home", "about", "services", "career", "projects", "contact", "logo", "seo"];
const INQUIRY_STATUSES = ["new", "contacted", "archived"];
const EMAIL_STATUSES = ["pending", "sent", "failed", "skipped"];
const SHEET_STATUSES = ["pending", "sent", "failed", "skipped"];
const OPPORTUNITY_STATUSES = ["open", "paused", "closed", "archived"];
const APPLICANT_STATUSES = ["new", "reviewed", "shortlisted", "accepted", "rejected"];
const PROJECT_STATUSES = ["planning", "in-progress", "review", "completed"];
const WORK_STATUSES = ["lead", "quoted", "assigned", "in-progress", "review", "completed", "paid", "lost"];
const PARTNER_WORK_STATUSES = ["assigned", "in-progress", "review", "completed"];
const REFERRAL_OWNER_ROLES = [ROLES.AGENT, ROLES.ACQUISITION_PARTNER, ROLES.AFFILIATE_PARTNER];
const accountSelect = {
  id: true,
  username: true,
  displayName: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  referralCodes: {
    orderBy: { createdAt: "asc" },
    select: { id: true, code: true, status: true, createdAt: true, updatedAt: true },
  },
};

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

function normalizeReferralCode(value) {
  return text(value, 32)?.toUpperCase().replace(/[^A-Z0-9_-]/g, "");
}

function referralCodeSeed(account) {
  const base = normalizeReferralCode(account.displayName || account.username || "PARTNER") || "PARTNER";
  return base.replace(/[_-]+/g, "-").replace(/^-|-$/g, "").slice(0, 16) || "PARTNER";
}

async function createUniqueReferralCode(account, requestedCode) {
  const preferred = normalizeReferralCode(requestedCode);
  if (requestedCode !== undefined && (!preferred || preferred.length < 4)) {
    const err = new Error("Referral code must be 4-32 characters using letters, numbers, dash, or underscore");
    err.status = 400;
    throw err;
  }
  const seed = preferred || referralCodeSeed(account);
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    const candidate = preferred || `${seed}-${suffix}`.slice(0, 32);
    const existing = await prisma.referralCode.findUnique({ where: { code: candidate } });
    if (!existing || existing.ownerId === account.id) return candidate;
  }
  const err = new Error("Could not generate a unique referral code. Try a manual code.");
  err.status = 409;
  throw err;
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
  acquisitionPartner: { select: { id: true, username: true, displayName: true, role: true, status: true } },
  deliveryPartner: { select: { id: true, username: true, displayName: true, role: true, status: true } },
  affiliatePartner: { select: { id: true, username: true, displayName: true, role: true, status: true } },
  payments: { orderBy: { createdAt: "desc" } },
};

function validateContentPayload(page, data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return `${page} content must be an object`;
  }
  const size = Buffer.byteLength(JSON.stringify(data), "utf-8");
  if (size > 750_000) return `${page} content is too large`;
  return null;
}

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

router.get("/integrations/overview", requireAdmin, async (_, res, next) => {
  try {
    const [total, emailGroups, sheetGroups, recentFailures] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.groupBy({ by: ["emailStatus"], _count: { _all: true } }),
      prisma.inquiry.groupBy({ by: ["sheetStatus"], _count: { _all: true } }),
      prisma.inquiry.findMany({
        where: {
          OR: [
            { emailStatus: "failed" },
            { sheetStatus: "failed" },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, emailStatus: true, sheetStatus: true, sheetError: true, createdAt: true },
      }),
    ]);

    const counts = (rows, key) => rows.reduce((acc, row) => {
      acc[row[key] || "unknown"] = row._count._all;
      return acc;
    }, {});

    res.json({
      gmail: getMailIntegrationStatus(),
      googleSheet: getSheetIntegrationStatus(),
      submissions: {
        total,
        email: counts(emailGroups, "emailStatus"),
        sheet: counts(sheetGroups, "sheetStatus"),
      },
      recentFailures,
      checkedAt: new Date().toISOString(),
    });
  } catch (err) { next(err); }
});

router.get("/activity", requireAdmin, async (_, res, next) => {
  try {
    const items = await prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 80 });
    res.json(items);
  } catch (err) { next(err); }
});

const CLEANUP_TARGETS = {
  inquiries: {
    label: "Leads / inquiries",
    run: async () => ({ inquiries: await prisma.inquiry.deleteMany() }),
  },
  applicants: {
    label: "Applicants / worker inquiries",
    run: async () => ({ applicants: await prisma.applicant.deleteMany() }),
  },
  projects: {
    label: "Projects",
    run: async () => ({ projects: await prisma.project.deleteMany() }),
  },
  "client-work": {
    label: "Client work and payment history",
    run: async () => {
      const payments = await prisma.workPayment.deleteMany();
      const work = await prisma.clientWork.deleteMany();
      return { payments, work };
    },
  },
  referrals: {
    label: "Referral tracking data",
    run: async () => {
      const attributions = await prisma.referralAttribution.deleteMany();
      const events = await prisma.referralEvent.deleteMany();
      const codes = await prisma.referralCode.deleteMany();
      return { attributions, events, codes };
    },
  },
  activity: {
    label: "Activity log",
    run: async () => ({ activity: await prisma.activityLog.deleteMany() }),
  },
};

router.post("/cleanup", requireAdmin, async (req, res, next) => {
  try {
    const target = String(req.body?.target || "");
    const confirm = String(req.body?.confirm || "");
    const cleanup = CLEANUP_TARGETS[target];
    if (!cleanup) {
      return res.status(400).json({ success: false, message: "Invalid cleanup target" });
    }
    if (confirm !== `CLEAN ${target}`) {
      return res.status(400).json({ success: false, message: `Type CLEAN ${target} to confirm this cleanup` });
    }
    const result = await cleanup.run();
    await logActivity(req, "cleanup-data", `cleanup:${target}`, cleanup.label);
    res.json({ success: true, target, label: cleanup.label, result });
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
      select: accountSelect,
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
      select: accountSelect,
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
      select: accountSelect,
    });
    await logActivity(req, "update-account", `account:${account.id}`, account.username);
    res.json(account);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ success: false, message: "Account not found" });
    next(err);
  }
});

router.post("/accounts/referral-code", requireAdmin, async (req, res, next) => {
  try {
    const accountId = toId(req.body.accountId);
    if (!accountId) return res.status(400).json({ success: false, message: "Valid account id is required" });

    const account = await prisma.adminUser.findUnique({
      where: { id: accountId },
      select: { id: true, username: true, displayName: true, role: true },
    });
    if (!account) return res.status(404).json({ success: false, message: "Account not found" });
    if (!REFERRAL_OWNER_ROLES.includes(account.role)) {
      return res.status(400).json({ success: false, message: "Referral code is available for agent, acquisition partner, and affiliate partner accounts" });
    }

    const existing = await prisma.referralCode.findFirst({
      where: { ownerId: accountId },
      orderBy: { createdAt: "asc" },
    });
    const status = req.body.status === "disabled" ? "disabled" : "active";
    const code = req.body.code === undefined && existing
      ? existing.code
      : await createUniqueReferralCode(account, req.body.code);

    const referralCode = existing
      ? await prisma.referralCode.update({ where: { id: existing.id }, data: { code, status } })
      : await prisma.referralCode.create({ data: { code, status, ownerId: account.id, ownerRole: account.role } });

    await logActivity(req, "update-referral-code", `account:${account.id}`, `${account.username}:${referralCode.code}`);
    const updatedAccount = await prisma.adminUser.findUnique({ where: { id: accountId }, select: accountSelect });
    res.json(updatedAccount);
  } catch (err) {
    if (err.code === "P2002") return res.status(409).json({ success: false, message: "Referral code already exists" });
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

router.get("/work-orders", allowRoles("admin", "agent", "partner", "acquisition_partner", "affiliate_partner"), async (req, res, next) => {
  try {
    const items = await prisma.clientWork.findMany({
      where: workWhereFor(req),
      include: workInclude,
      orderBy: { createdAt: "desc" },
    });
    res.json(items.map((item) => sanitizeWorkForRole(req, item)));
  } catch (err) { next(err); }
});

router.post("/work-orders", allowRoles("admin", "agent", "acquisition_partner"), async (req, res, next) => {
  try {
    const ownerRole = currentRole(req);
    const adminUser = isAdmin(req);
    let sourceInquiry = null;
    const inquiryId = toId(req.body.inquiryId);
    if (!adminUser && ownerRole === ROLES.ACQUISITION_PARTNER) {
      if (!inquiryId) return res.status(400).json({ success: false, message: "Acquisition partner can create work only from an assigned lead" });
      sourceInquiry = await prisma.inquiry.findUnique({ where: { id: inquiryId } });
      if (!sourceInquiry || !canAccessInquiry(req, sourceInquiry)) {
        return res.status(403).json({ success: false, message: "You can create work only from your assigned leads" });
      }
    }
    const agentId = adminUser ? toId(req.body.agentId) : ownerRole === ROLES.AGENT ? adminId(req) : null;
    const acquisitionPartnerId = adminUser ? toId(req.body.acquisitionPartnerId) : ownerRole === ROLES.ACQUISITION_PARTNER ? adminId(req) : null;
    const partnerId = adminUser ? toId(req.body.partnerId) : null;
    const deliveryPartnerId = adminUser ? toId(req.body.deliveryPartnerId) || partnerId : null;
    const item = await prisma.clientWork.create({
      data: {
        clientName: requireText(req.body.clientName || sourceInquiry?.name, "Client name", 180),
        clientPhone: nullableText(req.body.clientPhone || sourceInquiry?.phone, 60),
        service: requireText(req.body.service || "Website", "Service", 160),
        price: adminUser ? money(req.body.price) : 0,
        status: adminUser ? pickStatus(req.body.status, WORK_STATUSES, "lead") : "lead",
        notes: nullableText(req.body.notes, 5000),
        deliveryLink: nullableText(req.body.deliveryLink, 800),
        deliveryNotes: nullableText(req.body.deliveryNotes, 5000),
        inquiryId,
        agentId,
        partnerId,
        acquisitionPartnerId,
        deliveryPartnerId,
        affiliatePartnerId: adminUser ? toId(req.body.affiliatePartnerId) : sourceInquiry?.affiliatePartnerId || null,
        assignedHrId: adminUser ? toId(req.body.assignedHrId) : null,
        agentCommission: adminUser ? money(req.body.agentCommission) : 0,
        agentPaid: adminUser ? money(req.body.agentPaid) : 0,
        partnerPayout: adminUser ? money(req.body.partnerPayout) : 0,
        partnerPaid: adminUser ? money(req.body.partnerPaid) : 0,
      },
      include: workInclude,
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.put("/work-orders", allowRoles("admin", "agent", "partner", "acquisition_partner"), async (req, res, next) => {
  try {
    const id = toId(req.body.id);
    if (!id) return res.status(400).json({ success: false, message: "Valid work id is required" });
    const existing = await prisma.clientWork.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: "Work item not found" });
    if (!canAccessWork(req, existing)) {
      return res.status(403).json({ success: false, message: "You can update only records assigned to you" });
    }

    const data = {};
    if (isAdmin(req)) {
      if (req.body.clientName !== undefined) data.clientName = requireText(req.body.clientName, "Client name", 180);
      if (req.body.clientPhone !== undefined) data.clientPhone = nullableText(req.body.clientPhone, 60);
      if (req.body.service !== undefined) data.service = requireText(req.body.service, "Service", 160);
      if (req.body.price !== undefined) data.price = money(req.body.price);
      if (req.body.agentId !== undefined) data.agentId = toId(req.body.agentId);
      if (req.body.partnerId !== undefined) data.partnerId = toId(req.body.partnerId);
      if (req.body.inquiryId !== undefined) data.inquiryId = toId(req.body.inquiryId);
      if (req.body.acquisitionPartnerId !== undefined) data.acquisitionPartnerId = toId(req.body.acquisitionPartnerId);
      if (req.body.deliveryPartnerId !== undefined) data.deliveryPartnerId = toId(req.body.deliveryPartnerId);
      if (req.body.affiliatePartnerId !== undefined) data.affiliatePartnerId = toId(req.body.affiliatePartnerId);
      if (req.body.assignedHrId !== undefined) data.assignedHrId = toId(req.body.assignedHrId);
      if (req.body.agentCommission !== undefined) data.agentCommission = money(req.body.agentCommission);
      if (req.body.agentPaid !== undefined) data.agentPaid = money(req.body.agentPaid);
      if (req.body.partnerPayout !== undefined) data.partnerPayout = money(req.body.partnerPayout);
      if (req.body.partnerPaid !== undefined) data.partnerPaid = money(req.body.partnerPaid);
      if (req.body.deliveryLink !== undefined) data.deliveryLink = nullableText(req.body.deliveryLink, 800);
      if (req.body.deliveryNotes !== undefined) data.deliveryNotes = nullableText(req.body.deliveryNotes, 5000);
    }
    if (isDeliveryPartner(req)) {
      if (req.body.deliveryLink !== undefined) data.deliveryLink = nullableText(req.body.deliveryLink, 800);
      if (req.body.deliveryNotes !== undefined) data.deliveryNotes = nullableText(req.body.deliveryNotes, 5000);
    }
    if (req.body.notes !== undefined) data.notes = nullableText(req.body.notes, 5000);
    if (req.body.status !== undefined) {
      const allowedStatuses = isDeliveryPartner(req) ? PARTNER_WORK_STATUSES : WORK_STATUSES;
      data.status = pickStatus(req.body.status, allowedStatuses, existing.status);
      if (data.status === "review" && existing.status !== "review") data.submittedAt = new Date();
    }

    const item = await prisma.clientWork.update({ where: { id }, data, include: workInclude });
    res.json(item);
  } catch (err) { next(err); }
});

router.post("/work-orders/:id/payments", requireAdmin, async (req, res, next) => {
  try {
    const id = toId(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Valid work id is required" });
    const role = req.body.role === "partner" ? "partner" : req.body.role === "agent" ? "agent" : null;
    if (!role) return res.status(400).json({ success: false, message: "Payment role must be agent or partner" });
    const amount = money(req.body.amount);
    if (!amount) return res.status(400).json({ success: false, message: "Payment amount is required" });

    const item = await prisma.clientWork.update({
      where: { id },
      data: {
        [role === "agent" ? "agentPaid" : "partnerPaid"]: { increment: amount },
        payments: {
          create: {
            role,
            amount,
            note: nullableText(req.body.note, 1000),
            createdBy: req.admin?.username || "admin",
          },
        },
      },
      include: workInclude,
    });
    await logActivity(req, "record-payment", `work:${id}`, `${role}:${amount}`);
    res.status(201).json(item);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ success: false, message: "Work item not found" });
    next(err);
  }
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

router.get("/inquiries", allowRoles("admin", "agent", "acquisition_partner", "affiliate_partner"), async (req, res, next) => {
  try {
    const items = await prisma.inquiry.findMany({
      where: inquiryWhereFor(req),
      include: {
        owner: { select: { id: true, username: true, displayName: true, role: true } },
        acquisitionPartner: { select: { id: true, username: true, displayName: true, role: true } },
        affiliatePartner: { select: { id: true, username: true, displayName: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(items.map((item) => sanitizeInquiryForRole(req, item)));
  } catch (err) { next(err); }
});

router.put("/inquiries", allowRoles("admin", "agent", "acquisition_partner"), async (req, res, next) => {
  try {
    const id = toId(req.body.id);
    if (!id) return res.status(400).json({ success: false, message: "Valid inquiry id is required" });
    const existing = await prisma.inquiry.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    if (!canEditInquiry(req, existing)) {
      return res.status(403).json({ success: false, message: "You can update only assigned leads" });
    }
    const data = {};
    if (req.body.status !== undefined) data.status = pickStatus(req.body.status, INQUIRY_STATUSES, "new");
    if (req.body.notes !== undefined) data.notes = nullableText(req.body.notes, 3000);
    if (isAdmin(req)) {
      if (req.body.emailStatus !== undefined) data.emailStatus = pickStatus(req.body.emailStatus, EMAIL_STATUSES, "pending");
      if (req.body.sheetStatus !== undefined) data.sheetStatus = pickStatus(req.body.sheetStatus, SHEET_STATUSES, "pending");
      if (req.body.ownerId !== undefined) data.ownerId = toId(req.body.ownerId);
      if (req.body.acquisitionPartnerId !== undefined) data.acquisitionPartnerId = toId(req.body.acquisitionPartnerId);
      if (req.body.affiliatePartnerId !== undefined) data.affiliatePartnerId = toId(req.body.affiliatePartnerId);
      if (req.body.assignedHrId !== undefined) data.assignedHrId = toId(req.body.assignedHrId);
      if (req.body.leadSource !== undefined) data.leadSource = nullableText(req.body.leadSource, 120);
    }
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

router.get("/opportunities", allowRoles("admin", "hr_partner"), async (_, res, next) => {
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

router.put("/opportunities", requireAdmin, async (req, res, next) => {
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

router.get("/applicants", allowRoles("admin", "hr_partner"), async (req, res, next) => {
  try {
    const items = await prisma.applicant.findMany({ where: applicantWhereFor(req), orderBy: { createdAt: "desc" } });
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

router.put("/applicants", allowRoles("admin", "hr_partner"), async (req, res, next) => {
  try {
    const id = toId(req.body.id);
    if (!id) return res.status(400).json({ success: false, message: "Valid applicant id is required" });
    const existing = await prisma.applicant.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    if (!canAccessApplicant(req, existing)) {
      return res.status(403).json({ success: false, message: "You can update only assigned candidates" });
    }
    const data = {};
    if (isAdmin(req)) {
      if (req.body.name !== undefined) data.name = requireText(req.body.name, "Applicant name", 180);
      if (req.body.email !== undefined) data.email = requireText(req.body.email, "Applicant email", 200);
      if (req.body.phone !== undefined) data.phone = nullableText(req.body.phone, 50);
      if (req.body.resumeUrl !== undefined) data.resumeUrl = nullableText(req.body.resumeUrl, 500);
      if (req.body.coverLetter !== undefined) data.coverLetter = nullableText(req.body.coverLetter, 5000);
      if (req.body.assignedHrId !== undefined) data.assignedHrId = toId(req.body.assignedHrId);
      if (req.body.positionId !== undefined) data.positionId = toId(req.body.positionId);
      if (req.body.applicationType !== undefined) data.applicationType = text(req.body.applicationType || "career", 80);
    }
    if (req.body.status !== undefined) data.status = pickStatus(req.body.status, APPLICANT_STATUSES, "new");
    if (req.body.currentStage !== undefined) data.currentStage = pickStatus(req.body.currentStage, APPLICANT_STATUSES, "new");
    if (req.body.notes !== undefined) data.notes = nullableText(req.body.notes, 3000);
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

router.get("/projects", allowRoles("admin", "partner"), async (req, res, next) => {
  try {
    const items = await prisma.project.findMany({ where: projectWhereFor(req), orderBy: { createdAt: "desc" } });
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
        acquisitionPartnerId: toId(req.body.acquisitionPartnerId),
        deliveryPartnerId: toId(req.body.deliveryPartnerId) || toId(req.body.partnerId),
        affiliatePartnerId: toId(req.body.affiliatePartnerId),
        assignedHrId: toId(req.body.assignedHrId),
      },
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
});

router.put("/projects", allowRoles("admin", "partner"), async (req, res, next) => {
  try {
    const id = toId(req.body.id);
    if (!id) return res.status(400).json({ success: false, message: "Valid project id is required" });
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    if (!canAccessProject(req, existing)) {
      return res.status(403).json({ success: false, message: "You can update only assigned projects" });
    }
    const data = {};
    if (isAdmin(req)) {
      if (req.body.name !== undefined) data.name = requireText(req.body.name, "Project name", 180);
      if (req.body.clientName !== undefined) data.clientName = nullableText(req.body.clientName, 180);
      if (req.body.description !== undefined) data.description = nullableText(req.body.description, 5000);
      if (req.body.acquisitionPartnerId !== undefined) data.acquisitionPartnerId = toId(req.body.acquisitionPartnerId);
      if (req.body.deliveryPartnerId !== undefined) data.deliveryPartnerId = toId(req.body.deliveryPartnerId);
      if (req.body.affiliatePartnerId !== undefined) data.affiliatePartnerId = toId(req.body.affiliatePartnerId);
      if (req.body.assignedHrId !== undefined) data.assignedHrId = toId(req.body.assignedHrId);
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
    if (draft) return res.json({ success: true, data: removeMissingUploadUrls(draft.data), updatedAt: draft.updatedAt });
    const published = await prisma.content.findUnique({ where: { page } });
    res.json({ success: true, data: removeMissingUploadUrls(published?.data || {}), updatedAt: published?.updatedAt || null });
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
    res.json({ success: true, data: removeMissingUploadUrls(entry.data) });
  } catch (err) { next(err); }
});

router.delete("/content/:page", requireAdmin, async (req, res, next) => {
  const page = req.params.page;
  if (!CONTENT_PAGES.includes(page)) return res.status(404).json({ error: "Page not found" });
  try {
    const previous = await prisma.content.findUnique({ where: { page } });
    if (previous) {
      await prisma.contentRevision.create({ data: { page, data: previous.data, action: "delete", createdBy: req.admin.username } });
    }
    await prisma.contentDraft.delete({ where: { page } }).catch(() => null);
    await prisma.content.delete({ where: { page } }).catch(() => null);
    await logActivity(req, "delete-content", `content:${page}`);
    res.json({ success: true, data: {} });
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
