"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, ShieldCheck, User, LogOut, MapPin, Menu, X, Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const scrollToSearch = () => {
    const el = document.getElementById("vehicle-search-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* LEFT: Logo & Society */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-xl tracking-tight text-slate-900 font-heading">
                ADORE<span className="text-emerald-600">PARK</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold">Adore Grand, Sector 85</p>
          </div>
        </Link>

        {/* CENTER: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-600">
          <Link
            href="/"
            className={`transition hover:text-emerald-600 ${pathname === "/" ? "text-emerald-600 font-black border-b-2 border-emerald-600 pb-0.5" : ""}`}
          >
            Home
          </Link>
          <button
            onClick={scrollToSearch}
            className="transition hover:text-emerald-600 cursor-pointer"
          >
            Find Vehicle
          </button>
          <button
            onClick={scrollToSearch}
            className="transition hover:text-rose-600 cursor-pointer"
          >
            I'm Blocked
          </button>
          <Link
            href="/dashboard"
            className={`transition hover:text-emerald-600 ${pathname === "/dashboard" ? "text-emerald-600 font-black border-b-2 border-emerald-600 pb-0.5" : ""}`}
          >
            My Vehicles
          </Link>
          <Link
            href="/dashboard"
            className="transition hover:text-emerald-600"
          >
            Requests
          </Link>
        </nav>

        {/* RIGHT: Location, Role & Login */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Location Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sector 85, Faridabad</span>
          </div>

          {/* Role Selector Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>{user ? user.role : "Resident"}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>

          {/* Login / OTP Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 transition rounded-xl hover:bg-slate-100"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm" className="font-extrabold text-xs rounded-full px-5 h-9 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                Login / OTP
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="lg:hidden flex items-center gap-2">
          {!user && (
            <Link href="/login">
              <Button variant="primary" size="sm" className="font-extrabold text-xs py-1.5 px-3.5 rounded-full bg-emerald-600 text-white">
                Login
              </Button>
            </Link>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden p-4 bg-white border-b border-slate-200 space-y-3 text-sm font-medium shadow-xl">
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
              scrollToSearch();
            }}
            className="block w-full text-left px-3.5 py-2.5 rounded-xl text-slate-800 font-bold hover:bg-slate-50"
          >
            Find Vehicle
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              scrollToSearch();
            }}
            className="block w-full text-left px-3.5 py-2.5 rounded-xl text-rose-700 font-bold hover:bg-rose-50"
          >
            I'm Blocked
          </button>
          <Link
            href="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-slate-800 font-bold hover:bg-slate-50"
          >
            My Vehicles & Requests
          </Link>
          <Link
            href="/staff/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-slate-800 font-bold hover:bg-slate-50"
          >
            Security & Admin Login
          </Link>
        </div>
      )}
    </header>
  );
}
