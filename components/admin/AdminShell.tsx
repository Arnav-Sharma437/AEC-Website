"use client";

import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminPageTransition from "./AdminPageTransition";

export default function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />

      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar onNavigate={() => setMobileOpen(false)} />
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          showMenuButton
          onMenuClick={() => setMobileOpen((o) => !o)}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <AdminPageTransition>{children}</AdminPageTransition>
        </main>
      </div>
    </div>
  );
}
