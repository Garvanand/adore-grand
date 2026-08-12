"use client";

import React from "react";
import { VehicleSearch } from "@/components/vehicle/VehicleSearch";
import { AdoreGrandScene } from "@/components/illustration/AdoreGrandScene";
import { openPwaInstallGuide } from "@/components/pwa/PwaInstallPrompt";
import { useGlobalActions } from "@/context/GlobalActionContext";
import {
  Search,
  AlertOctagon,
  Plus,
  Car,
  ArrowRight,
  PhoneCall,
  Smartphone,
  FileText,
  Bell,
  Building2,
  ChevronRight,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { openFindVehicle, openImBlocked, openRegisterVehicle } = useGlobalActions();

  return (
    <div className="space-y-8 sm:space-y-12 py-1 sm:py-2 w-full mx-auto page-enter">
      {/* 1. HERO SECTION: ADORE GRAND IDENTITY & ILLUSTRATION */}
      <section className="text-center space-y-4 pt-2 relative">
        {/* Ambient Top Glow Backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

        {/* Floating Animated Society Location Badge */}
        <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-black text-emerald-900 tracking-widest uppercase bg-gradient-to-r from-emerald-100/90 via-teal-50/90 to-emerald-100/90 px-4 py-1.5 rounded-full border border-emerald-300/80 shadow-xs font-mono animate-float-subtle">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span>ADORE GRAND • SECTOR 85 • FARIDABAD</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 font-heading tracking-tight break-words">
            ADORE GRAND
          </h1>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent animate-text-shimmer font-heading tracking-tight drop-shadow-[0_4px_16px_rgba(16,185,129,0.2)]">
            ADOREPARK
          </h2>
          <p className="text-slate-600 text-xs sm:text-base font-extrabold max-w-xl mx-auto pt-1 italic tracking-wide">
            "Parking made easier."
          </p>
        </div>

        {/* Illustrated Society Environment */}
        <div className="w-full pt-2">
          <AdoreGrandScene />
        </div>
      </section>

      {/* 2. THREE PRIMARY DOMINANT ACTION CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6">
        {/* FIND A VEHICLE (Fresh Emerald Green) */}
        <div
          onClick={openFindVehicle}
          className="p-5 sm:p-7 rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer space-y-4 flex flex-col justify-between group shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-1 min-h-[130px] sm:min-h-[140px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
          </div>

          <div>
            <h3 className="text-lg sm:text-2xl font-black font-heading tracking-tight">
              FIND A VEHICLE
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5">
              Contact any vehicle owner instantly
            </p>
          </div>
        </div>

        {/* I'M BLOCKED (Soft Coral / Red) */}
        <div
          onClick={openImBlocked}
          className="p-5 sm:p-7 rounded-3xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer space-y-4 flex flex-col justify-between group shadow-lg shadow-rose-600/20 transition-all transform hover:-translate-y-1 min-h-[130px] sm:min-h-[140px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold">
              <AlertOctagon className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
          </div>

          <div>
            <h3 className="text-lg sm:text-2xl font-black font-heading tracking-tight">
              I'M BLOCKED
            </h3>
            <p className="text-xs sm:text-sm text-rose-100 font-medium mt-0.5">
              Request vehicle movement guided wizard
            </p>
          </div>
        </div>

        {/* REGISTER MY VEHICLE (Warm Yellow / Gold) */}
        <div
          onClick={openRegisterVehicle}
          className="p-5 sm:p-7 rounded-3xl bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer space-y-4 flex flex-col justify-between group shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-1 min-h-[130px] sm:min-h-[140px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-950/10 text-slate-950 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-950/80 group-hover:translate-x-1 transition-transform" />
          </div>

          <div>
            <h3 className="text-lg sm:text-2xl font-black font-heading tracking-tight">
              REGISTER MY VEHICLE
            </h3>
            <p className="text-xs sm:text-sm text-slate-900 font-extrabold mt-0.5">
              Add your vehicle for 1-tap contact
            </p>
          </div>
        </div>
      </section>

      {/* 3. SECONDARY RESIDENT SHORTCUTS GRID */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <Link href="/dashboard" className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs flex items-center justify-between text-xs font-bold text-slate-800 transition">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-slate-900 font-extrabold text-xs sm:text-sm">My Vehicles</span>
              <span className="text-[10px] text-slate-500 font-medium">Manage cars</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
        </Link>

        <Link href="/dashboard" className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs flex items-center justify-between text-xs font-bold text-slate-800 transition">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-slate-900 font-extrabold text-xs sm:text-sm">My Requests</span>
              <span className="text-[10px] text-slate-500 font-medium">Track alerts</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
        </Link>

        <Link href="/announcements" className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-xs flex items-center justify-between text-xs font-bold text-slate-800 transition">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-slate-900 font-extrabold text-xs sm:text-sm">Announcements</span>
              <span className="text-[10px] text-slate-500 font-medium">Society notices</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
        </Link>

        <Link href="/emergency" className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 shadow-xs flex items-center justify-between text-xs font-bold text-slate-800 transition">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-slate-900 font-extrabold text-xs sm:text-sm">Security</span>
              <span className="text-[10px] text-slate-500 font-medium">Emergency desk</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
        </Link>
      </section>

      {/* 4. SOCIETY VEHICLE LOOKUP */}
      <section id="vehicle-search-section" className="p-5 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
        <div className="text-left space-y-1">
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 font-heading uppercase tracking-tight text-emerald-800">
            SOCIETY VEHICLE LOOKUP
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-bold">Enter registration number (e.g. HR26AB1234)</p>
        </div>

        <VehicleSearch />
      </section>

      {/* 5. TRUST STRIP WITH ELEGANT PWA INSTALL BUTTON */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-1">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-1 flex items-start gap-2.5 sm:gap-3 shadow-xs">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <strong className="text-slate-900 font-extrabold block text-xs">Secure & Private</strong>
            <p className="text-[10px] sm:text-[11px] text-slate-500">Authorized residents</p>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-1 flex items-start gap-2.5 sm:gap-3 shadow-xs">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <strong className="text-slate-900 font-extrabold block text-xs">Instant Contact</strong>
            <p className="text-[10px] sm:text-[11px] text-slate-500">Call / WhatsApp tap</p>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-1 flex items-start gap-2.5 sm:gap-3 shadow-xs">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <strong className="text-slate-900 font-extrabold block text-xs">Built for Adore Grand</strong>
            <p className="text-[10px] sm:text-[11px] text-slate-500">Sector 85 Faridabad</p>
          </div>
        </div>

        {/* ELEGANT PWA INSTALL BUTTON */}
        <button
          onClick={openPwaInstallGuide}
          className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 text-xs space-y-1 flex items-start gap-2.5 sm:gap-3 shadow-xs text-left cursor-pointer transition"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <strong className="text-slate-900 font-extrabold block text-xs">Install AdorePark App</strong>
            <p className="text-[10px] sm:text-[11px] text-emerald-700 font-bold">1-tap Home Screen app</p>
          </div>
        </button>
      </section>
    </div>
  );
}
