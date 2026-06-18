import { PrismaClient } from "@prisma/client";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();
const DATA_DIR = join(__dirname, "..", "data");

const PAGES = [
  { page: "home", file: "content-home.json" },
  { page: "services", file: "content-services.json" },
  { page: "career", file: "content-career.json" },
  { page: "projects", file: "content-projects.json" },
  { page: "contact", file: "contact.json" },
  { page: "logo", file: "content-logo.json" },
  { page: "seo", file: "content-seo.json" },
];

const OPPORTUNITIES = [
  { title: "Frontend Developer Intern", description: "Ship polished landing pages and product experiences for builder-led brands inside the MistHustlers ecosystem.", department: "Engineering", type: "Internship", location: "Remote", status: "open", applicants: 0 },
  { title: "Community Growth Associate", description: "Help grow partnerships, improve community activation, and support campaigns across emerging creator and startup programs.", department: "Growth", type: "Job", location: "Hybrid", status: "open", applicants: 0 },
  { title: "AI Automation Workshop", description: "A live hands-on workshop on building repeatable AI workflows for solopreneurs, interns, and early-stage teams.", department: "AI", type: "Event", location: "Online", status: "open", applicants: 0 },
  { title: "Coding Bootcamp — 30 Days", description: "An intensive builder program focused on shipping, feedback cycles, portfolio proof, and real execution discipline.", department: "Education", type: "Program", location: "Cohort-based", status: "open", applicants: 0 },
  { title: "Builder Sprint Hackathon", description: "Build, demo, and iterate on startup-ready concepts in a high-energy sprint guided by product-first mentors.", department: "Innovation", type: "Hackathon", location: "Online", status: "open", applicants: 0 },
  { title: "Landing Page Design Project", description: "Design and polish a conversion-led landing page for a growth-stage service brand launching a fresh offer.", department: "Design", type: "Freelance Gig", location: "Remote", status: "open", applicants: 0 },
  { title: "Product Research Internship", description: "Support founder discovery sprints with market mapping, competitor tracking, insight synthesis, and user feedback reviews.", department: "Research", type: "Internship", location: "Remote", status: "open", applicants: 0 },
  { title: "Creator Partnerships Lead", description: "Own outreach and collaboration pipelines for creators, communities, and startup allies aligned with MistHustlers growth.", department: "Partnerships", type: "Job", location: "Remote-first", status: "open", applicants: 0 },
  { title: "Zero to Launch Founder Lab", description: "A guided execution track for first-time founders to validate offers, package services, and launch with confidence.", department: "Education", type: "Program", location: "Mentor-led", status: "open", applicants: 0 },
  { title: "Remote Growth Jam", description: "A live networking and strategy session where builders exchange launch feedback, tactics, and accountability plays.", department: "Community", type: "Event", location: "Live online", status: "open", applicants: 0 },
  { title: "Startup Weekend Buildathon", description: "Form teams, validate ideas, and present a working build during a curated weekend challenge for serious builders.", department: "Innovation", type: "Hackathon", location: "Hybrid sprint", status: "open", applicants: 0 },
  { title: "Motion Graphics Explainer Project", description: "Create a sharp, startup-style explainer reel for a product launch campaign with fast review and delivery cycles.", department: "Design", type: "Freelance Gig", location: "Remote", status: "open", applicants: 0 },
  { title: "Mentorship Program", description: "Get paired with an industry practitioner for 1:1 sessions covering career roadmapping, project reviews, accountability check-ins, and growth strategy.", department: "Education", type: "Program", location: "1:1 Remote", status: "open", applicants: 0 },
];

export async function seed() {
  const oppCount = await prisma.opportunity.count();
  const projCount = await prisma.project.count();

  for (const { page, file } of PAGES) {
    const existing = await prisma.content.findUnique({ where: { page } });
    if (existing) {
      console.log(`[SEED] ${page} already seeded, skipping`);
      continue;
    }
    const filePath = join(DATA_DIR, file);
    if (!existsSync(filePath)) {
      console.warn(`[SEED] Missing ${file}, skipping`);
      continue;
    }
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    await prisma.content.create({ data: { page, data } });
    console.log(`[SEED] ${page} → created`);
  }

  if (oppCount === 0) {
    for (const opp of OPPORTUNITIES) {
      await prisma.opportunity.create({ data: opp });
    }
    console.log(`[SEED] ${OPPORTUNITIES.length} opportunities → created`);
  } else {
    console.log("[SEED] Opportunities already seeded, skipping");
  }

  if (projCount === 0) {
    const projects = [
      { name: "MistHustlers Platform", description: "Core platform development for the MistHustlers ecosystem.", clientName: "Internal", status: "completed" },
      { name: "AI Automation Dashboard", description: "Internal tooling for AI workflow automation.", clientName: "Internal", status: "in-progress" },
      { name: "Community CRM Integration", description: "Customer relationship management for community pod tracking.", clientName: "Internal", status: "planning" },
    ];
    for (const proj of projects) {
      await prisma.project.create({ data: proj });
    }
    console.log(`[SEED] ${projects.length} projects → created`);
  } else {
    console.log("[SEED] Projects already seeded, skipping");
  }

  console.log("[SEED] Done");
  await prisma.$disconnect();
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  seed().catch((err) => {
    console.error("[SEED] Failed:", err);
    process.exit(1);
  });
}
