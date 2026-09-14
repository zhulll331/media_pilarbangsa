import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  xs: "w-5 h-5 text-[10px]",
  sm: "w-6 h-6 text-xs",     // 24px
  md: "w-8 h-8 text-sm",     // 32px
  lg: "w-12 h-12 text-base", // 48px
  xl: "w-16 h-16 text-lg",   // 64px
};

export function Avatar({ src, alt = "Avatar", name, size = "md", className, ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(!src);

  const getInitials = (n?: string) => {
    if (!n) return "?";
    return n
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden border border-[#E5E7EB] bg-[#F0F4F8] flex items-center justify-center font-semibold text-[#1E3A8A] shrink-0 select-none",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {!imageError && src ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
