"use client";

import React from "react";
import Image from "next/image";
import { Car } from "lucide-react";

export function AdoreGrandScene() {
  return (
    <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-100/70 via-emerald-50/30 to-white p-2 sm:p-4 text-center space-y-3 border border-slate-200/80 shadow-md hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 group">
      {/* 1. LIGHTWEIGHT ANIMATED CLOUD & BIRD OVERLAYS (GPU Accelerated) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-75">
        {/* Clouds */}
        <div className="absolute top-3 left-[-100px] animate-[cloudDrift_45s_linear_infinite] will-change-transform">
          <svg className="w-24 h-12 text-white/90 fill-current" viewBox="0 0 24 24">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
          </svg>
        </div>
        <div className="absolute top-6 left-[-200px] animate-[cloudDrift_65s_linear_infinite_15s] will-change-transform">
          <svg className="w-32 h-16 text-white/80 fill-current" viewBox="0 0 24 24">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
          </svg>
        </div>

        {/* Flying Birds Flock */}
        <div className="absolute top-4 left-[-60px] animate-[birdFly_32s_linear_infinite] opacity-60">
          <svg className="w-12 h-6 text-slate-700 fill-current" viewBox="0 0 50 25">
            <path d="M0 10 Q12.5 0 25 10 Q37.5 0 50 10 Q37.5 15 25 12 Q12.5 15 0 10 Z" />
          </svg>
        </div>
      </div>

      {/* 2. HIGH-RESOLUTION HERO ILLUSTRATION ASSET */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[240px] sm:min-h-[360px] rounded-2xl overflow-hidden shadow-xs border border-slate-100">
        <Image
          src="/images/adore_grand_hero_landscape.png"
          alt="Adore Grand Sector 85 Faridabad Society Vector Hero Environment"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          className="object-cover object-center scale-[1.01] group-hover:scale-[1.03] transition-transform duration-700 ease-out"
        />

        {/* Ambient Inner Vignette Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-sky-900/10 pointer-events-none" />

        {/* 3. LIGHTWEIGHT WINDOW & MANDIR BEACON GLOWS */}
        <div className="absolute top-[25%] left-[20%] w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_#f59e0b] animate-[beaconPulse_3s_ease-in-out_infinite]" />
        <div className="absolute top-[30%] left-[50%] w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_#f59e0b] animate-[beaconPulse_4s_ease-in-out_infinite_1s]" />
        <div className="absolute top-[28%] right-[22%] w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_#f59e0b] animate-[beaconPulse_3.5s_ease-in-out_infinite_2s]" />
        <div className="absolute top-[36%] right-[44%] w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_12px_#fbbf24] animate-[beaconPulse_2.5s_ease-in-out_infinite_0.5s]" />

        {/* 4. FOREGROUND VECTOR CAR & BIKE DRIVEWAY ANIMATIONS */}
        <div className="absolute bottom-2 left-0 right-0 h-7 overflow-hidden pointer-events-none z-20 flex items-center justify-between">
          {/* Car driving Left -> Right */}
          <div className="absolute left-[-60px] animate-[carDrive_18s_linear_infinite] flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-emerald-400 shadow-md text-[10px] font-mono font-black text-emerald-950">
            <Car className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
            <span>HR26AB1234</span>
          </div>

          {/* Resident Bike driving Right -> Left */}
          <div className="absolute left-[-60px] animate-[bikeDriveReverse_22s_linear_infinite_5s] flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-sky-400 shadow-md text-[10px] font-mono font-black text-sky-300">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping shrink-0" />
            <span>HR26CZ9876</span>
          </div>
        </div>
      </div>

      {/* 5. ELEGANT CAPTION STRIP */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/95 border border-slate-200/90 text-xs font-extrabold text-slate-700 shadow-xs">
        <span className="font-mono text-emerald-900 font-black flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span className="tracking-tight">ADORE GRAND • TOWERS T1 TO T7 • MANDIR • CENTRAL PARK</span>
        </span>
        <span className="text-emerald-700 font-mono text-[11px] font-black bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 hidden sm:inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          Sector 85, Faridabad
        </span>
      </div>
    </div>
  );
}
