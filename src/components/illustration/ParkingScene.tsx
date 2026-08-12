"use client";

import React from "react";
import { Car, MapPin, ShieldCheck } from "lucide-react";

interface ParkingSceneProps {
  zoneName?: string;
  availableSlots?: number;
}

export function ParkingScene({ zoneName = "Basement B1", availableSlots = 14 }: ParkingSceneProps) {
  return (
    <div className="w-full p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-xs flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
          <Car className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            {zoneName}
          </span>
          <p className="text-[11px] text-slate-500 font-medium">Permitted Resident & Visitor Bay</p>
        </div>
      </div>

      <div className="text-right">
        <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 inline-block font-mono">
          {availableSlots} Slots Active
        </span>
      </div>
    </div>
  );
}
