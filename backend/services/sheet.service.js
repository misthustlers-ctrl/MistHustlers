function buildInquiryPayload(inquiry) {
  return {
    id: inquiry.id,
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    company: inquiry.company || "",
    service: inquiry.service,
    budget: inquiry.budget,
    message: inquiry.message,
    status: inquiry.status,
    emailStatus: inquiry.emailStatus,
    createdAt: inquiry.createdAt,
    source: "MistHustlers Website",
  };
}

export function getSheetIntegrationStatus() {
  return {
    configured: Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL),
    mode: process.env.GOOGLE_SHEETS_WEBHOOK_URL ? "webhook" : "not-configured",
  };
}

export async function syncInquiryToSheet(inquiry) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    return { status: "skipped", error: "GOOGLE_SHEETS_WEBHOOK_URL is not configured" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildInquiryPayload(inquiry)),
      signal: controller.signal,
    });
    const body = await response.text().catch(() => "");
    if (!response.ok) {
      throw new Error(`Sheet webhook returned ${response.status}${body ? `: ${body.slice(0, 180)}` : ""}`);
    }
    return { status: "sent", error: null };
  } catch (err) {
    return {
      status: "failed",
      error: err instanceof Error ? err.message.slice(0, 500) : "Sheet sync failed",
    };
  } finally {
    clearTimeout(timeout);
  }
}
