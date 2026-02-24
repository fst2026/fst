import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { isSuperAdminEmail } from "@/lib/admin-auth";
import { canAccessSettings } from "@/lib/authz";
import { isDevAuthBypassEnabled } from "@/lib/env";
import { isSameOrigin } from "@/lib/http-security";
import { getCachedSettings, updateSettingsWithRevalidate } from "@/lib/settings";
import { isHttpsUrl } from "@/lib/url-security";

// Only allow https:// URLs (blocks javascript:, data:, mixed-content links).
const safeUrlSchema = z.string().url().refine(
  (url) => isHttpsUrl(url),
  "URL musi zaczynać się od https://"
).or(z.literal(""));

const eventDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Data musi być w formacie YYYY-MM-DD")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Podaj poprawną datę kalendarzową");

const settingsSchema = z.object({
  eventName: z.string().min(1).max(200).optional(),
  eventDate: eventDateSchema.optional(),
  eventLocation: z.string().min(1).max(300).optional(),
  facebookEventUrl: safeUrlSchema.optional(),
  galleryDropboxUrl: safeUrlSchema.optional(),
  socialFacebook: safeUrlSchema.optional(),
  socialInstagram: safeUrlSchema.optional(),
  socialTiktok: safeUrlSchema.optional(),
  associationName: z.string().min(1).max(200).optional(),
  associationAccountNumber: z.string().min(1).max(50).optional(),
  associationTaxId: z.string().min(1).max(50).optional(),
  associationContactEmail: z.string().email().optional(),
  entryFeePln: z.number().int().min(0).max(10000).optional(),
  paymentRecipientName: z.string().min(1).max(200).optional(),
  paymentBankAccount: z.string().min(1).max(50).optional(),
  paymentDeadlineText: z.string().min(1).max(200).optional(),
  parkingMapUrl: safeUrlSchema.optional(),
  submissionsOpen: z.boolean().optional(),
  submissionsClosedMessage: z.string().max(500).optional(),
  tshirtSizes: z.string().min(1).max(200).optional(),
  emailTemplateReceived: z.string().max(5000).optional(),
  emailTemplateAccepted: z.string().max(5000).optional(),
  emailTemplateRejected: z.string().max(5000).optional()
});

export async function GET() {
  const skipAuth = isDevAuthBypassEnabled();
  const session = await auth();
  const isSuperAdmin = isSuperAdminEmail(session?.user?.email);
  if (!canAccessSettings({ skipAuth, isSuperAdmin })) {
    return NextResponse.json({ error: "Unauthorized - super admin required" }, { status: 401 });
  }

  const settings = await getCachedSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const skipAuth = isDevAuthBypassEnabled();
  const session = await auth();
  const isSuperAdmin = isSuperAdminEmail(session?.user?.email);
  if (!canAccessSettings({ skipAuth, isSuperAdmin })) {
    return NextResponse.json({ error: "Unauthorized - super admin required" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = settingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updated = await updateSettingsWithRevalidate(parsed.data);
  return NextResponse.json(updated);
}
