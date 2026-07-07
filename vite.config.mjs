import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const previewChats = new Map();

function json(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => { raw += chunk; });
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); }
    });
  });
}

function previewReply(message, history = []) {
  const text = String(message || "").toLowerCase();
  const context = `${history.filter((item) => item.role === "user").map((item) => item.content).join(" ")} ${text}`.toLowerCase();
  const business = context.match(/restaurant|cafe|hotel|clinic|doctor|gym|school|coaching|real estate|property|shop|store|agency|manufacturer/)?.[0];
  const wantsBooking = /booking|appointment|reservation/.test(context);
  const wantsLeads = /lead|client|customer|inquiry|sales/.test(context);
  const wantsCommerce = /ecommerce|e-commerce|online sell|online store|payment/.test(context);

  if (/hindi|hinglish|hindi mein/.test(text)) {
    return "Bilkul. Aapko website, automation ya MVP mein se kis cheez ki zarurat hai? Main sahi starting option suggest karunga.";
  }
  if (/^(hi|hello|hey|namaste|hii+)[.! ]*$/.test(text)) {
    return "Namaste! Main aapki requirement samajhkar practical solution suggest karungi. Aap kis type ka business chalate hain aur website se sabse important result kya chahiye: leads, bookings, sales, ya credibility?";
  }
  if (/price|cost|budget|kitna|package/.test(text)) {
    const fit = wantsCommerce ? "online-store requirements ke liye custom estimate better rahega" : wantsBooking ? "booking-ready business website ka scope pehle confirm karna hoga" : "starter business website **₹7,999** se begin ho sakti hai";
    return `Aapki baat ke basis par ${fit}.\n\n1. Mobile-responsive pages\n2. Inquiry or conversion setup\n3. Basic SEO foundation\n\nFinal price pages, integrations aur content readiness par depend karega. Approx budget range aur launch timeline kya hai?`;
  }
  if (/automation|ai|bot/.test(text)) {
    const useCase = wantsLeads ? "lead capture, qualification aur follow-up" : wantsBooking ? "booking confirmations aur reminders" : "repetitive follow-ups, data entry aur customer questions";
    return `AI automation aapke **${useCase}** ko streamline kar sakti hai. Main unnecessary automation recommend nahi karungi: pehle batayein kaunsa manual task roz repeat hota hai aur roughly kitni baar?`;
  }
  if (/website|web|business/.test(text)) {
    const tailored = business ? `${business} ke liye` : "aapke business ke liye";
    const outcome = wantsBooking ? "booking-focused flow" : wantsCommerce ? "catalog, payment aur order flow" : wantsLeads ? "clear services, trust proof aur inquiry flow" : "credibility, services aur conversion path";
    return `A focused website ${tailored} **${outcome}** build kar sakti hai. Aapko new website chahiye ya existing site improve karni hai? Aur ideal launch date kya hai?`;
  }
  if (/yes|haan|ha|new|nayi|start/.test(text) && /website|web/.test(context)) {
    return `Great. ${business ? `${business} website` : "Business website"} ka right scope decide karne ke liye mujhe 3 cheezein chahiye:\n\n1. Required pages or features\n2. Approximate budget\n3. Preferred launch date\n\nInmein jo details available hain, woh bata dijiye.`;
  }
  if (/day|week|month|urgent|jaldi|timeline|date/.test(text)) {
    return "Timeline noted. A focused starter website commonly **7–10 working days** le sakti hai, provided content aur feedback time par available ho. Kaunse pages/features launch ke liye essential hain?";
  }
  if (/talk|human|team|whatsapp|contact/.test(text)) {
    return "Sure. Chat panel ke bahar visible green WhatsApp button se MistHustlers team ko directly message kar sakte hain. Message mein business type, requirement aur budget range add karenge to response more useful hoga.";
  }
  if (business || wantsBooking || wantsLeads || wantsCommerce) {
    const outcome = wantsBooking ? "bookings" : wantsCommerce ? "online sales" : wantsLeads ? "qualified inquiries" : "business growth";
    return `Samajh gaya: focus **${outcome}** par hai${business ? ` for your ${business}` : ""}. Iske liye website, automation, ya dono ka combination relevant ho sakta hai. Aapka current process kya hai aur sabse badi problem kahan aa rahi hai?`;
  }
  return "Main context ke basis par recommendation dungi. Bas ye teen cheezein bata dijiye: **business type**, **main problem**, aur **expected result**. English ya Hinglish, dono chalega.";
}

async function handlePreviewChat(req, res, requestBody = null) {
  const url = new URL(req.url, "http://localhost");
  if (req.method === "GET" && url.pathname === "/api/chatbot/config") {
    return json(res, 200, { enabled: true, primaryColor: "#fc5000", position: "bottom-right", maxMessageLength: 2000 });
  }

  if (req.method === "POST" && url.pathname === "/api/chatbot/session") {
    const token = `preview-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const greeting = "Namaste! Main ARIA hoon. Aapko website, AI automation ya MVP mein kis cheez ki help chahiye?";
    previewChats.set(token, [{ id: `${token}-1`, role: "bot", content: greeting, createdAt: new Date().toISOString() }]);
    return json(res, 200, { success: true, token, message: greeting, detectedLanguage: "hiEn", state: "GREETING", quickActions: [{ id: "website", label: "Business Website" }, { id: "automation", label: "AI Automation" }, { id: "mvp", label: "MVP Development" }], handoffAvailable: true, handoffReady: true });
  }

  const resumeMatch = url.pathname.match(/^\/api\/chatbot\/session\/([^/]+)$/);
  if (req.method === "GET" && resumeMatch) {
    const token = decodeURIComponent(resumeMatch[1]);
    const messages = previewChats.get(token);
    if (!messages) return json(res, 410, { success: false, message: "Preview session expired" });
    return json(res, 200, { success: true, token, messages, detectedLanguage: "hiEn", state: "DISCOVERY", handoffAvailable: true, handoffReady: true });
  }

  if (req.method === "POST" && url.pathname === "/api/chatbot/message") {
    const body = requestBody || {};
    const messages = previewChats.get(body.token);
    if (!messages) return json(res, 410, { success: false, message: "Preview session expired" });
    const now = new Date().toISOString();
    const message = previewReply(body.message, messages);
    messages.push({ id: `${body.token}-${messages.length + 1}`, role: "user", content: String(body.message || ""), createdAt: now });
    messages.push({ id: `${body.token}-${messages.length + 1}`, role: "bot", content: message, createdAt: now });
    return json(res, 200, { success: true, token: body.token, message, detectedLanguage: /[\u0900-\u097F]|\b(kya|hai|chahiye|mera|mujhe|batao)\b/i.test(body.message || "") ? "hiEn" : "en", state: "DISCOVERY", quickActions: [{ id: "price", label: "View pricing" }, { id: "team", label: "Talk to team" }], handoffAvailable: true, handoffReady: true });
  }

  if (req.method === "POST" && url.pathname === "/api/chatbot/handoff") {
    return json(res, 200, { success: true, whatsappUrl: "https://wa.me/918889937648?text=Hi%20MistHustlers%2C%20I%20want%20to%20discuss%20a%20project." });
  }

  if (req.method === "DELETE" && resumeMatch) {
    previewChats.delete(decodeURIComponent(resumeMatch[1]));
    return json(res, 200, { success: true });
  }
  return false;
}

function contentApiFallback() {
  return {
    name: "content-api-fallback",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) return next();
        const requestBody = req.method === "GET" || req.method === "HEAD" ? null : await readJson(req);
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 1500);
          const body = requestBody ? JSON.stringify(requestBody) : undefined;
          const resp = await fetch(`http://localhost:9000${req.url}`, {
            signal: controller.signal,
            method: req.method,
            headers: body ? { "Content-Type": "application/json" } : undefined,
            body,
          });
          clearTimeout(timeout);
          if (!resp.ok) throw new Error("not ok");
          const data = await resp.json();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(data));
        } catch {
          if (req.url.startsWith("/api/chatbot/")) {
            const handled = await handlePreviewChat(req, res, requestBody);
            if (handled !== false) return;
          }
          if (req.method !== "GET") return json(res, 503, { success: false, message: "Local backend is unavailable" });
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, data: {} }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), contentApiFallback()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5174,
    allowedHosts: [".trycloudflare.com", "localhost", "127.0.0.1"],
    hmr: {
      clientPort: 5174,
    },
    proxy: {
      "/api": {
        target: "http://localhost:9000",
        changeOrigin: true,
      },
    },
  },
});
