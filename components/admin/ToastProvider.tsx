"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<{
  toast: (message: string, type?: ToastType) => void;
} | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toasts.length > 0 && (
        <div
          className="pointer-events-none fixed bottom-4 right-4 z-[200] flex max-w-sm flex-col gap-2 p-4 sm:bottom-6 sm:right-6"
          aria-live="polite"
        >
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast: t,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg",
        t.type === "success"
          ? "border-green-200 bg-white text-green-900"
          : "border-red-200 bg-white text-red-900"
      )}
    >
      {t.type === "success" ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
      )}
      <p className="flex-1 text-sm font-medium">{t.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(t.id)}
        className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
