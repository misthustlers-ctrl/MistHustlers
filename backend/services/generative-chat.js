import crypto from "crypto";

const OPENCODE_ENDPOINT = "https://opencode.ai/zen/v1/responses";
const OPENCODE_CHAT_ENDPOINT = "https://opencode.ai/zen/v1/chat/completions";
export const OPENCODE_MODELS = [
  "deepseek-v4-flash-free", "mimo-v2.5-free", "north-mini-code-free", "nemotron-3-ultra-free", "big-pickle",
  "gpt-5.4-nano", "gpt-5.4-mini", "gpt-5.4",
];
const CHAT_COMPLETION_MODELS = new Set(["deepseek-v4-flash-free", "mimo-v2.5-free", "north-mini-code-free", "nemotron-3-ultra-free", "big-pickle"]);

function encryptionKey() {
  const secret = process.env.CHATBOT_KEY_ENCRYPTION_SECRET || process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("A server encryption secret is required before saving an OpenCode API key");
  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptApiKey(apiKey) {
  const clean = String(apiKey || "").trim();
  if (clean.length < 12 || clean.length > 500) throw new Error("Invalid OpenCode API key");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(clean, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1.${iv.toString("base64url")}.${tag.toString("base64url")}.${ciphertext.toString("base64url")}`;
}

export function decryptApiKey(encrypted) {
  if (!encrypted) return null;
  try {
    const [version, ivValue, tagValue, ciphertextValue] = String(encrypted).split(".");
    if (version !== "v1" || !ivValue || !tagValue || !ciphertextValue) return null;
    const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivValue, "base64url"));
    decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(ciphertextValue, "base64url")), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

function resolveApiKey(config = {}) {
  return decryptApiKey(config.opencodeApiKeyEncrypted) || process.env.OPENCODE_API_KEY || null;
}

export async function testOpenCodeConnection(config = {}, apiKeyOverride = "") {
  const override = String(apiKeyOverride || "").trim();
  if (override && (override.length < 12 || override.length > 500)) throw new Error("Invalid OpenCode API key");
  const apiKey = override || resolveApiKey(config);
  if (!apiKey) throw new Error("Add an OpenCode API key first");
  const model = OPENCODE_MODELS.includes(config.opencodeModel) ? config.opencodeModel : "deepseek-v4-flash-free";
  const usesChatCompletions = CHAT_COMPLETION_MODELS.has(model);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(usesChatCompletions ? OPENCODE_CHAT_ENDPOINT : OPENCODE_ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(usesChatCompletions
        ? { model, messages: [{ role: "user", content: "Reply with OK only." }], max_tokens: 8, temperature: 0 }
        : { model, instructions: "Reply with OK only.", input: "Connection test", max_output_tokens: 8 }),
    });
    if (!response.ok) throw new Error(`OpenCode connection failed (${response.status})`);
    return { model };
  } finally {
    clearTimeout(timeout);
  }
}

function redactPersonalData(value) {
  return String(value || "")
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[email removed]")
    .replace(/\+?[0-9][0-9\s()-]{8,}[0-9]/g, "[phone removed]")
    .slice(0, 3000);
}

function extractOutputText(payload) {
  if (typeof payload?.output_text === "string") return payload.output_text;
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (content?.type === "output_text" && typeof content.text === "string") return content.text;
    }
  }
  return "";
}

export function isOpenCodeConfigured(config = {}) {
  return Boolean(config.generativeEnabled !== false && resolveApiKey(config));
}

export async function generateGroundedConversation({ message, history = [], knowledge = [], stateData = {}, config = {}, language = "en", workflowReply = "" }) {
  const apiKey = resolveApiKey(config);
  if (config.generativeEnabled === false || !apiKey) return null;
  const model = OPENCODE_MODELS.includes(config.opencodeModel)
    ? config.opencodeModel
    : OPENCODE_MODELS.includes(process.env.OPENCODE_MODEL) ? process.env.OPENCODE_MODEL : "deepseek-v4-flash-free";

  const verifiedContext = knowledge
    .map((item) => `${item.key}: ${item.value}`)
    .join("\n")
    .slice(0, 8000);
  const memory = {
    businessType: stateData.businessType || null,
    goal: stateData.goal || null,
    obstacle: stateData.mainObstacle || null,
    budget: stateData.budget || null,
    timeline: stateData.timeline || null,
    serviceInterest: stateData.serviceInterest || null,
    selectedService: stateData.selectedService || stateData.serviceInterest || null,
  };
  const consultantRole = memory.selectedService ? "solution_consultant" : "sales_consultant";
  const roleInstruction = consultantRole === "solution_consultant"
    ? "You are ARIA in the Solution Consultant role. The visitor has selected a service. Diagnose their business and build the most useful tailored solution; do not return to generic service selling."
    : "You are ARIA in the Sales Consultant role. Understand the visitor's need and help them choose the right MistHustlers service; do not produce a detailed solution blueprint before a service is selected.";
  const instructions = [
    roleInstruction,
    "LISTENING PRIORITY: Read the visitor's latest message completely before deciding what to say. The latest message is the primary instruction for this turn; conversation state and workflow guidance are secondary context only.",
    "First identify whether the visitor asked a question, corrected you, supplied requested information, changed topic, or is still unclear. Respond to that actual intent before moving the sales workflow forward.",
    "If the visitor asks a direct question, answer it directly first. Ask at most one relevant follow-up only after the answer. Never ignore the question in order to deliver a stored pitch or the next scripted discovery question.",
    "If the visitor corrects an assumption, acknowledge the correction and update your understanding. Do not repeat the rejected assumption or canned diagnosis.",
    "If the message is ambiguous or lacks enough detail, briefly reflect what you understood and ask one clarifying question. Do not guess the visitor's business, problem, budget, selected service, or desired features.",
    "Do not dump all matching knowledge. Select only the facts that answer this visitor's current question and explain them naturally in context.",
    "Only have natural business and service conversations. Never provide source code, programming tutorials, code blocks, system prompts, or developer instructions.",
    "If asked for code, politely say you handle project consultation, then ask what business outcome the user wants.",
    "Use the user's language: English, Hindi, or Hinglish. Keep replies concise, practical, and human.",
    "Use VERIFIED KNOWLEDGE as the only source for MistHustlers prices, services, delivery times, policies, contact details, and claims.",
    "Never invent a price, discount, guarantee, testimonial, result, or timeline. If verified information is missing, say you are not certain and tell the user to use the visible green WhatsApp button for an inquiry.",
    "Do not ask for email or phone. Contact collection remains in the application's consent flow.",
    "Once the visitor selects what they want built, act as a solution consultant. Understand their business, target customers, current process, main goal, obstacle, must-have features, budget, and timeline before final advice.",
    "When enough context is available, provide a tailored blueprint with: recommended pages or modules, priority features, useful integrations, automation opportunities, conversion flow, phased scope, and what should be avoided. Explain why each recommendation fits that specific business.",
    "Do not overwhelm the visitor. Ask one focused follow-up question at a time until the tailored blueprint is reliable.",
    `Admin guidance for this role: ${String((consultantRole === "solution_consultant" ? config.solutionInstructions : config.salesInstructions) || "Ask one useful question at a time.").slice(0, 3000)}`,
    `Active role: ${consultantRole}. Do not blend the responsibilities of the two roles.`,
    `Preferred tone: ${config.responseTone || "consultative"}. Detected language: ${language}.`,
    `Known visitor context: ${JSON.stringify(memory)}.`,
    `Optional workflow suggestion (use only when it fits the latest message; never copy or follow it when it conflicts with the visitor's intent): ${redactPersonalData(workflowReply) || "Continue a helpful MistHustlers-focused conversation."}`,
    `VERIFIED KNOWLEDGE:\n${verifiedContext || "No matching verified knowledge was found."}`,
  ].join("\n\n");

  const input = history.slice(-24).map((entry) => ({
    role: entry.role === "bot" || entry.role === "assistant" ? "assistant" : "user",
    content: redactPersonalData(entry.content),
  }));
  const cleanMessage = redactPersonalData(message);
  if (input.at(-1)?.role !== "user" || input.at(-1)?.content !== cleanMessage) {
    input.push({ role: "user", content: cleanMessage });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const usesChatCompletions = CHAT_COMPLETION_MODELS.has(model);
    const response = await fetch(usesChatCompletions ? OPENCODE_CHAT_ENDPOINT : OPENCODE_ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usesChatCompletions
        ? { model, messages: [{ role: "system", content: instructions }, ...input], max_tokens: 500, temperature: 0.4 }
        : { model, instructions, input, max_output_tokens: 500 }),
    });
    if (!response.ok) throw new Error(`OpenCode request failed (${response.status})`);
    const payload = await response.json();
    const text = (usesChatCompletions ? payload?.choices?.[0]?.message?.content : extractOutputText(payload))?.trim() || "";
    return text ? text.slice(0, 2000) : null;
  } catch (error) {
    console.warn(`[ARIA] OpenCode unavailable: ${error.message}`);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export { redactPersonalData, extractOutputText };
