import { useState, useRef, useMemo, useEffect } from "react";
import { useContent } from "@/utils/useContent";
import { usePersistentForm } from "@/utils/usePersistentForm";
import { buildServiceInquiryWhatsAppMessage, buildWhatsAppUrl } from "@/utils/whatsapp";
import { Calendar, MessageCircle, Send } from "lucide-react";

const FORM_SERVICE_DEFAULTS = { pricing: { tiers: [] } };

const FALLBACK_TIERS = [
  { id: "starter", name: "STARTER", price: "", description: "", features: [], popular: false, accent: "var(--mh-text)" as const, imageUrl: "" },
  { id: "growth", name: "GROWTH", price: "", description: "", features: [], popular: true, accent: "var(--mh-cta)" as const, imageUrl: "" },
  { id: "premium", name: "PREMIUM", price: "", description: "", features: [], popular: false, accent: "#524ae9" as const, imageUrl: "" },
];

// Step 1: Minimal fields for initial submission
const EMPTY_INQUIRY_STEP1 = {
  name: "",
  email: "",
  projectType: "",
};

// Step 2: Additional details (progressive disclosure)
const EMPTY_INQUIRY_STEP2 = {
  phone: "",
  company: "",
  service: "starter",
  budget: "",
  message: "",
  website: "",
  timeline: "",
  preferredContact: "",
};

export default function ServiceInquiryForm({ preselectedPackage }: { preselectedPackage?: string }) {
  const servicesData = useContent("services", FORM_SERVICE_DEFAULTS);
  const contact = useContent("contact", { email: "misthustlers@gmail.com", phone: "888 993 7648", phoneHref: "+918889937648" });

  const [bookingExpanded, setBookingExpanded] = useState(false);
  const bookingRef = useRef<HTMLDivElement>(null);

  const pricingTiers = useMemo(() => {
    const apiTiers = servicesData?.pricing?.tiers;
    return apiTiers?.length ? apiTiers : FALLBACK_TIERS;
  }, [servicesData]);

  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [formDataStep1, setFormDataStep1, clearDraft1] = usePersistentForm("mh:draft:project-inquiry:v1:step1", EMPTY_INQUIRY_STEP1);
  const [formDataStep2, setFormDataStep2, clearDraft2] = usePersistentForm("mh:draft:project-inquiry:v1:step2", EMPTY_INQUIRY_STEP2);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasStep1Values = formDataStep1.name || formDataStep1.email || formDataStep1.projectType;

  useEffect(() => {
    if (!preselectedPackage) return;
    const target = preselectedPackage.toLowerCase();
    const tier = pricingTiers.find(
      (t) =>
        target.includes(t.id) ||
        (t.id === "starter" && /starter|beginner|launch/.test(target)) ||
        (t.id === "growth" && /growth|popular|standard|business/.test(target)) ||
        (t.id === "premium" && /premium|pro|enterprise/.test(target))
    );
    if (tier && formDataStep2.service !== tier.id) {
      setFormDataStep2((prev) => ({ ...prev, service: tier.id }));
    }
  }, [preselectedPackage, pricingTiers]);

  const submitInquiry = async (data: typeof formDataStep1 & typeof formDataStep2) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const params = new URLSearchParams();
      params.set("form-name", "mh-project-inquiry");
      params.set("name", data.name);
      params.set("email", data.email);
      params.set("phone", data.phone);
      params.set("company", data.company);
      params.set("service", data.service);
      params.set("budget", data.budget);
      params.set("project-details", data.message);
      params.set("website", (data as any).website || "");
      params.set("timeline", (data as any).timeline || "");
      params.set("preferredContact", (data as any).preferredContact || "");

      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      setSubmitted(true);
      clearDraft1();
      clearDraft2();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDataStep1.name || !formDataStep1.email || !formDataStep1.projectType) {
      setSubmitError("Please fill in all required fields.");
      return;
    }
    setFormStep(2);
    setSubmitError("");
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const combinedData = { ...formDataStep1, ...formDataStep2 };
    if (!combinedData.message) {
      setSubmitError("Please provide project details.");
      return;
    }

    const message = buildServiceInquiryWhatsAppMessage({
      name: combinedData.name,
      email: combinedData.email,
      phone: combinedData.phone,
      company: combinedData.company,
      service: combinedData.service,
      budget: combinedData.budget,
      message: combinedData.message,
      website: (combinedData as any).website,
      timeline: (combinedData as any).timeline,
      preferredContact: (combinedData as any).preferredContact,
    });

    const waUrl = buildWhatsAppUrl(contact.phoneHref || contact.phone || "8889937648", message);

    setIsSubmitting(true);
    const toastEl = document.createElement("div");
    toastEl.textContent = "Redirecting you to WhatsApp...";
    toastEl.style.position = "fixed";
    toastEl.style.right = "20px";
    toastEl.style.top = "20px";
    toastEl.style.background = "rgba(0,0,0,0.8)";
    toastEl.style.color = "white";
    toastEl.style.padding = "12px 16px";
    toastEl.style.borderRadius = "8px";
    toastEl.style.zIndex = "99999";
    document.body.appendChild(toastEl);

    try {
      window.open(waUrl, "_blank");
    } catch (err) {
      window.location.href = waUrl;
    }

    // Keep storing inquiry in background for records
    submitInquiry({ ...formDataStep1, ...formDataStep2 });

    setTimeout(() => {
      setIsSubmitting(false);
      if (toastEl && toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
    }, 2000);
  };

  const handleBackToStep1 = () => {
    setFormStep(1);
    setSubmitError("");
  };

  const toggleBooking = () => {
    setBookingExpanded((prev) => !prev);
  };

  const projectTypeOptions = [
    { value: "web-development", label: "Custom Web Development" },
    { value: "web-application", label: "Web Application / SaaS" },
    { value: "ecommerce", label: "E-commerce Development" },
    { value: "mvp", label: "MVP / Startup Product" },
    { value: "ai-development", label: "AI Development / AI Agents" },
    { value: "automation", label: "Workflow / AI Automation" },
    { value: "website-redesign", label: "Website Redesign" },
    { value: "maintenance", label: "Maintenance & Support" },
    { value: "other", label: "Other / Not Sure" },
  ];

  return (
    <div className="max-w-[1040px] mx-auto" ref={bookingRef} data-mobile-booking aria-expanded={bookingExpanded}>
      <div className="grid gap-[40px] lg:grid-cols-[0.95fr_1.05fr] lg:gap-[88px] items-start">
        <div className="lg:sticky lg:top-[104px]">
          <div className="inline-flex items-center gap-[10px] px-[14px] h-[36px] rounded-[14px] mb-[28px] border" style={{ backgroundColor: "var(--mh-surface)", borderColor: "rgba(252, 80, 0, 0.2)" }}>
            <div className="h-[8px] w-[8px] rounded-full animate-pulse" style={{ backgroundColor: "var(--mh-cta)" }}></div>
            <span className="text-[12px] font-[700] tracking-[0.04em] uppercase" style={{ color: "var(--mh-text)" }}>Let&rsquo;s Build Something Real</span>
          </div>

          <h2 className="display text-[34px] sm:text-[44px] md:text-[52px] leading-[1.06] tracking-[-0.025em] mb-[22px] sm:mb-[28px]" style={{ color: "var(--mh-text)" }}>
            Tell us what you&rsquo;re making
          </h2>

          <p className="text-[16px] sm:text-[17px] leading-[1.65] mb-[34px] sm:mb-[44px] font-[450]" style={{ color: "rgba(7, 6, 7, 0.72)" }}>
            Share your idea, and we&rsquo;ll get back with a fixed-price proposal within 48 hours. No calls required unless you want them.
          </p>

          <div className="space-y-[22px]">
            <div className="flex items-center gap-[16px]">
              <div className="h-[48px] w-[48px] rounded-[16px] flex items-center justify-center" style={{ backgroundColor: "#fc500014", color: "var(--mh-cta)" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3.333 5L10 10.833L16.667 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3.333" y="5" width="13.333" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <div className="text-[13px] font-[600] mb-[2px]" style={{ color: "rgba(7, 6, 7, 0.55)" }}>EMAIL</div>
                <a href={`mailto:${contact.email || ""}`} className="text-[16px] font-[600] hover:underline" style={{ color: "var(--mh-text)" }}>{contact.email || "Not available"}</a>
              </div>
            </div>

            <div className="flex items-center gap-[16px]">
              <div className="h-[48px] w-[48px] rounded-[16px] flex items-center justify-center" style={{ backgroundColor: "#524ae914", color: "#524ae9" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M14.167 12.5V14.167C14.167 14.6128 13.99 15.0404 13.675 15.3554C13.36 15.6704 12.9325 15.8473 12.4867 15.8473C9.24583 15.8473 6.21083 12.8123 3.8475 10.449C1.48417 8.08566 0 5.05066 0 1.80983C0 1.364 0.176917 0.936417 0.491917 0.621417C0.806917 0.306417 1.2345 0.1295 1.68033 0.1295H3.3475C3.73917 0.1295 4.1125 0.2855 4.38917 0.562167C4.66583 0.838833 4.82183 1.21217 4.82183 1.60383C4.82183 2.108 4.90583 2.608 5.06917 3.08417C5.2325 3.56033 5.47333 4.00417 5.78333 4.39183L4.53333 5.64183C5.44833 7.241 6.759 8.55167 8.35817 9.46667L9.60817 8.21667C9.99583 8.52683 10.4397 8.76783 10.9158 8.93117C11.392 9.0945 11.892 9.1785 12.3962 9.1785C12.7878 9.1785 13.1612 9.3345 13.4378 9.61117C13.7145 9.88783 13.8705 10.2612 13.8705 10.6528V12.5H14.167Z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <div className="text-[13px] font-[600] mb-[2px]" style={{ color: "rgba(7, 6, 7, 0.55)" }}>PHONE</div>
                <a href={`tel:${(contact.phone || "").replace(/\s/g, "")}`} className="text-[16px] font-[600] hover:underline" style={{ color: "var(--mh-text)" }}>{contact.phone || "Not available"}</a>
              </div>
            </div>
          </div>

          <div className="mt-[40px] pt-[32px] border-t" style={{ borderColor: "rgba(7, 6, 7, 0.08)" }}>
            <div className="text-[12.5px] leading-[1.6] font-[500]" style={{ color: "rgba(7, 6, 7, 0.62)" }}>
              Response time: <span style={{ color: "var(--mh-text)", fontWeight: 650 }}>within 48 hours</span><br />
              All timezones. Async-first communication.
            </div>
          </div>

          {/* Calendly Booking Option */}
          <div className="mt-[32px] pt-[24px] border-t" style={{ borderColor: "rgba(7, 6, 7, 0.08)" }}>
            <div className="text-[13px] font-[600] mb-[16px]" style={{ color: "var(--mh-text)" }}>Prefer a call?</div>
            <a
              href="https://calendly.com/misthustlers/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-abyssal-ink text-white px-6 py-3 rounded-[12px] font-semibold text-sm hover:bg-digital-orange transition-colors"
            >
              <Calendar className="h-5 w-5" />
              <span>Book a 15-min Discovery Call</span>
              <Send className="h-4 w-4" />
            </a>
            <p className="mt-3 text-[12px] text-abyssal-ink/55 font-body">
              Pick a time that works for you. No sales pitch — just technical discovery.
            </p>
          </div>

          {/* WhatsApp Quick Contact */}
          <div className="mt-[16px]">
            <a
              href={`https://wa.me/${(contact.phoneHref || contact.phone || "8889937648").replace(/\s|\+/g, "")}?text=${encodeURIComponent("Hi MistHustlers, I want to discuss a project")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-500 text-white px-6 py-3 rounded-[12px] font-semibold text-sm hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[24px] sm:rounded-[32px] p-[1px] shadow-[0_32px_72px_-16px_rgba(7,6,7,0.18)]" style={{ background: "linear-gradient(180deg, rgba(7,6,7,0.12), rgba(7,6,7,0.04))" }}>
            <div className="rounded-[23px] sm:rounded-[31px] p-[22px] sm:p-[32px] md:p-[40px]" style={{ backgroundColor: "var(--mh-surface)" }}>
              <button
                type="button"
                className="booking-summary md:hidden"
                onClick={toggleBooking}
                aria-expanded={bookingExpanded}
              >
                <div className="booking-summary-text">
                  {hasStep1Values ? `${formDataStep1.name || "Inquiry"} - ${formDataStep1.projectType}` : "Project Inquiry"}
                </div>
                <div className="booking-summary-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 8l4 4 4-4" />
                  </svg>
                </div>
              </button>

              <div className="booking-form-body">
                {submitted ? (
                  <div className="py-[64px] text-center">
                    <div className="h-[72px] w-[72px] rounded-[24px] mx-auto mb-[24px] flex items-center justify-center" style={{ backgroundColor: "var(--mh-cta)", color: "white" }}>
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M26.6667 8L12 22.6667L5.33333 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="display text-[26px] font-[700] mb-[12px]" style={{ color: "var(--mh-text)" }}>Inquiry received</h3>
                    <p className="text-[15px] leading-[1.6] max-w-[360px] mx-auto font-[450]" style={{ color: "rgba(7, 6, 7, 0.7)" }}>
                      We&rsquo;ll review and send a fixed-price proposal within 48 hours. Check your email.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* STEP 1: Quick Inquiry (3 fields) */}
                    {formStep === 1 && (
                      <form onSubmit={handleStep1Submit} data-netlify="true" name="mh-project-inquiry-step1" className="space-y-[22px]">
                        <input type="hidden" name="form-name" value="mh-project-inquiry-step1" />
                        <div>
                          <h3 className="display text-[24px] font-[700] mb-[8px] tracking-[-0.02em]" style={{ color: "var(--mh-text)" }}>Start Your Project</h3>
                          <p className="text-[14px] font-[450]" style={{ color: "rgba(7, 6, 7, 0.65)" }}>3 quick questions — takes 30 seconds</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                          <div>
                            <label className="block text-[12.5px] font-[650] mb-[9px] tracking-[-0.01em]" style={{ color: "var(--mh-text)" }}>Your name <span className="text-digital-orange" aria-hidden="true">*</span></label>
                            <input
                              required type="text"
                              name="name"
                              autoComplete="name"
                              value={formDataStep1.name}
                              onChange={(e) => setFormDataStep1({ ...formDataStep1, name: e.target.value })}
                              className="w-full h-[48px] px-[16px] rounded-[16px] text-[15px] font-[500] outline-none transition-all focus:ring-[2.5px] md:h-[48px] max-md:h-[44px] max-md:px-[14px] max-md:text-[15px] max-md:rounded-[14px]"
                              style={{ backgroundColor: "white", border: "1.5px solid rgba(7, 6, 7, 0.1)", color: "var(--mh-text)", boxShadow: "inset 0 1px 2px rgba(7, 6, 7, 0.04)" }}
                              placeholder="Full name"
                            />
                          </div>
                          <div>
                            <label className="block text-[12.5px] font-[650] mb-[9px] tracking-[-0.01em]" style={{ color: "var(--mh-text)" }}>Work email <span className="text-digital-orange" aria-hidden="true">*</span></label>
                            <input
                              required type="email"
                              name="email"
                              autoComplete="email"
                              value={formDataStep1.email}
                              onChange={(e) => setFormDataStep1({ ...formDataStep1, email: e.target.value })}
                              className="w-full h-[48px] px-[16px] rounded-[16px] text-[15px] font-[500] outline-none transition-all focus:ring-[2.5px] md:h-[48px] max-md:h-[44px] max-md:px-[14px] max-md:text-[15px] max-md:rounded-[14px]"
                              style={{ backgroundColor: "white", border: "1.5px solid rgba(7, 6, 7, 0.1)", color: "var(--mh-text)", boxShadow: "inset 0 1px 2px rgba(7, 6, 7, 0.04)" }}
                              placeholder="you@company.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[12.5px] font-[650] mb-[9px] tracking-[-0.01em]" style={{ color: "var(--mh-text)" }}>What are you building? <span className="text-digital-orange" aria-hidden="true">*</span></label>
                          <select
                            required
                            name="projectType"
                            value={formDataStep1.projectType}
                            onChange={(e) => setFormDataStep1({ ...formDataStep1, projectType: e.target.value })}
                            className="w-full h-[48px] px-[16px] rounded-[16px] text-[15px] font-[500] outline-none transition-all focus:ring-[2.5px] appearance-none cursor-pointer max-md:h-[44px] max-md:px-[14px] max-md:text-[15px] max-md:rounded-[14px]"
                            style={{
                              backgroundColor: "white", border: "1.5px solid rgba(7, 6, 7, 0.1)", color: "var(--mh-text)",
                              boxShadow: "inset 0 1px 2px rgba(7, 6, 7, 0.04)",
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23070607' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                              backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", backgroundSize: "16px",
                            }}
                          >
                            <option value="">Select project type</option>
                            {projectTypeOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-[54px] rounded-[18px] text-[16px] font-[650] flex items-center justify-center gap-[10px] transition-all hover:translate-y-[-1px] active:translate-y-[0px] hover:shadow-[0_12px_36px_-8px_rgba(252,80,0,0.45)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer max-md:h-[48px] max-md:text-[15px] max-md:rounded-[14px]"
                          style={{ backgroundColor: "var(--mh-cta)", color: "white", boxShadow: "0 10px 28px -8px rgba(252, 80, 0, 0.38)" }}
                        >
                          Continue to Details
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>

                        <div className="flex items-start gap-[10px] pt-[4px]">
                          <div className="h-[17px] w-[17px] rounded-[6px] border-[1.5px] flex items-center justify-center flex-shrink-0 mt-[1px]" style={{ borderColor: "rgba(7, 6, 7, 0.2)" }}>
                            <div className="h-[7px] w-[7px] rounded-[3px]" style={{ backgroundColor: "var(--mh-cta)" }}></div>
                          </div>
                          <p className="text-[12.5px] leading-[1.55] font-[450]" style={{ color: "rgba(7, 6, 7, 0.68)" }}>
                            By continuing, you agree to our terms. We&rsquo;ll respond within 48 hours with a detailed proposal. No spam, ever.
                          </p>
                        </div>
                      </form>
                    )}

                    {/* STEP 2: Detailed Inquiry */}
                    {formStep === 2 && (
                      <form onSubmit={handleStep2Submit} data-netlify="true" name="mh-project-inquiry-step2" className="space-y-[22px]">
                        <input type="hidden" name="form-name" value="mh-project-inquiry-step2" />
                        <div>
                          <div className="flex items-center justify-between mb-[8px]">
                            <h3 className="display text-[24px] font-[700] mb-[8px] tracking-[-0.02em]" style={{ color: "var(--mh-text)" }}>Project Details</h3>
                            <button
                              type="button"
                              onClick={handleBackToStep1}
                              className="text-[13px] font-[600] text-digital-orange hover:underline"
                            >
                              ← Back
                            </button>
                          </div>
                          <p className="text-[14px] font-[450]" style={{ color: "rgba(7, 6, 7, 0.65)" }}>All fields help us give you an accurate fixed-price quote</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                          <div>
                            <label className="block text-[12.5px] font-[650] mb-[9px] tracking-[-0.01em]" style={{ color: "var(--mh-text)" }}>Phone / WhatsApp</label>
                            <input
                              required type="tel"
                              name="phone"
                              autoComplete="tel"
                              value={formDataStep2.phone}
                              onChange={(e) => setFormDataStep2({ ...formDataStep2, phone: e.target.value })}
                              className="w-full h-[48px] px-[16px] rounded-[16px] text-[15px] font-[500] outline-none transition-all focus:ring-[2.5px] md:h-[48px] max-md:h-[44px] max-md:px-[14px] max-md:text-[15px] max-md:rounded-[14px]"
                              style={{ backgroundColor: "white", border: "1.5px solid rgba(7, 6, 7, 0.1)", color: "var(--mh-text)", boxShadow: "inset 0 1px 2px rgba(7, 6, 7, 0.04)" }}
                              placeholder="+91 XXXXX XXXXX"
                            />
                          </div>
                          <div>
                            <label className="block text-[12.5px] font-[650] mb-[9px] tracking-[-0.01em]" style={{ color: "var(--mh-text)" }}>Company / Project</label>
                            <input
                              type="text"
                              name="organization"
                              autoComplete="organization"
                              value={formDataStep2.company}
                              onChange={(e) => setFormDataStep2({ ...formDataStep2, company: e.target.value })}
                              className="w-full h-[48px] px-[16px] rounded-[16px] text-[15px] font-[500] outline-none transition-all focus:ring-[2.5px] md:h-[48px] max-md:h-[44px] max-md:px-[14px] max-md:text-[15px] max-md:rounded-[14px]"
                              style={{ backgroundColor: "white", border: "1.5px solid rgba(7, 6, 7, 0.1)", color: "var(--mh-text)", boxShadow: "inset 0 1px 2px rgba(7, 6, 7, 0.04)" }}
                              placeholder="Optional"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[12.5px] font-[650] mb-[9px] tracking-[-0.01em]" style={{ color: "var(--mh-text)" }}>Which service are you exploring?</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px]">
                            {pricingTiers.map((tier) => (
                              <button
                                key={tier.id}
                                type="button"
                                onClick={() => setFormDataStep2({ ...formDataStep2, service: tier.id })}
                                className={`min-h-[52px] rounded-[16px] border-2 px-[10px] py-[12px] text-[13px] font-[650] transition-all cursor-pointer ${formDataStep2.service === tier.id ? "scale-[0.98]" : "hover:scale-[0.99]"} max-md:min-h-[44px] max-md:text-[12px] max-md:py-[10px]`}
                                style={{
                                  backgroundColor: formDataStep2.service === tier.id ? tier.accent : "white",
                                  borderColor: formDataStep2.service === tier.id ? tier.accent : "rgba(7, 6, 7, 0.1)",
                                  color: formDataStep2.service === tier.id ? "white" : "var(--mh-text)",
                                  boxShadow: formDataStep2.service === tier.id ? `0 6px 16px -4px ${tier.accent}55` : "none",
                                }}
                              >
                                {tier.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[12.5px] font-[650] mb-[9px] tracking-[-0.01em]" style={{ color: "var(--mh-text)" }}>
                            Budget range <span style={{ color: "rgba(7, 6, 7, 0.5)", fontWeight: 500 }}>(required for accurate scope)</span>
                          </label>
                          <select
                            required
                            name="budget"
                            value={formDataStep2.budget}
                            onChange={(e) => setFormDataStep2({ ...formDataStep2, budget: e.target.value })}
                            className="w-full h-[48px] px-[16px] rounded-[16px] text-[15px] font-[500] outline-none transition-all focus:ring-[2.5px] appearance-none cursor-pointer max-md:h-[44px] max-md:px-[14px] max-md:text-[15px] max-md:rounded-[14px]"
                            style={{
                              backgroundColor: "white", border: "1.5px solid rgba(7, 6, 7, 0.1)", color: "var(--mh-text)",
                              boxShadow: "inset 0 1px 2px rgba(7, 6, 7, 0.04)",
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23070607' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                              backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", backgroundSize: "16px",
                            }}
                          >
                            <option value="">Select budget range</option>
                            <option value="less-than-5000">$50 - $500 / ₹1,000 &ndash; ₹5,000 (Starter)</option>
                            <option value="5000-15000">$500 - $1,500 / ₹5,000 &ndash; ₹15,000 (Growth)</option>
                            <option value="15000-50000">$1,500 - $5,000 / ₹15,000 &ndash; ₹50,000 (Premium)</option>
                            <option value="above-50000">$5,000+ / ₹50,000+ (Custom)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[12.5px] font-[650] mb-[9px] tracking-[-0.01em]" style={{ color: "var(--mh-text)" }}>Project details <span className="text-digital-orange" aria-hidden="true">*</span></label>
                          <textarea
                            required
                            name="project-details"
                            value={formDataStep2.message}
                            onChange={(e) => setFormDataStep2({ ...formDataStep2, message: e.target.value })}
                            rows={4}
                            className="w-full px-[16px] py-[14px] rounded-[16px] text-[15px] font-[500] outline-none transition-all focus:ring-[2.5px] resize-none leading-[1.55] max-md:px-[14px] max-md:py-[12px] max-md:text-[15px] max-md:rounded-[14px]"
                            style={{ backgroundColor: "white", border: "1.5px solid rgba(7, 6, 7, 0.1)", color: "var(--mh-text)", boxShadow: "inset 0 1px 2px rgba(7, 6, 7, 0.04)" }}
                            placeholder="What are you building? Timeline? Any specific tech requirements? The more context, the more accurate our proposal."
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                          <div>
                            <label className="block text-[12.5px] font-[650] mb-[9px] tracking-[-0.01em]" style={{ color: "var(--mh-text)" }}>Website (optional)</label>
                            <input
                              type="url"
                              name="website"
                              value={(formDataStep2 as any).website || ""}
                              onChange={(e) => setFormDataStep2({ ...formDataStep2, website: e.target.value })}
                              className="w-full h-[48px] px-[16px] rounded-[16px] text-[15px] font-[500] outline-none transition-all focus:ring-[2.5px]"
                              style={{ backgroundColor: "white", border: "1.5px solid rgba(7, 6, 7, 0.1)", color: "var(--mh-text)", boxShadow: "inset 0 1px 2px rgba(7, 6, 7, 0.04)" }}
                              placeholder="https://your-site.com"
                            />
                          </div>
                          <div>
                            <label className="block text-[12.5px] font-[650] mb-[9px] tracking-[-0.01em]" style={{ color: "var(--mh-text)" }}>Timeline</label>
                            <input
                              type="text"
                              name="timeline"
                              value={(formDataStep2 as any).timeline || ""}
                              onChange={(e) => setFormDataStep2({ ...formDataStep2, timeline: e.target.value })}
                              className="w-full h-[48px] px-[16px] rounded-[16px] text-[15px] font-[500] outline-none transition-all focus:ring-[2.5px]"
                              style={{ backgroundColor: "white", border: "1.5px solid rgba(7, 6, 7, 0.1)", color: "var(--mh-text)", boxShadow: "inset 0 1px 2px rgba(7, 6, 7, 0.04)" }}
                              placeholder="e.g. 4 weeks, 2 months"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[12.5px] font-[650] mb-[9px] tracking-[-0.01em]" style={{ color: "var(--mh-text)" }}>Preferred Contact Method</label>
                          <input
                            type="text"
                            name="preferredContact"
                            value={(formDataStep2 as any).preferredContact || ""}
                            onChange={(e) => setFormDataStep2({ ...formDataStep2, preferredContact: e.target.value })}
                            className="w-full h-[48px] px-[16px] rounded-[16px] text-[15px] font-[500] outline-none transition-all focus:ring-[2.5px]"
                            style={{ backgroundColor: "white", border: "1.5px solid rgba(7, 6, 7, 0.1)", color: "var(--mh-text)", boxShadow: "inset 0 1px 2px rgba(7, 6, 7, 0.04)" }}
                            placeholder="e.g. WhatsApp, Email, Phone Call"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-[54px] rounded-[18px] text-[16px] font-[650] flex items-center justify-center gap-[10px] transition-all hover:translate-y-[-1px] active:translate-y-[0px] hover:shadow-[0_12px_36px_-8px_rgba(252,80,0,0.45)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer max-md:h-[48px] max-md:text-[15px] max-md:rounded-[14px]"
                          style={{ backgroundColor: "var(--mh-cta)", color: "white", boxShadow: "0 10px 28px -8px rgba(252, 80, 0, 0.38)" }}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                          {!isSubmitting && (
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                              <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </button>

                        {submitError && (
                          <div className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[16px]" style={{ backgroundColor: "color-mix(in srgb, var(--mh-cta) 10%, transparent)", color: "var(--mh-text)" }}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0" style={{ color: "var(--mh-cta)" }}>
                              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                              <path d="M8 5V8.5M8 11H8.007" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <span className="text-[13px] font-[500] flex-1">{submitError}</span>
                            <button
                              type="button"
                              onClick={() => handleStep2Submit({ preventDefault: () => {} } as any)}
                              className="text-[13px] font-[650] px-[14px] py-[6px] rounded-[10px] cursor-pointer"
                              style={{ backgroundColor: "var(--mh-cta)", color: "white" }}
                            >
                              Retry
                            </button>
                          </div>
                        )}

                        <div className="flex items-start gap-[10px] pt-[4px]">
                          <div className="h-[17px] w-[17px] rounded-[6px] border-[1.5px] flex items-center justify-center flex-shrink-0 mt-[1px]" style={{ borderColor: "rgba(7, 6, 7, 0.2)" }}>
                            <div className="h-[7px] w-[7px] rounded-[3px]" style={{ backgroundColor: "var(--mh-cta)" }}></div>
                          </div>
                          <p className="text-[12.5px] leading-[1.55] font-[450]" style={{ color: "rgba(7, 6, 7, 0.68)" }}>
                            By submitting, you agree to our terms. We&rsquo;ll respond within 48 hours with a detailed proposal. No spam, ever.
                          </p>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}