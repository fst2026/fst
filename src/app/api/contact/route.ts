import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { createContactRequest } from "@/lib/db";
import { isSameOrigin } from "@/lib/http-security";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(1),
  email: z.string().email(),
  message: z.string().trim().min(1)
});

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limiter = await checkRateLimit(`contact:${ip}`, 30, 60 * 60 * 1000);
  if (!limiter.ok) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > 64 * 1024) {
    return NextResponse.json({ message: "Payload too large." }, { status: 413 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Wypełnij wszystkie pola." }, { status: 400 });
  }

  await createContactRequest({
    id: randomUUID(),
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ ok: true });
}
