"use client";

import React from "react";
import { Trees } from "lucide-react";

export function ParkIllustration() {
  return (
    <div className="flex items-end gap-1.5 p-2 rounded-2xl bg-emerald-100/80 border-2 border-emerald-300 shadow-xs">
      <div className="w-7 h-9 rounded-full bg-emerald-400 border border-emerald-500 flex items-center justify-center text-emerald-800">
        <Trees className="w-5 h-5" />
      </div>
      <div className="w-6 h-7 rounded-full bg-teal-400 border border-teal-500 hidden sm:block" />
      <span className="text-[10px] font-black text-emerald-800 uppercase font-heading tracking-wider px-1">
        PARK
      </span>
    </div>
  );
}
