import test from "node:test";
import assert from "node:assert/strict";
import { buildWhatsAppSummary, calculateLeadScore, detectLanguage } from "../services/chat-engine.js";
import { decryptApiKey, encryptApiKey, extractOutputText, generateGroundedConversation, redactPersonalData } from "../services/generative-chat.js";
import { extractKnowledgeFromContent } from "../services/knowledge-sync.js";

test("detects English, Hinglish, and Hindi", () => {
  assert.equal(detectLanguage("I need a website for my clinic"), "en");
  assert.equal(detectLanguage("Meko website banana hai"), "hiEn");
  assert.equal(detectLanguage("मुझे वेबसाइट बनानी है"), "hi");
});

test("lead score remains within public scoring bounds", () => {
  const result = calculateLeadScore({
    budget: "300000", features: "booking,payment,admin,automation", goal: "More qualified leads",
    timeline: "ASAP", decisionMaker: "yes", contentReady: "yes", consentGiven: true,
    name: "Naveen", email: "n@example.com", phone: "+918889937648",
  });
  assert.ok(result.score >= 80 && result.score <= 100);
  assert.equal(result.category, "hot");
});

test("WhatsApp summary contains structured values", () => {
  const summary = buildWhatsAppSummary({ name: "Client", phone: "+911234567890", email: "client@example.com", serviceInterest: "website" });
  assert.match(summary, /Name: Client/);
  assert.match(summary, /Service Interest: website/);
  assert.doesNotMatch(summary, /undefined/);
});

test("generative provider payload removes personal contact data", () => {
  const clean = redactPersonalData("Email me at client@example.com or call +91 88899 37648");
  assert.doesNotMatch(clean, /client@example\.com/);
  assert.doesNotMatch(clean, /88899/);
  assert.match(clean, /\[email removed\]/);
  assert.match(clean, /\[phone removed\]/);
});

test("extracts text from OpenCode Responses payload", () => {
  const text = extractOutputText({ output: [{ content: [{ type: "output_text", text: "Grounded answer" }] }] });
  assert.equal(text, "Grounded answer");
});

test("OpenCode API key is encrypted before database storage", () => {
  process.env.CHATBOT_KEY_ENCRYPTION_SECRET = "test-only-encryption-secret-with-enough-entropy";
  const encrypted = encryptApiKey("opencode-test-key-123456789");
  assert.doesNotMatch(encrypted, /opencode-test-key/);
  assert.equal(decryptApiKey(encrypted), "opencode-test-key-123456789");
});

test("OpenCode request uses selected model and conversation-only instructions", async () => {
  process.env.CHATBOT_KEY_ENCRYPTION_SECRET = "test-only-encryption-secret-with-enough-entropy";
  const originalFetch = global.fetch;
  let requestBody;
  global.fetch = async (_url, init) => {
    requestBody = JSON.parse(init.body);
    return { ok: true, json: async () => ({ output_text: "Conversation reply" }) };
  };
  try {
    const reply = await generateGroundedConversation({
      message: "Give me React code",
      config: {
        generativeEnabled: true,
        opencodeModel: "gpt-5.4-mini",
        opencodeApiKeyEncrypted: encryptApiKey("opencode-test-key-123456789"),
      },
    });
    assert.equal(reply, "Conversation reply");
    assert.equal(requestBody.model, "gpt-5.4-mini");
    assert.match(requestBody.instructions, /Never provide source code/);
    assert.match(requestBody.instructions, /Active role: sales_consultant/);
    assert.match(requestBody.instructions, /LISTENING PRIORITY/);
    assert.match(requestBody.instructions, /answer it directly first/i);
    assert.match(requestBody.instructions, /Optional workflow suggestion/);
  } finally {
    global.fetch = originalFetch;
  }
});

test("free OpenCode model uses chat completions protocol", async () => {
  process.env.CHATBOT_KEY_ENCRYPTION_SECRET = "test-only-encryption-secret-with-enough-entropy";
  const originalFetch = global.fetch;
  let requestedUrl = "";
  let requestBody;
  global.fetch = async (url, init) => {
    requestedUrl = String(url);
    requestBody = JSON.parse(init.body);
    return { ok: true, json: async () => ({ choices: [{ message: { content: "Free model reply" } }] }) };
  };
  try {
    const reply = await generateGroundedConversation({
      message: "Tell me about MistHustlers",
      stateData: { selectedService: "website", businessType: "clinic" },
      config: {
        generativeEnabled: true,
        opencodeModel: "deepseek-v4-flash-free",
        opencodeApiKeyEncrypted: encryptApiKey("opencode-test-key-123456789"),
      },
    });
    assert.equal(reply, "Free model reply");
    assert.match(requestedUrl, /chat\/completions$/);
    assert.equal(requestBody.model, "deepseek-v4-flash-free");
    assert.equal(requestBody.messages[0].role, "system");
    assert.match(requestBody.messages[0].content, /Active role: solution_consultant/);
    assert.match(requestBody.messages[0].content, /tailored solution/);
  } finally {
    global.fetch = originalFetch;
  }
});

test("CMS knowledge extraction covers nested services and projects", () => {
  const serviceItems = extractKnowledgeFromContent("services", {
    pricing: [{ name: "Starter", price: "₹7,999", features: ["Responsive website", "Inquiry form"], imageUrl: "/uploads/secret.webp" }],
    serviceCards: [{ title: "AI Automation", description: "Automate lead follow-up", color: "#ff0000" }],
  });
  const projectItems = extractKnowledgeFromContent("projects", {
    projects: [{ title: "Clinic CRM", description: "Appointment and patient workflow", link: "https://example.com/demo" }],
  });
  const combined = [...serviceItems, ...projectItems];
  assert.ok(combined.some((item) => item.value === "₹7,999" && item.category === "pricing"));
  assert.ok(combined.some((item) => item.value.includes("Automate lead follow-up")));
  assert.ok(combined.some((item) => item.value.includes("Appointment and patient workflow")));
  assert.ok(combined.some((item) => item.value === "https://example.com/demo"));
  assert.ok(!combined.some((item) => item.value.includes("secret.webp") || item.value === "#ff0000"));
});
