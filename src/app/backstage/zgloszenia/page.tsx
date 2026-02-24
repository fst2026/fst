import { getSubmissions } from "@/lib/db";
import { AdminSubmissions } from "@/components/AdminSubmissions";

export default async function SubmissionsPage() {
  const submissions = await getSubmissions();

  return <AdminSubmissions initialSubmissions={submissions} />;
}
