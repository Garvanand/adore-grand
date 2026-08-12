"use client";

import React from "react";
import { ShieldCheck, Building2, Car } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-8 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-200">AdorePark Parking Coordination Platform</p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-500" />
              Adore Grand, Sector 85, Faridabad, Haryana, India
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            Resident Phone Masking & Audit Logging Active
          </span>
          <span className="text-slate-500">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
