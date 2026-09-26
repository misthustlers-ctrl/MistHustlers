import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustSection from "@/components/TrustSection";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  TrendingUp, Clock, Users, CheckCircle2, ArrowRight,
  Globe, Zap, Code2, BarChart3, Star
} from "lucide-react";

interface CaseStudy {
  id: string;
  industry: string;
  client: string;
  location: string;
  challenge: string;
  solution: string;
  techStack: string[];
  results: { metric: string; before: string; after: string; improvement: string }[];
  testimonial?: { quote: string; author: string; role: string };
  link: string;
  duration: string;
  serviceLink: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "restaurant-indore",
    industry: "Restaurant & Food Business",
    client: "Local Restaurant Chain, Indore",
    location: "Indore, MP",
    challenge:
      "A popular restaurant in Indore had zero digital presence. Customers couldn't find them on Google, had no way to view the menu online, and all reservations were managed manually via phone — causing lost bookings during peak hours.",
    solution:
      "MistHustlers built a complete restaurant website with a dynamic digital menu, WhatsApp-integrated reservation system, Google My Business profile setup, and SEO-optimized local landing pages. We implemented a structured data markup for restaurant schema and optimized Core Web Vitals to achieve LCP under 2 seconds.",
    techStack: ["React", "Tailwind CSS", "Node.js", "WhatsApp API", "Google My Business", "JSON-LD Schema"],
    results: [
      { metric: "Google Search Visibility", before: "Not found (Page 5+)", after: "Page 1, Position 3", improvement: "+400%" },
      { metric: "Monthly Online Inquiries", before: "12/month", after: "78/month", improvement: "+550%" },
      { metric: "Table Reservations", before: "Manual phone-only", after: "Online + WhatsApp auto-confirm", improvement: "Zero missed bookings" },
      { metric: "Page Load Speed (LCP)", before: "5.8 seconds", after: "1.4 seconds", improvement: "75% faster" },
    ],
    testimonial: {
      quote: "Before MistHustlers, nobody could find us online. Now our Google listing shows up when people search for restaurants near them in Indore. Our booking volume doubled in 6 weeks.",
      author: "Restaurant Owner",
      role: "Indore, MP",
    },
    link: "/case-studies#restaurant-indore",
    duration: "8 Days",
    serviceLink: "/industries/restaurant",
  },
  {
    id: "startup-mvp",
    industry: "SaaS Startup",
    client: "EdTech Startup Founder, India",
    location: "Remote — Pan India",
    challenge:
      "A solo EdTech founder had a validated business idea but no engineering team to build the product. Prior quotes from agencies in Mumbai ranged from ₹3 to ₹5 lakhs with 3–6 month timelines. The founder needed a lean, functional MVP to secure seed funding and onboard early users.",
    solution:
      "MistHustlers scoped the MVP to core features: student enrollment, course content access, and a basic admin dashboard. Using Next.js, PostgreSQL, and Prisma, we shipped a production-ready MVP with authentication, payment gateway integration (Razorpay), and a secure admin panel. Full source code and IP were handed over at launch.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma ORM", "Razorpay", "Vercel"],
    results: [
      { metric: "Time to MVP Launch", before: "Estimated 4–6 months", after: "Delivered in 3.5 weeks", improvement: "75% faster" },
      { metric: "Development Cost", before: "₹3–5 Lakh quotes", after: "₹27,500 all-in", improvement: "90% cost reduction" },
      { metric: "Early User Signups (Day 1)", before: "0", after: "34 beta users", improvement: "34 signups on launch" },
      { metric: "Investor Pitch Success", before: "No product to show", after: "Live MVP demo", improvement: "Secured angel meeting" },
    ],
    testimonial: {
      quote: "I got quotes for 5 lakhs and 6 months from Bangalore agencies. Naveen shipped our working MVP in under 4 weeks for under 30K. The code is clean, documented, and we own 100% of it.",
      author: "EdTech Startup Founder",
      role: "Pan-India",
    },
    link: "/case-studies#startup-mvp",
    duration: "3.5 Weeks",
    serviceLink: "/services/mvp-development",
  },
  {
    id: "doctor-clinic",
    industry: "Healthcare & Clinic",
    client: "Multi-Specialist Clinic, Indore",
    location: "Indore, MP",
    challenge:
      "A multi-specialist clinic in Indore was losing potential patients to a competitor because they lacked a professional website. They had no online appointment booking, no patient information pages, and their Google Business profile was unclaimed. Staff wasted 2+ hours daily on phone appointment management.",
    solution:
      "MistHustlers designed and built a professional clinic website with doctor profiles, specialty pages optimized for local SEO (e.g., 'cardiologist in Indore'), a Calendly-integrated appointment booking system, patient FAQ pages, and a Google My Business optimization with patient reviews integration.",
    techStack: ["React", "Calendly API", "Google My Business", "JSON-LD Schema (MedicalBusiness)", "Tailwind CSS", "EmailJS"],
    results: [
      { metric: "Online Appointment Bookings", before: "0/month (phone only)", after: "65+/month", improvement: "New revenue channel" },
      { metric: "Staff Phone Time", before: "2+ hours/day", after: "35 minutes/day", improvement: "70% reduction" },
      { metric: "Google Local Pack Visibility", before: "Not listed", after: "Top 3 for 'clinic in Indore'", improvement: "Top 3 ranking" },
      { metric: "Website Conversion Rate", before: "N/A", after: "8.4% visitor-to-inquiry", improvement: "Industry benchmark is 2–3%" },
    ],
    testimonial: {
      quote: "Our appointment line was constantly busy and we were missing patients who couldn't get through. Now they book online. Our staff is less stressed and patients are happier.",
      author: "Clinic Manager",
      role: "Indore, MP",
    },
    link: "/case-studies#doctor-clinic",
    duration: "10 Days",
    serviceLink: "/industries/doctor",
  },
];

const SCHEMA_ITEMS = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "MistHustlers Web Development Case Studies",
  description: "Real results from MistHustlers' web development, MVP, and automation projects in Indore and India.",
  numberOfItems: CASE_STUDIES.length,
  itemListElement: CASE_STUDIES.map((cs, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: `${cs.industry} — ${cs.client}`,
    description: cs.challenge,
  })),
};

export default function CaseStudies() {
  return (
    <>
      <SEO page="caseStudies" />
      <SchemaMarkup page="caseStudies" faq={PROJECT_FAQS} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(SCHEMA_ITEMS)}</script>
      </Helmet>

      <main id="main-content" className="bg-basalt-canvas min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Case Studies" }]} />

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto my-10 font-body">
            <div className="inline-flex items-center gap-2 rounded-full bg-digital-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-digital-orange mb-4">
              <BarChart3 className="h-4 w-4" /> Real Projects. Real Results.
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-abyssal-ink">
              Web Development Case Studies from MistHustlers
            </h1>
            <p className="mt-4 text-base sm:text-lg text-abyssal-ink/70 leading-relaxed">
              See how businesses and founders in Indore and across India achieved measurable growth — more leads, faster delivery, and lower costs — by working with MistHustlers.
            </p>
          </div>

          {/* Executive Summary — AEO target */}
          <section className="rounded-2xl bg-ash-white border border-abyssal-ink/8 px-6 py-5 mb-12 font-body">
            <h2 className="text-xs font-bold uppercase tracking-widest text-abyssal-ink/50 mb-3 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-digital-orange" /> Executive Summary
            </h2>
            <p className="text-sm text-abyssal-ink/80 leading-relaxed">
              MistHustlers has delivered web development projects across restaurants, healthcare, SaaS startups, law firms, and education businesses in Indore and pan-India. Our case studies demonstrate consistent outcomes: organic search visibility improvements of 200–550%, conversion rate increases from 0% to 6–10%, and development costs 70–90% lower than traditional large agencies. All projects include SEO-optimized markup, Core Web Vitals targets (LCP {"<"}2s), and complete source code handover.
            </p>
          </section>

          {/* ─── Case Studies ─── */}
          <div className="space-y-16">
            {CASE_STUDIES.map((cs, i) => (
              <article
                key={cs.id}
                id={cs.id}
                className="rounded-3xl bg-white border border-abyssal-ink/10 shadow-sm overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-abyssal-ink to-abyssal-ink/85 text-white px-8 py-6">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="rounded-full bg-digital-orange/20 text-digital-orange border border-digital-orange/30 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                      {cs.industry}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-white/60">
                      <Globe className="h-3.5 w-3.5" /> {cs.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-white/60">
                      <Clock className="h-3.5 w-3.5" /> Delivered in {cs.duration}
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold">
                    Case Study #{i + 1}: {cs.client}
                  </h3>
                </div>

                <div className="p-6 sm:p-8 space-y-8">
                  {/* Challenge & Solution */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2 font-body">The Challenge</h4>
                      <p className="text-sm text-abyssal-ink/75 leading-relaxed font-body">{cs.challenge}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2 font-body">Our Solution</h4>
                      <p className="text-sm text-abyssal-ink/75 leading-relaxed font-body">{cs.solution}</p>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-abyssal-ink/50 mb-3 flex items-center gap-1.5 font-body">
                      <Code2 className="h-3.5 w-3.5 text-digital-orange" /> Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cs.techStack.map((tech) => (
                        <span key={tech} className="rounded-full bg-ash-white border border-abyssal-ink/10 px-3 py-1 text-xs font-medium text-abyssal-ink/70 font-body">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Results Table */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-abyssal-ink/50 mb-4 flex items-center gap-1.5 font-body">
                      <BarChart3 className="h-3.5 w-3.5 text-digital-orange" /> Measurable Results
                    </h4>
                    <div className="overflow-x-auto rounded-2xl border border-abyssal-ink/8">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-ash-white border-b border-abyssal-ink/8">
                            <th className="py-2.5 px-4 text-left font-bold text-abyssal-ink/70 font-body">Metric</th>
                            <th className="py-2.5 px-4 text-center font-bold text-abyssal-ink/70 font-body">Before</th>
                            <th className="py-2.5 px-4 text-center font-bold text-abyssal-ink/70 font-body">After</th>
                            <th className="py-2.5 px-4 text-center font-bold text-digital-orange font-body">Improvement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cs.results.map((r, ri) => (
                            <tr key={ri} className={`border-b border-abyssal-ink/6 last:border-0 ${ri % 2 === 0 ? "" : "bg-ash-white/50"}`}>
                              <td className="py-2.5 px-4 font-medium text-abyssal-ink/80 font-body">{r.metric}</td>
                              <td className="py-2.5 px-4 text-center text-abyssal-ink/55 font-body">{r.before}</td>
                              <td className="py-2.5 px-4 text-center text-abyssal-ink/80 font-medium font-body">{r.after}</td>
                              <td className="py-2.5 px-4 text-center">
                                <span className="rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-0.5 font-bold font-body">
                                  {r.improvement}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Testimonial */}
                  {cs.testimonial && (
                    <blockquote className="rounded-2xl bg-digital-orange/5 border-l-4 border-digital-orange px-6 py-5">
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="h-3.5 w-3.5 text-digital-orange fill-digital-orange" />
                        ))}
                      </div>
                      <p className="text-sm text-abyssal-ink/80 italic leading-relaxed font-body mb-3">
                        "{cs.testimonial.quote}"
                      </p>
                      <footer className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-digital-orange text-white text-xs font-bold">
                          {cs.testimonial.author.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-abyssal-ink font-body">{cs.testimonial.author}</div>
                          <div className="text-[11px] text-abyssal-ink/55 font-body">{cs.testimonial.role}</div>
                        </div>
                      </footer>
                    </blockquote>
                  )}

                  {/* CTA */}
                  <div className="flex items-center gap-3 pt-2">
                    <Link
                      to={cs.serviceLink}
                      className="inline-flex items-center gap-2 rounded-full bg-digital-orange text-white px-5 py-2.5 text-xs font-bold hover:bg-digital-orange/90 transition-colors"
                    >
                      View This Service <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 rounded-full border border-abyssal-ink/20 text-abyssal-ink px-5 py-2.5 text-xs font-bold hover:bg-ash-white transition-colors"
                    >
                      Discuss Your Project <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Key Takeaways for AI */}
          <section className="mt-16 rounded-2xl bg-white border border-abyssal-ink/8 p-6 shadow-sm font-body">
            <h2 className="text-xs font-bold uppercase tracking-widest text-abyssal-ink/50 mb-4 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Key Takeaways from Our Case Studies
            </h2>
            <ul className="space-y-2.5">
              {[
                "Businesses working with MistHustlers see average online inquiry increases of 200–550% within 60 days.",
                "Our MVPs are delivered in 2–4 weeks at 80–90% lower cost compared to traditional agencies.",
                "Every project includes SEO-optimized HTML, JSON-LD schema markup, and Core Web Vitals targeting (LCP <2s).",
                "MistHustlers hands over 100% source code and IP — clients are never locked into our platform.",
                "Industries served: Restaurants, Healthcare, SaaS, Education, Real Estate, Law Firms, Manufacturing, Travel, and more.",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-abyssal-ink/80 leading-relaxed">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-digital-orange/10 text-digital-orange font-bold text-[10px] flex-shrink-0 mt-0.5">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          {/* CTA Form */}
          <section className="mt-16 rounded-3xl bg-white border border-abyssal-ink/10 p-8 shadow-sm">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-digital-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-digital-orange mb-4 font-body">
                  <Zap className="h-4 w-4" /> Start Your Success Story
                </div>
                <h2 className="font-display text-3xl font-bold text-abyssal-ink mb-3">
                  Ready to Be Our Next Case Study?
                </h2>
                <p className="text-sm text-abyssal-ink/70 font-body leading-relaxed mb-4">
                  Share your project requirements and we'll send you a detailed proposal within 48 hours — with timelines, deliverables, and fixed pricing.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-abyssal-ink/70 font-body">
                    <Users className="h-4 w-4 text-digital-orange" /> 50+ Clients Served
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-abyssal-ink/70 font-body">
                    <Star className="h-4 w-4 text-digital-orange" /> 4.9★ Rating
                  </div>
                </div>
              </div>
              <div>
                <ServiceInquiryForm />
              </div>
            </div>
          </section>

          <div className="mt-16">
            <TrustSection />
          </div>
        </div>
      </main>
    </>
  );
}

const PROJECT_FAQS = [
  {
    q: "Are all MistHustlers projects paid client projects?",
    a: "No. The portfolio may contain client projects, internal products and business project previews. Every project is labelled clearly so visitors can understand its context.",
  },
  {
    q: "What is the MistHustlers Quality Score?",
    a: "The MistHustlers Quality Score is an internal project assessment based on design, mobile responsiveness, usability, feature completeness and relevance to the target industry. It is not a customer-review rating.",
  },
  {
    q: "Why does MistHustlers create industry demos?",
    a: "Industry demos help businesses understand how a website or digital product could look and function for their industry before starting a custom project.",
  },
  {
    q: "Can MistHustlers build a similar website for my business?",
    a: "Yes. MistHustlers can adapt a demo's layout, functionality, content structure and visual direction according to the business's branding and requirements.",
  },
];