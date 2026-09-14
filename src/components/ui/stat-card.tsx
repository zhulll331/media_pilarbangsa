import React from "react";
import { cn, formatNumber } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: "default" | "highlight" | "warning";
  className?: string;
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
  variant = "default",
  className,
}: StatCardProps) {
  const variantStyles = {
    default: "bg-[#F0F4F8] border border-[#E5E7EB]",
    highlight: "bg-blue-50/70 border border-blue-200",
    warning: "bg-amber-50/70 border border-amber-200",
  };

  const formattedValue = typeof value === "number" ? formatNumber(value) : value;

  return (
    <div
      className={cn(
        "rounded-xl p-6 transition-all duration-200 flex flex-col justify-between",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
          {label}
        </span>
        {icon && <div className="text-[#005AE0] p-1.5 rounded-lg bg-white shadow-2xs">{icon}</div>}
      </div>

      <div>
        <div className="text-3xl font-bold tracking-tight text-[#111827] data-tabular">
          {formattedValue}
        </div>
        {subtext && <p className="text-xs text-[#6B7280] mt-1">{subtext}</p>}
      </div>
    </div>
  );
}
