"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ImageIcon,
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
    <aside className="flex h-screen w-[260px] shrink-0 flex-col bg-[#080c10] text-slate-400 shadow-xl">
      <div className="border-b border-white/10 px-5 py-6">
        <p className="font-display text-lg font-bold tracking-wide text-white">
          AEC Admin
        </p>
        <p className="mt-0.5 text-xs text-slate-500">Management Panel</p>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition",
                active
                  ? "border-l-[3px] border-accent bg-accent/15 pl-[9px] font-semibold text-accent"
                  : "border-l-[3px] border-transparent pl-[9px] text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon
                className={cn("h-5 w-5 shrink-0", active ? "text-accent" : "")}
              />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-5 w-5 shrink-0" />
          View Website
        </Link>
      </div>
    </aside>
  );
}

