"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, FileText, User, AlertOctagon, Car } from "lucide-react";
import { useGlobalActions } from "@/context/GlobalActionContext";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { openFindVehicle, openImBlocked, openRegisterVehicle } = useGlobalActions();
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(Boolean(data.authenticated));
      })
      .catch(() => setIsAuthenticated(false));
  }, [pathname]);

  // Hide on pages that have their own bottom nav (Security Guard, Admin)
  if (pathname.startsWith("/security") || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Mobile Floating Bottom Navigation Bar (Visible on mobile screens) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 backdrop-blur-lg pb-safe px-4 h-16 flex items-center justify-around shadow-lg">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-extrabold ${
            pathname === "/" ? "text-emerald-600" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        {/* 2. Search -> Find Vehicle */}
        <button
          onClick={openFindVehicle}
          className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-extrabold text-slate-500 hover:text-emerald-600"
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>

        {/* 3. Prominent Central Floating Action (+) Button */}
        <div className="relative -top-5">
          <button
            onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
            className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 border-4 border-white transition-transform active:scale-95 cursor-pointer"
            title="Quick Action Menu"
          >
            <Plus className={`w-7 h-7 transition-transform ${isFabMenuOpen ? "rotate-45" : ""}`} />
          </button>

          {/* Quick Action Popover */}
          {isFabMenuOpen && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 space-y-1.5 z-50 text-xs font-black animate-in slide-in-from-bottom-2">
              <button
                onClick={() => {
                  setIsFabMenuOpen(false);
                  openFindVehicle();
                }}
                className="w-full p-2.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-left flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-emerald-600" />
                Find Vehicle
              </button>

              <button
                onClick={() => {
                  setIsFabMenuOpen(false);
                  openImBlocked();
                }}
                className="w-full p-2.5 rounded-xl bg-rose-50 text-rose-800 hover:bg-rose-100 text-left flex items-center gap-2"
              >
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                Report I'm Blocked
              </button>

              <button
                onClick={() => {
                  setIsFabMenuOpen(false);
                  openRegisterVehicle();
                }}
                className="w-full p-2.5 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 text-left flex items-center gap-2"
              >
                <Car className="w-4 h-4 text-amber-600" />
                Register Vehicle
              </button>
            </div>
          )}
        </div>

        {/* 4. Requests -> My Requests / Dashboard */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-extrabold ${
            pathname === "/dashboard" ? "text-emerald-600" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Requests</span>
        </Link>

        {/* 5. Profile -> Dashboard when logged in, Login when unauthenticated */}
        <Link
          href={isAuthenticated ? "/dashboard" : "/login"}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-extrabold ${
            (pathname === "/dashboard" || pathname === "/login") ? "text-emerald-600" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
      </nav>
    </>
  );
}
