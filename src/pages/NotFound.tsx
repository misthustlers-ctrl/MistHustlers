import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="bg-basalt-canvas min-h-screen flex flex-col">
      <SEO page="notFound" />
      <SchemaMarkup page="notFound" />
      <GlobalNavbar />
      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-16">
        <div className="text-center max-w-lg">
          <h1 className="font-display text-[clamp(80px,20vw,160px)] leading-[0.85] tracking-[0.02em] text-abyssal-ink">
            404
          </h1>
          <p className="font-body text-lg text-abyssal-ink/60 mt-4 mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex rounded-full bg-abyssal-ink px-7 py-4 text-base font-bold text-ash-white transition hover:-translate-y-0.5 hover:bg-digital-orange"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
