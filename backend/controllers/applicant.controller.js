import prisma from "../prisma/client.js";
import { sendApplicantEmail } from "../services/mail.service.js";

export async function submitApplicant(req, res, next) {
  try {
    const { opportunityId, name, email, phone, resumeUrl, coverLetter } = req.body;

    let resolvedOpportunityId = Number(opportunityId);
    if (!resolvedOpportunityId) {
      const fallback = await prisma.opportunity.findFirst({ orderBy: { createdAt: "asc" } });
      if (!fallback) {
        return res.status(400).json({
          success: false,
          message: "No active opportunity is available yet",
        });
      }
      resolvedOpportunityId = fallback.id;
    }

    const applicant = await prisma.applicant.create({
      data: {
        opportunityId: resolvedOpportunityId,
        name,
        email,
        phone: phone || null,
        resumeUrl: resumeUrl || null,
        coverLetter: coverLetter || null,
        status: "new",
      },
    });

    await prisma.opportunity.update({
      where: { id: resolvedOpportunityId },
      data: { applicants: { increment: 1 } },
    });

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: resolvedOpportunityId },
    });

    try {
      await sendApplicantEmail({ name, email, phone, resumeUrl, coverLetter, opportunity });
    } catch (emailErr) {
      console.error("[APPLICANT EMAIL FAILED]", emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      id: applicant.id,
    });
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(400).json({ success: false, message: "Invalid opportunity selected" });
    }
    next(err);
  }
}
