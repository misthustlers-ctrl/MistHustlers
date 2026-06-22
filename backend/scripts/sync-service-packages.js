import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prisma from "../prisma/client.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentPath = join(__dirname, "..", "data", "content-services.json");

const source = JSON.parse(await readFile(contentPath, "utf8"));
const packageData = {
  pricing: source.pricing,
  categories: source.categories,
  serviceCards: source.serviceCards,
};

function mergeServicesContent(existing = {}) {
  return {
    ...existing,
    ...packageData,
  };
}

async function syncModel(model, label) {
  const existing = await model.findUnique({ where: { page: "services" } });
  if (existing) {
    await model.update({
      where: { page: "services" },
      data: { data: mergeServicesContent(existing.data) },
    });
    console.log(`[content] Synced service packages in ${label}.`);
    return;
  }

  await model.create({
    data: {
      page: "services",
      data: mergeServicesContent(source),
    },
  });
  console.log(`[content] Created service packages in ${label}.`);
}

try {
  await syncModel(prisma.content, "published content");
  await syncModel(prisma.contentDraft, "draft content");
} finally {
  await prisma.$disconnect();
}
