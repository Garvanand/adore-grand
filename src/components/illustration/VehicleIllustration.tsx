"use client";

import React from "react";
import { motion } from "framer-motion";
import { Car } from "lucide-react";

interface VehicleProps {
  type?: "car" | "bike";
  plateNumber?: string;
  className?: string;
}

export function VehicleIllustration({ type = "car", plateNumber = "HR26AB1234", className = "" }: VehicleProps) {
  return (
    <motion.div
      animate={{ x: ["-100%", "300%"] }}
      transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-mono font-bold text-slate-800 ${className}`}
    >
      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
        <Car className="w-3.5 h-3.5" />
      </div>
      <span>{plateNumber}</span>
    </motion.div>
  );
}
