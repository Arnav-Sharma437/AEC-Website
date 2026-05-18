import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const log = (msg: string, data?: unknown) =>
          console.error("[Admin Auth]", msg, data ?? "");

        try {
          if (!credentials?.email || !credentials?.password) {
            log("Missing username or password");
            return null;
          }

          if (!process.env.NEXTAUTH_SECRET) {
            log("NEXTAUTH_SECRET is not set");
            return null;
          }

          const nextAuthUrl =
            process.env.NEXTAUTH_URL || process.env.VERCEL_URL;
          if (!nextAuthUrl?.trim()) {
            log("NEXTAUTH_URL and VERCEL_URL are not set");
            return null;
          }

          if (!process.env.MONGODB_URI?.trim()) {
            log("MONGODB_URI is not set");
            return null;
          }

          await connectDB();
          const login = credentials.email.trim().toLowerCase();
          const password = credentials.password;

          log("Login attempt for:", login);

          const admin = await Admin.findOne({
            $or: [{ username: login }, { email: login }],
          }).lean();

          if (!admin) {
            log("No admin found for username/email:", login);
            const count = await Admin.countDocuments();
            log("Total admins in DB:", count);
            return null;
          }

          log("Admin found:", {
            id: admin._id,
            username: admin.username,
            hasPassword: Boolean(admin.password),
            hashPrefix: admin.password?.substring(0, 7),
          });

          if (!admin.password?.startsWith("$2")) {
            log("Password field is not a bcrypt hash");
            return null;
          }

          const valid = await bcrypt.compare(password, admin.password);
          log("bcrypt.compare result:", valid);

          if (!valid) {
            return null;
          }

          return {
            id: admin._id.toString(),
            email: admin.username || login,
            name: admin.name || admin.username || login,
          };
        } catch (error) {
          log("authorize() error:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
