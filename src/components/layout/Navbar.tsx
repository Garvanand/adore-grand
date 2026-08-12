"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, LogOut, MapPin, Menu, X, PhoneCall, Megaphone, AlertOctagon, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useGlobalActions } from "@/context/GlobalActionContext";

export function Navbar() {
  const pathname = usePathname();
  const { openFindVehicle, openImBlocked } = useGlobalActions();

  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsAuthLoading(true);
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setIsAuthLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  // Hide main Navbar on Security Guard duty page (it has its own Gate 1 header)
  if (pathname.startsWith("/security")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* LEFT: Logo & Society */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Car className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 font-heading">
                ADORE<span className="text-emerald-600">PARK</span>
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-semibold leading-none">Sector 85, Faridabad</p>
          </div>
        </Link>

        {/* CENTER: Desktop & Laptop Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs font-extrabold text-slate-600">
          <Link
            href="/"
            className={`transition hover:text-emerald-600 ${pathname === "/" ? "text-emerald-600 font-black border-b-2 border-emerald-600 pb-0.5" : ""}`}
          >
            Home
          </Link>
          <button
            onClick={openFindVehicle}
            className="transition hover:text-emerald-600 cursor-pointer flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5 text-emerald-600" />
            Find Vehicle
          </button>
          <button
            onClick={openImBlocked}
            className="transition hover:text-rose-600 cursor-pointer flex items-center gap-1"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            I'm Blocked
          </button>
          <Link
            href="/dashboard"
            className={`transition hover:text-emerald-600 ${pathname === "/dashboard" ? "text-emerald-600 font-black border-b-2 border-emerald-600 pb-0.5" : ""}`}
          >
            My Vehicles & Requests
          </Link>
          <Link
            href="/announcements"
            className={`transition hover:text-emerald-600 ${pathname === "/announcements" ? "text-emerald-600 font-black border-b-2 border-emerald-600 pb-0.5" : ""}`}
          >
            Announcements
          </Link>
          <Link
            href="/emergency"
            className={`transition hover:text-rose-600 ${pathname === "/emergency" ? "text-rose-600 font-black border-b-2 border-rose-600 pb-0.5" : ""}`}
          >
            Emergency
          </Link>
        </nav>

        {/* RIGHT: Location & User Login / Profile */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sector 85, Faridabad</span>
          </div>

          {isAuthLoading ? (
            <div className="w-24 h-9 rounded-full bg-slate-100 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-extrabold text-emerald-800 hover:bg-emerald-100 transition">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{user.name}</span>
                {user.tower && user.flatNumber && (
                  <span className="font-mono text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded-md">
                    {user.tower}-{user.flatNumber}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 transition rounded-xl hover:bg-slate-100 cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm" className="font-extrabold text-xs rounded-full px-4 h-9 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                Resident Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation Area */}
        <div className="md:hidden flex items-center gap-2">
          {!isAuthLoading && user && (
            <Link href="/dashboard" className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-extrabold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="truncate max-w-[90px]">{user.name}</span>
            </Link>
          )}
          {!isAuthLoading && !user && (
            <Link href="/login">
              <Button variant="primary" size="sm" className="font-extrabold text-[11px] py-1 px-3 rounded-full bg-emerald-600 text-white">
                Login
              </Button>
            </Link>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden p-4 bg-white border-b border-slate-200 space-y-2 text-sm font-medium shadow-xl">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-slate-800 font-bold hover:bg-slate-50"
          >
            Home
          </Link>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              openFindVehicle();
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-emerald-800 font-bold hover:bg-emerald-50 flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-emerald-600" /> Find Vehicle
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              openImBlocked();
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-rose-800 font-bold hover:bg-rose-50 flex items-center gap-2"
          >
            <AlertOctagon className="w-4 h-4 text-rose-600" /> Report I'm Blocked
          </button>
          <Link
            href="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-slate-800 font-bold hover:bg-slate-50"
          >
            My Vehicles & Requests
          </Link>
          <Link
            href="/announcements"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-amber-800 font-bold hover:bg-amber-50 flex items-center gap-2"
          >
            <Megaphone className="w-4 h-4 text-amber-600" /> Society Announcements
          </Link>
          <Link
            href="/emergency"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-rose-800 font-bold hover:bg-rose-50 flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-rose-600" /> Emergency & Maintenance Contacts
          </Link>
          <Link
            href="/staff/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-slate-800 font-bold hover:bg-slate-50"
          >
            Security & Admin Duty Login
          </Link>
        </div>
      )}
    </header>
  );
}
