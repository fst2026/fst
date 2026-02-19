import { VehicleSubmission } from "@/lib/types";

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
    from: process.env.MAIL_FROM ?? "no-reply@fanaticspeedteam.pl",
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html
  });
  return true;
}

export async function sendSubmissionReceivedEmail(submission: VehicleSubmission) {
  const subject = "Potwierdzenie otrzymania zgłoszenia - Fanatic Summer Car Show";
  const text =
    `Cześć ${submission.firstName},\n\n` +
    "Twoje zgłoszenie zostało przyjęte i oczekuje na rozpatrzenie.\n" +
    "Po decyzji organizatora otrzymasz kolejną wiadomość.\n\n" +
    "Pozdrawiamy,\nFanatic Speed Team";

  const html = `<p>Cześć ${submission.firstName},</p>
<p>Twoje zgłoszenie zostało przyjęte i <strong>oczekuje na rozpatrzenie</strong>.</p>
<p>Po decyzji organizatora otrzymasz kolejną wiadomość.</p>
<p>Pozdrawiamy,<br/>Fanatic Speed Team</p>`;

  return sendMail({ to: submission.email, subject, text, html });
}

export async function sendSubmissionAcceptedEmail(submission: VehicleSubmission) {
  const bankAccount = process.env.PAYMENT_BANK_ACCOUNT ?? "00 0000 0000 0000 0000 0000 0000";
  const recipientName = process.env.PAYMENT_RECIPIENT_NAME ?? "Stowarzyszenie Fanatic Speed Team";
  const amount = process.env.ENTRY_FEE_PLN ?? "150";
  const deadline = process.env.PAYMENT_DEADLINE_TEXT ?? "w ciągu 72 godzin od otrzymania tej wiadomości";

  const subject = "Akceptacja zgłoszenia - Fanatic Summer Car Show";
  const text =
    `Cześć ${submission.firstName},\n\n` +
    "Twoje zgłoszenie zostało zaakceptowane.\n\n" +
    `Kwota wpisowego: ${amount} zł\n` +
    `Termin płatności: ${deadline}\n` +
    `Odbiorca: ${recipientName}\n` +
    `Numer konta: ${bankAccount}\n\n` +
    "Po opłaceniu wpisowego potwierdzimy finalnie udział.\n\n" +
    "Pozdrawiamy,\nFanatic Speed Team";

  const html = `<p>Cześć ${submission.firstName},</p>
<p>Twoje zgłoszenie zostało <strong>zaakceptowane</strong>.</p>
<p><strong>Kwota wpisowego:</strong> ${amount} zł<br/>
<strong>Termin płatności:</strong> ${deadline}<br/>
<strong>Odbiorca:</strong> ${recipientName}<br/>
<strong>Numer konta:</strong> ${bankAccount}</p>
<p>Po opłaceniu wpisowego potwierdzimy finalnie udział.</p>
<p>Pozdrawiamy,<br/>Fanatic Speed Team</p>`;

  return sendMail({ to: submission.email, subject, text, html });
}

export async function sendSubmissionRejectedEmail(submission: VehicleSubmission) {
  const parkingMapUrl = process.env.PARKING_MAP_URL ?? "https://maps.google.com/?q=Gda%C5%84sk";
  const subject = "Informacja o zgłoszeniu - Fanatic Summer Car Show";
  const text =
    `Cześć ${submission.firstName},\n\n` +
    "Tym razem nie mogliśmy zaakceptować Twojego zgłoszenia pojazdu.\n" +
    "Mimo to serdecznie zapraszamy Cię jako odwiedzającego na wydarzenie.\n" +
    `Mapa parkingu: ${parkingMapUrl}\n\n` +
    "Do zobaczenia,\nFanatic Speed Team";

  const html = `<p>Cześć ${submission.firstName},</p>
<p>Tym razem nie mogliśmy zaakceptować Twojego zgłoszenia pojazdu.</p>
<p>Mimo to serdecznie zapraszamy Cię jako odwiedzającego na wydarzenie.</p>
<p><strong>Mapa parkingu:</strong> <a href="${parkingMapUrl}" target="_blank" rel="noreferrer">${parkingMapUrl}</a></p>
<p>Do zobaczenia,<br/>Fanatic Speed Team</p>`;

  return sendMail({ to: submission.email, subject, text, html });
}
