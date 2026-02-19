import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { getSuperAdminEmails, isAdminEmail } from "@/lib/admin-auth";

const githubId = process.env.AUTH_GITHUB_ID;
const githubSecret = process.env.AUTH_GITHUB_SECRET;
const authSecret = process.env.AUTH_SECRET?.trim() ?? "";
const isAuthSecretStrong = authSecret.length >= 32;
const hasSuperAdminAllowlist = getSuperAdminEmails().size > 0;

export const authConfigurationIssue = !githubId || !githubSecret
  ? "missing_oauth_credentials"
  : !isAuthSecretStrong
    ? "weak_auth_secret"
    : !hasSuperAdminAllowlist
      ? "missing_super_admin_allowlist"
      : null;

export const isOAuthConfigured = authConfigurationIssue === null;

export const { handlers, auth } = NextAuth({
  secret: authSecret || undefined,
  providers: isOAuthConfigured
    ? [
        GitHub({
          clientId: githubId!,
          clientSecret: githubSecret!,
          authorization: { params: { scope: "read:user user:email" } }
        })
      ]
    : [],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user }: { user: { email?: string | null } }) {
      return isAdminEmail(user.email);
    }
  }
});
