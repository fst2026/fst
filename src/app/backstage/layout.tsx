import type { Metadata } from "next";
import { auth, authConfigurationIssue, isOAuthConfigured } from "@/auth";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminNav } from "@/components/AdminNav";
import { isAdminEmail, isSuperAdminEmail } from "@/lib/admin-auth";
import { isDevAuthBypassEnabled } from "@/lib/env";

export const metadata: Metadata = {
  title: "Panel admina - Fanatic Summer Car Show",
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

export default async function BackstageLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const skipAuth = isDevAuthBypassEnabled();
  const session = await auth();
  const userEmail = session?.user?.email;
  const isAdmin = skipAuth || isAdminEmail(userEmail);

  if (!isAdmin) {
    return <AdminLogin oauthConfigured={isOAuthConfigured} authConfigIssue={authConfigurationIssue} />;
  }

  const canEditSettings = skipAuth || isSuperAdminEmail(userEmail);

  return (
    <>
      <AdminNav canEditSettings={canEditSettings} />
      {children}
    </>
  );
}
