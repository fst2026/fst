export function getAllowedAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function getSuperAdminEmails() {
  return new Set(
    (process.env.SUPER_ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const normalized = email.toLowerCase();
  const allowed = getAllowedAdminEmails();
  const superAdmins = getSuperAdminEmails();
  return allowed.has(normalized) || superAdmins.has(normalized);
}

/** Super admin = can edit site settings */
export function isSuperAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const superAdmins = getSuperAdminEmails();
  if (superAdmins.size === 0) return false;
  return superAdmins.has(email.toLowerCase());
}
