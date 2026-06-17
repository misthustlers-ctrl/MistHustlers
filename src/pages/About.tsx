import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import ScrollReveal from "@/components/ScrollReveal";

export default function About() {
  return (
    <div className="bg-basalt-canvas min-h-screen">
      <SEO page="about" />
      <SchemaMarkup page="about" />
      <main>
        <section className="pt-28 sm:pt-32 pb-16 sm:pb-20">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-abyssal-ink/5 text-abyssal-ink/60 text-xs font-semibold tracking-wider uppercase mb-6 font-body">
                About Us
              </span>
              <h1 className="font-display text-[clamp(38px,12vw,80px)] leading-[0.92] tracking-[0.02em] text-abyssal-ink">
                Web Development Agency<br />
                <span className="text-digital-orange">Based in Indore</span>
              </h1>
              <p className="text-abyssal-ink/50 mt-4 max-w-xl mx-auto font-body">
                We help startups and founders ship web products fast. Fixed pricing. Direct communication. Real execution.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16 sm:mb-20">
              <ScrollReveal>
                <div className="bg-ash-white rounded-[28px] sm:rounded-[40px] p-6 sm:p-8 border border-abyssal-ink/5">
                  <div className="w-20 h-20 rounded-full bg-abyssal-ink flex items-center justify-center mb-6">
                    <span className="font-display text-3xl text-white">NS</span>
                  </div>
                  <h2 className="font-body font-bold text-2xl tracking-[0.02em] text-abyssal-ink mb-2">Naveen Salve</h2>
                  <p className="text-sm text-abyssal-ink/50 font-semibold mb-4">Founder, MistHustlers</p>
                  <p className="text-abyssal-ink/60 font-body leading-relaxed">
                    Naveen is a developer and entrepreneur based in Indore. He founded MistHustlers to bridge the gap
                    between ambitious builders and real-world execution. With hands-on experience in full-stack development,
                    automation, and AI systems, he leads the team in delivering production-grade work for startups.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="space-y-6">
                  <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink">What We Do</h2>
                  <p className="text-abyssal-ink/60 font-body leading-relaxed">
                    MistHustlers is a web development and automation agency based in Indore, Madhya Pradesh.
                    We build websites, MVPs, full-stack applications, and AI automation systems for startups and founders
                    who need execution over promises.
                  </p>
                  <p className="text-abyssal-ink/60 font-body leading-relaxed">
                    Unlike traditional agencies, we work with zero bureaucracy — direct communication with the developers
                    building your project, fixed pricing with no surprises, and source code included in every delivery.
                  </p>
                  <p className="text-abyssal-ink/60 font-body leading-relaxed">
                    We serve clients across India and globally, with a 48-hour response time on all inquiries.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal>
              <div className="bg-ash-white rounded-[28px] sm:rounded-[40px] p-6 sm:p-10 border border-abyssal-ink/5 mb-16 sm:mb-20">
                <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink mb-8 text-center">Why Choose MistHustlers</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { title: "Fixed Pricing", desc: "Know exactly what you pay upfront. No hourly billing, no scope creep, no surprises." },
                    { title: "Direct Access", desc: "You talk directly to the developers. No account managers, no layers of communication." },
                    { title: "Source Code Included", desc: "You own everything we build. Full source code, documentation, and commercial rights." },
                    { title: "48h Response", desc: "We respond to every inquiry within 48 hours. Async-first, all timezones welcome." },
                    { title: "Zero Bureaucracy", desc: "No meetings that could be emails. No sales pitches. Just direct, honest communication." },
                    { title: "Post-Delivery Support", desc: "Every project includes support from 14 to 90 days. We dont disappear after delivery." },
                  ].map((item) => (
                    <div key={item.title}>
                      <h3 className="font-semibold text-abyssal-ink mb-2 font-body">{item.title}</h3>
                      <p className="text-sm text-abyssal-ink/60 font-body leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="text-center">
                <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink mb-4">Our Tech Stack</h2>
                <p className="text-abyssal-ink/50 mb-8 font-body">Technologies we use to ship your projects</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {["React", "Next.js", "Node.js", "TypeScript", "Python", "PostgreSQL", "MongoDB", "AWS", "Docker", "Tailwind CSS", "Prisma", "OpenAI"].map((tech) => (
                    <span key={tech} className="px-4 py-2 rounded-full bg-ash-white border border-abyssal-ink/10 text-sm font-medium text-abyssal-ink/70 font-body">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </div>
  );
}
