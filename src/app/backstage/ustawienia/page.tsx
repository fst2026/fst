import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isSuperAdminEmail } from "@/lib/admin-auth";
import { isDevAuthBypassEnabled } from "@/lib/env";
import { getCachedSettings } from "@/lib/settings";
import { AdminSettings } from "@/components/AdminSettings";

export default async function SettingsPage() {
  const skipAuth = isDevAuthBypassEnabled();
  const session = await auth();
  const canEditSettings = skipAuth || isSuperAdminEmail(session?.user?.email);

  if (!canEditSettings) {
    redirect("/backstage/zgloszenia");
  }

  const settings = await getCachedSettings();

  return <AdminSettings initialSettings={settings} />;
}
