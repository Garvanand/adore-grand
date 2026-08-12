"use client";

import React from "react";
import { ShieldCheck, Building2, Car, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-8 mt-16 text-slate-600 text-xs">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-300">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold text-slate-900 font-heading">AdorePark Parking Coordination Platform</p>
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <Building2 className="w-3 h-3 text-emerald-600" />
              Adore Grand, Sector 85, Faridabad, Haryana, India
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold">
          <a
            href="mailto:garvanand03@gmail.com"
            className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-700 transition font-mono"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tech Emergency: <strong>garvanand03@gmail.com</strong></span>
          </a>

          <span className="flex items-center gap-1 text-emerald-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Resident Phone Privacy Active
          </span>
          <span className="text-slate-400 font-mono">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
