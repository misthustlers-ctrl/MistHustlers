import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustSection from "@/components/TrustSection";
import { Link } from "react-router-dom";
import { Utensils, Home, GraduationCap, ArrowRight } from "lucide-react";

const INDUSTRIES = [
  { slug: "restaurant", name: "Restaurants & Cafes", icon: Utensils, desc: "Online menus, table reservations, direct food ordering & Google Maps SEO.", meta: "indRestaurant" },
  { slug: "interior-designer", name: "Interior Designers & Architects", icon: Home, desc: "High-res project portfolio galleries & high-intent client inquiry forms.", meta: "indInterior" },
  { slug: "education", name: "Schools & Coaching Institutes", icon: GraduationCap, desc: "Online student admissions, course details & fee inquiry portals.", meta: "indEducation" },
];

export default function IndustryHub() {
  return (
    <>
      <SEO page="industries" />
      <SchemaMarkup page="industries" />

      <main id="main-content" className="bg-basalt-canvas min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Industries" }]} />

          <div className="text-center max-w-3xl mx-auto my-8">
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-abyssal-ink">
              Industry-Specific Web Development & Automation Solutions
            </h1>
            <p className="mt-4 text-base sm:text-lg text-abyssal-ink/70 font-body leading-relaxed">
              We engineer specialized website, software, and AI automation solutions tailored specifically to the operational goals and growth targets of your industry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
            {INDUSTRIES.map((ind) => {
              const Icon = ind.icon;
              return (
                <Link
                  key={ind.slug}
                  to={`/industries/${ind.slug}`}
                  className="group flex flex-col justify-between rounded-3xl border border-abyssal-ink/10 bg-white p-6 font-body shadow-sm transition-all hover:border-digital-orange/40 hover:shadow-lg"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-digital-orange/10 text-digital-orange mb-4 group-hover:bg-digital-orange group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-bold text-abyssal-ink group-hover:text-digital-orange transition-colors">
                      {ind.name}
                    </h2>
                    <p className="mt-2 text-sm text-abyssal-ink/65 leading-relaxed">
                      {ind.desc}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-xs font-bold text-digital-orange">
                    <span>Explore Solutions</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>

          <TrustSection />
        </div>
      </main>
    </>
  );
}
