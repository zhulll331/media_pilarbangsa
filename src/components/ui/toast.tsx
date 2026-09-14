"use client";

import React from "react";
import { usePortal, ToastMessage } from "@/context/portal-context";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, dismissToast } = usePortal();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: () => void }) {
  const accentColors = {
    success: "border-l-[#059669]",
    warning: "border-l-[#D97706]",
    error: "border-l-[#DC2626]",
    info: "border-l-[#005AE0]",
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#005AE0] shrink-0" />,
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-lg bg-[#0B172A] text-white shadow-xl border-l-[4px] transition-all animate-in fade-in slide-in-from-bottom-2",
        accentColors[toast.type]
      )}
    >
      <div className="flex items-center gap-2.5">
        {icons[toast.type]}
        <p className="text-sm font-medium leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="p-1 text-gray-400 hover:text-white rounded transition-colors cursor-pointer"
        aria-label="Tutup notifikasi"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
