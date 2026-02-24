import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth, authConfigurationIssue, isOAuthConfigured } from "@/auth";
import { isAdminEmail } from "@/lib/admin-auth";
import { isDevAuthBypassEnabled } from "@/lib/env";

function isProtectedPath(pathname: string) {
  return pathname === "/backstage" || pathname.startsWith("/backstage/") || pathname.startsWith("/api/submissions/export") || (pathname.startsWith("/api/submissions/") && pathname.endsWith("/status")) || (pathname === "/api/settings" && true);
}

type RequestWithAuth = NextRequest & {
  auth?: {
    user?: {
      email?: string | null;
    };
  } | null;
};

export default auth((request: RequestWithAuth) => {
  if (!isProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // DEV/TEST only: skip auth entirely when explicitly enabled.
  if (isDevAuthBypassEnabled()) {
    return NextResponse.next();
  }

  if (!isOAuthConfigured) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          message: "Admin OAuth is not configured.",
          reason: authConfigurationIssue
        },
        { status: 503 }
      );
    }
    return NextResponse.next();
  }

  const isAdmin = isAdminEmail(request.auth?.user?.email);
  if (isAdmin) return NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // For app routes (e.g. /backstage), let the page handle auth UI.
  // Redirecting to NextAuth default sign-in page can break UX on some deployments.
  return NextResponse.next();
});

export const config = {
  matcher: ["/backstage/:path*", "/api/submissions/:path*", "/api/settings"]
};
