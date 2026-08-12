"use client";

import React from "react";
import { motion } from "framer-motion";
import { Car, Trees, Landmark, Building2, Sparkles } from "lucide-react";

export function AdoreGrandIllustration() {
  const towers = ["T1", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 border border-slate-800 p-6 sm:p-8 text-center space-y-6 shadow-2xl">
      {/* Top Society Board */}
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest shadow-lg">
        <Building2 className="w-4 h-4 text-emerald-400" />
        ADORE GRAND RESIDENTIAL COMMUNITY • SECTOR 85 FARIDABAD
      </div>

      {/* Stylized Apartment Towers Baseline Grid */}
      <div className="relative pt-6 pb-2">
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end justify-center min-h-[140px] px-2">
          {towers.map((tower, idx) => {
            const heights = [130, 150, 140, 160, 145, 150, 135];
            const h = heights[idx];
            return (
              <motion.div
                key={tower}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="flex flex-col items-center group cursor-default"
              >
                {/* Tower Roof Light Indicator */}
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mb-1 opacity-75" />

                {/* Apartment Building Visual Block */}
                <div
                  style={{ height: `${h}px` }}
                  className="w-full rounded-t-xl bg-gradient-to-t from-slate-900 via-slate-800 to-slate-700/80 border border-slate-700/80 p-1.5 flex flex-col justify-between shadow-xl group-hover:border-emerald-500/60 transition-colors"
                >
                  <span className="text-[10px] font-black text-emerald-400 font-mono tracking-wider block border-b border-slate-700/60 pb-1">
                    {tower}
                  </span>

                  {/* Window Grid Pattern */}
                  <div className="grid grid-cols-2 gap-1 my-auto opacity-70">
                    <span className="w-full h-2 rounded-xs bg-amber-300/40" />
                    <span className="w-full h-2 rounded-xs bg-amber-300/20" />
                    <span className="w-full h-2 rounded-xs bg-amber-300/30" />
                    <span className="w-full h-2 rounded-xs bg-amber-300/50" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Ground Level Driveway & Environment Strip */}
        <div className="relative border-t-2 border-slate-700 pt-3 flex items-center justify-between gap-2 text-xs">
          {/* Mandir Silhouette */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-bold">
            <Landmark className="w-4 h-4 text-amber-400" />
            <span>Society Mandir</span>
          </div>

          {/* Moving Car Illustration */}
          <div className="flex-1 relative h-6 overflow-hidden hidden sm:block">
            <motion.div
              animate={{ x: ["-10%", "100%"] }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="absolute top-0 flex items-center gap-1 text-emerald-400 text-[10px] font-mono font-bold"
            >
              <Car className="w-4 h-4 text-emerald-400" />
              <span>HR 26 AB 1234</span>
            </motion.div>
          </div>

          {/* Park Greenery Section */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-bold">
            <Trees className="w-4 h-4 text-emerald-400" />
            <span>Central Park</span>
          </div>
        </div>
      </div>
    </div>
  );
}
