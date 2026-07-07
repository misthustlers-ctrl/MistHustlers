import prisma from "../prisma/client.js";
import { getServicePlans, getFAQs, getContactInfo, getKnowledgeByCategory, searchVerifiedKnowledge } from "./knowledge-sync.js";
import crypto from "crypto";

const DEVANAGARI_RANGE = /[\u0900-\u097F]/;
const HINGLISH_VOCAB = /\b(acha|accha|theek|thik|kya|kaise|kyu|nahi|hai|hoon|hain|apna|mera|karo|karna|chahiye|samajh|batana|batao|lo|le|de|do|sakta|sakte|sakti|bahut|thoda|zyada|saara|kaam|baat|baaki|waise|kuch|koi|aap|tum|main|hum|yeh|woh|uska|unka|aisa|waisa|kisi|kab|kahaan|yahan|wahan|sab|bilkul|zaroor|shayad|ho|ja|aa|dekh|sun|bol|kar|raha|rahi|rahe|tha|the|thi|hue|hui|gaya|gaye|kiya|diya|liya|paas|saath|bina|dono|bahar|andar|upar|neeche|aage|piche|saamne|aasan|mushkil|sahi|galat|bura|acche)\b/i;

const STATES = {
  GREETING: "greeting",
  DISCOVER_BUSINESS: "discover_business",
  DISCOVER_CURRENT: "discover_current",
  DISCOVER_GOAL: "discover_goal",
  DISCOVER_OBSTACLE: "discover_obstacle",
  DIAGNOSE_WEBSITE: "diagnose_website",
  DIAGNOSE_MANUAL: "diagnose_manual",
  DIAGNOSE_INSTAGRAM: "diagnose_instagram",
  DIAGNOSE_OUTDATED: "diagnose_outdated",
  REFLECT: "reflect",
  PRESENT_SOLUTION: "present_solution",
  HANDLE_OBJECTION: "handle_objection",
  CLOSE: "close",
  CONTACT: "contact",
  COMPLETE: "complete",
};

const COMPLEX_ROUTES = new Set([
  "ecommerce", "e-commerce", "ecommerce platform", "marketplace", "multi-vendor",
  "multi-role", "saas", "mobile app", "ios", "android", "react native", "flutter",
  "complex crm", "erp", "advanced integration", "custom api", "third-party integration",
]);

const AWARENESS_LEVELS = ["unaware", "problem_aware", "solution_aware", "product_aware", "ready"];

function detectLanguage(text) {
  if (!text || typeof text !== "string") return "en";
  const trimmed = text.trim();
  if (!trimmed) return "en";
  if (DEVANAGARI_RANGE.test(trimmed)) return "hi";
  if (HINGLISH_VOCAB.test(trimmed)) return "hiEn";
  return "en";
}

function t(templates, lang) {
  if (typeof templates === "string") return templates;
  return templates[lang] || templates.en || templates.hiEn || templates.hi || "";
}

function getLang(lang) {
  if (lang === "hi") return "hi";
  if (lang === "hiEn") return "hiEn";
  return "en";
}

function generateToken() {
  return crypto.randomBytes(24).toString("hex");
}

function safeText(text, max = 2000) {
  return String(text || "").trim().slice(0, max);
}

function buildResponse(response) {
  return {
    text: response.text || "",
    detectedLanguage: response.detectedLanguage || "en",
    quickActions: response.quickActions || null,
    recommendationCard: response.recommendationCard || null,
    nextExpectedField: response.nextExpectedField || null,
    handoffAvailable: response.handoffAvailable || false,
    state: response.state || null,
    leadCreatedId: response.leadCreatedId || null,
  };
}

function isComplexRoute(text) {
  const lower = text.toLowerCase();
  for (const route of COMPLEX_ROUTES) {
    if (lower.includes(route)) return true;
  }
  return false;
}

function getBudgetCategory(budget) {
  const num = parseInt(String(budget).replace(/[^0-9]/g, ""));
  if (isNaN(num)) return null;
  if (num < 25000) return "very-low";
  if (num < 50000) return "low";
  if (num < 100000) return "medium";
  if (num < 300000) return "high";
  return "premium";
}

function calculateLeadScore(data) {
  let score = 0;
  if (data.budget) {
    const budgetCat = getBudgetCategory(data.budget);
    if (budgetCat === "premium" || budgetCat === "high") score += 20;
    else if (budgetCat === "medium") score += 15;
    else if (budgetCat) score += 10;
  }
  if (data.features) {
    const featureCount = data.features.split(",").filter(Boolean).length;
    score += Math.min(featureCount * 3, 15);
  }
  if (data.goal) score += 15;
  if (data.timeline) {
    const lower = data.timeline.toLowerCase();
    if (lower.includes("asap") || lower.includes("urgent") || lower.includes("1 month") || lower.includes("2 week")) score += 10;
    else if (lower.includes("month")) score += 7;
    else score += 4;
  }
  if (data.decisionMaker === "yes") score += 10;
  if (data.contentReady === "yes") score += 5;
  else if (data.contentReady === "partial") score += 3;
  if (data.consentGiven) score += 10;
  if (data.name || data.email || data.phone) {
    let contactScore = 0;
    if (data.name) contactScore += 3;
    if (data.email) contactScore += 4;
    if (data.phone) contactScore += 3;
    score += Math.min(contactScore, 10);
  }
  let category = "low-priority";
  if (score >= 80) category = "hot";
  else if (score >= 60) category = "qualified";
  else if (score >= 40) category = "nurture";
  else if (score < 0) category = "spam";
  return { score: Math.min(score, 100), category };
}

function buildWhatsAppSummary(lead) {
  const field = (value, fallback, max = 240) => safeText(value || fallback, max).replace(/[\r\n\t]+/g, " ");
  const lines = [
    `*MistHustlers — ARIA Lead*`,
    `---`,
    `Name: ${field(lead.name, "Not shared")}`,
    `Phone: ${field(lead.phone, "Not shared", 30)}`,
    `Email: ${field(lead.email, "Not shared", 200)}`,
    `Company: ${field(lead.company, "Not shared")}`,
    `Service Interest: ${field(lead.serviceInterest, "Not specified")}`,
    `Budget: ${field(lead.budget, "Not shared")}`,
    `Timeline: ${field(lead.timeline, "Not shared")}`,
    `Goal: ${field(lead.goal, "Not specified")}`,
    `Diagnosis: ${field(lead.notes, "Standard discovery", 600)}`,
    ...(Number.isFinite(lead.leadScore) ? [`Score: ${lead.leadScore}/100 (${field(lead.leadCategory, "unclassified", 40)})`] : []),
    `Status: ${field(lead.status, "new", 40)}`,
    `---`,
    `_Generated by ARIA — Virtual Sales Consultant_`,
  ];
  return lines.join("\n");
}

function getGreeting(lang, config) {
  if (lang === "hi") return config.greetingHindi;
  if (lang === "hiEn") return config.greetingHinglish;
  return config.greeting;
}

function getQuickActions(lang) {
  return QUICK_ACTIONS.map((a) => ({
    id: a.id,
    label: lang === "hi" ? a.labelHi : lang === "hiEn" ? a.labelHiEn : a.label,
  }));
}

function getIndustries(lang) {
  const list = {
    en: [
      "E-commerce / Retail", "Healthcare / Clinic", "Restaurant / Cafe / Food",
      "Real Estate / Property", "Education / Coaching", "Salon / Spa / Wellness",
      "Fitness / Gym", "Professional Services (CA, Lawyer, Consultant)",
      "Manufacturing / Industrial", "Startup / Tech", "Creative Agency",
      "Non-profit / NGO", "Other",
    ],
    hi: [
      "ई-कॉमर्स / रिटेल", "हेल्थकेयर / क्लिनिक", "रेस्टोरेंट / कैफ़े / फ़ूड",
      "रियल एस्टेट / प्रॉपर्टी", "एजुकेशन / कोचिंग", "सैलून / स्पा / वेलनेस",
      "फ़िटनेस / जिम", "प्रोफ़ेशनल सर्विसेज़ (CA, वकील, सलाहकार)",
      "मैन्युफ़ैक्चरिंग / इंडस्ट्रियल", "स्टार्टअप / टेक", "क्रिएटिव एजेंसी",
      "नॉन-प्रॉफ़िट / NGO", "अन्य",
    ],
    hiEn: [
      "E-commerce / Retail", "Healthcare / Clinic", "Restaurant / Cafe / Food",
      "Real Estate / Property", "Education / Coaching", "Salon / Spa / Wellness",
      "Fitness / Gym", "Professional Services (CA, Lawyer, Consultant)",
      "Manufacturing / Industrial", "Startup / Tech", "Creative Agency",
      "Non-profit / NGO", "Aur koi",
    ],
  };
  return list[lang] || list.en;
}

function classifyGoal(text) {
  const lower = text.toLowerCase();
  if (lower.includes("website") || lower.includes("web") || lower.includes("site") || lower.includes("वेबसाइट") || lower.includes("landing")) return "website";
  if (lower.includes("automation") || lower.includes("automate") || lower.includes("workflow") || lower.includes("zapier") || lower.includes("ऑटोमेशन")) return "automation";
  if (lower.includes("mvp") || lower.includes("software") || lower.includes("app") || lower.includes("product") || lower.includes("platform") || lower.includes("सॉफ्टवेयर")) return "mvp";
  if (lower.includes("maintenance") || lower.includes("maintain") || lower.includes("support") || lower.includes("मेंटेनेंस") || lower.includes("सपोर्ट")) return "maintenance";
  if (lower.includes("redesign") || lower.includes("रीडिज़ाइन") || lower.includes("improve")) return "redesign";
  if (lower.includes("ecommerce") || lower.includes("e-commerce") || lower.includes("shop") || lower.includes("store")) return "ecommerce";
  if (lower.includes("mobile") || lower.includes("ios") || lower.includes("android")) return "mobile";
  return "website";
}

function detectServiceChoice(text) {
  const lower = String(text || "").toLowerCase();
  if (/\b(website|web site|landing page|वेबसाइट)\b/.test(lower)) return "website";
  if (/\b(automation|automate|workflow|zapier|ऑटोमेशन)\b/.test(lower)) return "automation";
  if (/\b(mvp|software|app|platform|सॉफ्टवेयर)\b/.test(lower)) return "mvp";
  if (/\b(maintenance|maintain|support|मेंटेनेंस|सपोर्ट)\b/.test(lower)) return "maintenance";
  if (/\b(redesign|रीडिज़ाइन)\b/.test(lower)) return "redesign";
  if (/\b(ecommerce|e-commerce|online store)\b/.test(lower)) return "ecommerce";
  if (/\b(mobile app|ios app|android app)\b/.test(lower)) return "mobile";
  return null;
}

function isServiceSelectionMessage(text) {
  const normalized = String(text || "").toLowerCase().replace(/[^a-z0-9\s/-]/g, " ").replace(/\s+/g, " ").trim();
  return /^(website|business website|new website|ai automation|automation|mvp|mvp software|software product|maintenance|website maintenance|i want to build a new website|i want to automate my business processes|i want to build an mvp or software product|i need website maintenance)$/.test(normalized);
}

function parsePlans(plans) {
  const map = {};
  for (const item of plans) {
    const parts = item.key.split(".");
    if (parts.length >= 3) {
      const planName = parts[1];
      const field = parts[2];
      if (!map[planName]) map[planName] = { inclusions: [], exclusions: [], features: [] };
      map[planName][field] = item.value;
      map[planName]._raw = item;
    }
  }
  return Object.entries(map).map(([key, val]) => ({
    key,
    name: val.name || key,
    price: val.price || "",
    delivery: val.delivery || val.timeline || "",
    description: val.description || "",
    inclusions: Array.isArray(val.inclusions) ? val.inclusions : (val.inclusions ? val.inclusions.split(",").filter(Boolean) : []),
    exclusions: Array.isArray(val.exclusions) ? val.exclusions : (val.exclusions ? val.exclusions.split(",").filter(Boolean) : []),
    features: Array.isArray(val.features) ? val.features : (val.features ? val.features.split(",").filter(Boolean) : []),
    whoIsFor: val.whoIsFor || "",
    _raw: val._raw,
  }));
}

function matchPlanToBudget(budget, plans) {
  const category = getBudgetCategory(budget);
  if (!category || !plans.length) return null;
  const planMap = {
    "very-low": ["basic", "starter", "essential", "landing"],
    "low": ["starter", "basic", "essential", "growth"],
    "medium": ["growth", "standard", "professional", "business"],
    "high": ["professional", "premium", "business"],
    "premium": ["enterprise", "premium", "business", "custom"],
  };
  const preferred = planMap[category] || [];
  for (const p of preferred) {
    const plan = plans.find((pl) => pl.key.toLowerCase().includes(p) || pl.name.toLowerCase().includes(p));
    if (plan) return plan;
  }
  if (category === "very-low" || category === "low") {
    return plans.sort((a, b) => a.value.length - b.value.length)[0] || plans[0];
  }
  return plans[plans.length - 1] || plans[0];
}

function createStateData(existing = {}) {
  return {
    businessType: existing.businessType || null,
    industry: existing.industry || null,
    goal: existing.goal || null,
    mainObstacle: existing.mainObstacle || null,
    hasWebsite: existing.hasWebsite || null,
    websiteType: existing.websiteType || null,
    currentSoftware: existing.currentSoftware || null,
    leadSource: existing.leadSource || null,
    needsBooking: existing.needsBooking || null,
    needsPayment: existing.needsPayment || null,
    needsAdmin: existing.needsAdmin || null,
    needsAutomation: existing.needsAutomation || null,
    features: existing.features || null,
    budget: existing.budget || null,
    timeline: existing.timeline || null,
    contentReady: existing.contentReady || null,
    decisionMaker: existing.decisionMaker || null,
    serviceInterest: existing.serviceInterest || null,
    selectedService: existing.selectedService || existing.serviceInterest || null,
    awarenessLevel: existing.awarenessLevel || "unaware",
    reflectionConfirmed: existing.reflectionConfirmed || false,
    recommendedPlan: existing.recommendedPlan || null,
    alternativePlan: existing.alternativePlan || null,
    objectionType: existing.objectionType || null,
    consentGiven: existing.consentGiven || false,
    _contactName: existing._contactName || null,
    _contactEmail: existing._contactEmail || null,
    _contactPhone: existing._contactPhone || null,
    _diagnosisSummary: existing._diagnosisSummary || null,
    ...existing,
  };
}

function absorbStructuredDetails(stateData, text) {
  const value = String(text || "").trim();
  const lower = value.toLowerCase();
  const service = detectServiceChoice(value);
  if (service) {
    stateData.serviceInterest ||= service;
    stateData.selectedService ||= service;
  }
  const budget = value.match(/(?:budget|₹|rs\.?|inr)\s*(?:is|hai|around|approx(?:imately)?)?\s*([₹\s\d,.]+(?:k|lakh|lac)?)/i)
    || value.match(/([₹]?\s*\d[\d,.]*\s*(?:k|lakh|lac))\s*(?:budget|tak|around)?/i);
  if (budget) stateData.budget ||= budget[0].trim();
  const timeline = value.match(/(?:within|in|timeline|delivery|complete|ready)\s*(?:is|hai|chahiye)?\s*(\d+\s*(?:day|days|week|weeks|month|months|din|hafte|mahine))/i)
    || value.match(/\b\d+\s*(?:day|days|week|weeks|month|months|din|hafte|mahine)\b/i)
    || value.match(/\b(asap|urgent|jaldi|immediately)\b/i);
  if (timeline) stateData.timeline ||= timeline[0].trim();
  if (/\b(no website|website nahi|site nahi|only instagram|sirf instagram|only social)\b/i.test(lower)) stateData.hasWebsite ||= lower.includes("instagram") || lower.includes("social") ? "social" : "no";
  else if (/\b(outdated|old website|purani website|redesign)\b/i.test(lower)) stateData.hasWebsite ||= "outdated";
  else if (/\b(have a website|website hai|existing website|current website)\b/i.test(lower)) stateData.hasWebsite ||= "yes";
  const featurePatterns = [
    ["booking", /\b(booking|appointment|reservation)\b/i], ["payment gateway", /\b(payment|checkout|pay online)\b/i],
    ["admin dashboard", /\b(admin|dashboard|crm)\b/i], ["user login", /\b(login|signup|account|member)\b/i],
    ["WhatsApp", /\bwhatsapp\b/i], ["gallery", /\b(gallery|portfolio)\b/i], ["automation", /\b(automation|automate|workflow)\b/i],
  ];
  const found = featurePatterns.filter(([, pattern]) => pattern.test(value)).map(([name]) => name);
  if (found.length) {
    const existing = String(stateData.features || "").split(",").map((item) => item.trim()).filter(Boolean);
    stateData.features = [...new Set([...existing, ...found])].join(", ");
  }
  if (/\b(booking|appointment|reservation)\b/i.test(value)) stateData.needsBooking ||= "yes";
  if (/\b(payment|checkout|pay online)\b/i.test(value)) stateData.needsPayment ||= "yes";
  if (/\b(i am the owner|main owner|decision maker|final decision)\b/i.test(value)) stateData.decisionMaker ||= "yes";
  return stateData;
}

const QUICK_ACTIONS = [
  { id: "website", label: "Website", labelHi: "वेबसाइट", labelHiEn: "Website" },
  { id: "automation", label: "Automation", labelHi: "ऑटोमेशन", labelHiEn: "Automation" },
  { id: "mvp", label: "MVP / Software", labelHi: "MVP / सॉफ्टवेयर", labelHiEn: "MVP / Software" },
  { id: "maintenance", label: "Maintenance", labelHi: "मेंटेनेंस", labelHiEn: "Maintenance" },
  { id: "talk", label: "Talk to Team", labelHi: "टीम से बात", labelHiEn: "Team se baat karein" },
  { id: "unsure", label: "Not Sure Yet", labelHi: "अभी तय नहीं", labelHiEn: "Abhi sure nahi hoon" },
];

const DISCOVERY_QUESTIONS = {
  hasWebsite: {
    text: {
      en: "Do you currently have a website for your business?",
      hi: "क्या आपके व्यवसाय की वर्तमान में कोई वेबसाइट है?",
      hiEn: "Kya aapke business ki abhi koi website hai?",
    },
    options: {
      en: ["Yes, a active website", "Yes, but outdated", "No website yet", "Only social media"],
      hi: ["हाँ, सक्रिय वेबसाइट", "हाँ, लेकिन पुरानी है", "अभी वेबसाइट नहीं", "सिर्फ सोशल मीडिया"],
      hiEn: ["Haan, active website", "Haan, lekin purani hai", "Abhi website nahi", "Sirf social media"],
    },
  },
  noWebsite: {
    text: {
      en: "I see. So how do your customers currently find details about your services, pricing, or contact information?",
      hi: "समझ गई। तो आपके ग्राहक अभी आपकी सेवाओं, मूल्य या संपर्क जानकारी कैसे ढूंढते हैं?",
      hiEn: "Samajh gayi. To aapke customers abhi aapki services, pricing ya contact details kaise dhundhte hain?",
    },
  },
  instagram: {
    text: {
      en: "Instagram se enquiries aa rahi hain, lekin kya services, pricing, testimonials aur contact process ek jagah clearly available hain?",
      hi: "Instagram से enquiries आ रही हैं, लेकिन क्या services, pricing, testimonials और contact process एक जगह clearly available हैं?",
      hiEn: "Instagram se enquiries aa rahi hain, lekin kya services, pricing, testimonials aur contact process ek jagah clearly available hain?",
    },
  },
  manualWork: {
    text: {
      en: "Tell me about your current workflow. Are there any repetitive tasks that your team does manually every day?",
      hi: "अपने मौजूदा कार्यप्रवाह के बारे में बताएं। क्या ऐसे कोई दोहराए जाने वाले काम हैं जो आपकी टीम हर दिन मैन्युअली करती है?",
      hiEn: "Apne current workflow ke baare mein batayein. Kya aise koi repetitive tasks hain jo aapki team har din manually karti hai?",
    },
  },
  outdated: {
    text: {
      en: "What was the main goal when you originally built the website? And when was the last meaningful update made to it?",
      hi: "जब आपने मूल रूप से वेबसाइट बनवाई थी तो मुख्य उद्देश्य क्या था? और आखिरी बार इसमें कोई महत्वपूर्ण अपडेट कब हुआ?",
      hiEn: "Jab aapne website banwayi thi to main goal kya tha? Aur aakhri baar ismein koi important update kab hua?",
    },
  },
  currentSoftware: {
    text: {
      en: "Are you currently using any software or tools to manage your business operations?",
      hi: "क्या आप अपने व्यवसाय के संचालन के लिए कोई सॉफ्टवेयर या टूल इस्तेमाल कर रहे हैं?",
      hiEn: "Kya aap apne business ke operations ke liye koi software ya tool use kar rahe hain?",
    },
  },
  leadSource: {
    text: {
      en: "How do customers typically reach you — WhatsApp, phone, walk-ins, or referrals?",
      hi: "ग्राहक आमतौर पर आपसे कैसे संपर्क करते हैं — WhatsApp, फ़ोन, सीधे आकर, या रेफ़रल से?",
      hiEn: "Customers aam taur par aapse kaise contact karte hain — WhatsApp, phone, walk-ins, ya referrals se?",
    },
  },
  needsBooking: {
    text: {
      en: "Do you need online booking or appointment scheduling as part of the solution?",
      hi: "क्या आपको ऑनलाइन बुकिंग या अपॉइंटमेंट शेड्यूलिंग की ज़रूरत है?",
      hiEn: "Kya aapko online booking ya appointment scheduling ki zaroorat hai?",
    },
  },
  needsPayment: {
    text: {
      en: "Do you need to collect payments online?",
      hi: "क्या आपको ऑनलाइन भुगतान लेने की ज़रूरत है?",
      hiEn: "Kya aapko online payment lene ki zaroorat hai?",
    },
  },
  goal: {
    text: {
      en: "What's the main goal you want to achieve through this project?",
      hi: "इस प्रोजेक्ट के माध्यम से आप मुख्य रूप से क्या हासिल करना चाहते हैं?",
      hiEn: "Is project ke through aap mainly kya achieve karna chahte hain?",
    },
    options: {
      en: ["Get more enquiries/leads", "Sell products or services online", "Build credibility and trust", "Automate manual processes", "Replace outdated system", "Not sure yet"],
      hi: ["ज़्यादा enquiries/leads प्राप्त करना", "ऑनलाइन उत्पाद या सेवाएँ बेचना", "विश्वसनीयता और भरोसा बनाना", "मैन्युअल प्रक्रियाओं को ऑटोमेट करना", "पुराने सिस्टम को बदलना", "अभी पक्का नहीं"],
      hiEn: ["Zyada enquiries/leads lena", "Online product ya service bechna", "Credibility aur trust banana", "Manual processes automate karna", "Purane system ko badalna", "Abhi pakka nahi"],
    },
  },
  obstacles: {
    text: {
      en: "What's the biggest challenge you're facing with your current setup?",
      hi: "अपनी मौजूदा व्यवस्था में सबसे बड़ी चुनौती क्या है?",
      hiEn: "Apni current setup mein sabse badi challenge kya hai?",
    },
  },
  features: {
    text: {
      en: "What key features do you need? For example: enquiry forms, gallery, user login, payment gateway, booking system, dashboard.",
      hi: "आपको किन मुख्य सुविधाओं की ज़रूरत है? जैसे: enquiry फ़ॉर्म, गैलरी, यूज़र लॉगिन, भुगतान गेटवे, बुकिंग सिस्टम, डैशबोर्ड।",
      hiEn: "Aapko kin mukhya suvidhaon ki zaroorat hai? Jaise: enquiry form, gallery, user login, payment gateway, booking system, dashboard.",
    },
  },
  budget: {
    text: {
      en: "Do you have a budget range in mind for this investment? (For reference, our plans range from ₹7,999 to ₹49,999+)",
      hi: "क्या आपके मन में इस निवेश के लिए कोई बजट सीमा है? (संदर्भ के लिए, हमारी योजनाएँ ₹7,999 से ₹49,999+ तक हैं)",
      hiEn: "Kya aapke man mein is investment ke liye koi budget range hai? (Reference ke liye, humari plans ₹7,999 se ₹49,999+ tak hain)",
    },
  },
  timeline: {
    text: {
      en: "What timeline are you looking at for this project?",
      hi: "आप इस प्रोजेक्ट के लिए कितनी समयसीमा देख रहे हैं?",
      hiEn: "Aap is project ke liye kitni timeline dekh rahe hain?",
    },
  },
  decisionMaker: {
    text: {
      en: "Are you the decision-maker for this project, or will you need to discuss with a partner or team?",
      hi: "क्या आप इस प्रोजेक्ट के लिए निर्णय लेने वाले हैं, या किसी पार्टनर या टीम से चर्चा करनी होगी?",
      hiEn: "Kya aap is project ke liye decision maker hain, ya kisi partner ya team se讨论 karni hogi?",
    },
    options: {
      en: ["I'm the decision maker", "I'll need to consult", "Just exploring for now"],
      hi: ["मैं निर्णय लेने वाला हूँ", "मुझे सलाह लेनी होगी", "अभी केवल जानकारी ले रहा हूँ"],
      hiEn: ["Main decision maker hoon", "Mujhe consult karna hoga", "Abhi sirf jaankari le raha hoon"],
    },
  },
};

const CONSEQUENCE_QUESTIONS = {
  noWebsite: {
    en: "Agar ye process same raha aur customer ko online information easily available nahi hui, to sabse badi difficulty kya continue hogi?",
    hi: "अगर यही प्रक्रिया जारी रही और ग्राहक को ऑनलाइन जानकारी आसानी से नहीं मिली, तो सबसे बड़ी कठिनाई क्या जारी रहेगी?",
    hiEn: "Agar yehi process continue raha aur customer ko online information aasani se nahi mili, to sabse badi difficulty kya continue rahegi?",
  },
  manual: {
    en: "Agar repetitive tasks increase hote rahe aur team size same rahi, to kya current team consistently same quality handle kar payegi?",
    hi: "अगर दोहराए जाने वाले काम बढ़ते रहे और टीम का आकार वही रहा, तो क्या मौजूदा टीम लगातार समान गुणवत्ता संभाल पाएगी?",
    hiEn: "Agar repetitive tasks badhte rahe aur team size same rahi, to kya current team consistently same quality handle kar payegi?",
  },
};

const REFLECTION_TEMPLATES = {
  noWebsite: {
    en: "Main jo samajh rahi hoon, uske according: → Aapke paas abhi koi website nahi hai → Customers ko information manually provide karni padti hai → Jo customer working hours ke baad search karta hai, uske liye koi structured source available nahi → Ye sirf website ki kami nahi, customer journey ka gap hai Kya ye assessment accurate hai?",
    hi: "Main जो समझ रही हूँ, उसके according: → आपके पास अभी कोई website नहीं है → ग्राहकों को जानकारी manually provide करनी पड़ती है → जो customer काम के घंटों के बाद search करता है, उसके लिए कोई structured source available नहीं → यह सिर्फ website की कमी नहीं, customer journey का gap है क्या यह assessment accurate है?",
    hiEn: "Main jo samajh rahi hoon, uske according: → Aapke paas abhi koi website nahi hai → Customers ko information manually provide karni padti hai → Jo customer working hours ke baad search karta hai, uske liye koi structured source available nahi → Ye sirf website ki kami nahi, customer journey ka gap hai Kya ye assessment accurate hai?",
  },
  instagram: {
    en: "Main jo samajh rahi hoon: → Instagram aapke liye primary discovery channel hai → Lekin services, pricing aur enquiry process ek central jagah available nahi hai → Instagram reach down hone par customers ko discover karne ka koi aur structured option nahi → Iska matlab hai ki aapka traffic source single point par dependent hai Kya ye assessment sahi hai?",
    hi: "Main जो समझ रही हूँ: → Instagram आपके लिए primary discovery channel है → लेकिन services, pricing और enquiry process एक central जगह available नहीं है → Instagram reach down होने पर customers को discover करने का कोई और structured option नहीं → इसका मतलब है कि आपका traffic source single point पर dependent है क्या यह assessment सही है?",
    hiEn: "Main jo samajh rahi hoon: → Instagram aapke liye primary discovery channel hai → Lekin services, pricing aur enquiry process ek central jagah available nahi hai → Instagram reach down hone par customers ko discover karne ka koi aur structured option nahi → Iska matlab hai ki aapka traffic source single point par dependent hai Kya ye assessment sahi hai?",
  },
  manual: {
    en: "Maine jo samjha: → Aapke team repetitive tasks mein significant time spend karti hai → Yeh process technically chal raha hai → Lekin employee availability par dependent hai → Agar koi responsible person available na ho, to delay ho sakta hai Kya ye accurate hai?",
    hi: "Maine जो समझा: → आपकी team repetitive tasks में significant time spend करती है → यह process technically चल रहा है → लेकिन employee availability पर dependent है → अगर कोई responsible person available न हो, तो delay हो सकता है क्या यह accurate है?",
    hiEn: "Maine jo samjha: → Aapki team repetitive tasks mein significant time spend karti hai → Yeh process technically chal raha hai → Lekin employee availability par dependent hai → Agar koi responsible person available na ho, to delay ho sakta hai Kya ye accurate hai?",
  },
  outdated: {
    en: "Main jo samajh rahi hoon: → Aapki website online to hai → Lekin actively sales asset ki tarah perform nahi kar rahi → Mobile experience aur enquiry flow mein gaps hain → Website ka last meaningful update kafi time pehle hua tha Kya ye sahi hai?",
    hi: "Main जो समझ रही हूँ: → आपकी website online तो है → लेकिन actively sales asset की तरह perform नहीं कर रही → Mobile experience और enquiry flow में gaps हैं → Website का last meaningful update काफी time पहले हुआ था क्या यह सही है?",
    hiEn: "Main jo samajh rahi hoon: → Aapki website online to hai → Lekin actively sales asset ki tarah perform nahi kar rahi → Mobile experience aur enquiry flow mein gaps hain → Website ka last meaningful update kafi time pehle hua tha Kya ye sahi hai?",
  },
};

function assessAwareness(stateData) {
  if (stateData.budget && stateData.features && stateData.timeline) return "ready";
  if (stateData.serviceInterest && stateData.reflectionConfirmed) return "product_aware";
  if (stateData.goal && stateData.mainObstacle) return "solution_aware";
  if (stateData.mainObstacle || stateData._diagnosisSummary) return "problem_aware";
  return "unaware";
}

function buildImpactStatement(diagnosisType, lang) {
  const impacts = {
    noWebsite: {
      en: "Business without a structured web presence typically finds that customers who search after hours don't return, and every enquiry requires manual effort to explain basic details.",
      hi: "बिना संरचित वेब उपस्थिति के व्यवसाय में आमतौर पर ग्राहक जो काम के घंटों के बाद खोज करते हैं, वापस नहीं आते, और हर enquiry में बुनियादी जानकारी समझाने के लिए मैन्युअल प्रयास करना पड़ता है।",
      hiEn: "Bina structured web presence ke business mein aam taur par jo customer working hours ke baad search karte hain, wapas nahi aate, aur har enquiry mein basic details explain karne ke liye manual effort lagta hai.",
    },
    instagram: {
      en: "Relying on a single platform for customer acquisition creates a structural risk. If the platform changes its algorithm or reach drops, there's no secondary conversion system in place.",
      hi: "ग्राहक अधिग्रहण के लिए एक ही प्लेटफ़ॉर्म पर निर्भर रहना संरचनात्मक जोखिम पैदा करता है। अगर प्लेटफ़ॉर्म अपना एल्गोरिदम बदलता है या पहुँच घटती है, तो कोई द्वितीयक रूपांतरण प्रणाली मौजूद नहीं है।",
      hiEn: "Customer acquisition ke liye ek hi platform par rely karna structural risk hai. Agar platform algorithm change kare ya reach gire, to koi secondary conversion system nahi hai.",
    },
    manual: {
      en: "Manual processes that depend on specific individuals create inconsistency. When that person is unavailable, the process slows down or stops — and that affects the customer experience directly.",
      hi: "मैन्युअल प्रक्रियाएँ जो विशिष्ट व्यक्तियों पर निर्भर करती हैं, असंगतता पैदा करती हैं। जब वह व्यक्ति अनुपलब्ध होता है, तो प्रक्रिया धीमी हो जाती है या रुक जाती है — और यह सीधे ग्राहक अनुभव को प्रभावित करता है।",
      hiEn: "Manual processes jo khaas individuals par depend karti hain, inconsistency create karti hain. Jab woh person unavailable ho, to process slow ho jata hai ya ruk jata hai — aur ye seedha customer experience ko affect karta hai.",
    },
    outdated: {
      en: "An outdated website can unintentionally reduce trust. Visitors who see old information or a poor mobile experience often question whether the business is still active.",
      hi: "पुरानी वेबसाइट अनजाने में विश्वास कम कर सकती है। जो आगंतुक पुरानी जानकारी या खराब मोबाइल अनुभव देखते हैं, वे अक्सर सवाल करते हैं कि क्या व्यवसाय अभी भी सक्रिय है।",
      hiEn: "Purani website unintentionally trust kam kar sakti hai. Visitors jo purani information ya kharab mobile experience dekhte hain, woh often question karte hain ki kya business abhi bhi active hai.",
    },
  };
  return impacts[diagnosisType]?.[lang] || impacts[diagnosisType]?.en || null;
}

function generateRecommendation(stateData, plans, lang) {
  const goal = stateData.serviceInterest || "website";
  let filtered = plans;
  if (goal === "website") filtered = plans.filter((p) => p.key.includes("website") || p.key.includes("starter") || p.key.includes("basic") || p.key.includes("landing"));
  else if (goal === "automation") filtered = plans.filter((p) => p.key.includes("automation") || p.key.includes("growth") || p.key.includes("professional"));
  else if (goal === "mvp") filtered = plans.filter((p) => p.key.includes("mvp") || p.key.includes("growth") || p.key.includes("professional"));
  else if (goal === "maintenance") filtered = plans.filter((p) => p.key.includes("maintenance") || p.key.includes("basic"));
  if (!filtered.length) filtered = plans;

  const matched = stateData.budget ? matchPlanToBudget(stateData.budget, filtered) : filtered[filtered.length > 1 ? 1 : 0] || filtered[0];
  const alternative = filtered.find((p) => p.key !== matched?.key) || (plans.find((p) => p.key !== matched?.key) || null);

  const score = calculateLeadScore(stateData);
  const planName = matched?.name || "Custom Solution";
  const planPrice = matched?.price || "Contact for pricing";
  const planDelivery = matched?.delivery || "Depends on scope";
  const planInclusions = matched?.inclusions || [];
  const planExclusions = matched?.exclusions || [];

  const diagnosisType = !stateData.hasWebsite || stateData.hasWebsite === "no" ? "noWebsite"
    : stateData.hasWebsite === "social" ? "instagram"
    : stateData.needsAutomation ? "manual"
    : "outdated";

  const impactStatement = buildImpactStatement(diagnosisType, lang);
  const text = buildRecText(planName, planPrice, planDelivery, planInclusions, planExclusions, stateData, impactStatement, lang);

  const card = {
    planName,
    price: planPrice,
    delivery: planDelivery,
    inclusions: planInclusions.slice(0, 5),
    exclusions: planExclusions.slice(0, 3),
    score: score.score,
    category: score.category,
    alternativeName: alternative?.name || null,
  };

  return { text, plan: matched, alternative, score, card };
}

function buildRecText(planName, price, delivery, inclusions, exclusions, stateData, impact, lang) {
  const problemStatement = stateData._diagnosisSummary || "aapki current situation mein improvement ka scope hai";

  let text;
  if (lang === "hi") {
    text = `Based on aapke answers, main problem sirf ${stateData.serviceInterest || "digital presence"} ki kami nahi hai.\n\n${impact ? "💡 " + impact + "\n\n" : ""}Aapke liye **${planName}** suitable rahega kyunki:\n\n• ${stateData.goal || "Aapke business requirements"} ke hisaab se design hoga\n• Verified investment: **${price}**\n• Expected delivery: **${delivery}**\n\n*Included:*\n${inclusions.slice(0, 5).map((i) => "• " + i).join("\n")}\n\n*Excluded:*\n${exclusions.slice(0, 3).map((i) => "• " + i).join("\n") || "• Custom features scope ke hisaab se confirm honge"}\n\nKya main aapke liye structured project summary prepare karun aur MistHustlers team ke saath connect karun?`;
  } else if (lang === "hiEn") {
    text = `Based on aapke answers, main problem sirf ${stateData.serviceInterest || "digital presence"} ki kami nahi hai.\n\n${impact ? "💡 " + impact + "\n\n" : ""}Aapke liye **${planName}** suitable rahega:\n\n• Verified investment: **${price}**\n• Expected delivery: **${delivery}**\n\n*Includes:*\n${inclusions.slice(0, 5).map((i) => "• " + i).join("\n")}\n\nKya main aapko MistHustlers team se connect karun?`;
  } else {
    text = `Based on what you've shared, your main challenge isn't just the absence of a ${stateData.serviceInterest || "digital presence"} — it's that ${problemStatement}.\n\n${impact ? "💡 " + impact + "\n\n" : ""}I'd recommend **${planName}** for your situation:\n\n• Verified investment: **${price}**\n• Expected delivery: **${delivery}**\n\n*What's included:*\n${inclusions.slice(0, 5).map((i) => "• " + i).join("\n")}\n\n*What's not included:*\n${exclusions.slice(0, 3).map((i) => "• " + i).join("\n") || "• Additional custom features confirmed during scope review"}\n\nWould you like me to prepare a structured project summary and connect you with the MistHustlers team?`;
  }

  return text;
}

function isVerifiedKnowledgeQuestion(text) {
  return /\b(price|pricing|cost|rate|package|plan|service|include|delivery|timeline|contact|phone|email|address|location|seo|website|automation|mvp|maintenance|refund|payment|kitna|kya|kaise|kab|contact)\b|₹|\?/i.test(text);
}

function isConversationQuestion(text) {
  return /\?|\b(what|why|how|when|where|who|which|can|could|should|would|tell me|explain|kya|kaise|kyu|kab|kahan|batao|samjhao|code|coding)\b/i.test(text);
}

function whatsappInquiryFallback(lang, config) {
  if (config?.unknownAnswer) return config.unknownAnswer;
  return {
    en: "I do not have a verified answer for that yet. Please use the visible green WhatsApp button to send your inquiry to the MistHustlers team.",
    hi: "Mere paas abhi iska verified answer nahi hai. Kripya visible green WhatsApp button se MistHustlers team ko inquiry bhejein.",
    hiEn: "Mere paas abhi iska verified answer nahi hai. Visible green WhatsApp button se MistHustlers team ko inquiry bhej dein.",
  }[lang];
}

function continuationForState(state, lang) {
  const prompts = {
    [STATES.DISCOVER_BUSINESS]: { en: "To tailor this, what does your business do?", hi: "Isse aapke liye tailor karne ke liye, aapka business kya karta hai?", hiEn: "Isse aapke liye tailor karne ke liye, aapka business kya karta hai?" },
    [STATES.DISCOVER_CURRENT]: { en: "Do you currently have a website?", hi: "Kya aapke business ki abhi website hai?", hiEn: "Kya aapke business ki abhi website hai?" },
    [STATES.DISCOVER_GOAL]: { en: "What result matters most to you?", hi: "Aapke liye sabse important result kya hai?", hiEn: "Aapke liye sabse important result kya hai?" },
    [STATES.DISCOVER_OBSTACLE]: { en: "What is the biggest obstacle in the current process?", hi: "Current process mein sabse badi problem kya hai?", hiEn: "Current process mein sabse badi problem kya hai?" },
  };
  return prompts[state]?.[lang] || "";
}

function buildVerifiedKnowledgeAnswer(items, state, lang, tone = "consultative", instructions = "") {
  const unique = [];
  const seen = new Set();
  for (const item of items) {
    const value = safeText(item.value, 700);
    if (!value || seen.has(value.toLowerCase())) continue;
    seen.add(value.toLowerCase());
    unique.push(value);
  }
  const intro = tone === "concise"
    ? { en: "Verified information:", hi: "Verified jaankari:", hiEn: "Verified information:" }[lang]
    : { en: "Based on the latest verified MistHustlers information:", hi: "MistHustlers ki latest verified jaankari ke anusaar:", hiEn: "MistHustlers ki latest verified information ke hisaab se:" }[lang];
  const concise = tone === "concise" || /brief|short|concise/i.test(instructions);
  const selected = unique.slice(0, concise ? 2 : 3);
  const details = selected.length === 1
    ? selected[0]
    : selected.map((value, index) => `${index + 1}. ${value}`).join("\n");
  const continuation = /do not ask|no follow.?up/i.test(instructions) ? "" : continuationForState(state, lang);
  return `${intro}\n\n${details}${continuation ? `\n\n${continuation}` : ""}`;
}

async function handleMessage(session, message, config) {
  const lang = getLang(session.language);
  const state = session.state || STATES.GREETING;
  const stateData = createStateData(session.stateData || {});
  const text = safeText(message);
  absorbStructuredDetails(stateData, text);

  let detectedLanguage = detectLanguage(text);
  if (session.languageSource === "explicit") detectedLanguage = session.language;

  const switchHi = /(हिंदी|हिन्दी|hindi)\b/i.test(text);
  const switchEn = /\b(english|inglish|angreji)\b/i.test(text) && !HINGLISH_VOCAB.test(text);

  if (switchHi && detectedLanguage !== "hi") {
    detectedLanguage = "hi";
    await prisma.chatSession.update({ where: { id: session.id }, data: { language: "hi", languageSource: "explicit" } });
    return buildResponse({ text: "बिल्कुल! Main ARIA ab aapse Hindi mein baat karungi. Bataiye, aapke business ke baare mein jaankari dein.", detectedLanguage: "hi", quickActions: getQuickActions("hi"), state: session.state });
  }
  if (switchEn && detectedLanguage !== "en") {
    detectedLanguage = "en";
    await prisma.chatSession.update({ where: { id: session.id }, data: { language: "en", languageSource: "explicit" } });
    return buildResponse({ text: "Sure! ARIA here — I'll continue in English. Tell me about your business.", detectedLanguage: "en", quickActions: getQuickActions("en"), state: session.state });
  }

  if (text.match(/^(are you real|who are you|are you human|tell me about yourself|kya aap real hain|aap kon ho)\b/i)) {
    return buildResponse({
      text: {
        en: "I'm ARIA — MistHustlers' virtual Senior Sales Consultant. I'm designed to understand your requirements, recommend verified solutions, and connect you with the team when human review is needed. I'm not a human, but I'm here to have a practical conversation about your business.",
        hi: "Main ARIA hoon — MistHustlers ki virtual Senior Sales Consultant. Main aapki zarooraton ko samajhne, verified solutions recommend karne aur jab human review ki zaroorat ho to aapko team se connect karne ke liye design ki gayi hoon. Main human nahi hoon, lekin aapke business ke baare mein practical baat karne ke liye yahan hoon.",
        hiEn: "Main ARIA hoon — MistHustlers ki virtual Senior Sales Consultant. Main aapki zarooraton ko samajhne, verified solutions recommend karne aur jab human review ki zaroorat ho to aapko team se connect karne ke liye design ki gayi hoon.",
      }[detectedLanguage],
      detectedLanguage, quickActions: getQuickActions(detectedLanguage), state: session.state,
    });
  }

  const langF = getLang(detectedLanguage);

  if (![STATES.CONTACT, STATES.CLOSE].includes(state) && isConversationQuestion(text)) {
    const knowledge = isVerifiedKnowledgeQuestion(text) ? await searchVerifiedKnowledge(text, 4).catch(() => []) : [];
    if (knowledge.length) {
      stateData.knowledgeHistory = [
        ...(Array.isArray(stateData.knowledgeHistory) ? stateData.knowledgeHistory : []),
        ...knowledge.map((item) => item.key),
      ].slice(-12);
      stateData.lastQuestion = text;
      await prisma.chatSession.update({
        where: { id: session.id },
        data: { stateData: createStateData(stateData), language: langF },
      });
      return buildResponse({
        text: buildVerifiedKnowledgeAnswer(knowledge, state, langF, config?.responseTone, config?.salesInstructions),
        detectedLanguage: langF,
        state,
      });
    }
    return buildResponse({
      text: whatsappInquiryFallback(langF, config),
      detectedLanguage: langF,
      state,
    });
  }

  switch (state) {
    case STATES.GREETING: {
      const selectedService = detectServiceChoice(text);
      if (selectedService) {
        stateData.serviceInterest = selectedService;
        stateData.selectedService = selectedService;
      }
      const greeting = selectedService
        ? {
            en: `Great, you've selected **${selectedService}**. I'll tailor it to your business instead of giving you a generic package. What does your business do, and who are your main customers?`,
            hi: `Aapne **${selectedService}** select kiya hai. Main generic package ke bajay ise aapke business ke hisaab se tailor karungi. Aapka business kya karta hai aur main customers kaun hain?`,
            hiEn: `Great, aapne **${selectedService}** select kiya hai. Main generic package ke bajay ise aapke business ke hisaab se tailor karungi. Aapka business kya karta hai aur main customers kaun hain?`,
          }[langF]
        : getGreeting(langF, config);
      await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.DISCOVER_BUSINESS, stateData: createStateData(stateData) } });
      return buildResponse({
        text: greeting,
        detectedLanguage: langF,
        quickActions: getQuickActions(langF),
        nextExpectedField: "businessType",
        state: STATES.DISCOVER_BUSINESS,
      });
    }

    case STATES.DISCOVER_BUSINESS: {
      const selectedService = detectServiceChoice(text);
      if (selectedService && isServiceSelectionMessage(text)) {
        stateData.serviceInterest = selectedService;
        stateData.selectedService = selectedService;
        await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.DISCOVER_BUSINESS, stateData: createStateData(stateData) } });
        return buildResponse({
          text: {
            en: `Great, **${selectedService}** is selected. ARIA is now switching from Sales Consultant to Solution Consultant. What does your business do, and who are your main customers?`,
            hi: `Great, **${selectedService}** select ho gaya hai. ARIA ab Sales Consultant se Solution Consultant role mein switch kar rahi hai. Aapka business kya karta hai aur main customers kaun hain?`,
            hiEn: `Great, **${selectedService}** select ho gaya hai. ARIA ab Sales Consultant se Solution Consultant role mein switch kar rahi hai. Aapka business kya karta hai aur main customers kaun hain?`,
          }[langF],
          detectedLanguage: langF,
          nextExpectedField: "businessType",
          state: STATES.DISCOVER_BUSINESS,
        });
      }
      stateData.businessType = text;
      const explicitService = selectedService;
      if (explicitService) {
        stateData.serviceInterest = explicitService;
        stateData.selectedService = explicitService;
      }

      if (isComplexRoute(text)) {
        await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.CLOSE, stateData: createStateData(stateData) } });
        return buildResponse({
          text: {
            en: "Your requirements sound like they need a custom approach — e-commerce platforms, marketplaces, mobile apps and advanced systems. I'll connect you directly with our technical team who can discuss your specific needs in detail.",
            hi: "Aapki requirements custom approach ki demand karti hain — e-commerce platforms, marketplaces, mobile apps aur advanced systems. Main aapko directly humari technical team se connect kar dungi jo aapki specific zarooraton par detail mein discuss kar sakti hai.",
            hiEn: "Aapki requirements custom approach ki demand karti hain. Main aapko directly humari technical team se connect kar dungi.",
          }[langF],
          detectedLanguage: langF,
          nextExpectedField: "consent",
          handoffAvailable: true,
          state: STATES.CLOSE,
        });
      }

      await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.DISCOVER_CURRENT, stateData: createStateData(stateData) } });

      const awareness = assessAwareness(stateData);
      const dq = DISCOVERY_QUESTIONS.hasWebsite;
      let optionsText = "";
      if (dq.options) {
        optionsText = "\n\n" + dq.options[langF]?.map((o, i) => `${i + 1}. ${o}`).join("\n") || "";
      }

      return buildResponse({
        text: dq.text[langF] + optionsText,
        detectedLanguage: langF,
        nextExpectedField: "hasWebsite",
        state: STATES.DISCOVER_CURRENT,
      });
    }

    case STATES.DISCOVER_CURRENT: {
      stateData.hasWebsite = text;
      const lower = text.toLowerCase();

      if (lower.includes("no") || lower.includes("nahi") || lower.includes("नहीं") || lower.includes("only social") || lower.includes("sirf")) {
        stateData.hasWebsite = lower.includes("social") || lower.includes("instagram") ? "social" : "no";
        await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.DIAGNOSE_WEBSITE, stateData: createStateData(stateData) } });
        const q = DISCOVERY_QUESTIONS.noWebsite;
        return buildResponse({
          text: q.text[langF],
          detectedLanguage: langF,
          nextExpectedField: "discovery_noWebsite",
          state: STATES.DIAGNOSE_WEBSITE,
        });
      }

      if (lower.includes("outdated") || lower.includes("purani") || lower.includes("पुरानी")) {
        stateData.hasWebsite = "outdated";
        await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.DIAGNOSE_OUTDATED, stateData: createStateData(stateData) } });
        const q = DISCOVERY_QUESTIONS.outdated;
        return buildResponse({
          text: q.text[langF],
          detectedLanguage: langF,
          nextExpectedField: "discovery_outdated",
          state: STATES.DIAGNOSE_OUTDATED,
        });
      }

      stateData.hasWebsite = "yes";
      await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.DIAGNOSE_MANUAL, stateData: createStateData(stateData) } });
      const q = DISCOVERY_QUESTIONS.manualWork;
      return buildResponse({
        text: q.text[langF],
        detectedLanguage: langF,
        nextExpectedField: "discovery_manual",
        state: STATES.DIAGNOSE_MANUAL,
      });
    }

    case STATES.DIAGNOSE_WEBSITE: {
      stateData._diagnosisNotes = text;

      if (stateData.hasWebsite === "social") {
        await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.DIAGNOSE_INSTAGRAM, stateData: createStateData(stateData) } });
        return buildResponse({
          text: DISCOVERY_QUESTIONS.instagram.text[langF],
          detectedLanguage: langF,
          nextExpectedField: "discovery_instagram",
          state: STATES.DIAGNOSE_INSTAGRAM,
        });
      }

      stateData._diagnosisSummary = "customer journey mein structured information ka gap hai jo manual enquiry par dependent hai";
      stateData._diagnosisType = "noWebsite";

      const reflect = REFLECTION_TEMPLATES.noWebsite;
      const impact = buildImpactStatement("noWebsite", langF);
      await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.REFLECT, stateData: createStateData(stateData) } });

      return buildResponse({
        text: `${reflect[langF]}\n\n${impact ? "💡 " + impact : ""}`,
        detectedLanguage: langF,
        nextExpectedField: "confirmation",
        state: STATES.REFLECT,
      });
    }

    case STATES.DIAGNOSE_INSTAGRAM: {
      stateData._diagnosisSummary = "traffic source single platform par dependent hai aur structured conversion system available nahi hai";
      stateData._diagnosisType = "instagram";
      const reflect = REFLECTION_TEMPLATES.instagram;
      const impact = buildImpactStatement("instagram", langF);
      await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.REFLECT, stateData: createStateData(stateData) } });
      return buildResponse({
        text: `${reflect[langF]}\n\n${impact ? "💡 " + impact : ""}`,
        detectedLanguage: langF,
        nextExpectedField: "confirmation",
        state: STATES.REFLECT,
      });
    }

    case STATES.DIAGNOSE_OUTDATED: {
      stateData._diagnosisSummary = "website online hai lekin actively sales asset ki tarah perform nahi kar rahi";
      stateData._diagnosisType = "outdated";
      const reflect = REFLECTION_TEMPLATES.outdated;
      const impact = buildImpactStatement("outdated", langF);
      await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.REFLECT, stateData: createStateData(stateData) } });
      return buildResponse({
        text: `${reflect[langF]}\n\n${impact ? "💡 " + impact : ""}`,
        detectedLanguage: langF,
        nextExpectedField: "confirmation",
        state: STATES.REFLECT,
      });
    }

    case STATES.DIAGNOSE_MANUAL: {
      stateData.needsAutomation = "yes";
      stateData._diagnosisSummary = "repetitive manual tasks employee availability par dependent hain aur process mein delay ho sakta hai";
      stateData._diagnosisType = "manual";
      const reflect = REFLECTION_TEMPLATES.manual;
      const impact = buildImpactStatement("manual", langF);
      await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.REFLECT, stateData: createStateData(stateData) } });
      return buildResponse({
        text: `${reflect[langF]}\n\n${impact ? "💡 " + impact : ""}`,
        detectedLanguage: langF,
        nextExpectedField: "confirmation",
        state: STATES.REFLECT,
      });
    }

    case STATES.REFLECT: {
      const lower = text.toLowerCase();
      const affirmative = /^(yes|haan|hah|हाँ|हां|theek|sahi|accurate|bilkul|zaroor|yes correct|yes sahi|yes right|right|correct|yeah|yep|ha|yes yes)\b/i;

      if (affirmative.test(text) || lower.includes("yes") || lower.includes("haan") || lower.includes("right") || lower.includes("correct") || lower.includes("sahi")) {
        stateData.reflectionConfirmed = true;
        stateData.awarenessLevel = "problem_aware";

        await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.DISCOVER_GOAL, stateData: createStateData(stateData) } });

        const dq = DISCOVERY_QUESTIONS.goal;
        let optText = "";
        if (dq.options) {
          optText = "\n\n" + dq.options[langF]?.map((o, i) => `${i + 1}. ${o}`).join("\n") || "";
        }

        return buildResponse({
          text: {
            en: "Thank you for confirming. Now that we've identified the gap, let's understand what you want to achieve. " + dq.text[langF] + optText,
            hi: "पुष्टि करने के लिए धन्यवाद। अब जब हमने gap पहचान लिया है, समझते हैं कि आप क्या हासिल करना चाहते हैं। " + dq.text[langF] + optText,
            hiEn: "Confirmation ke liye dhanyavaad. Ab jab humne gap pehchan liya hai, samajhte hain ki aap kya achieve karna chahte hain. " + dq.text[langF] + optText,
          }[langF],
          detectedLanguage: langF,
          nextExpectedField: "goal",
          state: STATES.DISCOVER_GOAL,
        });
      }

      if (lower.includes("no") || lower.includes("nahi") || lower.includes("नहीं") || lower.includes("galat") || lower.includes("wrong") || lower.includes("not") || lower.includes("partially")) {
        stateData.reflectionConfirmed = false;
        await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.DISCOVER_GOAL, stateData: createStateData(stateData) } });
        return buildResponse({
          text: {
            en: "I appreciate the correction. Let me understand your situation better. What's the main goal you want to achieve through this project?",
            hi: "सुधार के लिए शुक्रिया। मैं आपकी स्थिति को बेहतर समझना चाहूँगी। आप इस प्रोजेक्ट के माध्यम से मुख्य रूप से क्या हासिल करना चाहते हैं?",
            hiEn: "Sudhaar ke liye shukriya. Main aapki sthiti ko behtar samajhna chahungi. Aap is project ke through mainly kya achieve karna chahte hain?",
          }[langF],
          detectedLanguage: langF,
          nextExpectedField: "goal",
          state: STATES.DISCOVER_GOAL,
        });
      }

      return buildResponse({
        text: {
          en: "I'll rephrase — does my understanding match your situation, or would you like to clarify something? (Yes/No/Correct)",
          hi: "Main doosre shabdon mein kahun — kya mera assessment aapki sthiti se match karta hai, ya aap kuch clarify karna chahenge? (हाँ/नहीं/सही)",
          hiEn: "Main doosre shabdon mein kahun — kya mera assessment aapki sthiti se match karta hai, ya aap kuch clarify karna chahenge? (Haan/Nahi/Sahi)",
        }[langF],
        detectedLanguage: langF,
        nextExpectedField: "confirmation",
        state: STATES.REFLECT,
      });
    }

    case STATES.DISCOVER_GOAL: {
      stateData.goal = text;
      await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.DISCOVER_OBSTACLE, stateData: createStateData(stateData) } });
      return buildResponse({
        text: DISCOVERY_QUESTIONS.obstacles.text[langF],
        detectedLanguage: langF,
        nextExpectedField: "obstacle",
        state: STATES.DISCOVER_OBSTACLE,
      });
    }

    case STATES.DISCOVER_OBSTACLE: {
      stateData.mainObstacle = text;
      stateData.awarenessLevel = "solution_aware";

      await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.DISCOVER_GOAL, stateData: createStateData(stateData) } });

      const needsFields = ["needsBooking", "needsPayment", "currentSoftware", "features", "budget", "timeline", "decisionMaker"];
      const nextField = needsFields.find((f) => !stateData[f]);

      if (!nextField) {
        const plans = await getServicePlans();
        const planData = parsePlans(plans);
        const rec = generateRecommendation(stateData, planData, langF);
        stateData.recommendedPlan = rec.plan;
        stateData.alternativePlan = rec.alternative;
        await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.PRESENT_SOLUTION, stateData: createStateData(stateData) } });
        return buildResponse({
          text: rec.text, detectedLanguage: langF,
          quickActions: [{ id: "proceed", label: { en: "Proceed", hi: "आगे बढ़ें", hiEn: "Aage badhein" }[langF] }, { id: "talk", label: { en: "Talk to Team", hi: "टीम से बात", hiEn: "Team se baat" }[langF] }],
          recommendationCard: rec.card, handoffAvailable: true, state: STATES.PRESENT_SOLUTION,
        });
      }

      const questionKey = nextField === "features" ? "features"
        : nextField === "budget" ? "budget"
        : nextField === "timeline" ? "timeline"
        : nextField === "decisionMaker" ? "decisionMaker"
        : nextField === "needsBooking" ? "needsBooking"
        : nextField === "needsPayment" ? "needsPayment"
        : "currentSoftware";

      const dq = DISCOVERY_QUESTIONS[questionKey];
      if (dq) {
        let optText = "";
        if (dq.options) {
          optText = "\n\n" + dq.options[langF]?.map((o, i) => `${i + 1}. ${o}`).join("\n") || "";
        }
        return buildResponse({
          text: dq.text[langF] + optText,
          detectedLanguage: langF,
          nextExpectedField: nextField,
          state: STATES.DISCOVER_OBSTACLE,
        });
      }

      const plans = await getServicePlans();
      const planData = parsePlans(plans);
      const rec = generateRecommendation(stateData, planData, langF);
      stateData.recommendedPlan = rec.plan;
      stateData.alternativePlan = rec.alternative;
      await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.PRESENT_SOLUTION, stateData: createStateData(stateData) } });
      return buildResponse({
        text: rec.text, detectedLanguage: langF,
        quickActions: [{ id: "proceed", label: { en: "Proceed", hi: "आगे बढ़ें", hiEn: "Aage badhein" }[langF] }, { id: "talk", label: { en: "Talk to Team", hi: "टीम से बात", hiEn: "Team se baat" }[langF] }],
        recommendationCard: rec.card, handoffAvailable: true, state: STATES.PRESENT_SOLUTION,
      });
    }

    case STATES.PRESENT_SOLUTION: {
      const lower = text.toLowerCase();
      if (lower.includes("proceed") || lower.includes("aage") || lower.includes("आगे") || lower.includes("yes") || lower.includes("haan") || lower.includes("हाँ") || lower.includes("start") || lower.includes("shuru") || lower.includes("ready")) {
        await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.CLOSE, stateData: createStateData(stateData) } });
        return buildResponse({
          text: {
            en: "Before we continue: may I securely store your name, email and phone so the MistHustlers team can contact you about this requirement? Reply yes to consent.",
            hi: "आगे बढ़ने से पहले: क्या मैं आपका नाम, ईमेल और फोन सुरक्षित रूप से सेव कर सकती हूँ ताकि MistHustlers team इस requirement के बारे में आपसे संपर्क कर सके? सहमति के लिए हाँ लिखें।",
            hiEn: "Aage badhne se pehle: kya main aapka naam, email aur phone securely save kar sakti hoon taaki MistHustlers team is requirement ke baare mein aapse contact kar sake? Consent ke liye haan likhein.",
          }[langF],
          detectedLanguage: langF, nextExpectedField: "consent", state: STATES.CLOSE,
        });
      }
      if (lower.includes("talk") || lower.includes("team") || lower.includes("baat") || lower.includes("बात")) {
        await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.CLOSE, stateData: createStateData(stateData) } });
        return buildResponse({
          text: {
            en: "Absolutely. May I securely store your name, email and phone so the team can contact you? Reply yes to consent.",
            hi: "बिल्कुल। क्या मैं आपका नाम, ईमेल और फोन सुरक्षित रूप से सेव कर सकती हूँ ताकि team आपसे संपर्क कर सके? सहमति के लिए हाँ लिखें।",
            hiEn: "Bilkul. Kya main aapka naam, email aur phone securely save kar sakti hoon taaki team aapse contact kar sake? Consent ke liye haan likhein.",
          }[langF],
          detectedLanguage: langF, nextExpectedField: "consent", handoffAvailable: true, state: STATES.CLOSE,
        });
      }
      if (lower.includes("cost") || lower.includes("price") || lower.includes("kitna") || lower.includes("कितना") || lower.includes("budget") || lower.includes("afford")) {
        const plans = await getServicePlans();
        const planData = parsePlans(plans);
        const rec = generateRecommendation(stateData, planData, langF);
        return buildResponse({
          text: {
            en: `The verified investment for the recommended **${rec.plan?.name || "plan"}** is **${rec.plan?.price || "Contact for pricing"}**. Would you like to proceed with this, or discuss with the team first?`,
            hi: `Recommended **${rec.plan?.name || "plan"}** ka verified investment **${rec.plan?.price || "Contact for pricing"}** hai. Kya aap iske saath aage badhna chahenge ya pehle team se discuss karna chahenge?`,
            hiEn: `Recommended **${rec.plan?.name || "plan"}** ka verified investment **${rec.plan?.price || "Contact for pricing"}** hai. Kya aap iske saath aage badhna chahenge ya pehle team se discuss karna chahenge?`,
          }[langF],
          detectedLanguage: langF,
          quickActions: [{ id: "proceed", label: { en: "Proceed", hi: "आगे बढ़ें", hiEn: "Aage badhein" }[langF] }, { id: "talk", label: { en: "Talk to Team", hi: "टीम से बात", hiEn: "Team se baat" }[langF] }],
          handoffAvailable: true, state: STATES.PRESENT_SOLUTION,
        });
      }
      if (lower.includes("think") || lower.includes("soch") || lower.includes("सोच") || lower.includes("later") || lower.includes("baad") || lower.includes("बाद") || lower.includes("need time") || lower.includes("decision")) {
        return buildResponse({
          text: {
            en: "Of course. May I ask — is the clarity needed around budget, scope, trust, timeline, or whether the solution is necessary?",
            hi: "Bilkul. Kya main poochh sakti hoon — clarity kis cheez par chahiye — budget, scope, trust, timeline, ya ki solution zaroori hai ya nahi?",
            hiEn: "Bilkul. Kya main poochh sakti hoon — clarity kis cheez par chahiye — budget, scope, trust, timeline, ya ki solution zaroori hai ya nahi?",
          }[langF],
          detectedLanguage: langF, nextExpectedField: "objectionType", state: STATES.HANDLE_OBJECTION,
        });
      }
      return buildResponse({
        text: {
          en: "Would you like to proceed with this recommendation, talk to the team, or do you have any questions?",
          hi: "Kya aap is recommendation ke saath aage badhna chahenge, team se baat karna chahenge, ya koi sawaal hai?",
          hiEn: "Kya aap is recommendation ke saath aage badhna chahenge, team se baat karna chahenge, ya koi sawaal hai?",
        }[langF],
        detectedLanguage: langF,
        quickActions: [{ id: "proceed", label: { en: "Proceed", hi: "आगे बढ़ें", hiEn: "Aage badhein" }[langF] }, { id: "talk", label: { en: "Talk to Team", hi: "टीम से बात", hiEn: "Team se baat" }[langF] }],
        handoffAvailable: true, state: STATES.PRESENT_SOLUTION,
      });
    }

    case STATES.HANDLE_OBJECTION: {
      stateData.objectionType = text;
      await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.PRESENT_SOLUTION, stateData: createStateData(stateData) } });
      return buildResponse({
        text: {
          en: "I understand. Let me clarify — you now have a clear understanding of the current gap and a verified solution that fits your situation. I'm not here to push a decision. May I prepare a structured summary that you can keep on WhatsApp and review at your convenience?",
          hi: "Main samajh gayi. Aapke paas ab current gap ki clear understanding hai aur ek verified solution hai jo aapki situation ke liye suitable hai. Main decision push nahi kar rahi. Kya main ek structured summary prepare karun jo aap WhatsApp par rakh sakte hain aur apni convenience par review kar sakte hain?",
          hiEn: "Main samajh gayi. Aapke paas ab current gap ki clear understanding hai aur ek verified solution hai jo suitable hai. Kya main ek structured summary prepare karun jo aap WhatsApp par rakh sakte hain?",
        }[langF],
        detectedLanguage: langF, nextExpectedField: "consent", handoffAvailable: true, state: STATES.CLOSE,
      });
    }

    case STATES.CLOSE: {
      const lower = text.toLowerCase();
      const affirmative = /^(yes|haan|hah|हाँ|हां|theek|ok|sure|bilkul|zaroor|okay|fine)\b/i;
      if (affirmative.test(text) || lower.includes("yes") || lower.includes("haan") || lower.includes("ok") || lower.includes("sure")) {
        stateData.consentGiven = true;
        stateData.consentAt = new Date().toISOString();
        await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.CONTACT, stateData: createStateData(stateData) } });
        return buildResponse({
          text: { en: "Perfect. What's your name?", hi: "बहुत अच्छा। आपका नाम क्या है?", hiEn: "Bahut achha. Aapka naam kya hai?" }[langF],
          detectedLanguage: langF, nextExpectedField: "name", state: STATES.CONTACT,
        });
      }
      return buildResponse({
        text: { en: "No pressure at all. You can always come back and continue. Feel free to explore our services on the website.", hi: "Bilkul pressure nahi hai. Kabhi bhi wapas aa sakte hain. Website par humari services explore kar sakte hain.", hiEn: "Bilkul pressure nahi hai. Kabhi bhi wapas aa sakte hain. Website par humari services explore kar sakte hain." }[langF],
        detectedLanguage: langF, quickActions: getQuickActions(langF), state: STATES.COMPLETE,
      });
    }

    case STATES.CONTACT: {
      return await handleContactInput(session, stateData, text, langF);
    }

    case STATES.COMPLETE: {
      return buildResponse({
        text: { en: "ARIA here. Whenever you're ready, just say 'start' and we can pick up where we left off.", hi: "ARIA yahan hai. Jab bhi ready hon, bas 'start' bolein aur hum wahin se shuru karenge jahan chhoda tha.", hiEn: "ARIA yahan hai. Jab bhi ready hon, bas 'start' bolein aur hum wahin se shuru karenge." }[langF],
        detectedLanguage: langF, quickActions: getQuickActions(langF), handoffAvailable: true, state: STATES.COMPLETE,
      });
    }

    default: {
      await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.GREETING } });
      return buildResponse({
        text: getGreeting(langF, config),
        detectedLanguage: langF,
        quickActions: getQuickActions(langF),
        state: STATES.DISCOVER_BUSINESS,
      });
    }
  }
}

async function handleContactInput(session, stateData, text, lang) {
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const normalizePhone = (value) => {
    const raw = String(value || "").trim();
    if (!/^\+?[0-9\s()-]+$/.test(raw)) return null;
    const digits = raw.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15 ? `+${digits}` : null;
  };

  if (!stateData._contactName) {
    const name = safeText(text, 120);
    if (name.length < 2 || /@|https?:|\d{6,}/i.test(name)) {
      return buildResponse({
        text: { en: "Please share your name so the team knows how to address you.", hi: "Kripya apna naam batayein taaki team aapko sahi tarah address kar sake.", hiEn: "Kripya apna naam batayein taaki team aapko sahi tarah address kar sake." }[lang],
        detectedLanguage: lang, nextExpectedField: "name", state: STATES.CONTACT,
      });
    }
    stateData._contactName = name;
    await prisma.chatSession.update({ where: { id: session.id }, data: { stateData: createStateData(stateData) } });
    return buildResponse({
      text: { en: "Thanks. And your email address?", hi: "Shukriya. Aur aapka email address?", hiEn: "Shukriya. Aur aapka email address?" }[lang],
      detectedLanguage: lang, nextExpectedField: "email", state: STATES.CONTACT,
    });
  }

  if (!stateData._contactEmail) {
    const emailMatch = text.match(emailPattern);
    if (!emailMatch) {
      return buildResponse({
        text: { en: "That doesn't look like a valid email. Could you share a working one?", hi: "Yeh valid email nahi lagta. Kripya ek kaam ka email dein.", hiEn: "Yeh valid email nahi lagta. Kripya ek kaam ka email dein." }[lang],
        detectedLanguage: lang, nextExpectedField: "email", state: STATES.CONTACT,
      });
    }
    stateData._contactEmail = emailMatch[1];
    await prisma.chatSession.update({ where: { id: session.id }, data: { stateData: createStateData(stateData) } });
    return buildResponse({
      text: { en: "And your phone number (with country code)?", hi: "Aur aapka phone number (country code ke saath)?", hiEn: "Aur aapka phone number (country code ke saath)?" }[lang],
      detectedLanguage: lang, nextExpectedField: "phone", state: STATES.CONTACT,
    });
  }

  if (!stateData._contactPhone) {
    const normalizedPhone = normalizePhone(text);
    if (normalizedPhone) stateData._contactPhone = normalizedPhone;
    else {
      return buildResponse({
        text: { en: "Please share a valid number so the team can reach you.", hi: "Kripya ek valid number dein taaki team aapse sampark kar sake.", hiEn: "Kripya ek valid number dein taaki team aapse sampark kar sake." }[lang],
        detectedLanguage: lang, nextExpectedField: "phone", state: STATES.CONTACT,
      });
    }

    const score = calculateLeadScore({ ...stateData, name: stateData._contactName, email: stateData._contactEmail, phone: stateData._contactPhone, consentGiven: true, goal: stateData.goal, budget: stateData.budget, features: stateData.features });

    const existingLead = await prisma.qualifiedLead.findUnique({ where: { sessionId: session.id } });
    if (existingLead) {
      await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.COMPLETE, leadId: existingLead.id } });
      return buildResponse({
        text: { en: "Your details are already saved. You can continue with the team on WhatsApp.", hi: "Aapki details pehle se save hain. Aap WhatsApp par team se baat continue kar sakte hain.", hiEn: "Aapki details pehle se save hain. Aap WhatsApp par team se baat continue kar sakte hain." }[lang],
        detectedLanguage: lang, handoffAvailable: true, state: STATES.COMPLETE,
      });
    }

    const lead = await prisma.qualifiedLead.create({
      data: {
        sessionId: session.id,
        name: stateData._contactName, email: stateData._contactEmail, phone: stateData._contactPhone,
        company: null, businessType: stateData.businessType, industry: stateData.businessType,
        goal: stateData.goal, budget: stateData.budget, timeline: stateData.timeline,
        serviceInterest: stateData.serviceInterest, features: stateData.features,
        leadScore: score.score, leadCategory: score.category, consentGiven: true, consentAt: new Date(), status: "new",
        notes: stateData._diagnosisSummary || null,
      },
    });

    await prisma.chatSession.update({ where: { id: session.id }, data: { state: STATES.COMPLETE, stateData: createStateData(stateData), leadId: lead.id } });

    const contactInfo = await getContactInfo().catch(() => []);
    const responseTime = contactInfo.find((item) => item.key === "contact.responseTime")?.value || "within 48 hours";

    return buildResponse({
      text: {
        en: `Thank you. Here's what happens next:\n1. Your details reach the MistHustlers team\n2. The team reviews your requirements and responds ${responseTime}\n3. You receive a detailed scope and quote\n\nYou can also continue directly on WhatsApp below.`,
        hi: `Shukriya. Aage kya hoga:\n1. Aapki details MistHustlers team tak pahunch jayengi\n2. Team requirements review karke ${responseTime} response karegi\n3. Aapko detailed scope aur quotation milega\n\nAap neeche WhatsApp par bhi baat continue kar sakte hain.`,
        hiEn: `Shukriya. Aage kya hoga:\n1. Aapki details MistHustlers team tak pahunch jayengi\n2. Team requirements review karke ${responseTime} response karegi\n3. Aapko detailed scope aur quotation milega\n\nAap neeche WhatsApp par bhi baat continue kar sakte hain.`,
      }[lang],
      detectedLanguage: lang, quickActions: getQuickActions(lang), handoffAvailable: true, state: STATES.COMPLETE, leadCreatedId: lead.id,
    });
  }

  return buildResponse({
    text: { en: "We've got your details. The team will reach out soon. Anything else you'd like to know?", hi: "Aapki details mil gayi hain. Team jald contact karegi. Kuch aur janna chahenge?", hiEn: "Aapki details mil gayi hain. Team jald contact karegi. Kuch aur janna chahenge?" }[lang],
    detectedLanguage: lang, quickActions: getQuickActions(lang), state: STATES.COMPLETE,
  });
}

export {
  handleMessage, detectLanguage, generateToken, calculateLeadScore, buildWhatsAppSummary,
  getGreeting, getQuickActions, getServicePlans, getFAQs, getContactInfo, getKnowledgeByCategory,
  STATES, createStateData, absorbStructuredDetails, buildResponse,
};
