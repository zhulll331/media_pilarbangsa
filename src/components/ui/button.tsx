import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005AE0] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none";

    const variantStyles = {
      primary: "bg-[#005AE0] text-white hover:bg-[#0048b3] active:bg-[#003c94] shadow-sm rounded-full",
      secondary: "bg-transparent text-[#005AE0] border border-[#005AE0] hover:bg-[#F0F4F8] rounded-full",
      danger: "bg-transparent text-[#DC2626] border border-[#DC2626] hover:bg-red-50 rounded-full",
      ghost: "bg-transparent text-[#111827] hover:bg-[#F0F4F8] rounded-lg",
      link: "bg-transparent text-[#005AE0] underline-offset-4 hover:underline p-0 h-auto",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 min-h-[36px]",
      md: "text-sm px-5 py-2 min-h-[44px]", // 44px touch target compliance
      lg: "text-base px-6 py-2.5 min-h-[48px]",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
