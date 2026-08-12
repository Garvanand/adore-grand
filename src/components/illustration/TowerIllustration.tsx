"use client";

import React from "react";
import { motion } from "framer-motion";

interface TowerProps {
  name: string;
  height?: number;
  highlight?: boolean;
  className?: string;
}

export function TowerIllustration({ name, height = 150, highlight = false, className = "" }: TowerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center group cursor-default relative ${className}`}
    >
      {/* Tower Name Badge */}
      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-xs text-[10px] font-black text-slate-800 font-mono tracking-wider mb-1 z-10">
        {name}
      </span>

      {/* Vector Tower Building */}
      <div
        style={{ height: `${height}px` }}
        className={`w-14 sm:w-16 rounded-t-2xl border-2 transition-all relative overflow-hidden flex flex-col justify-between p-2 shadow-sm ${
          highlight
            ? "bg-gradient-to-t from-emerald-100 via-amber-50 to-white border-emerald-500 shadow-md"
            : "bg-gradient-to-t from-amber-100/70 via-amber-50/80 to-white border-amber-200/90 group-hover:border-emerald-400"
        }`}
      >
        {/* Roof Light Beacon */}
        <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

        {/* Window Grids Pattern */}
        <div className="grid grid-cols-2 gap-1.5 pt-3 opacity-80">
          <span className="h-3 rounded-xs bg-amber-200/90 border border-amber-300/50" />
          <span className="h-3 rounded-xs bg-amber-300/90 border border-amber-300/50" />
          <span className="h-3 rounded-xs bg-sky-200/80 border border-sky-300/50" />
          <span className="h-3 rounded-xs bg-amber-200/90 border border-amber-300/50" />
          <span className="h-3 rounded-xs bg-amber-300/90 border border-amber-300/50" />
          <span className="h-3 rounded-xs bg-amber-200/90 border border-amber-300/50" />
        </div>

        {/* Balcony Railings Base */}
        <div className="w-full h-2 rounded-xs bg-amber-200 border-t border-amber-300 mt-auto" />
      </div>
    </motion.div>
  );
}
