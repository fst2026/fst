import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toSubmissionCsv } from "@/lib/csv";
import { getSubmissions } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin-auth";
import { isDevAuthBypassEnabled } from "@/lib/env";

export async function GET() {
  const skipAuth = isDevAuthBypassEnabled();
  const session = await auth();
  if (!skipAuth && !isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const submissions = await getSubmissions();
  const csv = toSubmissionCsv(submissions);
  const fileName = `zgloszenia-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`
    }
  });
}
