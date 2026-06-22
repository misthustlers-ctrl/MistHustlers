import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prisma from "../prisma/client.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentPath = join(__dirname, "..", "data", "content-home.json");
const source = JSON.parse(await readFile(contentPath, "utf8"));
const desiredHero = source.hero;

function mergeHomeHero(existing = {}) {
  return {
    ...existing,
    hero: {
      ...(existing.hero || {}),
      ...desiredHero,
    },
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
