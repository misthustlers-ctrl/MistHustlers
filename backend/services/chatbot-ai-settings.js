import prisma from "../prisma/client.js";
import { encryptApiKey, OPENCODE_MODELS } from "./generative-chat.js";

const PAGE = "_chatbot_ai_settings";

export async function readAiSettings() {
  const entry = await prisma.content.findUnique({ where: { page: PAGE } });
  const data = entry?.data && typeof entry.data === "object" ? entry.data : {};
  return {
    generativeEnabled: data.generativeEnabled !== false,
    opencodeModel: OPENCODE_MODELS.includes(data.opencodeModel) ? data.opencodeModel : "deepseek-v4-flash-free",
    opencodeApiKeyEncrypted: typeof data.opencodeApiKeyEncrypted === "string" ? data.opencodeApiKeyEncrypted : null,
  };
}

export async function saveAiSettings(input = {}) {
  const previous = await readAiSettings();
  const data = {
    generativeEnabled: input.generativeEnabled !== false,
    opencodeModel: OPENCODE_MODELS.includes(input.opencodeModel) ? input.opencodeModel : previous.opencodeModel,
    opencodeApiKeyEncrypted: previous.opencodeApiKeyEncrypted,
  };
  if (typeof input.opencodeApiKey === "string" && input.opencodeApiKey.trim()) {
    data.opencodeApiKeyEncrypted = encryptApiKey(input.opencodeApiKey);
  } else if (input.clearOpenCodeApiKey === true) {
    data.opencodeApiKeyEncrypted = null;
  }
  await prisma.content.upsert({ where: { page: PAGE }, create: { page: PAGE, data }, update: { data } });
  return data;
}

export function publicAiSettings(settings) {
  return {
    generativeEnabled: settings.generativeEnabled,
    opencodeModel: settings.opencodeModel,
    hasOpenCodeApiKey: Boolean(settings.opencodeApiKeyEncrypted || process.env.OPENCODE_API_KEY),
    opencodeApiKey: "",
  };
}
