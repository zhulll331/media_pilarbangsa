import React from "react";
import { cn } from "@/lib/utils";

export type StatusVariant = "draft" | "pending" | "published" | "rejected";

export interface BadgeStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusVariant;
}

const statusConfig: Record<StatusVariant, { label: string; bg: string; text: string; dot: string }> = {
  draft: {
    label: "Draft",
    bg: "bg-gray-100",
    text: "text-[#6B7280]",
    dot: "bg-[#6B7280]",
  },
  pending: {
    label: "Menunggu Review",
    bg: "bg-amber-50",
    text: "text-[#D97706]",
    dot: "bg-[#D97706]",
  },
  published: {
    label: "Tayang",
    bg: "bg-emerald-50",
    text: "text-[#059669]",
    dot: "bg-[#059669]",
  },
  rejected: {
    label: "Perlu Revisi",
    bg: "bg-red-50",
    text: "text-[#DC2626]",
    dot: "bg-[#DC2626]",
  },
};

export function BadgeStatus({ status, className, ...props }: BadgeStatusProps) {
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border border-transparent",
        config.bg,
        config.text,
        className
      )}
      {...props}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
