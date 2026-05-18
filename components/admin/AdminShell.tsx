"use client";

import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import Breadcrumbs from "./Breadcrumbs";
import { ToastProvider } from "./ToastProvider";

export default function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-slate-100">
        <div
          className={`fixed inset-0 z-40 bg-black/50 lg:hidden ${
            mobileOpen ? "block" : "hidden"
          }`}
          onClick={() => setMobileOpen(false)}
          aria-hidden={!mobileOpen}
        />
        <div
          className={`fixed inset-y-0 left-0 z-50 transform transition-transform lg:relative lg:translate-x-0 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSidebar onNavigate={() => setMobileOpen(false)} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:px-8">
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <p className="text-sm font-medium text-slate-600 lg:hidden">AEC Admin</p>
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-8">
            <Breadcrumbs />
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
