"use client";

import React from "react";
import { Building2, ShieldCheck } from "lucide-react";

export function SocietyGate() {
  return (
    <div className="flex flex-col items-center">
      {/* Grand Arch Signage */}
      <div className="px-5 py-2 rounded-2xl bg-white border-2 border-amber-300 shadow-md text-center space-y-0.5 z-10">
        <span className="text-[10px] font-black text-emerald-700 tracking-widest uppercase block">
          SECTOR 85, FARIDABAD
        </span>
        <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading tracking-tight">
          ADORE GRAND
        </h3>
      </div>

      {/* Pillars & Gate Barriers */}
      <div className="flex items-end justify-center gap-6 -mt-2">
        <div className="w-5 h-12 rounded-t-md bg-amber-200 border-2 border-amber-400 shadow-xs" />
        <div className="w-16 h-1.5 bg-rose-500 rounded-full border border-rose-600 shadow-xs" />
        <div className="w-5 h-12 rounded-t-md bg-amber-200 border-2 border-amber-400 shadow-xs" />
      </div>
    </div>
  );
}
