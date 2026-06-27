import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import ScrollReveal from "@/components/ScrollReveal";
import { useContent } from "@/utils/useContent";

const ABOUT_DEFAULTS = {
  badge: "About Us",
  title: ["Premium Ecosystem", "Based in Indore"],
  highlightWord: "Based in Indore",
  description: "MistHustlers helps ambitious students, developers, founders, agents, and partners learn, build, earn, and grow through real execution.",
  membersTitle: "Core Team",
  members: [
    {
      name: "Naveen Salve",
      role: "Founder, MistHustlers",
      initials: "NS",
      imageUrl: "",
      bio: "Naveen is a developer and entrepreneur based in Indore. He founded MistHustlers to bridge the gap between ambitious builders and real-world execution.",
    },
  ],
  whatTitle: "What We Do",
  whatWeDo: [
    "MistHustlers is a premium ecosystem for learning, building, earning, and career growth.",
    "We build websites, MVPs, full-stack applications, and AI automation systems for startups and founders.",
    "We also manage client work through agents and partners with transparent tracking for delivery and payments.",
  ],
  whyTitle: "Why Choose MistHustlers",
  reasons: [
    { title: "Real Execution", desc: "Work is tied to real projects, client delivery, and measurable outcomes." },
    { title: "Direct Access", desc: "Clients and builders get direct communication with the people doing the work." },
    { title: "Transparent System", desc: "Admin, agent, and partner dashboards keep work, leads, and payments visible." },
    { title: "Post-Delivery Support", desc: "Projects include support and handoff so delivery does not stop at launch." },
  ],
  stackTitle: "Our Tech Stack",
  stackDescription: "Technologies we use to ship production-ready projects",
  techStack: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS", "Railway", "OpenAI", "Automation"],
  mapTitle: "MistHustlers Location - Indore",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.21689636887!2d75.788529!3d22.719568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcad1b410ddb%3A0x96ec4da356240f4!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1",
};

export default function About() {
  const c = useContent("about", ABOUT_DEFAULTS);
  const titleLines = Array.isArray(c.title) ? c.title : String(c.title || "").split("\n").filter(Boolean);

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
                {c.badge}
              </span>
              <h1 className="font-display text-[clamp(38px,12vw,80px)] leading-[0.92] tracking-[0.02em] text-abyssal-ink">
                {(titleLines.length ? titleLines : ABOUT_DEFAULTS.title).map((line, index) => (
                  <span key={`${line}-${index}`} className={line === c.highlightWord || index === titleLines.length - 1 ? "text-digital-orange" : ""}>
                    {line}{index < (titleLines.length ? titleLines.length : ABOUT_DEFAULTS.title.length) - 1 && <br />}
                  </span>
                ))}
              </h1>
              <p className="text-abyssal-ink/50 mt-4 max-w-xl mx-auto font-body">{c.description}</p>
            </motion.div>

            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-12 items-start mb-16 sm:mb-20">
              <ScrollReveal>
                <div>
                  <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink mb-6">{c.membersTitle}</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(c.members || []).map((member) => (
                      <div key={member.name} className="bg-ash-white rounded-[28px] p-6 border border-abyssal-ink/5 h-full">
                        <div className="w-20 h-20 rounded-full bg-abyssal-ink flex items-center justify-center mb-5 overflow-hidden ring-4 ring-white shadow-sm">
                          {member.imageUrl ? (
                            <img
                              src={member.imageUrl}
                              alt={`${member.name || "Team member"} portrait`}
                              width="80"
                              height="80"
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="font-display text-2xl text-white">{member.initials || member.name?.slice(0, 2)}</span>
                          )}
                        </div>
                        <h3 className="font-body font-bold text-xl tracking-[0.02em] text-abyssal-ink mb-1">{member.name}</h3>
                        <p className="text-sm text-abyssal-ink/50 font-semibold mb-4">{member.role}</p>
                        <p className="text-abyssal-ink/60 font-body leading-relaxed text-sm">{member.bio}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="space-y-6">
                  <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink">{c.whatTitle}</h2>
                  {(c.whatWeDo || []).map((item) => (
                    <p key={item} className="text-abyssal-ink/60 font-body leading-relaxed">{item}</p>
                  ))}
                  {c.mapEmbedUrl && (
                    <div className="min-h-[240px] overflow-hidden rounded-[28px] border border-abyssal-ink/5 bg-ash-white sm:min-h-[280px]">
                      <iframe
                        src={c.mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0, minHeight: "inherit" }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={c.mapTitle || "MistHustlers location"}
                      />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal>
              <div className="content-visibility-auto bg-ash-white rounded-[28px] sm:rounded-[40px] p-6 sm:p-10 border border-abyssal-ink/5 mb-16 sm:mb-20">
                <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink mb-8 text-center">{c.whyTitle}</h2>
                <div className="grid md:grid-cols-4 gap-8">
                  {(c.reasons || []).map((item) => (
                    <div key={item.title}>
                      <h3 className="font-semibold text-abyssal-ink mb-2 font-body">{item.title}</h3>
                      <p className="text-sm text-abyssal-ink/60 font-body leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="content-visibility-auto text-center">
                <h2 className="font-body font-bold text-3xl tracking-[0.02em] text-abyssal-ink mb-4">{c.stackTitle}</h2>
                <p className="text-abyssal-ink/50 mb-8 font-body">{c.stackDescription}</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {(c.techStack || []).map((tech) => (
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
