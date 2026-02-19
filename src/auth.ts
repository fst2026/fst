import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { isAdminEmail } from "@/lib/admin-auth";

const githubId = process.env.AUTH_GITHUB_ID;
const githubSecret = process.env.AUTH_GITHUB_SECRET;
export const isOAuthConfigured = Boolean(githubId && githubSecret);

export const { handlers, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
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
