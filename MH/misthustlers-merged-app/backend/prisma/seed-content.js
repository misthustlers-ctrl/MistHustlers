import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import prisma from "./client.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const backendDir = join(__dirname, "..");

const PROJECTS = [
  {
    name: "Automation Dashboard",
    clientName: "Automation",
    description: "Real-time workflow monitoring and automation control panel for enterprise operations.",
    status: "completed",
  },
  {
    name: "E-Commerce Platform",
    clientName: "Development",
    description: "Full-stack online marketplace with payment integration, inventory management, and analytics.",
    status: "completed",
  },
  {
    name: "AI Content Pipeline",
    clientName: "AI",
    description: "Automated content generation system leveraging LLMs for marketing and documentation.",
    status: "in-progress",
  },
  {
    name: "Portfolio Builder App",
    clientName: "Tooling",
    description: "Drag-and-drop portfolio builder with custom themes, SEO optimization, and hosting.",
    status: "review",
  },
  {
    name: "Client CRM System",
    clientName: "Freelancing",
    description: "Client management platform with invoicing, project tracking, and communication tools.",
    status: "in-progress",
  },
  {
    name: "Career Match Engine",
    clientName: "Platform",
    description: "AI-powered talent matching platform connecting builders with relevant opportunities.",
    status: "planning",
  },
];

function toDbType(type) {
  const map = {
    Job: "full-time",
    Internship: "internship",
    Event: "event",
    Program: "program",
    Hackathon: "hackathon",
    "Freelance Gig": "contract",
  };
  return map[type] || "full-time";
}

export async function seedContent() {
  const career = JSON.parse(
    await readFile(join(backendDir, "data", "content-career.json"), "utf-8")
  );

  for (const opportunity of career.opportunities || []) {
    const data = {
      title: opportunity.title,
      description: opportunity.description,
      department: opportunity.type,
      type: toDbType(opportunity.type),
      location: opportunity.mode || "Remote",
      status: "open",
    };
    const existing = await prisma.opportunity.findFirst({ where: { title: opportunity.title } });
    if (existing) {
      await prisma.opportunity.update({ where: { id: existing.id }, data });
    } else {
      await prisma.opportunity.create({ data });
    }
  }

  for (const project of PROJECTS) {
    const existing = await prisma.project.findFirst({ where: { name: project.name } });
    if (existing) {
      await prisma.project.update({ where: { id: existing.id }, data: project });
    } else {
      await prisma.project.create({ data: project });
    }
  }
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`) {
  seedContent()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
