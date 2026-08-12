"use client";

import React from "react";
import { TowerIllustration } from "./TowerIllustration";
import { SocietyGate } from "./SocietyGate";
import { MandirIllustration } from "./MandirIllustration";
import { ParkIllustration } from "./ParkIllustration";
import { VehicleIllustration } from "./VehicleIllustration";

export function AdoreGrandScene() {
  const towers = [
    { name: "T1", height: 135 },
    { name: "T2", height: 155 },
    { name: "T3", height: 140 },
    { name: "T4", height: 165 },
    { name: "T5", height: 145 },
    { name: "T6", height: 150 },
    { name: "T7", height: 135 },
  ];

  return (
    <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-100 via-sky-50 to-white border border-slate-200 p-4 sm:p-6 text-center space-y-4 shadow-sm">
      {/* Background Towers Grid (T1 - T7) */}
      <div className="relative pt-2 pb-1">
        <div className="grid grid-cols-7 gap-1 sm:gap-3 items-end justify-center min-h-[120px] sm:min-h-[140px] px-1 sm:px-2">
          {towers.map((t, idx) => (
            <TowerIllustration key={t.name} name={t.name} height={t.height} highlight={idx === 3} />
          ))}
        </div>

        {/* Middle Ground: Mandir, Society Gate, Park */}
        <div className="relative border-t-2 border-slate-300 pt-3 flex items-end justify-between gap-2 text-xs">
          <MandirIllustration />
          <SocietyGate />
          <ParkIllustration />
        </div>

        {/* Foreground Driveway with Animated Vehicles */}
        <div className="w-full h-8 bg-slate-200 border-t border-slate-300 rounded-b-xl relative overflow-hidden flex items-center px-4 mt-1">
          <div className="w-full border-b border-dashed border-slate-400 absolute" />
          <VehicleIllustration plateNumber="HR 26 AB 1234" />
        </div>
      </div>
    </div>
  );
}
