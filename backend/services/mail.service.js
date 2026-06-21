import nodemailer from "nodemailer";

const SERVICE_TIER_LABELS = {
  starter: "STARTER (₹999 – ₹4,999)",
  growth: "GROWTH (₹5,000 – ₹15,000)",
  premium: "PREMIUM (₹15,000 – ₹50,000+)",
};

export function getMailIntegrationStatus() {
  const missing = ["SMTP_EMAIL", "SMTP_PASSWORD", "EMAIL_TO"].filter((key) => !process.env[key]);
  return {
    configured: missing.length === 0,
    missing,
    from: process.env.SMTP_EMAIL ? process.env.SMTP_EMAIL.replace(/(^.).*(@.*$)/, "$1***$2") : null,
    to: process.env.EMAIL_TO ? process.env.EMAIL_TO.replace(/(^.).*(@.*$)/, "$1***$2") : null,
  };
}

function createMailTransporter() {
  const status = getMailIntegrationStatus();
  if (!status.configured) {
    const err = new Error(`SMTP is not configured (${status.missing.join(", ")})`);
    err.code = "MAIL_NOT_CONFIGURED";
    throw err;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
}

export async function sendInquiryEmail({ name, email, phone, company, service, budget, message }) {
  const transporter = createMailTransporter();

  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "long",
  });

  const emailBody = `
NEW PROJECT INQUIRY
${"=".repeat(50)}

Name:         ${name}
Email:        ${email}
Phone:        ${phone}
Company:      ${company || "N/A"}
Service Tier: ${SERVICE_TIER_LABELS[service] || service}
Budget:       ${budget}
${"=".repeat(50)}

Message:
${message}

${"=".repeat(50)}
Submitted At: ${timestamp}
  `.trim();

  await transporter.sendMail({
    from: `"${name} via MistHustlers" <${process.env.SMTP_EMAIL}>`,
    replyTo: email,
    to: process.env.EMAIL_TO,
    subject: "New Project Inquiry — MistHustlers",
    text: emailBody,
  });
}

export async function sendApplicantEmail({ name, email, phone, resumeUrl, coverLetter, opportunity }) {
  const transporter = createMailTransporter();

  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "long",
  });

  const emailBody = `
NEW CAREER APPLICATION
${"=".repeat(50)}

Name:        ${name}
Email:       ${email}
Phone:       ${phone || "N/A"}
Portfolio:   ${resumeUrl || "N/A"}
Opportunity: ${opportunity?.title || "General MistHustlers Opportunity"}
Type:        ${opportunity?.type || "N/A"}
Department:  ${opportunity?.department || "N/A"}
Location:    ${opportunity?.location || "N/A"}
${"=".repeat(50)}

Message:
${coverLetter || "N/A"}

${"=".repeat(50)}
Submitted At: ${timestamp}
  `.trim();

  await transporter.sendMail({
    from: `"${name} via MistHustlers Career" <${process.env.SMTP_EMAIL}>`,
    replyTo: email,
    to: process.env.EMAIL_TO,
    subject: "New Career Application — MistHustlers",
    text: emailBody,
  });
}
