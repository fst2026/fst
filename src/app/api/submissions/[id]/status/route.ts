import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { getSubmissionById, updateSubmissionStatus } from "@/lib/db";
import { sendSubmissionAcceptedEmail, sendSubmissionRejectedEmail } from "@/lib/email";
import { isSameOrigin } from "@/lib/http-security";
import { isAdminEmail } from "@/lib/admin-auth";
import { isDevAuthBypassEnabled } from "@/lib/env";

const schema = z.object({
  status: z.enum(["accepted", "rejected"])
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const skipAuth = isDevAuthBypassEnabled();
  const session = await auth();
  if (!skipAuth && !isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > 16 * 1024) {
    return NextResponse.json({ message: "Payload too large." }, { status: 413 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Niepoprawny status." }, { status: 400 });
  }

  const { id } = await params;
  const previous = await getSubmissionById(id);
  if (!previous) return NextResponse.json({ message: "Zgłoszenie nie istnieje." }, { status: 404 });

  const updated = await updateSubmissionStatus(id, parsed.data.status);
  if (!updated) return NextResponse.json({ message: "Nie udało się zapisać statusu." }, { status: 500 });

  if (previous.status !== updated.status) {
    if (updated.status === "accepted") {
      await sendSubmissionAcceptedEmail(updated);
    } else {
      await sendSubmissionRejectedEmail(updated);
    }
  }

  return NextResponse.json({ ok: true });
}
