import { Link } from "react-router-dom";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function RefundPolicy() {
  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="refundPolicy" />
      <GlobalNavbar />
      <main className="pt-32 pb-20">
        <div className="max-w-[800px] mx-auto px-6">
          <h1 className="font-display text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mb-8">Refund & Cancellation Policy</h1>
          <div className="text-abyssal-ink/60 font-body leading-relaxed space-y-4">
            <p>Last updated: June 2026</p>
            <h2 className="font-body font-bold text-xl text-abyssal-ink mt-8 mb-4">Cancellation</h2>
            <p>You may cancel a project before work has begun for a full refund of any advance payment. Once work has commenced, cancellation terms are as per the project agreement.</p>
            <h2 className="font-body font-bold text-xl text-abyssal-ink mt-8 mb-4">Refunds</h2>
            <p>If we fail to deliver the agreed scope within the specified timeline, you are eligible for a partial or full refund as specified in your project agreement. Each project agreement clearly outlines the refund terms before work begins.</p>
            <h2 className="font-body font-bold text-xl text-abyssal-ink mt-8 mb-4">Change of Mind</h2>
            <p>If you change your mind about the project direction, we can adjust the scope through a change order. Refunds for unused portions are evaluated on a case-by-case basis.</p>
            <h2 className="font-body font-bold text-xl text-abyssal-ink mt-8 mb-4">Dispute Resolution</h2>
            <p>We aim to resolve all disputes amicably. If a resolution cannot be reached, disputes will be handled in the courts of Indore, Madhya Pradesh.</p>
            <h2 className="font-body font-bold text-xl text-abyssal-ink mt-8 mb-4">Contact</h2>
            <p>For refund requests: <a href="mailto:misthustlers@gmail.com" className="text-digital-orange hover:underline">misthustlers@gmail.com</a></p>
            <div className="pt-8">
              <Link to="/" className="text-digital-orange hover:underline font-body">Back to Home</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
