import crypto from "crypto";
import prisma from "../prisma/client.js";

function hashValue(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex").slice(0, 16);
}

const STATIC_PUBLIC_CONTENT = {
  "privacy-policy": {
    title: "Privacy Policy",
    updated: "June 2026",
    introduction: 'MistHustlers is committed to protecting personal information and explains how it is collected, used and safeguarded.',
    informationCollected: "Inquiry and contact forms may collect name, email address, phone number, company name, project details, and other information voluntarily provided.",
    useOfInformation: "Information is used to respond to inquiries, provide services, send project proposals, communicate about projects, and improve services.",
    dataProtection: "MistHustlers uses appropriate security measures, but no Internet transmission method is completely secure.",
    thirdParties: "Email and hosting providers may process information on behalf of MistHustlers under their own privacy policies.",
    contact: "Questions about privacy can be sent to misthustlers@gmail.com.",
  },
  "terms-of-service": {
    title: "Terms of Service",
    updated: "June 2026",
    services: "MistHustlers provides web development, automation, MVP development, and related services. Each project has a separate agreement defining scope, timeline, and pricing.",
    payment: "Prices are quoted in Indian Rupees. An advance is required before work begins and the balance is due upon delivery, subject to the project proposal.",
    intellectualProperty: "After full payment, the client receives ownership of agreed deliverables including source code, designs, and documentation. MistHustlers may display the work in its portfolio unless otherwise agreed.",
    liability: "Liability is limited to the amount paid for the specific project. MistHustlers is not liable for indirect damages, loss of profits, or business interruption.",
    contact: "Terms questions can be sent to misthustlers@gmail.com.",
  },
  "refund-policy": {
    title: "Refund and Cancellation Policy",
    updated: "June 2026",
    cancellation: "A project may be cancelled before work begins for a full refund of the advance. After work begins, cancellation follows the project agreement.",
    refunds: "If the agreed scope is not delivered within the specified timeline, partial or full refund eligibility follows the signed project agreement.",
    changeOfMind: "Direction changes can be handled through a change order. Refunds for unused portions are evaluated case by case.",
    disputes: "MistHustlers first attempts amicable resolution. Unresolved disputes are handled in the courts of Indore, Madhya Pradesh.",
    contact: "Refund requests can be sent to misthustlers@gmail.com.",
  },
};

const SKIPPED_CONTENT_KEYS = /^(id|enabled|sortOrder|order|index|image|imageUrl|backgroundImage|mapEmbedUrl|color|accent|className|style|styles|icon|emoji.*)$/i;

function inferCategory(page, path) {
  const value = `${page}.${path}`.toLowerCase();
  if (value.includes("privacy") || value.includes("terms") || value.includes("refund") || value.includes("policy")) return "policy";
  if (value.includes("price") || value.includes("pricing") || value.includes("package")) return "pricing";
  if (value.includes("faq")) return "faq";
  if (value.includes("project") || value.includes("portfolio") || value.includes("showcase")) return "portfolio";
  if (value.includes("contact") || /phone|email|address|hours|whatsapp/.test(value)) return "contact";
  if (value.includes("career") || value.includes("opportunit")) return "career";
  if (value.includes("service") || value.includes("process")) return "service";
  if (value.includes("seo")) return "seo";
  return page === "home" || page === "about" ? "branding" : page;
}

function riskForPath(path) {
  return /price|pricing|payment|refund|delivery|timeline|phone|email|address|hours|guarantee/i.test(path) ? "medium" : "low";
}

function extractKnowledgeFromContent(page, data) {
  const items = [];
  const seenKeys = new Set();

  function add(key, value, category = "general", subcategory = null, riskLevel = "low", requiresApproval = false) {
    if (value === null || value === undefined || value === "") return;
    if (seenKeys.has(key)) return;
    const str = String(value).trim().slice(0, 5000);
    if (!str) return;
    seenKeys.add(key);
    items.push({
      source: "cms",
      sourceId: `${page}:${key}`,
      category,
      subcategory,
      key,
      value: str,
      hash: hashValue(str),
      riskLevel,
      requiresApproval,
      verificationStatus: "verified",
      approvalStatus: "approved",
      publishedAt: new Date(),
    });
  }

  if (!data || typeof data !== "object") return items;

  if (page === "services") {
    if (data.plans && Array.isArray(data.plans)) {
      for (const plan of data.plans) {
        const planKey = plan.id || plan.name?.toLowerCase().replace(/\s+/g, "-") || "unknown";
        add(`plan.${planKey}.name`, plan.name, "service", "plan");
        add(`plan.${planKey}.price`, plan.price, "pricing", "plan", "medium", true);
        add(`plan.${planKey}.delivery`, plan.delivery, "service", "plan", "medium", true);
        add(`plan.${planKey}.description`, plan.description, "service", "plan");
        if (plan.inclusions && Array.isArray(plan.inclusions)) {
          add(`plan.${planKey}.inclusions`, plan.inclusions.join(", "), "service", "plan");
        }
        if (plan.exclusions && Array.isArray(plan.exclusions)) {
          add(`plan.${planKey}.exclusions`, plan.exclusions.join(", "), "service", "plan");
        }
        if (plan.features && Array.isArray(plan.features)) {
          add(`plan.${planKey}.features`, plan.features.join(", "), "service", "plan");
        }
        if (plan.timeline) {
          add(`plan.${planKey}.timeline`, plan.timeline, "service", "plan", "medium", true);
        }
        if (plan.whoIsFor) {
          add(`plan.${planKey}.whoIsFor`, plan.whoIsFor, "service", "plan");
        }
      }
    }
    if (data.serviceCategories && Array.isArray(data.serviceCategories)) {
      for (const cat of data.serviceCategories) {
        const catKey = cat.title?.toLowerCase().replace(/\s+/g, "-") || "unknown";
        add(`category.${catKey}.title`, cat.title, "service", "category");
        add(`category.${catKey}.description`, cat.description, "service", "category");
      }
    }
    if (data.faqs && Array.isArray(data.faqs)) {
      for (let i = 0; i < data.faqs.length; i++) {
        const faq = data.faqs[i];
        add(`faq.${i}.question`, faq.question, "faq", "services");
        add(`faq.${i}.answer`, faq.answer, "faq", "services");
      }
    }
  }

  if (page === "contact") {
    add("contact.phone", data.phone, "contact", null, "medium", true);
    add("contact.phoneHref", data.phoneHref, "contact", null, "medium", true);
    add("contact.email", data.email, "contact", null, "medium", true);
    add("contact.address", data.address, "contact", null, "medium", true);
    add("contact.whatsappText", data.whatsappText, "contact");
    if (data.workingHours) add("contact.workingHours", data.workingHours, "contact");
    if (data.responseTime) add("contact.responseTime", data.responseTime, "contact");
  }

  if (page === "faq") {
    if (data.faqs && Array.isArray(data.faqs)) {
      for (let i = 0; i < data.faqs.length; i++) {
        const faq = data.faqs[i];
        add(`faq.${i}.question`, faq.question, "faq", "general");
        add(`faq.${i}.answer`, faq.answer, "faq", "general");
      }
    }
  }

  if (page === "home") {
    if (data.hero) {
      add("hero.title", data.hero.title, "branding", "hero");
      add("hero.description", data.hero.description, "branding", "hero");
      add("hero.badge", data.hero.badge, "branding", "hero");
    }
    if (data.stats && Array.isArray(data.stats)) {
      for (const stat of data.stats) {
        add(`stat.${stat.label}`, `${stat.value} ${stat.label}`, "branding", "stats");
      }
    }
  }

  if (page === "about") {
    add("about.description", data.description, "branding", "about");
    add("about.mission", data.mission, "branding", "about");
    if (data.team && Array.isArray(data.team)) {
      for (let i = 0; i < data.team.length; i++) {
        add(`team.${i}.name`, data.team[i].name, "branding", "team");
        add(`team.${i}.role`, data.team[i].role, "branding", "team");
      }
    }
  }

  if (page === "projects") {
    if (data.projects && Array.isArray(data.projects)) {
      add("projectCount", String(data.projects.length), "portfolio", "count");
    }
  }

  if (page === "seo") {
    add("seo.defaultTitle", data.defaultTitle, "seo");
    add("seo.defaultDescription", data.defaultDescription, "seo");
  }

  if (page === "career") {
    add("career.description", data.description, "career");
  }

  function visit(value, path = "") {
    if (value === null || value === undefined) return;
    if (typeof value === "string" || typeof value === "number") {
      if (!path || String(value).trim().length < 2) return;
      const risk = riskForPath(path);
      add(`content.${path}`, value, inferCategory(page, path), path.split(".")[0] || null, risk, risk !== "low");
      return;
    }
    if (Array.isArray(value)) {
      if (value.every((entry) => typeof entry === "string" || typeof entry === "number")) {
        visit(value.join(", "), path);
        return;
      }
      value.forEach((entry, index) => {
        const identity = entry && typeof entry === "object" ? entry.id || entry.name || entry.title || entry.label : null;
        const segment = identity ? String(identity).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) : String(index);
        visit(entry, path ? `${path}.${segment || index}` : segment || String(index));
      });
      return;
    }
    if (typeof value === "object") {
      for (const [key, child] of Object.entries(value)) {
        if (SKIPPED_CONTENT_KEYS.test(key)) continue;
        visit(child, path ? `${path}.${key}` : key);
      }
    }
  }

  visit(data);

  return items;
}

function extractKnowledgeFromInquiry(inquiry) {
  const items = [];
  items.push({
    source: "inquiry",
    sourceId: `inquiry:${inquiry.id}`,
    category: "lead-intelligence",
    subcategory: "inquiry",
    key: `inquiry.${inquiry.id}.service`,
    value: inquiry.service || "unknown",
    hash: hashValue(inquiry.service || "unknown"),
    riskLevel: "low",
    requiresApproval: false,
    verificationStatus: "verified",
    approvalStatus: "approved",
    publishedAt: new Date(),
  });
  return items;
}

export async function syncKnowledgeFromCMS(page = null, contentData = null) {
  const run = await prisma.knowledgeSyncRun.create({
    data: { status: "running", source: page || "full" },
  });

  const errors = [];
  let total = 0;
  let added = 0;
  let updated = 0;
  let failed = 0;

  try {
    const pages = page
      ? [{ page, data: contentData }]
      : await prisma.content.findMany();

    if (!page) {
      const existingPages = new Set(pages.map((entry) => entry.page));
      for (const [staticPage, data] of Object.entries(STATIC_PUBLIC_CONTENT)) {
        if (!existingPages.has(staticPage)) pages.push({ page: staticPage, data });
      }
    }

    for (const entry of pages) {
      try {
        if (!entry.data) continue;
        const items = extractKnowledgeFromContent(entry.page, entry.data);
        total += items.length;

        for (const item of items) {
          try {
            const existing = await prisma.knowledgeItem.findUnique({
              where: {
                source_sourceId_key: {
                  source: item.source,
                  sourceId: item.sourceId,
                  key: item.key,
                },
              },
            });

            if (!existing) {
              await prisma.knowledgeItem.create({ data: item });
              added++;
            } else if (existing.hash !== item.hash) {
              const requiresApproval = item.requiresApproval;
              await prisma.knowledgeItem.update({
                where: { id: existing.id },
                data: {
                  value: item.value,
                  hash: item.hash,
                  version: existing.version + 1,
                  approvalStatus: requiresApproval ? "pending" : "approved",
                  verificationStatus: requiresApproval ? "pending" : "verified",
                  riskLevel: item.riskLevel,
                  publishedAt: requiresApproval ? existing.publishedAt : new Date(),
                },
              });
              updated++;
            }
          } catch (err) {
            errors.push({ key: item.key, error: err.message });
            failed++;
          }
        }

        const activeKeys = items.map((item) => item.key);
        await prisma.knowledgeItem.deleteMany({
          where: {
            source: "cms",
            sourceId: { startsWith: `${entry.page}:` },
            ...(activeKeys.length ? { key: { notIn: activeKeys } } : {}),
          },
        });
      } catch (err) {
        errors.push({ page: entry.page, error: err.message });
        failed++;
      }
    }

    await prisma.knowledgeSyncRun.update({
      where: { id: run.id },
      data: {
        status: failed > 0 ? "completed_with_errors" : "completed",
        itemsTotal: total,
        itemsAdded: added,
        itemsUpdated: updated,
        itemsFailed: failed,
        errorLog: errors.length > 0 ? JSON.stringify(errors) : "[]",
        completedAt: new Date(),
      },
    });
  } catch (err) {
    await prisma.knowledgeSyncRun.update({
      where: { id: run.id },
      data: {
        status: "failed",
        errorLog: JSON.stringify([{ fatal: err.message }]),
        completedAt: new Date(),
      },
    });
  }

  return prisma.knowledgeSyncRun.findUnique({ where: { id: run.id } });
}

export async function getKnowledgeByCategory(category) {
  return prisma.knowledgeItem.findMany({
    where: {
      category,
      approvalStatus: "approved",
      verificationStatus: "verified",
    },
  });
}

export async function getServicePlans() {
  return prisma.knowledgeItem.findMany({
    where: {
      category: { in: ["service", "pricing"] },
      approvalStatus: "approved",
      verificationStatus: "verified",
    },
  });
}

export async function getFAQs() {
  return prisma.knowledgeItem.findMany({
    where: {
      category: "faq",
      approvalStatus: "approved",
    },
  });
}

export async function getContactInfo() {
  return prisma.knowledgeItem.findMany({
    where: {
      category: "contact",
      approvalStatus: "approved",
    },
  });
}

export async function getKnowledgeItem(source, sourceId, key) {
  return prisma.knowledgeItem.findUnique({
    where: { source_sourceId_key: { source, sourceId, key } },
  });
}

function searchableTokens(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f₹]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

export async function searchVerifiedKnowledge(query, limit = 4) {
  const queryTokens = new Set(searchableTokens(query));
  if (!queryTokens.size) return [];

  const items = await prisma.knowledgeItem.findMany({
    where: {
      approvalStatus: "approved",
      verificationStatus: "verified",
      publishedAt: { not: null },
    },
    orderBy: { updatedAt: "desc" },
    take: 500,
  });

  return items
    .map((item) => {
      const keyTokens = searchableTokens(`${item.category} ${item.subcategory || ""} ${item.key}`);
      const valueTokens = searchableTokens(item.value);
      let score = 0;
      for (const token of keyTokens) if (queryTokens.has(token)) score += 4;
      for (const token of valueTokens) if (queryTokens.has(token)) score += 1;
      if (item.category === "pricing" && /price|pricing|cost|budget|kitna|rate|₹/i.test(query)) score += 8;
      if (item.category === "contact" && /contact|phone|email|address|location|response/i.test(query)) score += 8;
      if (item.category === "faq" && /how|what|why|can|kya|kaise|kyu/i.test(query)) score += 3;
      if (/\.answer$/.test(item.key)) score += 2;
      if (/\.question$/.test(item.key)) score -= 2;
      return { ...item, relevance: score };
    })
    .filter((item) => item.relevance > 2)
    .sort((a, b) => b.relevance - a.relevance || b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, Math.max(1, Math.min(limit, 8)));
}

export {
  extractKnowledgeFromContent,
  extractKnowledgeFromInquiry,
  hashValue,
};
