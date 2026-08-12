import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-extrabold rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

  const variants = {
    primary:
      "bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 shadow-sm hover:shadow-emerald-600/20",
    secondary:
      "bg-sky-600 hover:bg-sky-700 text-white border border-sky-600 shadow-sm",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white border border-rose-600 shadow-sm",
    outline:
      "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-700",
  };

  const sizes = {
    sm: "h-9 px-3.5 text-xs gap-1.5",
    md: "h-11 px-5 text-sm gap-2",
    lg: "h-14 px-6 text-base gap-2.5",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {children}
    </button>
  );
}
