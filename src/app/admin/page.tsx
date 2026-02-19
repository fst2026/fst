import type { Metadata } from "next";
import { auth, isOAuthConfigured } from "@/auth";
import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminLogin } from "@/components/AdminLogin";
import { getSubmissions } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin-auth";

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
  const isAdmin = isAdminEmail(session?.user?.email);

  if (!isAdmin) return <AdminLogin oauthConfigured={isOAuthConfigured} />;

  const submissions = await getSubmissions();
  return <AdminDashboard initialSubmissions={submissions} />;
}
