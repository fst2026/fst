import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { MAX_PHOTOS, MAX_PHOTO_SIZE_BYTES, MIN_PHOTOS } from "@/lib/constants";
import { checkRateLimit } from "@/lib/rate-limit";
import { createSubmission } from "@/lib/db";
import { sendSubmissionReceivedEmail } from "@/lib/email";
import { isSameOrigin } from "@/lib/http-security";
import { normalizeUploadedImage, uploadImageFile } from "@/lib/storage";
import { VehicleSubmission } from "@/lib/types";

export const runtime = "nodejs";

const textSchema = z.string().trim().min(1);

const submissionSchema = z.object({
  brand: textSchema,
  model: textSchema,
  productionYear: textSchema,
  registrationNumber: textSchema,
  modifications: textSchema,
  firstName: textSchema,
  lastName: textSchema,
  email: z.string().email(),
  phone: textSchema,
  instagram: z.string().trim().optional().default(""),
  tshirtSize: textSchema
});

function text(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function validatePhotos(photos: File[]) {
  if (photos.length < MIN_PHOTOS) {
    return `Wymagane są minimum ${MIN_PHOTOS} zdjęcia.`;
  }
  if (photos.length > MAX_PHOTOS) {
    return `Maksymalnie ${MAX_PHOTOS} zdjęć.`;
  }
  if (photos.some((photo) => photo.size > MAX_PHOTO_SIZE_BYTES)) {
    return "Każde zdjęcie może mieć maksymalnie 5 MB.";
  }
  return null;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limiter = await checkRateLimit(`submission:${ip}`, 20, 60 * 60 * 1000);
  if (!limiter.ok) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > 30 * 1024 * 1024) {
    return NextResponse.json({ message: "Payload too large." }, { status: 413 });
  }

  const formData = await request.formData();
  const photos = formData.getAll("photos").filter((item) => item instanceof File) as File[];

  const photoError = validatePhotos(photos);
  if (photoError) return NextResponse.json({ message: photoError }, { status: 400 });

  const parsed = submissionSchema.safeParse({
    brand: text(formData.get("brand")),
    model: text(formData.get("model")),
    productionYear: text(formData.get("productionYear")),
    registrationNumber: text(formData.get("registrationNumber")),
    modifications: text(formData.get("modifications")),
    firstName: text(formData.get("firstName")),
    lastName: text(formData.get("lastName")),
    email: text(formData.get("email")),
    phone: text(formData.get("phone")),
    instagram: text(formData.get("instagram")),
    tshirtSize: text(formData.get("tshirtSize"))
  });

  if (!parsed.success) {
    return NextResponse.json({ message: "Sprawdź poprawność pól formularza." }, { status: 400 });
  }

  const acceptedRules = formData.get("acceptedRules") === "on";
  const acceptedRodo = formData.get("acceptedRodo") === "on";
  if (!acceptedRules || !acceptedRodo) {
    return NextResponse.json({ message: "Wymagana akceptacja regulaminu i RODO." }, { status: 400 });
  }

  const normalized = await Promise.all(photos.map((photo) => normalizeUploadedImage(photo)));
  if (normalized.some((item) => item === null)) {
    return NextResponse.json({ message: "Dozwolone formaty to realne: JPG, PNG, WEBP." }, { status: 400 });
  }

  const safeNormalized = normalized.filter((item): item is NonNullable<typeof item> => Boolean(item));
  const uploaded = await Promise.all(safeNormalized.map((photo) => uploadImageFile(photo)));
  const photoPaths = uploaded.filter((value): value is string => Boolean(value));
  const now = new Date().toISOString();

  const submission: VehicleSubmission = {
    id: randomUUID(),
    ...parsed.data,
    photoPaths,
    acceptedRules,
    acceptedRodo,
    status: "pending",
    createdAt: now
  };

  await createSubmission(submission);
  await sendSubmissionReceivedEmail(submission);

  return NextResponse.json({ ok: true, id: submission.id });
}
