"use client";

import React from "react";
import { ShieldCheck, Building2, Car, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-8 mt-12 sm:mt-16 text-slate-600 text-xs">
      <div className="max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-300 shrink-0">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold text-slate-900 font-heading text-xs sm:text-sm">AdorePark Parking Coordination Platform</p>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium flex items-center justify-center md:justify-start gap-1">
              <Building2 className="w-3 h-3 text-emerald-600 shrink-0" />
              Adore Grand, Sector 85, Faridabad, Haryana, India
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-bold">
          <a
            href="mailto:garvanand03@gmail.com"
            className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-700 transition font-mono"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Tech Emergency: <strong>garvanand03@gmail.com</strong></span>
          </a>

          <span className="flex items-center gap-1 text-emerald-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            Phone Privacy Active
          </span>
          <span className="text-slate-400 font-mono">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
