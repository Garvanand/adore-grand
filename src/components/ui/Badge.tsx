import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
}

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase font-mono border";

  const variants = {
    success: "bg-emerald-100 border-emerald-300 text-emerald-800",
    warning: "bg-amber-100 border-amber-300 text-amber-800",
    danger: "bg-rose-100 border-rose-300 text-rose-800",
    info: "bg-sky-100 border-sky-300 text-sky-800",
    neutral: "bg-slate-100 border-slate-200 text-slate-700",
  };

  return <div className={cn(baseStyles, variants[variant], className)} {...props} />;
}
