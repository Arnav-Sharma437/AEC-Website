"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const LABELS: Record<string, string> = {
  admin: "Dashboard",
  products: "Products",
  hero: "Hero Banner",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs: { href: string; label: string }[] = [];
  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    if (seg === "admin" && segments.length === 1) {
      crumbs.push({ href: path, label: "Dashboard" });
    } else if (seg !== "admin") {
      crumbs.push({ href: path, label: LABELS[seg] || seg });
    }
  }

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-gray-500">
      <Link href="/admin" className="flex items-center hover:text-gray-900">
        <Home className="h-4 w-4" />
      </Link>
      {crumbs.map((c, i) => (
        <span key={c.href} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-gray-300" />
          {i === crumbs.length - 1 ? (
            <span className="font-medium text-gray-900">{c.label}</span>
          ) : (
            <Link href={c.href} className="hover:text-gray-900">
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
