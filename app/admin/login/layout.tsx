import SessionProvider from "@/components/providers/SessionProvider";

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#0f1419]">{children}</div>
    </SessionProvider>
  );
}
