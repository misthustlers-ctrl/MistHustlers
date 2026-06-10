import { Link } from "react-router-dom";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function PrivacyPolicy() {
  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="privacyPolicy" />
      <GlobalNavbar />
      <main className="pt-32 pb-20">
        <div className="max-w-[800px] mx-auto px-6">
          <h1 className="font-display text-[clamp(36px,5vw,56px)] tracking-[0.02em] text-abyssal-ink mb-8">Privacy Policy</h1>
          <div className="text-abyssal-ink/60 font-body leading-relaxed space-y-4">
            <p>Last updated: June 2026</p>
            <p>MistHustlers ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.</p>
            <h2 className="font-body font-bold text-xl text-abyssal-ink mt-8 mb-4">Information We Collect</h2>
            <p>When you use our inquiry form or contact us, we collect: name, email address, phone number, company name, project details, and any other information you voluntarily provide.</p>
            <h2 className="font-body font-bold text-xl text-abyssal-ink mt-8 mb-4">How We Use Your Information</h2>
            <p>We use your information to: respond to your inquiries, provide our services, send project proposals, communicate about your project, and improve our services.</p>
            <h2 className="font-body font-bold text-xl text-abyssal-ink mt-8 mb-4">Data Protection</h2>
            <p>We implement reasonable security measures to protect your personal information. We do not sell, trade, or share your personal information with third parties except as necessary to provide our services or as required by law.</p>
            <h2 className="font-body font-bold text-xl text-abyssal-ink mt-8 mb-4">Third-Party Services</h2>
            <p>We may use third-party services (email providers, hosting services) that process data on our behalf. These providers have their own privacy policies.</p>
            <h2 className="font-body font-bold text-xl text-abyssal-ink mt-8 mb-4">Contact Us</h2>
            <p>For questions about this policy, contact us at: <a href="mailto:misthustlers@gmail.com" className="text-digital-orange hover:underline">misthustlers@gmail.com</a></p>
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
