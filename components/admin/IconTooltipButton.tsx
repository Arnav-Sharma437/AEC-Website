"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface IconTooltipButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  variant?: "default" | "danger";
}

export default function IconTooltipButton({
  label,
  onClick,
  disabled,
  children,
  variant = "default",
}: IconTooltipButtonProps) {
  return (
    <div className="group relative">
      <button
        type="button"
        title={label}
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50",
          variant === "danger" &&
            "border-red-100 text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
        )}
      >
        {children}
      </button>
      <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100">
        {label}
      </span>
    </div>
  );
}
