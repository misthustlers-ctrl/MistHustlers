import { describe, expect, it } from "vitest";
import { buildServiceInquiryWhatsAppMessage, buildWhatsAppUrl, formatIndianWhatsappPhone } from "./whatsapp";

describe("WhatsApp utilities", () => {
  it("formats Indian phone numbers correctly", () => {
    expect(formatIndianWhatsappPhone("8889937648")).toBe("918889937648");
    expect(formatIndianWhatsappPhone("919999999999")).toBe("919999999999");
    expect(formatIndianWhatsappPhone("+91 88899 37648")).toBe("918889937648");
    expect(formatIndianWhatsappPhone("0091-8889937648")).toBe("918889937648");
    expect(formatIndianWhatsappPhone("12345")).toBe("12345");
  });

  it("builds a WhatsApp URL with encoded message and fallback phone", () => {
    const url = buildWhatsAppUrl("8889937648", "Hello world", "919111111111");
    expect(url).toBe("https://wa.me/918889937648?text=Hello%20world");

    const fallbackUrl = buildWhatsAppUrl("", "Hi there", "919111111111");
    expect(fallbackUrl).toBe("https://wa.me/919111111111?text=Hi%20there");
  });

  it("builds the service inquiry WhatsApp message with all fields", () => {
    const message = buildServiceInquiryWhatsAppMessage({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "8889937648",
      company: "MistHustlers",
      service: "growth",
      budget: "₹50,000",
      message: "I need a website.",
      website: "https://example.com",
      timeline: "2 weeks",
      preferredContact: "WhatsApp",
    });

    expect(message).toContain("NEW SERVICE INQUIRY");
    expect(message).toContain("Jane Doe");
    expect(message).toContain("https://example.com");
    expect(message).toContain("WhatsApp");
  });
});
