"use client";

import { cn } from "@/lib/utils";

interface StockPillToggleProps {
  inStock: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export default function StockPillToggle({
  inStock,
  disabled,
  onToggle,
}: StockPillToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={inStock}
      aria-label={inStock ? "In stock" : "Out of stock"}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-1 py-1 pr-3 transition disabled:opacity-50",
        inStock
          ? "border-green-200 bg-green-50"
          : "border-red-200 bg-red-50"
      )}
    >
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          inStock ? "bg-green-500" : "bg-red-500"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            inStock ? "translate-x-5" : "translate-x-0"
          )}
        />
      </span>
      <span
        className={cn(
          "text-xs font-semibold",
          inStock ? "text-green-800" : "text-red-800"
        )}
      >
        {inStock ? "In Stock" : "Out of Stock"}
      </span>
    </button>
  );
}
