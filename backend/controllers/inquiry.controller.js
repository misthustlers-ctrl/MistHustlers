import prisma from "../prisma/client.js";
import { sendInquiryEmail } from "../services/mail.service.js";
import { syncInquiryToSheet } from "../services/sheet.service.js";

function normalizeReferralCode(value) {
  return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
}

function attributionDataFor(referralCode) {
  if (!referralCode) return {};
  if (referralCode.ownerRole === "affiliate_partner") {
    return { affiliatePartnerId: referralCode.ownerId, leadSource: `referral:${referralCode.code}` };
  }
  if (referralCode.ownerRole === "acquisition_partner") {
    return { ownerId: referralCode.ownerId, acquisitionPartnerId: referralCode.ownerId, leadSource: `referral:${referralCode.code}` };
  }
  if (referralCode.ownerRole === "agent") {
    return { ownerId: referralCode.ownerId, leadSource: `referral:${referralCode.code}` };
  }
  return {};
}

async function findActiveReferralCode(code) {
  const normalized = normalizeReferralCode(code);
  if (!normalized || normalized.length < 4) return null;
  return prisma.referralCode.findFirst({
    where: { code: normalized, status: "active", owner: { status: "active" } },
  });
}

async function recordReferralEvent(referralCode, req, eventType, path) {
  if (!referralCode) return;
  await prisma.referralEvent.create({
    data: {
      referralCodeId: referralCode.id,
      eventType,
      path: String(path || req.get("referer") || "").slice(0, 500) || null,
      userAgent: String(req.get("user-agent") || "").slice(0, 500) || null,
    },
  }).catch((err) => console.warn("[REFERRAL EVENT SKIPPED]", err.message));
}

export async function submitInquiry(req, res, next) {
  try {
    const { name, email, phone, company, service, budget, message, referralCode } = req.body;
    const referral = await findActiveReferralCode(referralCode);

    let inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        company: company || null,
        service,
        budget,
        message,
        emailStatus: "pending",
        sheetStatus: "pending",
        leadSource: referral ? `referral:${referral.code}` : "website",
        ...attributionDataFor(referral),
      },
    });

    if (referral) {
      await prisma.referralAttribution.create({
        data: { referralCodeId: referral.id, targetType: "inquiry", targetId: inquiry.id, status: "pending" },
      }).catch((err) => console.warn("[REFERRAL ATTRIBUTION SKIPPED]", err.message));
      await recordReferralEvent(referral, req, "conversion", req.body.path);
    }

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

export async function trackReferralClick(req, res, next) {
  try {
    const referral = await findActiveReferralCode(req.body.referralCode || req.query.ref);
    if (referral) await recordReferralEvent(referral, req, "click", req.body.path);
    res.json({ success: true, tracked: Boolean(referral) });
  } catch (err) {
    next(err);
  }
}
