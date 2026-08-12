"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, FileText, User } from "lucide-react";
import { ImBlockedWorkflowModal } from "@/components/incident/ImBlockedWorkflowModal";
import { AddVehicleModal } from "@/components/vehicle/AddVehicleModal";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isBlockedOpen, setIsBlockedOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);

  const scrollToSearch = () => {
    const el = document.getElementById("vehicle-search-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Mobile Floating Bottom Navigation Bar (Visible on mobile/tablets) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 backdrop-blur-lg pb-safe px-4 h-16 flex items-center justify-around shadow-lg">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${
            pathname === "/" ? "text-emerald-600" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        {/* 2. Search */}
        <button
          onClick={scrollToSearch}
          className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-slate-500 hover:text-emerald-600"
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>

        {/* 3. Prominent Central Floating Action (+) Button */}
        <div className="relative -top-5">
          <button
            onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
            className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 border-4 border-white transition-transform active:scale-95"
            title="Quick Action"
          >
            <Plus className={`w-7 h-7 transition-transform ${isFabMenuOpen ? "rotate-45" : ""}`} />
          </button>

          {/* Quick Action Popover */}
          {isFabMenuOpen && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1.5 z-50 text-xs font-extrabold animate-in slide-in-from-bottom-2">
              <button
                onClick={() => {
                  setIsFabMenuOpen(false);
                  setIsBlockedOpen(true);
                }}
                className="w-full p-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-left flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                Report I'm Blocked
              </button>

              <button
                onClick={() => {
                  setIsFabMenuOpen(false);
                  setIsAddVehicleOpen(true);
                }}
                className="w-full p-2.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 text-left flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Register Vehicle
              </button>
            </div>
          )}
        </div>

        {/* 4. Requests */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${
            pathname === "/dashboard" ? "text-emerald-600" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Requests</span>
        </Link>

        {/* 5. Profile */}
        <Link
          href="/login"
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${
            pathname === "/login" ? "text-emerald-600" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
      </nav>

      {/* Modals */}
      <ImBlockedWorkflowModal isOpen={isBlockedOpen} onClose={() => setIsBlockedOpen(false)} />
      <AddVehicleModal isOpen={isAddVehicleOpen} onClose={() => setIsAddVehicleOpen(false)} />
    </>
  );
}
