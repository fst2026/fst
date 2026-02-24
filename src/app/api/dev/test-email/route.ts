import { NextResponse } from "next/server";
import {
  sendSubmissionReceivedEmail,
  sendSubmissionAcceptedEmail,
  sendSubmissionRejectedEmail
} from "@/lib/email";
import { isDevAuthBypassEnabled, isDevelopmentRuntime } from "@/lib/env";
import { VehicleSubmission } from "@/lib/types";

export const runtime = "nodejs";

const mockSubmission: VehicleSubmission = {
  id: "test-123",
  brand: "BMW",
  model: "E36 325i",
  productionYear: "1995",
  registrationNumber: "GD 12345",
  modifications: "Swap M50B25, coilovers, BBS RS",
  photoPaths: [],
  firstName: "Jan",
  lastName: "Testowy",
  email: "", // will be set from query param
  phone: "123456789",
  instagram: "@test",
  tshirtSize: "L",
  acceptedRules: true,
  acceptedRodo: true,
  status: "pending",
  createdAt: new Date().toISOString()
};

export async function GET(request: Request) {
  // Never expose this endpoint outside local development.
  if (!isDevelopmentRuntime()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!isDevAuthBypassEnabled()) {
    return NextResponse.json(
      { error: "Test emails only available with SKIP_AUTH=true in development mode" },
      { status: 403 }
    );
  }

  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const email = url.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      {
        error: "Missing email parameter",
        usage: "/api/dev/test-email?type=received|accepted|rejected|contact&email=your@email.com"
      },
      { status: 400 }
    );
  }

  const submission = { ...mockSubmission, email };

  try {
    let result = false;
    let emailType = "";

    switch (type) {
      case "received":
        result = await sendSubmissionReceivedEmail(submission);
        emailType = "Potwierdzenie otrzymania zgłoszenia";
        break;
      case "accepted":
        result = await sendSubmissionAcceptedEmail(submission);
        emailType = "Akceptacja zgłoszenia";
        break;
      case "rejected":
        result = await sendSubmissionRejectedEmail(submission);
        emailType = "Odrzucenie zgłoszenia";
        break;
      default:
        return NextResponse.json(
          {
            error: "Invalid type",
            validTypes: ["received", "accepted", "rejected"],
            usage: "/api/dev/test-email?type=received&email=your@email.com"
          },
          { status: 400 }
        );
    }

    if (!result) {
      return NextResponse.json(
        {
          error: "Email not sent - check SMTP configuration",
          hint: "Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env.local"
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: `Email "${emailType}" wysłany do ${email}`,
      type,
      email
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: err instanceof Error ? err.message : String(err)
      },
      { status: 500 }
    );
  }
}
