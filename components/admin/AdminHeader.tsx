"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Menu } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/hero": "Hero Banner",
};

export default function AdminHeader({
  onMenuClick,
  showMenuButton,
}: {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const title =
    PAGE_TITLES[pathname] ||
    (pathname.startsWith("/admin/products") ? "Products" : "Admin");

  const displayName =
    session?.user?.name || session?.user?.email?.split("@")[0] || "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div>
          <h1 className="font-display text-lg font-bold text-slate-900 sm:text-xl">
            {title}
          </h1>
          <p className="hidden text-xs text-slate-500 sm:block">AEC Management Panel</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">{displayName}</p>
          <p className="text-xs text-slate-500">Administrator</p>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
