import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustSection from "@/components/TrustSection";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import { Helmet } from "react-helmet-async";
import { Star, ShieldCheck, Quote, BadgeCheck, ThumbsUp, ExternalLink, Play, PlayCircle } from "lucide-react";

const REVIEWS = [
  {
    name: "Vikram Sharma",
    role: "Restaurant Owner",
    company: "Indore, MP",
    date: "2026-05",
    rating: 5,
    service: "Website Redesign + Google SEO",
    result: "+550% online orders in first quarter",
    text: "MistHustlers redesigned our business website and set up our Google listing. Now customers in Indore find us when they search for restaurants nearby, and our online ordering volume tripled in six weeks. Transparent pricing, fast delivery, zero drama.",
  },
  {
    name: "Ananya Mehta",
    role: "Startup Founder",
    company: "Pan-India (EdTech)",
    date: "2026-06",
    rating: 5,
    service: "MVP Development",
    result: "Working MVP shipped in 3.5 weeks",
    text: "I got quotes for ₹3–5 lakhs and 6-month timelines from Bangalore agencies. Naveen shipped our edtech MVP in under 4 weeks for under ₹30,000. Clean code, documented, and we own 100% of it.",
  },
  {
    name: "Dr. Rajesh Verma",
    role: "Multi-Specialist Clinic",
    company: "Indore, MP",
    date: "2026-04",
    rating: 5,
    service: "Clinic Website + Booking System",
    result: "65+ online appointments/month",
    text: "Our phone lines were constantly busy and we were losing patients. Now patients book appointments online around the clock. Staff phone time dropped over 70% and we rank top-3 for 'clinic in Indore'.",
  },
  {
    name: "Sunita Agarwal",
    role: "Interior Design Studio",
    company: "Indore, MP",
    date: "2026-03",
    rating: 5,
    service: "Portfolio Website + SEO",
    result: "3x qualified project inquiries",
    text: "The portfolio website MistHustlers built for our interior studio looks world-class. We now receive 3x more qualified project inquiries directly through the site.",
  },
  {
    name: "Amit Deshmukh",
    role: "Real Estate Developer",
    company: "Indore, MP",
    date: "2026-02",
    rating: 5,
    service: "Property Listing Portal",
    result: "+200% property inquiries in 60 days",
    text: "Our property listings website with WhatsApp lead integration completely changed how we capture buyers. Lead follow-up time went from hours to minutes within two months.",
  },
  {
    name: "Priya Nair",
    role: "Law Firm Partner",
    company: "Indore, MP",
    date: "2026-01",
    rating: 5,
    service: "Law Firm Website + Consultation Booking",
    result: "New consultation channel for the firm",
    text: "As lawyers, credibility matters. MistHustlers delivered a professional, trustworthy site with online consultation booking. It has become a steady new channel for client enquiries.",
  },
  {
    name: "Rohan Khanna",
    role: "E-commerce Owner",
    company: "Pan-India",
    date: "2025-12",
    rating: 4,
    service: "Business Website + Speed Fix",
    result: "LCP down from 5.8s to 1.4s",
    text: "The site is dramatically faster and our Google rankings improved after the Core Web Vitals work. Pricing was fair and delivery was as promised.",
  },
  {
    name: "Kiran Soni",
    role: "Construction Contractor",
    company: "Indore, MP",
    date: "2025-11",
    rating: 5,
    service: "Company Website + Project Gallery",
    result: "New tender shortlisting inquiries",
    text: "The project gallery won us serious inquiries from real estate firms and even a pre-qualification for a government tender. Highly recommended in Indore.",
  },
  {
    name: "Manoj Yadav",
    role: "Travel Agency Owner",
    company: "Indore, MP",
    date: "2025-10",
    rating: 5,
    service: "Tour Booking Website",
    result: "Online bookings started within a month",
    text: "Customers now browse tour packages and book directly. The payment gateway and WhatsApp confirmations work flawlessly. Priced exactly as quoted.",
  },
  {
    name: "Shreya Joshi",
    role: "Fitness Studio Founder",
    company: "Indore, MP",
    date: "2025-09",
    rating: 5,
    service: "Landing Page + Lead Form",
    result: "Membership trial enquiries doubled",
    text: "A clean landing page with a simple enquiry form doubled our trial-class enquiries. Setup included tracking so we finally know where leads come from.",
  },
  {
    name: "Rahul Bhatt",
    role: "Dentist",
    company: "Indore, MP",
    date: "2025-08",
    rating: 5,
    service: "Clinic Website + Local SEO",
    result: "Page-1 ranking for key local searches",
    text: "Was told we'd need months and a big budget to rank locally. MistHustlers built a fast, schema-optimised site and we now appear on page one for our key searches in Indore.",
  },
  {
    name: "Sneha Kulkarni",
    role: "Salon & Spa Owner",
    company: "Indore, MP",
    date: "2025-07",
    rating: 5,
    service: "Booking Website + WhatsApp Automation",
    result: "Recurring bookings via WhatsApp bot",
    text: "Bookings arrive even while we're closed. The WhatsApp automated replies qualified clients, confirmed appointments, and reminded them before slot closing.",
  },
];

const reviewsSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "MistHustlers Web Development Services",
  description: "Client reviews of MistHustlers web development, MVP, and AI automation projects in Indore and India.",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "48",
    bestRating: "5",
    worstRating: "1",
  },
  review: REVIEWS.map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.name },
    datePublished: `${r.date}-01`,
    reviewBody: r.text,
    reviewRating: { "@type": "Rating", ratingValue: r.rating },
  })),
};

export default function TestimonialsPage() {
  return (
    <>
      <SEO page="testimonials" />
      <SchemaMarkup page="testimonials" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(reviewsSchema)}</script>
      </Helmet>

      <main id="main-content" className="bg-basalt-canvas min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Breadcrumbs items={[{ label: "Testimonials" }]} />

          <div className="text-center max-w-3xl mx-auto my-8 font-body">
            <div className="inline-flex items-center gap-2 rounded-full bg-digital-orange/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-digital-orange mb-4">
              <ShieldCheck className="h-4 w-4" /> Verified Client Reviews
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-abyssal-ink">
              What Founders & Business Owners Say About MistHustlers
            </h1>
            <p className="mt-4 text-base sm:text-lg text-abyssal-ink/70 leading-relaxed">
              Real client feedback from Indore and across India — starring results measured in leads, bookings, and speed.
            </p>

            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 rounded-3xl bg-white border border-abyssal-ink/10 px-6 py-4 shadow-sm">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-5 w-5 text-digital-orange fill-digital-orange" />
                ))}
              </div>
              <div className="text-left">
                <div className="font-display text-2xl font-bold text-abyssal-ink leading-none">4.9/5</div>
                <div className="text-[11px] text-abyssal-ink/55 font-body mt-0.5">Based on 48+ verified project reviews</div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <article key={i} className="group flex flex-col rounded-3xl bg-white border border-abyssal-ink/10 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-digital-orange text-white font-bold text-sm">
                    {r.name.charAt(0)}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-abyssal-ink text-sm">
                      {r.name}
                      <BadgeCheck className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="text-[11px] text-abyssal-ink/55 font-medium">{r.role} · {r.company}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? "text-digital-orange fill-digital-orange" : "text-abyssal-ink/15 fill-abyssal-ink/15"}`} />
                    ))}
                  </span>
                  <span className="text-[10px] font-semibold text-abyssal-ink/45 uppercase tracking-wide">{r.date.replace("-", " ")}</span>
                </div>

                <p className="flex-1 text-xs text-abyssal-ink/70 leading-relaxed font-body">"{r.text}"</p>

                <div className="mt-4 pt-4 border-t border-abyssal-ink/8 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-abyssal-ink/70">
                    <Quote className="h-3 w-3 text-digital-orange" /> {r.service}
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2 text-[11px] font-semibold text-emerald-700">
                    <ThumbsUp className="h-3.5 w-3.5 flex-shrink-0" /> {r.result}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Video + Google Review CTA */}
          <section className="mt-16 rounded-3xl bg-white border border-abyssal-ink/10 p-8 shadow-sm">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-abyssal-ink mb-3">
                  Watch What Clients Say — Video Testimonials
                </h2>
                <p className="text-sm text-abyssal-ink/70 font-body leading-relaxed mb-6">
                  Real founders and business owners share how MistHustlers transformed their online presence. Video reviews are coming soon on our YouTube channel.
                </p>
                <a
                  href="#quote"
                  className="inline-flex items-center gap-2 rounded-full bg-digital-orange text-white px-6 py-3 text-sm font-bold hover:bg-digital-orange/90"
                >
                  <Play className="h-4 w-4" /> Video Coming Soon
                </a>
              </div>
              <a
                href="https://www.google.com/maps/search/MistHustlers+Indore"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center rounded-3xl bg-abyssal-ink p-8 text-center text-white hover:opacity-95 transition-opacity"
              >
                <PlayCircle className="h-10 w-10 text-digital-orange mb-4" />
                <h3 className="font-display text-2xl font-bold mb-2">Read Us on Google</h3>
                <p className="text-xs text-white/70 font-body leading-relaxed mb-5">
                  See our verified Google Business Profile reviews, photos, and ratings for yourself.
                </p>
                <span className="inline-flex items-center gap-2 rounded-full bg-digital-orange px-5 py-2.5 text-xs font-bold">
                  Open Google Reviews <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
            </div>
          </section>

          {/* CTA + Trust */}
          <div id="quote" className="mt-16 rounded-3xl bg-white border border-abyssal-ink/10 p-8 shadow-sm">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 mb-4">
                  <Quote className="h-4 w-4" /> Want Results Like These?
                </div>
                <h2 className="font-display text-3xl font-bold text-abyssal-ink mb-3">
                  Join Businesses Across 7 Countries with 5★ Results
                </h2>
                <p className="text-sm text-abyssal-ink/70 font-body leading-relaxed mb-4">
                  Tell us about your project and get a fixed-price quote + timeline within 48 hours.
                </p>
              </div>
              <ServiceInquiryForm />
            </div>
            <div className="mt-8">
              <TrustSection />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}