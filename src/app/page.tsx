"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { VehicleSearch } from "@/components/vehicle/VehicleSearch";
import { AdoreGrandScene } from "@/components/illustration/AdoreGrandScene";
import { openPwaInstallGuide } from "@/components/pwa/PwaInstallPrompt";
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

// LAZY-LOADED HEAVY MODAL COMPONENTS
const ImBlockedWorkflowModal = dynamic(
  () =>
    import("@/components/incident/ImBlockedWorkflowModal").then(
      (mod) => mod.ImBlockedWorkflowModal
    ),
  { ssr: false }
);

const AddVehicleModal = dynamic(
  () =>
    import("@/components/vehicle/AddVehicleModal").then(
      (mod) => mod.AddVehicleModal
    ),
  { ssr: false }
);

export default function HomePage() {
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);

  const scrollToSearch = () => {
    const el = document.getElementById("vehicle-search-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12 py-1 sm:py-2 w-full mx-auto page-enter">
      {/* 1. HERO SECTION: ADORE GRAND IDENTITY & ILLUSTRATION */}
      <section className="text-center space-y-4 pt-2">
        <span className="text-[10px] sm:text-xs font-black text-emerald-800 tracking-widest uppercase bg-emerald-100/90 px-4 py-1.5 rounded-full border border-emerald-300 inline-block font-mono">
          ADORE GRAND • SECTOR 85 • FARIDABAD
        </span>

        <div className="space-y-1">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 font-heading tracking-tight">
            ADORE GRAND
          </h1>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-emerald-600 font-heading tracking-tight">
            ADOREPARK
          </h2>
          <p className="text-slate-600 text-sm sm:text-lg font-extrabold max-w-xl mx-auto pt-1">
            "Parking made easier."
          </p>
        </div>

        {/* Illustrated Society Environment */}
        <div className="w-full pt-2">
          <AdoreGrandScene />
        </div>
      </section>

      {/* 2. THREE PRIMARY DOMINANT ACTION CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* FIND A VEHICLE (Fresh Emerald Green) */}
        <div
          onClick={scrollToSearch}
          className="p-6 sm:p-7 rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer space-y-4 flex flex-col justify-between group shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-1 min-h-[140px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold">
              <Search className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
              FIND A VEHICLE
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium mt-0.5">
              Contact any vehicle owner instantly
            </p>
          </div>
        </div>

        {/* I'M BLOCKED (Soft Coral / Red) */}
        <div
          onClick={() => setIsBlockedModalOpen(true)}
          className="p-6 sm:p-7 rounded-3xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer space-y-4 flex flex-col justify-between group shadow-lg shadow-rose-600/20 transition-all transform hover:-translate-y-1 min-h-[140px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
              I'M BLOCKED
            </h3>
            <p className="text-xs sm:text-sm text-rose-100 font-medium mt-0.5">
              Request vehicle movement guided wizard
            </p>
          </div>
        </div>

        {/* REGISTER MY VEHICLE (Warm Yellow / Gold) */}
        <div
          onClick={() => setIsAddVehicleOpen(true)}
          className="p-6 sm:p-7 rounded-3xl bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer space-y-4 flex flex-col justify-between group shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-1 min-h-[140px]"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-slate-950/10 text-slate-950 flex items-center justify-center font-bold">
              <Plus className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-950/80 group-hover:translate-x-1 transition-transform" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
              REGISTER MY VEHICLE
            </h3>
            <p className="text-xs sm:text-sm text-slate-900 font-extrabold mt-0.5">
              Add your vehicle for 1-tap contact
            </p>
          </div>
        </div>
      </section>

      {/* 3. SECONDARY RESIDENT SHORTCUTS GRID */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Link href="/dashboard" className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs flex items-center justify-between text-xs font-bold text-slate-800 transition">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
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
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
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
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
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
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
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
      <section id="vehicle-search-section" className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
        <div className="text-left space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading uppercase tracking-tight text-emerald-800">
            SOCIETY VEHICLE LOOKUP
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-bold">Enter registration number (e.g. HR26AB1234)</p>
        </div>

        <VehicleSearch />
      </section>

      {/* 5. TRUST STRIP WITH ELEGANT PWA INSTALL BUTTON */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-1">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-1 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-slate-900 font-extrabold block text-xs">Secure & Private</strong>
            <p className="text-[11px] text-slate-500">Authorized residents</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-1 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-slate-900 font-extrabold block text-xs">Instant Contact</strong>
            <p className="text-[11px] text-slate-500">Call / WhatsApp tap</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-1 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-slate-900 font-extrabold block text-xs">Built for Adore Grand</strong>
            <p className="text-[11px] text-slate-500">Sector 85 Faridabad</p>
          </div>
        </div>

        {/* ELEGANT PWA INSTALL BUTTON */}
        <button
          onClick={openPwaInstallGuide}
          className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 text-xs space-y-1 flex items-start gap-3 shadow-xs text-left cursor-pointer transition"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-slate-900 font-extrabold block text-xs">Install AdorePark App</strong>
            <p className="text-[11px] text-emerald-700 font-bold">1-tap Home Screen app</p>
          </div>
        </button>
      </section>

      {/* Conditionally Rendered Heavy Modals */}
      {isBlockedModalOpen && (
        <ImBlockedWorkflowModal
          isOpen={isBlockedModalOpen}
          onClose={() => setIsBlockedModalOpen(false)}
        />
      )}
      {isAddVehicleOpen && (
        <AddVehicleModal
          isOpen={isAddVehicleOpen}
          onClose={() => setIsAddVehicleOpen(false)}
        />
      )}
    </div>
  );
}
