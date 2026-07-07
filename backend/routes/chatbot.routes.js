import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  getConfig,
  createSession,
  resumeSession,
  sendMessage,
  getRecommendation,
  submitLead,
  handoff,
  deleteSession,
  triggerKnowledgeSync,
} from "../controllers/chatbot.controller.js";
import { requireAdmin } from "../middleware/admin-auth.middleware.js";
import { auditLog } from "../middleware/audit.middleware.js";
import prisma from "../prisma/client.js";
import { encryptApiKey, isOpenCodeConfigured, OPENCODE_MODELS } from "../services/generative-chat.js";

const router = Router();

function adminConfig(config) {
  const { opencodeApiKeyEncrypted: _secret, ...safeConfig } = config;
  return { ...safeConfig, hasOpenCodeApiKey: Boolean(_secret || process.env.OPENCODE_API_KEY), opencodeApiKey: "" };
}

function leadSummary(lead, stateData = {}) {
  if (!lead && !stateData) return null;
  const timeline = lead?.timeline || stateData.timeline || null;
  const timelineText = String(timeline || "").toLowerCase();
  const urgency = /urgent|asap|immediately|1 week|2 week|jaldi|today/.test(timelineText)
    ? "high"
    : /month|30 day|4 week/.test(timelineText) ? "medium" : timeline ? "normal" : "unknown";
  const recommended = stateData.recommendedPlan;
  return {
    requirement: lead?.goal || stateData.goal || stateData.mainObstacle || null,
    business: lead?.businessType || stateData.businessType || null,
    service: lead?.serviceInterest || stateData.serviceInterest || null,
    budget: lead?.budget || stateData.budget || null,
    timeline,
    urgency,
    recommendation: typeof recommended === "object" ? recommended?.name || recommended?.key || null : recommended || null,
    obstacle: stateData.mainObstacle || null,
  };
}

const chatRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many messages. Please wait a moment." },
});

const sessionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many sessions created. Try again later." },
});

const leadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many submissions. Try again later." },
});

router.get("/config", getConfig);

router.post("/session", sessionRateLimit, createSession);

router.get("/session/:token", resumeSession);

router.post("/message", chatRateLimit, sendMessage);

router.post("/recommend", getRecommendation);

router.post("/lead", leadRateLimit, submitLead);

router.post("/handoff", handoff);

router.delete("/session/:token", deleteSession);

router.post("/admin/sync", requireAdmin, auditLog, triggerKnowledgeSync);

router.get("/admin/config", requireAdmin, async (req, res, next) => {
  try {
    let config = await prisma.chatbotConfig.findFirst();
    if (!config) {
      config = await prisma.chatbotConfig.create({ data: {} });
    }
    res.json({ success: true, config: adminConfig(config) });
  } catch (err) { next(err); }
});

router.get("/admin/overview", requireAdmin, async (_req, res, next) => {
  try {
    const [config, lastSync, activeSessions, newLeads] = await Promise.all([
      prisma.chatbotConfig.findFirst(),
      prisma.knowledgeSyncRun.findFirst({ orderBy: { startedAt: "desc" } }),
      prisma.chatSession.count({ where: { isActive: true, expiresAt: { gt: new Date() } } }),
      prisma.qualifiedLead.count({ where: { status: "new" } }),
    ]);
    res.json({ success: true, enabled: Boolean(config?.enabled), generativeEnabled: isOpenCodeConfigured(config || {}), lastSync, activeSessions, newLeads });
  } catch (err) { next(err); }
});

router.put("/admin/config", requireAdmin, auditLog, async (req, res, next) => {
  try {
    const data = {};
    const fields = ["enabled", "greeting", "greetingHindi", "greetingHinglish", "primaryColor", "position", "maxMessageLength", "sessionTtlMinutes", "responseTone", "salesInstructions", "solutionInstructions", "unknownAnswer", "generativeEnabled", "opencodeModel"];
    for (const field of fields) {
      if (req.body[field] !== undefined) {
        if (field === "enabled" || field === "generativeEnabled") data[field] = Boolean(req.body[field]);
        else if (field === "maxMessageLength" || field === "sessionTtlMinutes") data[field] = parseInt(req.body[field]) || 1440;
        else if (field === "responseTone") data[field] = ["consultative", "concise", "friendly"].includes(req.body[field]) ? req.body[field] : "consultative";
        else if (field === "opencodeModel") data[field] = OPENCODE_MODELS.includes(req.body[field]) ? req.body[field] : "deepseek-v4-flash-free";
        else data[field] = String(req.body[field]).slice(0, field === "salesInstructions" || field === "solutionInstructions" ? 5000 : 2000);
      }
    }
    if (typeof req.body.opencodeApiKey === "string" && req.body.opencodeApiKey.trim()) {
      data.opencodeApiKeyEncrypted = encryptApiKey(req.body.opencodeApiKey);
    } else if (req.body.clearOpenCodeApiKey === true) {
      data.opencodeApiKeyEncrypted = null;
    }

    let config = await prisma.chatbotConfig.findFirst();
    if (config) {
      config = await prisma.chatbotConfig.update({ where: { id: config.id }, data });
    } else {
      config = await prisma.chatbotConfig.create({ data });
    }

    await prisma.activityLog.create({
      data: {
        actor: req.admin?.username || "admin",
        role: req.admin?.role || "admin",
        action: "update-chatbot-config",
        detail: `Updated chatbot configuration`,
      },
    });

    res.json({ success: true, config: adminConfig(config) });
  } catch (err) { next(err); }
});

router.get("/admin/knowledge", requireAdmin, async (req, res, next) => {
  try {
    const { category, approvalStatus, page = 1, limit = 50 } = req.query;
    const where = {};
    if (category) where.category = category;
    if (approvalStatus) where.approvalStatus = approvalStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      prisma.knowledgeItem.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.knowledgeItem.count({ where }),
    ]);

    res.json({ success: true, items, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) { next(err); }
});

router.put("/admin/knowledge/:id", requireAdmin, auditLog, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = {};
    if (req.body.approvalStatus) data.approvalStatus = req.body.approvalStatus;
    if (req.body.verificationStatus) data.verificationStatus = req.body.verificationStatus;
    if (req.body.value !== undefined) data.value = String(req.body.value).slice(0, 5000);
    if (req.body.publishedAt !== undefined) data.publishedAt = req.body.publishedAt ? new Date(req.body.publishedAt) : null;

    const item = await prisma.knowledgeItem.update({ where: { id }, data });

    await prisma.activityLog.create({
      data: {
        actor: req.admin?.username || "admin",
        role: req.admin?.role || "admin",
        action: "update-knowledge-item",
        target: `knowledge:${id}`,
        detail: `Updated ${item.key}: ${data.approvalStatus || "edited"}`,
      },
    });

    res.json({ success: true, item });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ success: false, message: "Knowledge item not found" });
    next(err);
  }
});

router.get("/admin/sessions", requireAdmin, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [sessions, total] = await Promise.all([
      prisma.chatSession.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
        include: {
          _count: { select: { messages: true } },
          qualifiedLead: true,
        },
      }),
      prisma.chatSession.count(),
    ]);

    res.json({
      success: true,
      sessions: sessions.map((session) => ({
        ...session,
        summary: leadSummary(session.qualifiedLead, session.stateData && typeof session.stateData === "object" ? session.stateData : {}),
      })),
      total, page: parseInt(page), limit: parseInt(limit),
    });
  } catch (err) { next(err); }
});

router.get("/admin/sessions/:id/messages", requireAdmin, async (req, res, next) => {
  try {
    const sessionId = parseInt(req.params.id);
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: 200,
    });
    res.json({ success: true, messages });
  } catch (err) { next(err); }
});

router.delete("/admin/sessions/:id", requireAdmin, auditLog, async (req, res, next) => {
  try {
    const sessionId = parseInt(req.params.id);
    await prisma.chatSession.delete({ where: { id: sessionId } });
    await prisma.activityLog.create({
      data: {
        actor: req.admin?.username || "admin",
        role: req.admin?.role || "admin",
        action: "permanently-delete-chat-session",
        target: `session:${sessionId}`,
      },
    });
    res.json({ success: true });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ success: false, message: "Session not found" });
    next(err);
  }
});

router.get("/admin/leads", requireAdmin, async (req, res, next) => {
  try {
    const { category, status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (category) where.leadCategory = category;
    if (status) where.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [leads, total] = await Promise.all([
      prisma.qualifiedLead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.qualifiedLead.count({ where }),
    ]);

    res.json({
      success: true,
      leads: leads.map((lead) => ({ ...lead, summary: leadSummary(lead, {}) })),
      total, page: parseInt(page), limit: parseInt(limit),
    });
  } catch (err) { next(err); }
});

router.put("/admin/leads/:id", requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const data = {};
    if (req.body.status) data.status = req.body.status;
    if (req.body.notes !== undefined) data.notes = String(req.body.notes).slice(0, 3000);

    const lead = await prisma.qualifiedLead.update({ where: { id }, data });
    res.json({ success: true, lead });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ success: false, message: "Lead not found" });
    next(err);
  }
});

router.delete("/admin/leads/:id", requireAdmin, auditLog, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.qualifiedLead.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ success: false, message: "Lead not found" });
    next(err);
  }
});

router.get("/admin/leads/export", requireAdmin, async (req, res, next) => {
  try {
    const { category, status } = req.query;
    const where = {};
    if (category) where.leadCategory = category;
    if (status) where.status = status;

    const leads = await prisma.qualifiedLead.findMany({ where, orderBy: { createdAt: "desc" } });

    const header = "Name,Email,Phone,Company,Service Interest,Budget,Timeline,Goal,Score,Category,Status,Consent,Date";
    const rows = leads.map((l) =>
      [
        `"${(l.name || "").replace(/"/g, '""')}"`,
        `"${(l.email || "").replace(/"/g, '""')}"`,
        `"${(l.phone || "").replace(/"/g, '""')}"`,
        `"${(l.company || "").replace(/"/g, '""')}"`,
        `"${(l.serviceInterest || "").replace(/"/g, '""')}"`,
        `"${(l.budget || "").replace(/"/g, '""')}"`,
        `"${(l.timeline || "").replace(/"/g, '""')}"`,
        `"${(l.goal || "").replace(/"/g, '""')}"`,
        l.leadScore,
        l.leadCategory,
        l.status,
        l.consentGiven ? "Yes" : "No",
        l.createdAt.toISOString().split("T")[0],
      ].join(",")
    );

    const csv = `\uFEFF${header}\n${rows.join("\n")}`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=chatbot-leads.csv");
    res.send(csv);
  } catch (err) { next(err); }
});

router.get("/admin/sync-runs", requireAdmin, async (req, res, next) => {
  try {
    const runs = await prisma.knowledgeSyncRun.findMany({
      orderBy: { startedAt: "desc" },
      take: 20,
    });
    res.json({ success: true, runs });
  } catch (err) { next(err); }
});

export default router;
