export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/aec~!@/((?!login).*)",
    "/api/admin/((?!forgot-password).*)",
  ],
};
