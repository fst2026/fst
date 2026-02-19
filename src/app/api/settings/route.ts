import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { isSuperAdminEmail } from "@/lib/admin-auth";
import { isSameOrigin } from "@/lib/http-security";
import { getCachedSettings, updateSettingsWithRevalidate } from "@/lib/settings";

// Only allow https:// URLs (blocks javascript:, data:, etc.)
const safeUrlSchema = z.string().url().refine(
  (url) => url.startsWith("https://") || url.startsWith("http://"),
  "URL musi zaczynać się od https:// lub http://"
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
  parkingMapUrl: safeUrlSchema.optional()
});

export async function GET() {
  const settings = await getCachedSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const session = await auth();
  if (!isSuperAdminEmail(session?.user?.email)) {
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
