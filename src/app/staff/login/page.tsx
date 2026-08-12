"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, User, Building2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function StaffLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg("Please enter username and password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/staff-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.user.role === "security") {
          router.push("/security");
        } else {
          router.push("/admin");
        }
      } else {
        setErrorMsg(data.message || "Invalid staff credentials.");
      }
    } catch (err) {
      setErrorMsg("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-xs font-black uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-rose-600" />
          ADORE GRAND STAFF PORTAL
        </div>
        <h1 className="text-3xl font-black text-slate-900 font-heading">Security & RWA Login</h1>
        <p className="text-xs text-slate-600 font-medium">
          Authorized duty login for Gate 1 Security Guards and RWA Society Administrators.
        </p>
      </div>

      <Card className="border-slate-200 shadow-xl bg-white">
        <CardContent className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleStaffLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">
                Username / Staff Identifier *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. garvanand03 or guard_gate1"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 h-12 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:border-rose-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter staff password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 h-12 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:border-rose-600"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="danger"
              size="lg"
              className="w-full h-13 font-black text-sm rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              isLoading={isLoading}
            >
              Sign In to Duty Desk <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Staff Credentials Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-mono">
            <span className="font-extrabold text-slate-700 block font-sans">
              Demo Credentials (Adore Grand):
            </span>
            <div className="flex justify-between text-[11px] text-slate-600">
              <span>Super Admin:</span>
              <button
                onClick={() => {
                  setUsername("garvanand03");
                  setPassword("Garv@516002");
                }}
                className="text-rose-600 hover:underline font-bold"
              >
                garvanand03 / Garv@516002
              </button>
            </div>
            <div className="flex justify-between text-[11px] text-slate-600">
              <span>Security Guard:</span>
              <button
                onClick={() => {
                  setUsername("guard_gate1");
                  setPassword("Guard@123456");
                }}
                className="text-rose-600 hover:underline font-bold"
              >
                guard_gate1 / Guard@123456
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
