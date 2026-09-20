import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

// Solid Category Badge (1 per artikel, kurasi editorial, warna primary #005AE0)
export function CategoryBadge({ className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center w-fit self-start text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#005AE0] text-white shadow-xs",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
