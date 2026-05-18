export const dynamic = "force-dynamic";

import SessionProvider from "@/components/providers/SessionProvider";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}
