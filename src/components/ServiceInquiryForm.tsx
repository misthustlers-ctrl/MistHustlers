import { useState, useEffect } from "react";
import { useContent } from "@/utils/useContent";
import { getStoredReferralCode } from "@/utils/referral";

const DEFAULT_TIERS = [
  { id: "starter", name: "STARTER", price: "", description: "", features: [], popular: false, accent: "var(--mh-text)" as const, imageUrl: "" },
  { id: "growth", name: "GROWTH", price: "", description: "", features: [], popular: true, accent: "var(--mh-cta)" as const, imageUrl: "" },
  { id: "premium", name: "PREMIUM", price: "", description: "", features: [], popular: false, accent: "#524ae9" as const, imageUrl: "" },
];
export default function ServiceInquiryForm() {
  const [pricingTiers, setPricingTiers] = useState(DEFAULT_TIERS);
  const contact = useContent("contact", { email: "misthustlers@gmail.com", phone: "888 993 7648" });

  useEffect(() => {
    fetch("/api/content/services")
      .then((r) => r.json())
      .then((j) => { if (j.success && j.data?.pricing?.tiers) setPricingTiers(j.data.pricing.tiers); })
      .catch(() => {});
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "starter",
    budget: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitInquiry = async (data: typeof formData) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, referralCode: getStoredReferralCode() || undefined }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const json = await res.json().catch(() => ({}));
      if (json.success === false) {
        throw new Error(json.message || "Inquiry could not be submitted");
      }

      setSubmitted(true);
      setFormData({
        name: "", email: "", phone: "", company: "",
        service: "starter", budget: "", message: "",
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInquiry(formData);
  };

  return (
    <div className="max-w-[1040px] mx-auto">
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
        </div>

        <div className="relative">
          <div className="rounded-[24px] sm:rounded-[32px] p-[1px] shadow-[0_32px_72px_-16px_rgba(7,6,7,0.18)]" style={{ background: "linear-gradient(180deg, rgba(7,6,7,0.12), rgba(7,6,7,0.04))" }}>
            <div className="rounded-[23px] sm:rounded-[31px] p-[22px] sm:p-[32px] md:p-[40px]" style={{ backgroundColor: "var(--mh-surface)" }}>
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
                <form onSubmit={handleSubmit} className="space-y-[22px]">
                  <div>
                    <h3 className="display text-[24px] font-[700] mb-[8px] tracking-[-0.02em]" style={{ color: "var(--mh-text)" }}>Project Inquiry</h3>
                    <p className="text-[14px] font-[450]" style={{ color: "rgba(7, 6, 7, 0.65)" }}>All fields required for accurate pricing</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                    <div>
                      <label className="block text-[12.5px] font-[650] mb-[9px] tracking-[-0.01em]" style={{ color: "var(--mh-text)" }}>Your name</label>
                      <input
                        required type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-[48px] px-[16px] rounded-[16px] text-[15px] font-[500] outline-none transition-all focus:ring-[2.5px]"
                        style={{ backgroundColor: "white", border: "1.5px solid rgba(7, 6, 7, 0.1)", color: "var(--mh-text)", boxShadow: "inset 0 1px 2px rgba(7, 6, 7, 0.04)" }}
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-[12.5px] font-[650] mb-[9px] tracking-[-0.01em]" style={{ color: "var(--mh-text)" }}>Work email</label>
                      <input
                        required type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-[48px] px-[16px] rounded-[16px] text-[15px] font-[500] outline-none transition-all focus:ring-[2.5px]"
                        style={{ backgroundColor: "white", border: "1.5px solid rgba(7, 6, 7, 0.1)", color: "var(--mh-text)", boxShadow: "inset 0 1px 2px rgba(7, 6, 7, 0.04)" }}
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                    <div>
                      <label className="block text-[12.5px] font-[650] mb-[9px] tracking-[-0.01em]" style={{ color: "var(--mh-text)" }}>Phone / WhatsApp</label>
                      <input
                        required type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full h-[48px] px-[16px] rounded-[16px] text-[15px] font-[500] outline-none transition-all focus:ring-[2.5px]"
                        style={{ backgroundColor: "white", border: "1.5px solid rgba(7, 6, 7, 0.1)", color: "var(--mh-text)", boxShadow: "inset 0 1px 2px rgba(7, 6, 7, 0.04)" }}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-[12.5px] font-[650] mb-[9px] tracking-[-0.01em]" style={{ color: "var(--mh-text)" }}>Company / Project</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full h-[48px] px-[16px] rounded-[16px] text-[15px] font-[500] outline-none transition-all focus:ring-[2.5px]"
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
                          onClick={() => setFormData({ ...formData, service: tier.id })}
                          className={`min-h-[52px] rounded-[16px] border-2 px-[10px] py-[12px] text-[13px] font-[650] transition-all cursor-pointer ${formData.service === tier.id ? "scale-[0.98]" : "hover:scale-[0.99]"}`}
                          style={{
                            backgroundColor: formData.service === tier.id ? tier.accent : "white",
                            borderColor: formData.service === tier.id ? tier.accent : "rgba(7, 6, 7, 0.1)",
                            color: formData.service === tier.id ? "white" : "var(--mh-text)",
                            boxShadow: formData.service === tier.id ? `0 6px 16px -4px ${tier.accent}55` : "none",
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
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full h-[48px] px-[16px] rounded-[16px] text-[15px] font-[500] outline-none transition-all focus:ring-[2.5px] appearance-none cursor-pointer"
                      style={{
                        backgroundColor: "white", border: "1.5px solid rgba(7, 6, 7, 0.1)", color: "var(--mh-text)",
                        boxShadow: "inset 0 1px 2px rgba(7, 6, 7, 0.04)",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23070607' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", backgroundSize: "16px",
                      }}
                    >
                      <option value="">Select budget range</option>
                      <option value="less-than-5000">₹1,000 &ndash; ₹5,000 (Starter)</option>
                      <option value="5000-15000">₹5,000 &ndash; ₹15,000 (Growth)</option>
                      <option value="15000-50000">₹15,000 &ndash; ₹50,000 (Premium)</option>
                      <option value="above-50000">₹50,000+ (Custom)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-[650] mb-[9px] tracking-[-0.01em]" style={{ color: "var(--mh-text)" }}>Project details</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="w-full px-[16px] py-[14px] rounded-[16px] text-[15px] font-[500] outline-none transition-all focus:ring-[2.5px] resize-none leading-[1.55]"
                      style={{ backgroundColor: "white", border: "1.5px solid rgba(7, 6, 7, 0.1)", color: "var(--mh-text)", boxShadow: "inset 0 1px 2px rgba(7, 6, 7, 0.04)" }}
                      placeholder="What are you building? Timeline? Any specific tech requirements? The more context, the more accurate our proposal."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-[54px] rounded-[18px] text-[16px] font-[650] flex items-center justify-center gap-[10px] transition-all hover:translate-y-[-1px] active:translate-y-[0px] hover:shadow-[0_12px_36px_-8px_rgba(252,80,0,0.45)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
                        onClick={() => submitInquiry(formData)}
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
            </div>
          </div>

          <div className="absolute -z-10 top-[20%] -right-[14px] h-[140px] w-[140px] rounded-full blur-[48px] opacity-[0.22]" style={{ backgroundColor: "var(--mh-cta)" }}></div>
        </div>
      </div>
    </div>
  );
}
