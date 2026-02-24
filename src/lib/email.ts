import { getSettings } from "@/lib/db";
import { replaceTemplatePlaceholders, textToHtml } from "@/lib/email-template";
import { SiteSettings, VehicleSubmission } from "@/lib/types";

function getTemplateValues(
  settings: SiteSettings,
  submission: VehicleSubmission
): Record<string, string | number> {
  return {
    firstName: submission.firstName,
    entryFeePln: settings.entryFeePln,
    paymentBankAccount: settings.paymentBankAccount,
    paymentDeadlineText: settings.paymentDeadlineText,
    paymentRecipientName: settings.paymentRecipientName,
    parkingMapUrl: settings.parkingMapUrl
      ? `Mapa parkingu: ${settings.parkingMapUrl}`
      : ""
  };
}

async function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  const nodemailer = await import("nodemailer");
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

async function sendMail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  await transporter.sendMail({
    from: process.env.MAIL_FROM ?? "fanaticspeedteamost@gmail.com",
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html
  });
  return true;
}

export async function sendSubmissionReceivedEmail(submission: VehicleSubmission) {
  const settings = await getSettings();
  const values = getTemplateValues(settings, submission);
  const subject = `Potwierdzenie otrzymania zgłoszenia - ${settings.eventName}`;
  const text = replaceTemplatePlaceholders(settings.emailTemplateReceived, values);
  const html = textToHtml(text);

  return sendMail({ to: submission.email, subject, text, html });
}

export async function sendSubmissionAcceptedEmail(submission: VehicleSubmission) {
  const settings = await getSettings();
  const values = getTemplateValues(settings, submission);
  const subject = `Akceptacja zgłoszenia - ${settings.eventName}`;
  const text = replaceTemplatePlaceholders(settings.emailTemplateAccepted, values);
  const html = textToHtml(text);

  return sendMail({ to: submission.email, subject, text, html });
}

export async function sendSubmissionRejectedEmail(submission: VehicleSubmission) {
  const settings = await getSettings();
  const values = getTemplateValues(settings, submission);
  const subject = `Informacja o zgłoszeniu - ${settings.eventName}`;
  const text = replaceTemplatePlaceholders(settings.emailTemplateRejected, values);
  const html = textToHtml(text);

  return sendMail({ to: submission.email, subject, text, html });
}
