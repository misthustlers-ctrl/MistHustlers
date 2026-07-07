import prisma from "../prisma/client.js";
import {
  handleMessage,
  detectLanguage,
  generateToken,
  calculateLeadScore,
  buildWhatsAppSummary,
  STATES,
  createStateData,
} from "../services/chat-engine.js";
import { searchVerifiedKnowledge, syncKnowledgeFromCMS } from "../services/knowledge-sync.js";
import { sendChatbotLeadEmail } from "../services/mail.service.js";
import { generateGroundedConversation, isOpenCodeConfigured } from "../services/generative-chat.js";
import { readAiSettings } from "../services/chatbot-ai-settings.js";

async function getConfig(req, res, next) {
  try {
    let config = await prisma.chatbotConfig.findFirst().catch(() => null);
    if (!config) {
      config = await prisma.chatbotConfig.create({ data: {} }).catch(() => ({
        enabled: true, greeting: "Hi, I am ARIA. How can I help?", greetingHindi: "Namaste, main ARIA hoon.",
        greetingHinglish: "Namaste, main ARIA hoon.", primaryColor: "#fc5000", position: "bottom-right", maxMessageLength: 2000,
      }));
    }
    res.json({
      enabled: config.enabled,
      greeting: config.greeting,
      greetingHindi: config.greetingHindi,
      greetingHinglish: config.greetingHinglish,
      primaryColor: config.primaryColor,
      position: config.position,
      maxMessageLength: config.maxMessageLength,
    });
  } catch (err) {
    next(err);
  }
}

async function createSession(req, res, next) {
  try {
    const config = await prisma.chatbotConfig.findFirst().catch(() => null);
    if (config && !config.enabled) {
      return res.status(503).json({ success: false, message: "Chatbot is currently disabled" });
    }

    const { language } = req.body || {};
    const token = generateToken();
    const detectedLang = language && ["en", "hi", "hiEn"].includes(language) ? language : "en";
    const ttl = config?.sessionTtlMinutes || 43200;

    const session = await prisma.chatSession.create({
      data: {
        token,
        language: detectedLang,
        languageSource: language ? "explicit" : "auto",
        state: STATES.GREETING,
        stateData: "{}",
        expiresAt: new Date(Date.now() + ttl * 60 * 1000),
      },
    });

    const greeting = await handleMessage(
      { ...session, language: detectedLang },
      "",
      config || { greeting: "", greetingHindi: "", greetingHinglish: "" }
    );

    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: "bot",
        content: greeting.text,
        detectedLanguage: greeting.detectedLanguage,
        metadata: { state: greeting.state, quickActions: greeting.quickActions, consultantRole: "sales_consultant" },
      },
    });

    await prisma.chatSession.update({
      where: { id: session.id },
      data: { messageCount: { increment: 1 } },
    });

    res.status(201).json({
      success: true,
      token,
      message: greeting.text,
      detectedLanguage: greeting.detectedLanguage,
      quickActions: greeting.quickActions,
      state: greeting.state,
      nextExpectedField: greeting.nextExpectedField,
      handoffAvailable: greeting.handoffAvailable,
      consultantRole: "sales_consultant",
    });
  } catch (err) {
    next(err);
  }
}

function publicRecommendation(card) {
  if (!card) return null;
  const { score: _score, category: _category, ...publicCard } = card;
  return publicCard;
}

async function resumeSession(req, res, next) {
  try {
    const config = { ...(await prisma.chatbotConfig.findFirst().catch(() => null) || {}), ...(await readAiSettings()) };
    if (config && !config.enabled) {
      return res.status(503).json({ success: false, message: "Chatbot is currently disabled" });
    }
    const session = await prisma.chatSession.findUnique({
      where: { token: req.params.token },
      include: { messages: { orderBy: { createdAt: "desc" }, take: 200 }, qualifiedLead: { select: { id: true } } },
    });
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    if (!session.isActive || session.expiresAt < new Date()) {
      await prisma.chatSession.delete({ where: { id: session.id } }).catch(() => null);
      return res.status(410).json({ success: false, message: "Session expired" });
    }
    const orderedMessages = [...session.messages].reverse();
    const lastBotMessage = [...orderedMessages].reverse().find((message) => message.role === "bot");
    const metadata = lastBotMessage?.metadata && typeof lastBotMessage.metadata === "object" ? lastBotMessage.metadata : {};
    res.json({
      success: true,
      token: session.token,
      detectedLanguage: session.language,
      state: session.state,
      messages: orderedMessages.map((message) => ({
        id: String(message.id), role: message.role, content: message.content,
        detectedLanguage: message.detectedLanguage, createdAt: message.createdAt,
      })),
      quickActions: metadata.quickActions || null,
      recommendationCard: publicRecommendation(metadata.recommendationCard),
      nextExpectedField: metadata.nextExpectedField || null,
      handoffAvailable: Boolean(metadata.handoffAvailable || session.qualifiedLead),
      handoffReady: Boolean(session.qualifiedLead),
      consultantRole: session.stateData && typeof session.stateData === "object" && (session.stateData.selectedService || session.stateData.serviceInterest) ? "solution_consultant" : "sales_consultant",
    });
  } catch (err) {
    next(err);
  }
}

async function sendMessage(req, res, next) {
  try {
    const { token, message } = req.body;
    if (!token || !message) {
      return res.status(400).json({ success: false, message: "Token and message are required" });
    }

    const config = { ...(await prisma.chatbotConfig.findFirst().catch(() => null) || {}), ...(await readAiSettings()) };
    if (config && !config.enabled) {
      return res.status(503).json({ success: false, message: "Chatbot is currently disabled" });
    }

    const maxLen = config?.maxMessageLength || 2000;
    const safeMessage = String(message).trim().slice(0, maxLen);
    if (!safeMessage) {
      return res.status(400).json({ success: false, message: "Message cannot be empty" });
    }

    const session = await prisma.chatSession.findUnique({ where: { token } });
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found. Please start a new conversation." });
    }
    if (!session.isActive) {
      return res.status(410).json({ success: false, message: "Session has expired. Please start a new conversation." });
    }
    if (session.expiresAt < new Date()) {
      await prisma.chatSession.update({ where: { id: session.id }, data: { isActive: false } });
      return res.status(410).json({ success: false, message: "Session has expired. Please start a new conversation." });
    }

    const detectedLanguage = detectLanguage(safeMessage);

    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: "user",
        content: safeMessage,
        detectedLanguage,
      },
    });

    const response = await handleMessage(session, safeMessage, config || {});
    const latestSession = await prisma.chatSession.findUnique({ where: { id: session.id }, select: { stateData: true } }).catch(() => null);
    const activeStateData = latestSession?.stateData && typeof latestSession.stateData === "object" ? latestSession.stateData : {};
    response.consultantRole = activeStateData.selectedService || activeStateData.serviceInterest ? "solution_consultant" : "sales_consultant";
    const sensitiveFields = new Set(["consent", "name", "email", "phone"]);
    if (isOpenCodeConfigured(config || {}) && !response.leadCreatedId && !sensitiveFields.has(response.nextExpectedField)) {
      const [knowledge, recentMessages] = await Promise.all([
        searchVerifiedKnowledge(safeMessage, 6).catch(() => []),
        prisma.chatMessage.findMany({
          where: { sessionId: session.id },
          orderBy: { createdAt: "desc" },
          take: 10,
          select: { role: true, content: true },
        }).then((items) => items.reverse()).catch(() => []),
      ]);
      const generated = await generateGroundedConversation({
        message: safeMessage,
        history: recentMessages,
        knowledge,
        stateData: activeStateData,
        config: config || {},
        language: response.detectedLanguage,
        workflowReply: response.text,
      });
      if (generated) response.text = generated;
    }

    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: "bot",
        content: response.text,
        detectedLanguage: response.detectedLanguage,
        metadata: {
          state: response.state,
          quickActions: response.quickActions,
          recommendationCard: response.recommendationCard,
          nextExpectedField: response.nextExpectedField,
          handoffAvailable: response.handoffAvailable,
          consultantRole: response.consultantRole,
        },
      },
    });

    await prisma.chatSession.update({
      where: { id: session.id },
      data: {
        messageCount: { increment: 1 },
        language: response.detectedLanguage,
        state: response.state,
      },
    });

    if (response.leadCreatedId) {
      const lead = await prisma.qualifiedLead.findUnique({ where: { id: response.leadCreatedId } });
      if (lead) sendLeadEmail(lead, token);
    }

    res.json({
      success: true,
      message: response.text,
      detectedLanguage: response.detectedLanguage,
      quickActions: response.quickActions,
      recommendationCard: publicRecommendation(response.recommendationCard),
      state: response.state,
      nextExpectedField: response.nextExpectedField,
      handoffAvailable: response.handoffAvailable,
      handoffReady: Boolean(response.leadCreatedId || session.leadId),
      consultantRole: response.consultantRole,
    });
  } catch (err) {
    next(err);
  }
}

async function getRecommendation(req, res, next) {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: "Session token is required" });
    }

    const session = await prisma.chatSession.findUnique({
      where: { token },
      include: { qualifiedLead: true },
    });
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const stateData = createStateData(session.stateData || {});
    const lead = session.qualifiedLead;

    res.json({
      success: true,
      stateData: {
        goal: stateData.goal,
        industry: stateData.industry,
        features: stateData.features,
        budget: stateData.budget,
        timeline: stateData.timeline,
        serviceInterest: stateData.serviceInterest,
        hasWebsite: stateData.hasWebsite,
        needsBooking: stateData.needsBooking,
        needsPayment: stateData.needsPayment,
        needsAdmin: stateData.needsAdmin,
        needsAutomation: stateData.needsAutomation,
        contentReady: stateData.contentReady,
        decisionMaker: stateData.decisionMaker,
        recommendedPlan: stateData.recommendedPlan?.key || null,
      },
      lead: lead ? {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        leadScore: lead.leadScore,
        leadCategory: lead.leadCategory,
        status: lead.status,
      } : null,
    });
  } catch (err) {
    next(err);
  }
}

async function submitLead(req, res, next) {
  try {
    const { token, name, email, phone, company, consent } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: "Session token is required" });
    }

    const session = await prisma.chatSession.findUnique({ where: { token } });
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (!consent) {
      return res.status(400).json({ success: false, message: "Consent is required to store contact details" });
    }

    const stateData = createStateData(session.stateData || {});
    const existingLead = session.leadId
      ? await prisma.qualifiedLead.findUnique({ where: { id: session.leadId } })
      : null;

    if (existingLead) {
      const updated = await prisma.qualifiedLead.update({
        where: { id: existingLead.id },
        data: {
          name: name || existingLead.name,
          email: email || existingLead.email,
          phone: phone || existingLead.phone,
          company: company || existingLead.company,
          consentGiven: true,
          consentAt: existingLead.consentAt || new Date(),
        },
      });
      return res.json({ success: true, lead: updated });
    }

    const score = calculateLeadScore({
      ...stateData,
      name,
      email,
      phone,
      consentGiven: true,
    });

    const lead = await prisma.qualifiedLead.create({
      data: {
        sessionId: session.id,
        name,
        email,
        phone,
        company,
        businessType: stateData.industry,
        industry: stateData.industry,
        goal: stateData.goal,
        budget: stateData.budget,
        timeline: stateData.timeline,
        serviceInterest: stateData.serviceInterest,
        features: stateData.features,
        leadScore: score.score,
        leadCategory: score.category,
        consentGiven: true,
        consentAt: new Date(),
        status: "new",
      },
    });

    await prisma.chatSession.update({
      where: { id: session.id },
      data: { leadId: lead.id },
    });

    sendLeadEmail(lead, token);

    res.status(201).json({ success: true, lead });
  } catch (err) {
    next(err);
  }
}

async function sendLeadEmail(lead, sessionToken) {
  try {
    const session = await prisma.chatSession.findUnique({
      where: { token: sessionToken },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!session) return;

    const conversation = session.messages.map((m) => ({
      role: m.role,
      content: m.content,
      createdAt: m.createdAt,
    }));

    await sendChatbotLeadEmail({ lead, conversation }).catch((e) => {
      console.error("[ARIA] Failed to send lead email:", e.message);
    });
  } catch (e) {
    console.error("[ARIA] Email error:", e.message);
  }
}

async function handoff(req, res, next) {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: "Session token is required" });
    }

    const session = await prisma.chatSession.findUnique({
      where: { token },
      include: { qualifiedLead: true },
    });
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (!session.qualifiedLead) {
      return res.status(400).json({
        success: false,
        message: "No lead data found. Please complete the contact form first.",
      });
    }

    const lead = session.qualifiedLead;
    const summary = buildWhatsAppSummary(lead);

    sendLeadEmail(lead, token);

    const contactInfo = await prisma.knowledgeItem.findMany({
      where: { category: "contact", approvalStatus: "approved" },
    }).catch(() => []);

    const phoneItem = contactInfo.find((k) => k.key.includes("phoneHref"));
    const phone = phoneItem?.value || process.env.WHATSAPP_PHONE || "+918889937648";

    const waText = encodeURIComponent(summary);
    const waUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${waText}`;

    res.json({
      success: true,
      summary,
      whatsappUrl: waUrl,
      phone,
      leadId: lead.id,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteSession(req, res, next) {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ success: false, message: "Session token is required" });
    }

    const session = await prisma.chatSession.findUnique({ where: { token } });
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    await prisma.chatSession.delete({ where: { id: session.id } });

    res.json({ success: true, message: "Session deleted" });
  } catch (err) {
    next(err);
  }
}

async function triggerKnowledgeSync(req, res, next) {
  try {
    const result = await syncKnowledgeFromCMS();
    res.json({ success: true, syncRun: result });
  } catch (err) {
    next(err);
  }
}

export {
  getConfig,
  createSession,
  resumeSession,
  sendMessage,
  getRecommendation,
  submitLead,
  handoff,
  deleteSession,
  triggerKnowledgeSync,
};
