import { Router } from "express";
import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import prisma from "../prisma/client.js";
import { submitApplicant } from "../controllers/applicant.controller.js";
import { validateApplicant, handleValidationErrors } from "../middleware/validate.middleware.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

async function readCareerContent() {
  try {
    return JSON.parse(
      await readFile(join(__dirname, "..", "data", "content-career.json"), "utf-8")
    );
  } catch {
    return { opportunities: [] };
  }
}

function mapType(type) {
  const normalized = String(type || "").toLowerCase();
  if (normalized.includes("intern")) return "Internship";
  if (normalized.includes("contract")) return "Freelance Gig";
  if (normalized.includes("event")) return "Event";
  if (normalized.includes("program")) return "Program";
  if (normalized.includes("hack")) return "Hackathon";
  return "Job";
}

router.get("/opportunities", async (_, res, next) => {
  try {
    const [items, careerContent] = await Promise.all([
      prisma.opportunity.findMany({
        where: { status: "open" },
        orderBy: { createdAt: "desc" },
      }),
      readCareerContent(),
    ]);
    const richByTitle = new Map((careerContent.opportunities || []).map((item) => [item.title, item]));
    const data = items.map((item) => {
      const rich = richByTitle.get(item.title) || {};
      return {
        ...rich,
        id: item.id,
        title: item.title,
        description: item.description,
        type: rich.type || mapType(item.type),
        skills: Array.isArray(rich.skills) && rich.skills.length > 0 ? rich.skills : [item.department || mapType(item.type)],
        duration: rich.duration || (mapType(item.type) === "Event" ? "Upcoming" : item.location || "Flexible"),
        dateTime: rich.dateTime || (mapType(item.type) === "Event" || mapType(item.type) === "Hackathon" ? item.location || "Upcoming" : undefined),
        budget: rich.budget || (mapType(item.type) === "Freelance Gig" ? "Discuss after shortlisting" : undefined),
        level: rich.level || "Intermediate",
        mode: rich.mode || item.location || "Remote",
        cta: rich.cta || "Apply Now",
      };
    });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.get("/projects", async (_, res, next) => {
  try {
    const items = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
    const visuals = ["⚡", "🛒", "🤖", "🎨", "📊", "🔗"];
    const data = items.map((item, index) => ({
      id: item.id,
      title: item.name,
      name: item.name,
      category: item.clientName || item.status || "Project",
      visual: visuals[index % visuals.length],
      desc: item.description || "A MistHustlers community project shipped with real execution discipline.",
      description: item.description,
      clientName: item.clientName,
      status: item.status,
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.post("/applicants", validateApplicant, handleValidationErrors, submitApplicant);

export default router;
