import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth({
  ...authOptions,
  events: {
    async signIn({ user }) {
      console.error("[Admin Auth] signIn event OK:", user?.email);
    },
  },
  logger: {
    error(code, metadata) {
      console.error("[Admin Auth] NextAuth error:", code, metadata);
    },
    warn(code) {
      console.warn("[Admin Auth] NextAuth warn:", code);
    },
  },
});

export { handler as GET, handler as POST };
