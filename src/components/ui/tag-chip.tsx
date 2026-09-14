import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TagChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  href?: string;
  children: React.ReactNode;
}

// Outline Tag Chip (Banyak per artikel, santai, outline border, bukan solid)
export function TagChip({ href, className, children, ...props }: TagChipProps) {
  const content = (
    <span
      className={cn(
        "inline-flex items-center text-xs font-normal px-2.5 py-0.5 rounded-full border border-[#E5E7EB] text-[#6B7280] hover:border-[#005AE0] hover:text-[#005AE0] transition-colors bg-white",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
