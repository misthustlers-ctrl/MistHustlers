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

function getServiceLabel(serviceId: string): string {
  const labels: Record<string, string> = {
    "mobile-app-mvp": "Mobile App MVP",
    "mvp-starter": "Web MVP Starter",
    "mvp-launch": "MVP Launch",
    "saas-platform": "SaaS / Custom Web Application",
    "saas-advanced": "Advanced SaaS / Platform",
    "web-development": "Web Development",
    "custom-web-development": "Custom Web Development",
    "web-application-development": "Web Application Development",
    "ecommerce-development": "Ecommerce Development",
    "website-redesign": "Website Redesign",
    "automation-basic": "Basic Automation",
    "automation-business": "Business Automation",
    "automation-ai": "AI Automation",
    "automation-advanced": "Advanced AI Agent / Workflow",
    "ai-development": "AI Development",
    "custom-web-development": "Custom Web Development",
    "web-application-development": "Web Application Development",
    "ecommerce-development": "Ecommerce Development",
    "website-redesign": "Website Redesign",
    "saas-development": "SaaS Development",
    "ai-development": "AI Development",
    "automation": "AI & Workflow Automation",
    "crm-development": "CRM & Dashboard Development",
    "ui-ux": "UI/UX Design",
    "maintenance": "Maintenance & Support",
  };
  return labels[serviceId] || serviceId;
}

export function buildServiceInquiryWhatsAppMessage(data: ServiceInquiryFormData) {
  const serviceLabel = getServiceLabel(data.service);
  return [
    "Hi MistHustlers, I'd like to discuss " + serviceLabel + ".",
    "",
    "Sent from MistHustlers Website",
  ].join("\n");
}
