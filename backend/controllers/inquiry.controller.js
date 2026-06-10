import prisma from "../prisma/client.js";
import { sendInquiryEmail } from "../services/mail.service.js";

export async function submitInquiry(req, res, next) {
  try {
    const { name, email, phone, company, service, budget, message } = req.body;

    const inquiry = await prisma.inquiry.create({
      data: { name, email, phone, company: company || null, service, budget, message, emailStatus: "pending" },
    });

    try {
      await sendInquiryEmail({ name, email, phone, company: company || "", service, budget, message });
      await prisma.inquiry.update({ where: { id: inquiry.id }, data: { emailStatus: "sent" } });
    } catch (emailErr) {
      console.error("[INQUIRY EMAIL FAILED]", emailErr.message);
      await prisma.inquiry.update({ where: { id: inquiry.id }, data: { emailStatus: "failed" } });
    }

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      id: inquiry.id,
    });
  } catch (err) {
    next(err);
  }
}
