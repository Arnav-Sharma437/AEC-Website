"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ImageIcon,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Analytics", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/hero", label: "Hero Banner", icon: ImageIcon },
];

export default function AdminSidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-[#0f1419] text-gray-300">
      <div className="border-b border-white/10 px-6 py-6">
        <p className="font-display text-lg font-bold uppercase tracking-wide text-white">
          AEC Admin
        </p>
        <p className="text-xs text-gray-500">Management Panel</p>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition",
              pathname === href || (href !== "/admin" && pathname.startsWith(href))
                ? "bg-accent/20 text-accent"
                : "hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-5 w-5" />
          View Website
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-400 hover:bg-white/5"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
