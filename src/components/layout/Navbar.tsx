"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, LogOut, MapPin, Menu, X, PhoneCall, Megaphone } from "lucide-react";
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
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-16 flex items-center justify-between gap-4">
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

        {/* CENTER: Desktop & Laptop Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-xs font-extrabold text-slate-600">
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
            href="/announcements"
            className={`transition hover:text-emerald-600 ${pathname === "/announcements" ? "text-emerald-600 font-black border-b-2 border-emerald-600 pb-0.5" : ""}`}
          >
            Announcements
          </Link>
          <Link
            href="/emergency"
            className={`transition hover:text-rose-600 ${pathname === "/emergency" ? "text-rose-600 font-black border-b-2 border-rose-600 pb-0.5" : ""}`}
          >
            Emergency Contacts
          </Link>
        </nav>

        {/* RIGHT: Location & User Login */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sector 85, Faridabad</span>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{user.name}</span>
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
              <Button variant="primary" size="sm" className="font-extrabold text-xs rounded-full px-5 h-9 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                Login / OTP
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden flex items-center gap-2">
          {!user && (
            <Link href="/login">
              <Button variant="primary" size="sm" className="font-extrabold text-xs py-1.5 px-3.5 rounded-full bg-emerald-600 text-white">
                Login
              </Button>
            </Link>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden p-4 bg-white border-b border-slate-200 space-y-3 text-sm font-medium shadow-xl">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-slate-800 font-bold hover:bg-slate-50"
          >
            Home
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
