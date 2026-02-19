import type { Metadata } from "next";
import { auth, isOAuthConfigured } from "@/auth";
import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminLogin } from "@/components/AdminLogin";
import { getSubmissions } from "@/lib/db";
import { isAdminEmail, isSuperAdminEmail } from "@/lib/admin-auth";
import { getCachedSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Panel admina - Fanatic Summer Car Show",
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

export default async function AdminPage() {
  const session = await auth();
  const userEmail = session?.user?.email;
  const isAdmin = isAdminEmail(userEmail);

  if (!isAdmin) return <AdminLogin oauthConfigured={isOAuthConfigured} />;

  const canEditSettings = isSuperAdminEmail(userEmail);
  const [submissions, settings] = await Promise.all([getSubmissions(), getCachedSettings()]);

  return (
    <AdminDashboard
      initialSubmissions={submissions}
      initialSettings={settings}
      canEditSettings={canEditSettings}
    />
  );
}
