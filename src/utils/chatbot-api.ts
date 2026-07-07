const API = "/api/chatbot";

export interface ChatResponse {
  success: boolean;
  message?: string;
  token?: string;
  detectedLanguage?: string;
  quickActions?: Array<{ id: string; label: string }>;
  recommendationCard?: {
    planName: string;
    price: string;
    delivery: string;
    inclusions: string[];
    exclusions?: string[];
    score?: number;
    category?: string;
    alternativeName?: string | null;
  } | null;
  state?: string;
  nextExpectedField?: string | null;
  handoffAvailable?: boolean;
  handoffReady?: boolean;
  consultantRole?: "sales_consultant" | "solution_consultant";
  messages?: Array<{ id: string; role: "user" | "bot"; content: string; detectedLanguage?: string; createdAt: string }>;
}

async function parseResponse(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || "Request failed"), { status: res.status });
  return data;
}

export async function getConfig() {
  const res = await fetch(`${API}/config`);
  const config = await parseResponse(res);
  if (typeof config?.enabled !== "boolean") {
    throw new Error("Chatbot configuration is unavailable");
  }
  return config;
}

export async function createSession(language?: string): Promise<ChatResponse> {
  const res = await fetch(`${API}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language }),
  });
  return parseResponse(res);
}

export async function resumeSession(token: string): Promise<ChatResponse> {
  const res = await fetch(`${API}/session/${encodeURIComponent(token)}`);
  return parseResponse(res);
}

export async function sendMessage(token: string, message: string): Promise<ChatResponse> {
  const res = await fetch(`${API}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, message }),
  });
  return parseResponse(res);
}

export async function getRecommendation(token: string) {
  const res = await fetch(`${API}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return res.json();
}

export async function submitLead(token: string, data: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  consent: boolean;
}) {
  const res = await fetch(`${API}/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, ...data }),
  });
  return res.json();
}

export async function handoff(token: string) {
  const res = await fetch(`${API}/handoff`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return parseResponse(res);
}

export async function deleteSession(token: string) {
  const res = await fetch(`${API}/session/${token}`, { method: "DELETE" });
  return parseResponse(res);
}
