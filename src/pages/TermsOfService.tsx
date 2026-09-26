import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";

export default function TermsOfService() {
  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="termsOfService" />
      <SchemaMarkup page="termsOfService" />
      <main className="pt-28 sm:pt-32 pb-16 sm:pb-20">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <h1 className="font-display text-[clamp(34px,10vw,56px)] tracking-[0.02em] text-abyssal-ink mb-8">Terms of Service</h1>
          <div className="text-abyssal-ink/60 font-body leading-relaxed space-y-4">
            <p>Last updated: June 2026</p>
            <p>By using our website and services, you agree to these terms. If you do not agree, please do not use our services.</p>
            <h2 className="font-body font-bold text-xl text-abyssal-ink mt-8 mb-4">Services</h2>
            <p>MistHustlers provides web development, automation, MVP development, and related services as described on our website. Each project is governed by a separate project agreement that specifies scope, timeline, and pricing.</p>
            <h2 className="font-body font-bold text-xl text-abyssal-ink mt-8 mb-4">Pricing & Payment</h2>
            <p>All pricing is quoted in Indian Rupees (INR). Payment terms are specified in each project proposal. We require an advance payment before starting work, with the balance due upon delivery.</p>
            <h2 className="font-body font-bold text-xl text-abyssal-ink mt-8 mb-4">Intellectual Property</h2>
            <p>Upon full payment, you receive complete ownership of all deliverables, including source code, designs, and documentation. We reserve the right to display the work in our portfolio unless otherwise agreed.</p>
            <h2 className="font-body font-bold text-xl text-abyssal-ink mt-8 mb-4">Limitation of Liability</h2>
            <p>Our liability is limited to the amount paid for the specific project. We are not liable for indirect damages, loss of profits, or business interruption.</p>
            <h2 className="font-body font-bold text-xl text-abyssal-ink mt-8 mb-4">Contact</h2>
            <p>For questions: <a href="mailto:misthustlers@gmail.com" className="text-digital-orange hover:underline">misthustlers@gmail.com</a></p>
            <div className="pt-8">
              <Link to="/" className="text-digital-orange hover:underline font-body">Back to Home</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
