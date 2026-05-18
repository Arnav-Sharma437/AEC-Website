export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin/((?!login).*)",
    // Allow seed & check without auth (bootstrap + diagnostics)
    "/api/admin/((?!seed|check).*)",
  ],
};
