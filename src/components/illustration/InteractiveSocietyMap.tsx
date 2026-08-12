"use client";

import React, { useState } from "react";
import {
  Building2,
  Landmark,
  Trees,
  Car,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Compass,
} from "lucide-react";

interface InteractiveSocietyMapProps {
  selectedZone?: string;
  onSelectZone?: (zoneId: string) => void;
  className?: string;
}

export function InteractiveSocietyMap({
  selectedZone = "T1",
  onSelectZone,
  className = "",
}: InteractiveSocietyMapProps) {
  const [activeZone, setActiveZone] = useState(selectedZone);

  const handleZoneClick = (zoneId: string) => {
    setActiveZone(zoneId);
    if (onSelectZone) onSelectZone(zoneId);
  };

  const isSel = (id: string) => activeZone === id;

  return (
    <div className={`w-full p-4 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-4 ${className}`}>
      {/* Map Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs font-bold">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 font-heading">
              ADORE GRAND U-SHAPE MAP
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">Interactive Parking Zone Selector</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 text-emerald-800 text-[11px] font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zone: {activeZone}</span>
        </div>
      </div>

      {/* ILLUSTRATED U-SHAPED SOCIETY VECTOR LAYOUT CONTAINER */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-sky-50 via-emerald-50/40 to-slate-100 p-4 border border-slate-200 min-h-[280px] flex flex-col justify-between overflow-hidden">
        {/* TOP ROW: T3, T4, T5 (Curved Base of U) */}
        <div className="grid grid-cols-3 gap-2 z-10">
          {["T3", "T4", "T5"].map((towerId) => (
            <button
              key={towerId}
              type="button"
              onClick={() => handleZoneClick(towerId)}
              className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                isSel(towerId)
                  ? "bg-white border-emerald-500 text-emerald-900 shadow-md scale-105"
                  : "bg-white/80 border-amber-200 hover:border-emerald-300 text-slate-700"
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${isSel(towerId) ? "bg-emerald-600 text-white" : "bg-amber-100 text-amber-800"}`}>
                {towerId}
              </div>
              <span className="text-[10px] font-extrabold uppercase">Tower {towerId}</span>
            </button>
          ))}
        </div>

        {/* MIDDLE ROW: T2, Mandir (Left Wing) | CENTRAL PARK (Center) | T6 (Right Wing) */}
        <div className="grid grid-cols-12 gap-2 items-center my-3 z-10">
          {/* Left Wing (T2 & Mandir) */}
          <div className="col-span-3 space-y-2">
            <button
              type="button"
              onClick={() => handleZoneClick("T2")}
              className={`w-full p-2.5 rounded-2xl border-2 transition-all flex items-center gap-2 cursor-pointer ${
                isSel("T2")
                  ? "bg-white border-emerald-500 text-emerald-900 shadow-md scale-105"
                  : "bg-white/80 border-amber-200 hover:border-emerald-300 text-slate-700"
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${isSel("T2") ? "bg-emerald-600 text-white" : "bg-amber-100 text-amber-800"}`}>
                T2
              </div>
              <span className="text-[10px] font-extrabold hidden sm:inline">Tower T2</span>
            </button>

            <button
              type="button"
              onClick={() => handleZoneClick("MANDIR")}
              className={`w-full p-2.5 rounded-2xl border-2 transition-all flex items-center gap-2 cursor-pointer ${
                isSel("MANDIR")
                  ? "bg-white border-emerald-500 text-emerald-900 shadow-md scale-105"
                  : "bg-white/80 border-amber-300 hover:border-emerald-300 text-slate-700"
              }`}
            >
              <Landmark className="w-5 h-5 text-amber-600 shrink-0" />
              <span className="text-[10px] font-extrabold text-amber-900">Mandir</span>
            </button>
          </div>

          {/* CENTER: CENTRAL PARK */}
          <div className="col-span-6">
            <button
              type="button"
              onClick={() => handleZoneClick("PARK_BOUNDARY")}
              className={`w-full p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center ${
                isSel("PARK_BOUNDARY")
                  ? "bg-emerald-100 border-emerald-600 text-emerald-900 shadow-md scale-105"
                  : "bg-emerald-50/90 border-emerald-300 hover:border-emerald-400 text-emerald-800"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center">
                <Trees className="w-6 h-6" />
              </div>
              <span className="text-xs font-black font-heading tracking-wide">
                CENTRAL PARK
              </span>
              <span className="text-[10px] font-bold text-emerald-700">Park Boundary Parking</span>
            </button>
          </div>

          {/* Right Wing (T6) */}
          <div className="col-span-3 space-y-2">
            <button
              type="button"
              onClick={() => handleZoneClick("T6")}
              className={`w-full p-2.5 rounded-2xl border-2 transition-all flex items-center gap-2 cursor-pointer ${
                isSel("T6")
                  ? "bg-white border-emerald-500 text-emerald-900 shadow-md scale-105"
                  : "bg-white/80 border-amber-200 hover:border-emerald-300 text-slate-700"
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${isSel("T6") ? "bg-emerald-600 text-white" : "bg-amber-100 text-amber-800"}`}>
                T6
              </div>
              <span className="text-[10px] font-extrabold hidden sm:inline">Tower T6</span>
            </button>
          </div>
        </div>

        {/* BOTTOM ROW: T1 & EXIT GATE (Left) | ENTRY GATE & T7 (Right) */}
        <div className="grid grid-cols-2 gap-3 z-10 pt-1">
          {/* T1 & Exit Gate */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleZoneClick("T1")}
              className={`flex-1 p-2.5 rounded-2xl border-2 transition-all flex items-center gap-2 cursor-pointer ${
                isSel("T1")
                  ? "bg-white border-emerald-500 text-emerald-900 shadow-md scale-105"
                  : "bg-white/80 border-amber-200 hover:border-emerald-300 text-slate-700"
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${isSel("T1") ? "bg-emerald-600 text-white" : "bg-amber-100 text-amber-800"}`}>
                T1
              </div>
              <span className="text-[10px] font-extrabold">Tower T1</span>
            </button>
            <div className="px-2 py-1.5 rounded-xl bg-slate-200 text-slate-600 text-[10px] font-black flex items-center justify-center uppercase font-mono shrink-0">
              Exit Gate
            </div>
          </div>

          {/* Entry Gate & T7 */}
          <div className="flex gap-2 justify-end">
            <div className="px-2 py-1.5 rounded-xl bg-emerald-200 text-emerald-800 text-[10px] font-black flex items-center justify-center uppercase font-mono shrink-0">
              Entry Gate
            </div>
            <button
              type="button"
              onClick={() => handleZoneClick("T7")}
              className={`flex-1 p-2.5 rounded-2xl border-2 transition-all flex items-center gap-2 cursor-pointer ${
                isSel("T7")
                  ? "bg-white border-emerald-500 text-emerald-900 shadow-md scale-105"
                  : "bg-white/80 border-amber-200 hover:border-emerald-300 text-slate-700"
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${isSel("T7") ? "bg-emerald-600 text-white" : "bg-amber-100 text-amber-800"}`}>
                T7
              </div>
              <span className="text-[10px] font-extrabold">Tower T7</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selected Zone Confirmation Strip */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>Selected Parking Zone: <strong className="text-emerald-700 font-mono">{activeZone}</strong></span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">Click any zone above to select</span>
      </div>
    </div>
  );
}
