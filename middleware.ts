export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/aec~!@",
    "/aec~!@/((?!login).*)",
    "/api/admin/((?!forgot-password).*)",
  ],
};
