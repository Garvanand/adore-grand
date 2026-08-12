"use client";

import React, { useState } from "react";
import { VehicleSearch } from "@/components/vehicle/VehicleSearch";
import { ImBlockedWorkflowModal } from "@/components/incident/ImBlockedWorkflowModal";
import { AddVehicleModal } from "@/components/vehicle/AddVehicleModal";
import { AdoreGrandScene } from "@/components/illustration/AdoreGrandScene";
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
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

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
    <div className="space-y-6 sm:space-y-10 py-1 sm:py-2 max-w-7xl mx-auto w-full">
      {/* 1. MOBILE COMPACT HERO SCENE & BRANDING */}
      <section className="relative w-full rounded-3xl overflow-hidden border border-slate-200/90 bg-gradient-to-b from-sky-100/70 via-emerald-50/20 to-white p-4 sm:p-10 shadow-xs text-center space-y-4">
        {/* Eyebrow */}
        <span className="text-[10px] sm:text-xs font-black text-emerald-800 tracking-widest uppercase bg-emerald-100/90 px-3.5 py-1 rounded-full border border-emerald-300 inline-block font-mono">
          ADORE GRAND • SECTOR 85 • FARIDABAD
        </span>

        {/* Headings */}
        <div className="space-y-0.5">
          <h1 className="text-3xl sm:text-6xl font-black text-slate-900 font-heading tracking-tight">
            ADORE GRAND
          </h1>
          <h2 className="text-2xl sm:text-5xl font-black text-emerald-600 font-heading tracking-tight">
            ADOREPARK
          </h2>
          <p className="text-slate-600 text-xs sm:text-base font-extrabold max-w-lg mx-auto pt-0.5">
            "Parking made easier."
          </p>
        </div>

        {/* Vector Scene Component */}
        <div className="relative w-full max-w-5xl mx-auto pt-1">
          <AdoreGrandScene />
        </div>
      </section>

      {/* 2. PRIMARY ACTIONS (Stacked 80-110px Tall Cards for 1-Handed Mobile Operation) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* CARD 1: FIND A VEHICLE (Green Surface) */}
        <div
          onClick={scrollToSearch}
          className="p-4 sm:p-7 rounded-3xl bg-emerald-50/90 border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer space-y-2 sm:space-y-5 flex items-center justify-between group shadow-sm transition-all min-h-[90px] sm:min-h-[110px]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
              <Search className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-slate-900 font-heading leading-tight">
                FIND A VEHICLE
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 font-bold mt-0.5">
                "Need to contact a vehicle owner?"
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-700 group-hover:translate-x-1 transition-transform shrink-0" />
        </div>

        {/* CARD 2: I'M BLOCKED (Coral/Red Surface) */}
        <div
          onClick={() => setIsBlockedModalOpen(true)}
          className="p-4 sm:p-7 rounded-3xl bg-rose-50/90 border-2 border-rose-200 hover:border-rose-500 hover:bg-rose-50 cursor-pointer space-y-2 sm:space-y-5 flex items-center justify-between group shadow-sm transition-all min-h-[90px] sm:min-h-[110px]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-100 border border-rose-300 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
              <AlertOctagon className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-slate-900 font-heading text-rose-700 leading-tight">
                I'M BLOCKED
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 font-bold mt-0.5">
                "Someone's vehicle is blocking you?"
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-rose-700 group-hover:translate-x-1 transition-transform shrink-0" />
        </div>

        {/* CARD 3: REGISTER MY VEHICLE (Yellow/Gold Surface) */}
        <div
          onClick={() => setIsAddVehicleOpen(true)}
          className="p-4 sm:p-7 rounded-3xl bg-amber-50/90 border-2 border-amber-200 hover:border-amber-500 hover:bg-amber-50 cursor-pointer space-y-2 sm:space-y-5 flex items-center justify-between group shadow-sm transition-all min-h-[90px] sm:min-h-[110px]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
              <Plus className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-slate-900 font-heading leading-tight">
                REGISTER MY VEHICLE
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600 font-bold mt-0.5">
                "Add your vehicle for quick contact."
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-700 group-hover:translate-x-1 transition-transform shrink-0" />
        </div>
      </section>

      {/* 3. QUICK ACCESS 2X2 GRID */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Link href="/dashboard" className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs flex items-center justify-between text-xs font-bold text-slate-800 transition">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-slate-900 font-extrabold text-xs sm:text-sm">My Vehicles</span>
              <span className="text-[10px] text-slate-500 font-normal">View & manage</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
        </Link>

        <Link href="/dashboard" className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs flex items-center justify-between text-xs font-bold text-slate-800 transition">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-slate-900 font-extrabold text-xs sm:text-sm">My Requests</span>
              <span className="text-[10px] text-slate-500 font-normal">Track reports</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
        </Link>

        <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between text-xs font-bold text-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-slate-900 font-extrabold text-xs sm:text-sm">Announcements</span>
              <span className="text-[10px] text-slate-500 font-normal">Society updates</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
        </div>

        <a href="tel:01292858585" className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 shadow-xs flex items-center justify-between text-xs font-bold text-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-slate-900 font-extrabold text-xs sm:text-sm">Security</span>
              <span className="text-[10px] text-slate-500 font-normal">Emergency</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
        </a>
      </section>

      {/* 4. VEHICLE LOOKUP */}
      <section id="vehicle-search-section" className="p-5 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md space-y-4">
        <div className="text-left space-y-1">
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 font-heading uppercase tracking-tight text-emerald-800">
            SOCIETY VEHICLE LOOKUP
          </h2>
          <p className="text-xs text-slate-500 font-bold">Enter vehicle number (e.g. HR26AB1234)</p>
        </div>

        <VehicleSearch />
      </section>

      {/* 5. TRUST STRIP */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs space-y-1 flex items-start gap-2.5 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-slate-900 font-extrabold block text-xs">Secure & Private</strong>
            <p className="text-[10px] text-slate-500">Authorized residents</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs space-y-1 flex items-start gap-2.5 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-slate-900 font-extrabold block text-xs">Instant Contact</strong>
            <p className="text-[10px] text-slate-500">Call / WhatsApp tap</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs space-y-1 flex items-start gap-2.5 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-slate-900 font-extrabold block text-xs">Adore Grand</strong>
            <p className="text-[10px] text-slate-500">By residents</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs space-y-1 flex items-start gap-2.5 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-slate-900 font-extrabold block text-xs">Home Screen</strong>
            <p className="text-[10px] text-slate-500">Install app</p>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ImBlockedWorkflowModal
        isOpen={isBlockedModalOpen}
        onClose={() => setIsBlockedModalOpen(false)}
      />
      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
      />
    </div>
  );
}
