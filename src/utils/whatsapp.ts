export type ServiceInquiryFormData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  website?: string;
  timeline?: string;
  preferredContact?: string;
};

export function formatIndianWhatsappPhone(phone: string): string {
  const digits = String(phone || "").replace(/[^0-9]/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith("0091") && digits.length >= 14) return digits.slice(2);
  if (digits.startsWith("91") && digits.length >= 12) return digits;
  return digits;
}

export function buildWhatsAppUrl(phone: string, message: string, fallbackPhone = "919999999999") {
  const formatted = formatIndianWhatsappPhone(phone);
  const targetPhone = formatted || fallbackPhone;
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

export function buildServiceInquiryWhatsAppMessage(data: ServiceInquiryFormData) {
  return [
    "🚀 NEW SERVICE INQUIRY",
    "",
    `👤 Name: ${data.name || "-"}`,
    "",
    `🏢 Company:\n${data.company || "-"}`,
    "",
    `📧 Email:\n${data.email || "-"}`,
    "",
    `📱 Phone:\n${data.phone || "-"}`,
    "",
    `🌐 Website:\n${data.website || "-"}`,
    "",
    `🛠 Service Required:\n${data.service || "-"}`,
    "",
    `💰 Budget:\n${data.budget || "-"}`,
    "",
    `⏳ Timeline:\n${data.timeline || "-"}`,
    "",
    `📞 Preferred Contact:\n${data.preferredContact || "-"}`,
    "",
    `📝 Project Details:\n${data.message || "-"}`,
    "",
    "━━━━━━━━━━━━━━━━━━",
    "Sent from MistHustlers Website",
  ].join("\n");
}
