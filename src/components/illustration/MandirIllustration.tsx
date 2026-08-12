"use client";

import React from "react";
import { Landmark } from "lucide-react";

export function MandirIllustration() {
  return (
    <div className="flex flex-col items-center group cursor-default">
      {/* Golden Dome & Flag */}
      <div className="w-2 h-3 bg-amber-500 rounded-t-full relative">
        <span className="absolute -top-2 left-1 w-2.5 h-1.5 bg-orange-500 clip-triangle" />
      </div>
      <div className="w-10 h-6 rounded-t-full bg-amber-300 border-2 border-amber-400 shadow-xs flex items-center justify-center">
        <Landmark className="w-4 h-4 text-amber-800" />
      </div>
      <div className="w-12 h-5 bg-amber-200 border-2 border-amber-300 rounded-b-md text-[9px] font-bold text-amber-900 text-center flex items-center justify-center shadow-xs font-heading">
        MANDIR
      </div>
    </div>
  );
}
