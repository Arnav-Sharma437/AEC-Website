export const dynamic = "force-dynamic";

import SessionProvider from "@/components/providers/SessionProvider";
import AdminShell from "@/components/admin/AdminShell";
import { ToastProvider } from "@/components/admin/ToastProvider";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ToastProvider>
        <AdminShell>{children}</AdminShell>
      </ToastProvider>
    </SessionProvider>
  );
}
