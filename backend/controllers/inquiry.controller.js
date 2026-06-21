import prisma from "../prisma/client.js";
import { sendInquiryEmail } from "../services/mail.service.js";
import { syncInquiryToSheet } from "../services/sheet.service.js";

export async function submitInquiry(req, res, next) {
  try {
    const { name, email, phone, company, service, budget, message } = req.body;

    let inquiry = await prisma.inquiry.create({
      data: { name, email, phone, company: company || null, service, budget, message, emailStatus: "pending", sheetStatus: "pending" },
    });

    try {
      await sendInquiryEmail({ name, email, phone, company: company || "", service, budget, message });
      inquiry = await prisma.inquiry.update({ where: { id: inquiry.id }, data: { emailStatus: "sent" } });
    } catch (emailErr) {
      const isMissingMailConfig = emailErr.code === "MAIL_NOT_CONFIGURED";
      if (isMissingMailConfig) {
        console.warn("[INQUIRY EMAIL SKIPPED]", emailErr.message);
        inquiry = await prisma.inquiry.update({ where: { id: inquiry.id }, data: { emailStatus: "skipped" } });
      } else {
        console.error("[INQUIRY EMAIL FAILED]", emailErr.message);
        inquiry = await prisma.inquiry.update({ where: { id: inquiry.id }, data: { emailStatus: "failed" } });
      }
    }

    const sheetResult = await syncInquiryToSheet(inquiry);
    try {
      await prisma.inquiry.update({
        where: { id: inquiry.id },
        data: {
          sheetStatus: sheetResult.status,
          sheetError: sheetResult.error || null,
        },
      });
    } catch (sheetErr) {
      console.error("[INQUIRY SHEET STATUS UPDATE FAILED]", sheetErr.message);
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
