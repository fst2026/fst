export function getAllowedAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const allowed = getAllowedAdminEmails();
  if (allowed.size === 0) return false;
  return allowed.has(email.toLowerCase());
}
