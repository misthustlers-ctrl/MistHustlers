import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prisma from "../prisma/client.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentPath = join(__dirname, "..", "data", "content-home.json");
const source = JSON.parse(await readFile(contentPath, "utf8"));
const desiredHero = source.hero;
const OLD_HERO_TITLE = ["WEB DEVELOPMENT", "AI AUTOMATION", "INDORE AGENCY."];
const OLD_BRANDS = ["Transparent Scope", "Clear Milestones", "Source-Code Handover", "Post-Launch Support"];

function sameArray(a = [], b = []) {
  return Array.isArray(a) && a.length === b.length && a.every((item, index) => item === b[index]);
}

function mergeHomeHero(existing = {}) {
  const existingHero = existing.hero || {};
  const isOldDefaultHero =
    sameArray(existingHero.title, OLD_HERO_TITLE) ||
    existingHero.badge === "Websites • MVPs • AI Automation" ||
    existingHero.highlightWord === "INDORE AGENCY.";

  return {
    ...existing,
    ...(isOldDefaultHero ? { hero: { ...existingHero, ...desiredHero } } : {}),
    ...(sameArray(existing.brands, OLD_BRANDS) ? { brands: source.brands } : {}),
  };
}

async function syncModel(model, label) {
  const existing = await model.findUnique({ where: { page: "home" } });

  if (existing) {
    await model.update({
      where: { page: "home" },
      data: { data: mergeHomeHero(existing.data) },
    });
    console.log(`[content] Synced home hero in ${label}.`);
    return;
  }

  await model.create({
    data: {
      page: "home",
      data: source,
    },
  });
  console.log(`[content] Created home content in ${label}.`);
}

try {
  await syncModel(prisma.content, "published content");
  await syncModel(prisma.contentDraft, "draft content");
} finally {
  await prisma.$disconnect();
}
